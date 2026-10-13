#!/usr/bin/env bun
/**
 * LintPost: mechanical checks for a social post in English or Hebrew, with exact per-platform counts.
 *
 *   bun Tools/LintPost.ts [--platform <key>] [--lang en|he] [--type post|hiring] [--sponsored]
 *                         [--allow r1,r2] [--keep "phrase1,phrase2"] [--max N] [--fold] [--split] [--no-number]
 *                         [--json] <file | ->
 *   bun Tools/LintPost.ts --check-templates
 *   bun Tools/LintPost.ts --check-facts [--today YYYY-MM-DD]
 *
 * Platform keys, limits, folds, and tag caps come from ../Platforms.md; phrase rules from ../Tells.md.
 * Forked from skills/Email/Tools/LintEmail.ts (same Tells.md contract, exit codes, and runtime contract).
 * Runs on bun, or on node >= 22.6 with --experimental-strip-types. No dependencies.
 *
 * Exit codes: 0 no errors (warnings allowed) · 1 errors found · 2 usage error.
 */
import { readFileSync, readdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  SKILL_DIR, STATUSES, countUnit, findUrls, isEmoji, loadPlatforms, platform as getPlatform, readPost, segments,
  type Platform, type Span,
} from "./Count.ts"

export type Level = "error" | "warn" | "info"
export type Lang = "en" | "he"
export type Finding = { level: Level; rule: string; line: number; message: string }
export type Tell = { phrase: string; level: Level; instead: string; re: RegExp }
export type Options = {
  platform?: string
  lang?: Lang
  type?: string
  sponsored?: boolean
  allow?: string[]
  keep?: string[]
  max?: number
  tells?: Tell[]
}
export type Report = {
  platform: string | null
  lang: Lang
  unit: string | null
  count: number | null
  limit: number | null
  tags: number
  findings: Finding[]
  errors: number
  warnings: number
}

const HEB = /[א-ת]/
const HEB_G = /[א-ת]/g
const LAT_G = /[A-Za-z]/g
const BIDI = "\\u200E\\u200F\\u202A-\\u202E\\u2066-\\u2069"
const BIDI_G = new RegExp(`[${BIDI}]`, "g")
// Rules a template may trigger on purpose; --check-templates ignores them.
const TEMPLATE_EXEMPT = new Set(["placeholder", "hook-cut"])
// Style rules a profile may switch off with --allow. Bait, leaks, fake formatting, Hebrew parentheses, disclosure,
// length, and the core anti-slop rules are fixed.
export const ALLOWABLE = [
  "em-dash", "exclaim", "emoji-count", "broetry", "gender-slash", "bidi-start", "wrong-way-pointer", "spaced-phone",
  "leading-sign", "en-quote-midline", "hashtag-portable", "mixed-tag-line", "mention-portable", "bidi-control",
  "link-glued", "link-shortener", "link-dead", "hashtag-count", "hook-cut", "niqqud", "placeholder",
]
export const TYPES = ["post", "hiring"]

const count = (s: string, re: RegExp) => (s.match(re) ?? []).length
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const inSpans = (i: number, spans: Span[]) => spans.some((s) => i >= s.start && i < s.end)

export function normalize(s: string): string {
  return s.replace(/[‘’׳]/g, "'").replace(/[“”״]/g, '"')
}

/** Share of Hebrew among letters. A post is Hebrew from 30%: Hebrew posts carry English technical terms. */
export function hebrewShare(text: string): number {
  const he = count(text, HEB_G)
  const en = count(text, LAT_G)
  return he + en === 0 ? 0 : he / (he + en)
}
export const detectLang = (text: string): Lang => (hebrewShare(text) >= 0.3 ? "he" : "en")
const isHebrewLine = (line: string) => hebrewShare(line) >= 0.3

/**
 * Tells.md phrase syntax: a leading ^ anchors the phrase to the start of a line or sentence; a trailing * lets an
 * English phrase match as a word stem. English phrases otherwise match whole words. Hebrew phrases may take one
 * prefix letter (ו ה ש ב כ ל מ) and no other letter before them, so "אל תתייגו" doesn't match "תייגו".
 */
function phraseRegex(raw: string): RegExp {
  const anchored = raw.startsWith("^")
  const stem = raw.endsWith("*")
  const phrase = raw.replace(/^\^/, "").replace(/\*$/, "")
  const body = escapeRe(phrase)
  if (HEB.test(phrase)) {
    const start = anchored ? "(?:^\\s*|(?<=[.!?:;]\\s{1,3}))" : "(?<![\\u05D0-\\u05EA])"
    return new RegExp(`${start}[\\u05D5\\u05D4\\u05E9\\u05D1\\u05DB\\u05DC\\u05DE]?${body}`, "u")
  }
  const start = anchored ? "(?:^\\s*|(?<=[.!?:;]\\s{1,3}))" : "(?<![\\p{L}\\p{N}])"
  const end = stem || !/[\p{L}\p{N}]$/u.test(phrase) ? "" : "(?![\\p{L}\\p{N}])"
  return new RegExp(`${start}${body}${end}`, "iu")
}

