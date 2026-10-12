#!/usr/bin/env bun
/**
 * Count: per-platform character counting for social posts, plus the Platforms.md parser.
 *
 *   bun Tools/Count.ts [--json] <file | ->      counts for every platform in Platforms.md
 *
 * Units (see ../Platforms.md):
 *   x          twitter-text v3 weighting: NFC; code points in 0-4351, 8192-8205, 8208-8223, 8242-8247 cost 1,
 *              everything else 2; each emoji grapheme 2; each URL 23, bare domains with a known TLD included.
 *              Reimplemented from twitter-text (Apache-2.0, github.com/twitter/twitter-text). Change: an RGI emoji
 *              grapheme always costs 2, fixing twitter-text 3.1.0's per-code-point count of post-2019 ZWJ emoji.
 *              TLD lists live in Tlds.ts, copied from twitter-text.
 *   threads    characters, with each emoji counted as its UTF-8 bytes (Threads API docs).
 *   graphemes  user-perceived characters (Bluesky).
 *   mastodon   graphemes; each http(s) URL 23; @user@domain counted as @user.
 *   utf16      JavaScript string length, the conservative unit where a platform doesn't document one.
 * Runs on bun, or on node >= 22.6 with --experimental-strip-types. No dependencies.
 */
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { CCTLDS, GTLDS } from "./Tlds.ts"

export type Unit = "x" | "threads" | "graphemes" | "mastodon" | "utf16"
export type Status = "documented" | "observed" | "reported" | "folklore"
export type Platform = {
  key: string
  unit: Unit
  limit: number | null
  foldChars: number | null
  foldLines: number | null
  tags: number | null
  links: "ok" | "none"
  status: Status
  asOf: string
  source: string
}

export const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..")
export const UNITS: Unit[] = ["x", "threads", "graphemes", "mastodon", "utf16"]
export const STATUSES: Status[] = ["documented", "observed", "reported", "folklore"]

const graphemeSeg = new Intl.Segmenter(undefined, { granularity: "grapheme" })
export const segments = (s: string): string[] => Array.from(graphemeSeg.segment(s), (x) => x.segment)
export const graphemes = (s: string): number => segments(s).length
export const utf16 = (s: string): number => s.length
export const codePoints = (s: string): number => Array.from(s).length
export const utf8Bytes = (s: string): number => new TextEncoder().encode(s).length

let rgi: RegExp | null = null
try {
  rgi = new RegExp("^\\p{RGI_Emoji}$", "v")
} catch {
  rgi = null // runtime without the v flag: fall back below
}
/** True for one grapheme that renders as an emoji. Bare © or ™ without U+FE0F is text, not emoji. */
export function isEmoji(g: string): boolean {
  if (rgi) return rgi.test(g)
  return /\p{Extended_Pictographic}/u.test(g) && /[️‍\u{1F000}-\u{1FAFF}]/u.test(g)
}

const TLDS = `${GTLDS} ${CCTLDS}`.split(/\s+/).sort((a, b) => b.length - a.length).join("|")

// URL character classes follow twitter-text: path characters are ASCII, Latin accents, Cyrillic, and a fixed
// punctuation set, so a URL ends at an em dash, emoji, ellipsis, curly quote, Hebrew letter, or bidi mark.
const PATH_CHARS = "a-z0-9\\u00C0-\\u024F\\u0400-\\u04FF!*';:=+,.$/%#\\[\\]\\-\\u2013_~&|@()"
const QUERY_CHARS = "a-z0-9!?*'@();:&=+$/%#\\[\\]\\-_.,~|"
const TAIL = `(?::\\d{1,5})?(?:/[${PATH_CHARS}]*)?(?:\\?[${QUERY_CHARS}]*)?`
const PROTOCOL_URL = new RegExp(`https?://(?:[a-z0-9-]+\\.)*[a-z0-9-]+${TAIL}`, "gi")
const WWW_URL = new RegExp(`(?<![A-Za-z0-9_@.$#/])www\\.(?:[a-z0-9-]+\\.)*[a-z0-9-]+${TAIL}`, "gi")
// A Hebrew letter or "-" may precede a bare domain, as in twitter-text: "ב-example.com" links "-example.com".
const BARE_URL = new RegExp(`(?<![A-Za-z0-9_@.$#/])(?:[a-z0-9-][a-z0-9-]*\\.)+(?:${TLDS})(?![A-Za-z0-9_-])${TAIL}`, "gi")
const URL_END = /[a-z0-9\u00C0-\u024F\u0400-\u04FF=_#/+&\-)]/i
const MAX_URL = 4096

/** Drops trailing characters a URL can't end with, and a closing parenthesis with no opening partner. */
function trimUrl(raw: string): string {
  let u = raw
  for (;;) {
    const last = u[u.length - 1]
    if (!last) return u
    if (last === ")" && count(u, "(") >= count(u, ")")) return u
    if (last !== ")" && URL_END.test(last)) return u
    u = u.slice(0, -1)
  }
}
const count = (s: string, ch: string) => s.split(ch).length - 1

export type Span = { start: number; end: number; text: string }

/** URL spans as X sees them: with a protocol, starting with www., or a bare domain with a known TLD. */
export function findUrls(text: string): Span[] {
  const spans: Span[] = []
  for (const re of [PROTOCOL_URL, WWW_URL, BARE_URL]) {
    for (const m of text.matchAll(re)) {
      const raw = trimUrl(m[0])
      const start = m.index ?? 0
      const end = start + raw.length
      if (!raw.includes(".") || raw.length > MAX_URL) continue
      if (!spans.some((s) => start < s.end && end > s.start)) spans.push({ start, end, text: raw })
    }
  }
  return spans.sort((a, b) => a.start - b.start)
}

const xWeight = (cp: number): number =>
  cp <= 4351 || (cp >= 8192 && cp <= 8205) || (cp >= 8208 && cp <= 8223) || (cp >= 8242 && cp <= 8247) ? 1 : 2

function withoutSpans(text: string, spans: Span[]): string[] {
  const parts: string[] = []
  let at = 0
  for (const s of spans) {
    parts.push(text.slice(at, s.start))
    at = s.end
  }
  parts.push(text.slice(at))
  return parts
}

export function xWeighted(text: string): number {
  const t = text.normalize("NFC")
  const urls = findUrls(t)
  let total = urls.length * 23
  for (const part of withoutSpans(t, urls)) {
    for (const g of segments(part)) {
      if (isEmoji(g)) total += 2
      else for (const ch of g) total += xWeight(ch.codePointAt(0) ?? 0)
    }
  }
  return total
}

export function threadsLength(text: string): number {
  let total = 0
  for (const g of segments(text)) total += isEmoji(g) ? utf8Bytes(g) : codePoints(g)
  return total
}

export function mastodonLength(text: string): number {
  // Only URLs with a protocol get Mastodon's 23-character concession; bare domains count in full.
  const urls = findUrls(text).filter((u) => /^https?:\/\//i.test(u.text))
  let rewritten = ""
  let at = 0
  for (const u of urls) {
    rewritten += text.slice(at, u.start) + "x".repeat(23)
    at = u.end
  }
  rewritten += text.slice(at)
  return graphemes(rewritten.replace(/(@[A-Za-z0-9_]+)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "$1"))
}

export function countUnit(unit: Unit, text: string): number {
  switch (unit) {
    case "x":
      return xWeighted(text)
    case "threads":
      return threadsLength(text)
    case "graphemes":
      return graphemes(text)
    case "mastodon":
      return mastodonLength(text)
    case "utf16":
      return utf16(text)
  }
}

const num = (cell: string): number | null => (/^\d+$/.test(cell) ? Number(cell) : null)

/** Parses the table in Platforms.md whose first header is "Platform". Throws on a malformed row. */
export function parsePlatforms(md: string): Platform[] {
  const rows: Platform[] = []
  let inTable = false
  for (const raw of md.split("\n")) {
    const line = raw.trim()
    if (!line.startsWith("|")) {
      inTable = false
      continue
    }
    const cells = line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim())
    if (/^:?-{3,}:?$/.test(cells[0])) continue
    if (cells[0] === "Platform" && cells[1] === "Unit") {
      inTable = true
      continue
    }
    if (!inTable) continue
    const [key, unit, limit, fold, tags, links, status, asOf, source] = cells
    if (!UNITS.includes(unit as Unit)) throw new Error(`Platforms.md: ${key}: unknown unit "${unit}"`)
    const [fc, fl] = (fold ?? "").split("/")
    rows.push({
      key,
      unit: unit as Unit,
      limit: num(limit ?? ""),
      foldChars: num(fc ?? ""),
      foldLines: num(fl ?? ""),
      tags: num(tags ?? ""),
      links: links === "none" ? "none" : "ok",
      status: status as Status,
      asOf: asOf ?? "",
      source: source ?? "",
    })
  }
  return rows
}

/** Reads a post from a file or stdin ("-") as strict UTF-8 with LF line endings. Throws on bytes that aren't UTF-8. */
export function readPost(file: string): string {
  const bytes = readFileSync(file === "-" ? 0 : file)
  let text: string
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    throw new Error(`${file} is not UTF-8 (Windows-1255 Hebrew?). Re-save it as UTF-8.`)
  }
  return text.replace(/\r\n?/g, "\n")
}

let cached: Platform[] | null = null
export function loadPlatforms(): Platform[] {
  cached ??= parsePlatforms(readFileSync(join(SKILL_DIR, "Platforms.md"), "utf8"))
  return cached
}
export function platform(key: string): Platform | undefined {
  return loadPlatforms().find((p) => p.key === key)
}

export function main(argv: string[]): number {
  const json = argv.includes("--json")
  const file = argv.find((a) => a === "-" || !a.startsWith("-"))
  if (argv.includes("--help") || !file) {
    console.log("Usage: bun Tools/Count.ts [--json] <file | ->")
    return file || argv.includes("--help") ? 0 : 2
  }
  let text: string
  try {
    text = readPost(file).replace(/\s+$/, "")
  } catch (e) {
    console.error(`Cannot read ${file}: ${(e as Error).message}`)
    return 2
  }
  const rows = loadPlatforms().map((p) => {
    const count = countUnit(p.unit, text)
    return { platform: p.key, unit: p.unit, count, limit: p.limit, fits: p.limit === null || count <= p.limit }
  })
  if (json) console.log(JSON.stringify(rows, null, 2))
  else {
    for (const r of rows) {
      const lim = r.limit === null ? "—" : String(r.limit)
      console.log(`${r.platform.padEnd(17)} ${String(r.count).padStart(6)} / ${lim.padEnd(6)} ${r.unit.padEnd(9)} ${r.fits ? "ok" : "OVER"}`)
    }
  }
  return 0
}

const isMain =
  (import.meta as { main?: boolean }).main ??
  (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
if (isMain) process.exit(main(process.argv.slice(2)))