export function parseTells(md: string): Tell[] {
  const tells: Tell[] = []
  let inPhraseTable = false
  for (const raw of md.split("\n")) {
    const line = raw.trim()
    if (!line.startsWith("|")) {
      inPhraseTable = false
      continue
    }
    const cells = line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim())
    if (/^:?-{3,}:?$/.test(cells[0])) continue
    if (cells[0] === "Phrase") {
      inPhraseTable = true
      continue
    }
    if (!inPhraseTable) continue
    const level: Level = cells[1] === "ban" ? "error" : "warn"
    for (const m of cells[0].matchAll(/`([^`]+)`/g)) {
      const raw = normalize(m[1])
      const phrase = raw.replace(/^\^/, "").replace(/\*$/, "")
      tells.push({ phrase, level, instead: cells[2] ?? "", re: phraseRegex(raw) })
    }
  }
  return tells
}

let cachedTells: Tell[] | null = null
export function loadTells(): Tell[] {
  cachedTells ??= parseTells(readFileSync(join(SKILL_DIR, "Tells.md"), "utf8"))
  return cachedTells
}

/** The text the fold applies to: the post without leading blank lines. */
export const foldBody = (text: string) => text.replace(/\r\n?/g, "\n").replace(/^(?:[ \t]*\n)+/, "").replace(/\s+$/, "")

/** Text visible before "see more": stops at the char budget or the visual-line budget, whichever comes first. */
export function foldPreview(text: string, chars: number, lines: number | null): string {
  const perLine = lines ? Math.max(20, Math.round(chars / lines)) : Infinity
  let used = 0
  let visual = 0
  const out: string[] = []
  for (const line of foldBody(text).split("\n")) {
    if (used >= chars) break
    const g = segments(line)
    const rows = Math.max(1, Math.ceil(g.length / perLine))
    if (lines !== null && visual + rows > lines) {
      const room = Math.min((lines - visual) * perLine, chars - used)
      if (room > 0) out.push(g.slice(0, room).join(""))
      break
    }
    if (used + g.length > chars) {
      out.push(g.slice(0, Math.max(0, chars - used)).join(""))
      break
    }
    out.push(line)
    used += g.length + 1
    visual += rows
  }
  return out.join("\n")
}

// Math bold/italic, circled and squared letters, small capitals, and combining strike or underline.
const FAKE_STYLE = /[\u{1D400}-\u{1D7FF}Ⓐ-ⓩ\u{1F130}-\u{1F16F}\u{1F172}-\u{1F17D}\u{1F180}-\u{1F189}ᴀ-ᴢꜰꜱʀʜɪʟɴʏɢʙ]/u
const COMBINING_STYLE = /\p{L}[̵̶̸̲̳]/u
const letterFoldsToAscii = (ch: string) =>
  ch !== "ℹ" && /\p{L}/u.test(ch) && !/[A-Za-z]/.test(ch) && /^[A-Za-z]$/.test(ch.normalize("NFKC"))
const SHORTENERS = /(?:^|\/\/|\s)(?:bit\.ly|tinyurl\.com|ow\.ly|buff\.ly|rebrand\.ly|cutt\.ly|is\.gd|t\.ly|shorturl\.at|lnkd\.in)\//i
// The label must open the first line; only whitespace or emoji may come before it.
const DISCLOSURE = /^[\s\p{Extended_Pictographic}️]*(?:#?ad\b|#?sponsored\b|advertisement\b|paid partnership\b|i work at\b|publicité|collaboration commerciale|פרסומת|תוכן ממומן|בשיתוף פעולה בתשלום|שיתוף פעולה בתשלום)/iu
const CONTRAST = [
  /\b(?:it|this|that|[\w']+)(?:'s| is| was)(?:n't| not) (?:just |only |about |merely )?[^.,;!?\n—–]{1,60}?(?:[,;.]|\s[—–])\s*(?:it'?s|it is|this is|that'?s)\b/gi,
  /\bnot (?:just|only|merely) [^.,;!?\n]{1,60}[,;]?\s+but\b/gi,
  /(?:^|[.!?]\s+)Not [^.!?\n]{1,40}\.\s+Not [^.!?\n]{1,40}\./g,
  /זה לא [^.,;!?\n]{1,50}(?:[,.;]|\s[–-])\s*(?:זה|אלא) /g,
  /לא רק [^.;!?\n]{1,50} אלא/g,
]
// Comment-gates and share bait, beyond the Tells.md phrases: a verb, a keyword to type, and a promise or a place.
const BAIT = [
  /\b(?:[Cc]omment|[Rr]eply|[Tt]ype|[Ww]rite|[Dd]rop)(?:\s+(?:a|an|the word|with))?\s+(?:"[^"\n]{1,25}"|'[^'\n]{1,25}'|[A-Z]{2,}\b|\p{Extended_Pictographic}|\d\b)[^.!?\n]{0,40}?(?:\bbelow\b|\bin the comments\b|\bI'll (?:send|DM|share)\b|\bDM (?:you|it)\b)/u,
  /\brepost\s*\p{Extended_Pictographic}?️?\s*to help\b/iu,
  /(?<![א-ת])ו?תגיבו\s+(?:את המילה\s+)?(?:"[^"\n]{1,25}"|'[^'\n]{1,25}')/u,
  /(?<![א-ת])ו?(?:תגיבו|הגיבו|כתבו)\s[^.!?\n]{0,40}?(?:ואשלח|אשלח לכם|בפרטי)/u,
]
const BULLET_SYMBOLS = /^[✔✓➡▶►➤☑]/u
const STARTS_WITH_EMOJI = (line: string) => {
  const first = segments(line.replace(BIDI_G, "").trimStart())[0] ?? ""
  return first !== "" && (isEmoji(first) || /\p{Extended_Pictographic}/u.test(first) || BULLET_SYMBOLS.test(first) || /^[0-9#*]️?⃣$/u.test(first))
}
const EMOTICON = /[:;=]-?[()]|[()]-?[:;=]/g

export function lint(text: string, opts: Options = {}): Report {
  const tells = opts.tells ?? loadTells()
  const allow = new Set((opts.allow ?? []).filter((r) => ALLOWABLE.includes(r)))
  const keep = (opts.keep ?? []).map((k) => normalize(k).toLowerCase().trim()).filter(Boolean)
  const p: Platform | undefined = opts.platform ? getPlatform(opts.platform) : undefined
  const body = text.replace(/\r\n?/g, "\n").replace(/\s+$/, "")
  const lines = body.split("\n")
  const lang = opts.lang ?? detectLang(body)
  const findings: Finding[] = []
  const add = (level: Level, rule: string, line: number, message: string) => {
    if (!allow.has(rule)) findings.push({ level, rule, line, message })
  }
  const rtl = (line: string) => HEB.test(line) && (lang === "he" || isHebrewLine(line))

  if (!body.trim()) add("error", "empty", 0, "The post is empty.")
  if (body.includes("﻿")) add("error", "bom", 0, "Invisible byte-order mark (U+FEFF): X rejects it. Delete it.")

  // Chatbot preambles and wrappers.
  const firstIdx = lines.findIndex((l) => l.trim() !== "")
  const first = firstIdx >= 0 ? lines[firstIdx].trim() : ""
  const firstNorm = normalize(first)
  const preamble =
    /^(?:sure[,!]?\s+)?here(?:'s| is) (?:a|an|your|the) [^:\n]{0,60}?\b(?:post|tweet|thread|caption|draft)(?![\p{L}-])[^:\n]{0,60}:\s*$/iu.test(firstNorm) &&
    /\b(?:linkedin|twitter|x|facebook|instagram|threads|bluesky|mastodon|your|revised|updated|polished|draft|version)\b/i.test(firstNorm)
  if (preamble || /^הנה (?:ה)?(?:פוסט|טיוטה|ציוץ)[^:\n]{0,60}:\s*$/.test(first)) {
    add("error", "chatbot-leak", firstIdx + 1, "Chatbot preamble: deliver only the post.")
  }
  const trimmed = body.trim()
  if (trimmed.length > 2 && /^["“][^"“”]*["”]$/.test(trimmed)) {
    add("error", "chatbot-leak", firstIdx + 1, "The whole post is wrapped in quotation marks.")
  }

  let warnTells = 0
  let contrasts = 0
  lines.forEach((line, i) => {
    const n = i + 1
    const norm = normalize(line)
    const urls = findUrls(line)
    for (const t of tells) {
      if (!t.re.test(norm)) continue
      if (t.level === "warn" && keep.some((k) => k === t.phrase.toLowerCase() || k.includes(t.phrase.toLowerCase()))) continue
      add(t.level, "tell", n, `"${t.phrase}": ${t.instead}`)
      if (t.level === "warn") warnTells++
    }
    if (BAIT.some((re) => re.test(norm))) add("error", "bait", n, "Engagement bait: asks for a keyword, reaction, or share. Ask a real question or give the link.")
    for (const re of CONTRAST) contrasts += [...norm.matchAll(re)].length

    if (/^\s{0,3}#{1,6}\s/.test(line)) add("error", "markdown", n, "Markdown heading: the # shows literally.")
    if (opts.platform !== "telegram" && opts.platform !== "telegram-caption" && /(?<![\w*])\*\*(?=\S)[^*\n]+?(?<=\S)\*\*(?![\w*])/.test(line)) {
      add("error", "markdown", n, "Markdown bold: shows as raw asterisks.")
    }
    if (/\[[^\]\n]+\]\((?:https?:|mailto:|www\.)[^)\s]*\)/.test(line)) add("error", "markdown", n, "Markdown link: paste the URL itself.")
    if (/^\s*\|.*\|\s*$/.test(line)) add("error", "markdown", n, "Markdown table: posts can't show tables.")
    if (/^\s*(?:hashtags|tags|האשטגים|תגיות)\s*:\s*(?:#[\p{L}\p{N}_]+[\s,]*)+$/iu.test(line)) {
      add("error", "chatbot-leak", n, '"Hashtags:" label: just put the tags on the last line.')
    }

    const fake = [...line].filter((ch) => FAKE_STYLE.test(ch) || letterFoldsToAscii(ch))
    if (fake.length || COMBINING_STYLE.test(line)) {
      add("error", "fake-styling", n, `Unicode-styled letters (${fake.slice(0, 6).join("")}): screen readers and search can't read them. Plain: "${line.normalize("NFKC").trim().slice(0, 60)}"`)
    }

    const holes = [...line.matchAll(/\[[^\]\n]{1,80}\](?!\()/g)].map((m) => m[0])
    if (holes.length) add("warn", "placeholder", n, `Unfilled: ${holes.join(" ")}`)

    // Parentheses inside URLs and emoticons don't count; an English line with a Hebrew gloss counts in a Hebrew post.
    let bare = line
    for (const u of [...urls].reverse()) bare = bare.slice(0, u.start) + bare.slice(u.end)
    bare = bare.replace(EMOTICON, "")
    if (/[()]/.test(bare) && rtl(bare)) {
      add("error", "hebrew-parens", n, "Parentheses in Hebrew text (house rule). Use a comma, a colon, or a new sentence.")
    }
    if (HEB.test(line) && opts.type !== "hiring") {
      const slashes = [...line.matchAll(/[א-ת]{2,}\/(?:ה|ת|ית|ות|ים|יות|תי|י|ו)(?![א-ת])/g)].map((m) => m[0])
      if (slashes.length) add("warn", "gender-slash", n, `${slashes.join(" ")}: use plural or gender-free forms (Hebrew.md).`)
    }

    if (rtl(line)) {
      const firstLetter = line.match(/[A-Za-zא-ת]/)
      if (firstLetter && /[A-Za-z]/.test(firstLetter[0])) {
        add("warn", "bidi-start", n, "Hebrew line whose first letter is Latin: it renders left to right. Start with a Hebrew word, or move the English to a line of its own.")
      }
      if (/👉|➡️|➡|→|▶️|▶|⇨|➜/u.test(line)) add("warn", "wrong-way-pointer", n, "In Hebrew, 👉 and → point backward. Use 👈 or ←.")
      if (/(?<!\d)\d{2,4} \d{3} \d{3,4}(?!\d)/.test(line)) add("warn", "spaced-phone", n, "Spaced digit groups reorder in RTL. Write 054-1234567.")
      if (/(?:^|\s)[+-]\d/.test(line)) add("warn", "leading-sign", n, "A leading + or - flips in RTL. Put international numbers on their own line; say decreases in words.")
      if (/[A-Za-z]+(?:[ ,:;'-]+[A-Za-z]+){2,}[.!?]\s+[^\n]*[א-ת]/.test(line)) {
        add("warn", "en-quote-midline", n, "An English sentence inside a Hebrew line shows its punctuation on the wrong side. Put the English on its own line.")
      }
    }

    for (const m of line.matchAll(/(^|.)#([\p{L}\p{N}_][^\s#]*)/gu)) {
      const at = (m.index ?? 0) + m[1].length
      if (inSpans(at, urls)) continue
      const before = m[1]
      const tagBody = m[2].replace(/[.,!?:;)\]"'”’]+$/u, "")
      const tag = `#${tagBody}`
      if (before && /[\p{L}\p{N}]/u.test(before)) add("warn", "hashtag-portable", n, `${before}${tag}: a # glued to a word is not a tag. Put a space before it.`)
      else if (/["'\-־׳״]/.test(tagBody)) add("warn", "hashtag-portable", n, `${tag}: punctuation inside a tag cuts it on X and Mastodon. Join words with _ and drop acronym marks.`)
      else if (!/\p{L}/u.test(tagBody)) add("info", "hashtag-portable", n, `${tag} has no letter, so no platform treats it as a tag.`)
    }
    const tagsHere = [...line.matchAll(/(?:^|\s)#([\p{L}\p{N}_]+)/gu)].map((m) => m[1])
    if (tagsHere.some((t) => HEB.test(t)) && tagsHere.some((t) => /[A-Za-z]/.test(t))) {
      add("warn", "mixed-tag-line", n, "Hebrew and English hashtags on one line: one # always lands on the wrong side. Split them.")
    }
    if (/[א-ת-]@[A-Za-z0-9_]/.test(line)) add("warn", "mention-portable", n, "A prefix glued to @ links on X and Mastodon only. Write a space before @: \"תודה רבה @dana\".")
    if (/@[א-ת]/.test(line)) add("warn", "mention-portable", n, "@ followed by Hebrew is not a mention on any platform; handles are Latin.")
    if (new RegExp(`[${BIDI}][#@]`).test(line)) add("warn", "bidi-control", n, "An invisible direction mark right before # breaks the tag on Bluesky and Mastodon, and before @ breaks the mention on Bluesky.")
    if (/[א-ת]-?(?:https?:\/\/|www\.)/.test(line) || /[א-ת]-[a-z0-9-]+\.(?:com|net|org|io|co\.il|org\.il|ai|dev|app)\b/i.test(line)) {
      add("warn", "link-glued", n, "A Hebrew prefix glued to a link breaks it: X links \"-example.com\". Put the link on its own line.")
    }
    if (SHORTENERS.test(line)) add("warn", "link-shortener", n, "Link shorteners look like spam on X and Mastodon. Use the real URL.")
  })

  // Whole-post checks.
  if (contrasts === 1) add("warn", "contrast", 0, 'One "it\'s not X, it\'s Y" contrast: a well-known AI cadence. State the point directly.')
  if (contrasts >= 2) add("error", "contrast", 0, `${contrasts} contrast or reveal structures: a well-known AI cadence. State the points directly.`)
  if (warnTells >= 3) add("error", "tell-density", 0, `${warnTells} warn-level tells in one post: the density reads as generated. Rewrite in plain words, or pass phrases the user really uses with --keep.`)

  const emDashes = count(body, /—/g)
  if (emDashes === 1) add("warn", "em-dash", 0, "One em dash. A period or comma usually works.")
  if (emDashes >= 2) add("error", "em-dash", 0, `${emDashes} em dashes: the best-known AI tell. Use periods and commas.`)
  const bangs = count(body, /!/g)
  if (bangs > 2) add("warn", "exclaim", 0, `${bangs} exclamation marks; one or two at most.`)

  const emojiLines = lines.filter(STARTS_WITH_EMOJI).length
  if (emojiLines >= 3) add("error", "emoji-bullets", 0, `${emojiLines} lines start with an emoji or a symbol: emoji bullets are a template tell. Use - or numbers.`)
  const emojis = segments(body).filter(isEmoji).length
  if (emojis > 3) add("warn", "emoji-count", 0, `${emojis} emoji; two or three at most, each carrying meaning.`)

  const paragraphs = body.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
  let run = 0
  let longest = 0
  for (const para of paragraphs) {
    // A paragraph that is only a [placeholder] has unknown length, so it neither counts nor breaks a run.
    if (/^\[[^\n]*\]$/.test(para)) continue
    const oneLine = !para.includes("\n") && para.split(/\s+/).length <= 20 && count(para.replace(/[.!?]+$/, ""), /[.!?]\s/g) === 0
    run = oneLine ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  if (longest >= 4) add("warn", "broetry", 0, `${longest} one-sentence paragraphs in a row. Mix in longer paragraphs.`)

  if (opts.sponsored && !DISCLOSURE.test(first)) {
    add("error", "disclosure", firstIdx + 1, 'Sponsored post without a label opening the first line: "Ad:", "#ad", "Paid partnership with", "פרסומת:" (Disclosure.md).')
  }

  const tags = [...body.matchAll(/(?:^|\s)#[\p{L}\p{N}_]*\p{L}[\p{L}\p{N}_]*/gu)].length
  let countValue: number | null = null
  let limit: number | null = null
  if (p) {
    countValue = countUnit(p.unit, body)
    limit = opts.max ?? p.limit
    if (limit !== null && countValue > limit) add("error", "length", 0, `${countValue}/${limit} (${p.unit}): over the ${p.key} limit by ${countValue - limit}.`)
    if (p.tags !== null && tags > p.tags) add("warn", "hashtag-count", 0, `${tags} hashtags; ${p.key} works best with at most ${p.tags} (Platforms.md).`)
    if (p.links === "none" && findUrls(body).length) add("warn", "link-dead", 0, `Links aren't clickable in ${p.key} captions. Say where the link is instead.`)
    const folded = foldBody(body)
    const hook = folded.split("\n")[0]?.trim() ?? ""
    if (p.foldChars !== null && hook && !foldPreview(folded, p.foldChars, p.foldLines).includes(hook)) {
      add("warn", "hook-cut", firstIdx + 1, `The first line doesn't fit before "see more" on ${p.key} (about ${p.foldChars} characters). Shorten the hook.`)
    }
    if (p.unit === "x") {
      const niqqud = count(body, /[֑-ׇ]/g)
      const heb = count(body, HEB_G)
      if (heb && niqqud / heb > 0.1) add("warn", "niqqud", 0, `${niqqud} niqqud marks cost 1 each on X. Drop them.`)
    }
  }
  const controls = count(body, BIDI_G)
  if (controls) add("info", "bidi-control", 0, `${controls} invisible direction marks${p?.unit === "x" ? ", 2 each on X" : ""}; they travel with copy and paste.`)

  const errors = findings.filter((f) => f.level === "error").length
  const warnings = findings.filter((f) => f.level === "warn").length
  return { platform: p?.key ?? null, lang, unit: p?.unit ?? null, count: countValue, limit, tags, findings, errors, warnings }
}

const ABBREVIATIONS = /(?:^|\s)(?:Dr|Mr|Mrs|Ms|Prof|Inc|Ltd|vs|etc|e\.g|i\.e|U\.S|U\.K|No|St|וכו['׳]|וכד['׳]|ד["״]ר)\.\s*$/i

function sentences(line: string, lang: Lang): string[] {
  const seg = new Intl.Segmenter(lang, { granularity: "sentence" })
  const out: string[] = []
  for (const { segment } of seg.segment(line)) {
    const s = segment.trim()
    if (!s) continue
    if (out.length && ABBREVIATIONS.test(out[out.length - 1])) out[out.length - 1] += ` ${s}`
    else out.push(s)
  }
  return out
}

/** Swaps URLs, #tags, and @mentions for opaque tokens so sentence splitting can't cut inside them. */
function protect(text: string): { text: string; restore: (s: string) => string } {
  const spans: Span[] = [...findUrls(text)]
  for (const m of text.matchAll(/[#@][\p{L}\p{N}_][\p{L}\p{N}_.\-]*[\p{L}\p{N}_]|[#@][\p{L}\p{N}_]/gu)) {
    const start = m.index ?? 0
    const end = start + m[0].length
    if (!spans.some((s) => start < s.end && end > s.start)) spans.push({ start, end, text: m[0] })
  }
  spans.sort((a, b) => a.start - b.start)
  const tokens: string[] = []
  let out = ""
  let at = 0
  for (const s of spans) {
    out += text.slice(at, s.start) + `${tokens.length}`
    tokens.push(s.text)
    at = s.end
  }
  out += text.slice(at)
  return { text: out, restore: (s) => s.replace(/(\d+)/g, (_, i) => tokens[Number(i)]) }
}

/** Splits a long post into a thread sized by the platform's own counter, numbered " n/N" when asked. */
export function splitThread(text: string, platformKey: string, numbered = true, maxOverride?: number): string[] {
  const p = getPlatform(platformKey)
  if (!p || p.limit === null) throw new Error(`Platform "${platformKey}" has no limit to split against.`)
  const limit = maxOverride ?? p.limit
  const { text: safe, restore } = protect(text.replace(/\r\n?/g, "\n").trim())
  const size = (s: string) => countUnit(p.unit, restore(s))
  const lang = detectLang(text)
  type Unit = { text: string; sep: "\n\n" | "\n" | " " }
  const units: Unit[] = []
  for (const para of safe.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)) {
    para.split("\n").map((l) => l.trim()).filter(Boolean).forEach((line, li) => {
      sentences(line, lang).forEach((s, si) => units.push({ text: s, sep: si > 0 ? " " : li > 0 ? "\n" : "\n\n" }))
    })
  }

  const pack = (total: number): string[] => {
    const reserve = numbered && total > 1 ? countUnit(p.unit, ` ${total}/${total}`) : 0
    const room = limit - reserve
    const posts: string[] = []
    let cur = ""
    const push = () => {
      if (cur.trim()) posts.push(cur.trim())
      cur = ""
    }
    for (const u of units) {
      const sep = cur ? u.sep : ""
      if (size(cur + sep + u.text) <= room) {
        cur += sep + u.text
        continue
      }
      push()
      if (size(u.text) <= room) {
        cur = u.text
        continue
      }
      for (const word of u.text.split(/\s+/)) {
        const s = cur ? " " : ""
        if (size(cur + s + word) <= room) cur += s + word
        else {
          push()
          if (size(word) > room) throw new Error(`One token is longer than a whole post: ${restore(word).slice(0, 40)}…`)
          cur = word
        }
      }
    }
    push()
    return posts
  }

  let total = 1
  let posts = pack(total)
  for (let i = 0; i < 5 && posts.length !== total; i++) {
    total = posts.length
    posts = pack(total)
  }
  const restored = posts.map(restore)
  return numbered && restored.length > 1 ? restored.map((s, i) => `${s} ${i + 1}/${restored.length}`) : restored
}

export type TemplateFailure = { file: string; block: number; info: string; finding: Finding }

/** Lints every ```text block in Templates*.md. The fence info names the platform and language: ```text linkedin he */
export function checkTemplates(dir: string = SKILL_DIR): { blocks: number; failures: TemplateFailure[] } {
  const keys = new Set(loadPlatforms().map((p) => p.key))
  const failures: TemplateFailure[] = []
  let blocks = 0
  for (const file of readdirSync(dir).filter((f) => /^Templates.+\.md$/.test(f)).sort()) {
    const md = readFileSync(join(dir, file), "utf8")
    let block = 0
    for (const m of md.matchAll(/```text([^\n]*)\n([\s\S]*?)```/g)) {
      block++
      blocks++
      const info = m[1].trim()
      const words = info.split(/\s+/)
      const opts: Options = {
        platform: words.find((w) => keys.has(w)),
        lang: words.includes("he") ? "he" : words.includes("en") ? "en" : undefined,
        type: words.includes("hiring") ? "hiring" : undefined,
        sponsored: words.includes("sponsored"),
      }
      for (const finding of lint(m[2], opts).findings) {
        if (finding.level !== "info" && !TEMPLATE_EXEMPT.has(finding.rule)) failures.push({ file, block, info, finding })
      }
    }
  }
  return { blocks, failures }
}

/** A YYYY-MM-DD string that is a real calendar date, or null. */
export function parseDay(v: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null
  const d = new Date(`${v}T00:00:00Z`)
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v ? null : d
}

export type FactProblem = { platform: string; problem: string }

/** Every Platforms.md row needs a known status, a real As of date within maxAgeDays of today, and a source. */
export function checkFacts(today: Date, maxAgeDays = 180): FactProblem[] {
  const problems: FactProblem[] = []
  for (const p of loadPlatforms()) {
    if (!STATUSES.includes(p.status)) problems.push({ platform: p.key, problem: `unknown status "${p.status}"` })
    if (!p.source || p.source === "—") problems.push({ platform: p.key, problem: "no source" })
    const asOf = parseDay(p.asOf)
    if (!asOf) problems.push({ platform: p.key, problem: `bad As of date "${p.asOf}"` })
    else if (asOf.getTime() > today.getTime()) problems.push({ platform: p.key, problem: `As of ${p.asOf} is in the future` })
    else {
      const age = Math.floor((today.getTime() - asOf.getTime()) / 86_400_000)
      if (age > maxAgeDays) problems.push({ platform: p.key, problem: `checked ${age} days ago (${p.asOf}); refresh it` })
    }
  }
  return problems
}

function formatReport(r: Report, preview?: string): string {
  const where = r.platform ? `platform=${r.platform} count=${r.count}/${r.limit ?? "—"} (${r.unit})` : "platform=none (pass --platform to count)"
  const out = [`LintPost: ${where} lang=${r.lang} tags=${r.tags}`]
  for (const f of r.findings) {
    const at = f.line ? `L${f.line}` : ""
    out.push(`  ${f.level.padEnd(5)}  ${at.padEnd(5)} ${f.rule.padEnd(17)} ${f.message}`)
  }
  if (preview !== undefined) out.push("--- before \"see more\" ---", preview, "---")
  out.push(`Result: ${r.errors} error${r.errors === 1 ? "" : "s"}, ${r.warnings} warning${r.warnings === 1 ? "" : "s"}`)
  return out.join("\n")
}

const USAGE = `Usage:
  bun Tools/LintPost.ts [--platform <key>] [--lang en|he] [--type post|hiring] [--sponsored]
                        [--allow r1,r2] [--keep "phrase1,phrase2"] [--max N] [--fold] [--split] [--no-number]
                        [--json] <file | ->
  bun Tools/LintPost.ts --check-templates
  bun Tools/LintPost.ts --check-facts [--today YYYY-MM-DD]

Platforms: see Platforms.md. --allow takes style rules only: ${ALLOWABLE.join(", ")}.
Exit: 0 no errors · 1 errors found · 2 usage error`

const usageError = (msg: string) => {
  console.error(`${msg}\n\n${USAGE}`)
  return 2
}

export function main(argv: string[]): number {
  const o: Options = {}
  let json = false
  let fold = false
  let split = false
  let numbered = true
  let templates = false
  let facts = false
  let today: Date | undefined
  let file: string | undefined
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => argv[++i] ?? ""
    if (a === "--help" || a === "-h") {
      console.log(USAGE)
      return 0
    } else if (a === "--check-templates") templates = true
    else if (a === "--check-facts") facts = true
    else if (a === "--today") {
      const v = next()
      const d = parseDay(v)
      if (!d) return usageError(`--today must be a real date as YYYY-MM-DD, got "${v}"`)
      today = d
    } else if (a === "--platform") {
      o.platform = next()
      if (!getPlatform(o.platform)) return usageError(`Unknown platform "${o.platform}". Known: ${loadPlatforms().map((p) => p.key).join(", ")}`)
    } else if (a === "--lang") {
      const v = next()
      if (v !== "en" && v !== "he") return usageError("--lang must be en or he")
      o.lang = v
    } else if (a === "--type") {
      o.type = next()
      if (!TYPES.includes(o.type)) return usageError(`Unknown --type "${o.type}". Known: ${TYPES.join(", ")}`)
    } else if (a === "--sponsored") o.sponsored = true
    else if (a === "--allow") {
      o.allow = next().split(",").map((s) => s.trim()).filter(Boolean)
      const bad = o.allow.filter((r) => !ALLOWABLE.includes(r))
      if (bad.length) return usageError(`--allow can't include ${bad.join(", ")}`)
    } else if (a === "--keep") o.keep = next().split(",").map((s) => s.trim()).filter(Boolean)
    else if (a === "--max") {
      o.max = Number(next())
      if (!Number.isInteger(o.max) || o.max <= 0) return usageError("--max must be a positive integer")
    } else if (a === "--json") json = true
    else if (a === "--fold") fold = true
    else if (a === "--split") split = true
    else if (a === "--no-number") numbered = false
    else if (a === "-" || !a.startsWith("-")) file = a
    else return usageError(`Unknown option ${a}`)
  }

  if (templates || facts) {
    let failed = false
    if (templates) {
      const { blocks, failures } = checkTemplates()
      for (const f of failures) console.log(`${f.file} block ${f.block} [${f.info}] L${f.finding.line} ${f.finding.rule}: ${f.finding.message}`)
      console.log(`check-templates: ${blocks} blocks, ${failures.length} failure${failures.length === 1 ? "" : "s"}`)
      failed ||= failures.length > 0
    }
    if (facts) {
      const problems = checkFacts(today ?? new Date())
      for (const pr of problems) console.log(`${pr.platform}: ${pr.problem}`)
      console.log(`check-facts: ${loadPlatforms().length} rows, ${problems.length} problem${problems.length === 1 ? "" : "s"}`)
      failed ||= problems.length > 0
    }
    return failed ? 1 : 0
  }
  if (!file) return usageError("Pass a file, or - for stdin.")
  if (split && !o.platform) return usageError("--split needs --platform")
  if (split && getPlatform(o.platform ?? "")?.limit === null) return usageError(`Platform "${o.platform}" has no limit to split against.`)

  let text: string
  try {
    text = readPost(file)
  } catch (e) {
    console.error(`Cannot read ${file}: ${(e as Error).message}`)
    return 2
  }

  if (split) {
    if (!text.trim()) {
      console.error("The post is empty.")
      return 1
    }
    let posts: string[]
    try {
      posts = splitThread(text, o.platform ?? "", numbered, o.max)
    } catch (e) {
      console.error((e as Error).message)
      return 1
    }
    const reports = posts.map((post) => lint(post, o))
    if (json) console.log(JSON.stringify(posts.map((post, i) => ({ post, ...reports[i] })), null, 2))
    else posts.forEach((post, i) => console.log(`${i > 0 ? "\n" : ""}=== ${i + 1}/${posts.length} · ${reports[i].count}/${reports[i].limit} ===\n${post}`))
    return reports.some((r) => r.errors) ? 1 : 0
  }

  const report = lint(text, o)
  const p = o.platform ? getPlatform(o.platform) : undefined
  const preview = fold && p?.foldChars ? foldPreview(text, p.foldChars, p.foldLines) : undefined
  console.log(json ? JSON.stringify({ ...report, preview }, null, 2) : formatReport(report, preview))
  return report.errors > 0 ? 1 : 0
}

const isMain =
  (import.meta as { main?: boolean }).main ??
  (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
if (isMain) process.exit(main(process.argv.slice(2)))
