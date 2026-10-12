#!/usr/bin/env bun
/**
 * LintEmail: mechanical checks for an email draft in English or Hebrew.
 *
 *   bun Tools/LintEmail.ts [--type <type>] [--lang en|he] [--json] <file | ->
 *   bun Tools/LintEmail.ts --check-templates
 *
 * Input is plain text. An optional first line "Subject: ..." (or "נושא: ...") is checked as the subject.
 * Phrase rules come from ../Tells.md: every table whose first header is "Phrase".
 * Length budgets mirror the table in ../Anatomy.md.
 * Runs on bun, or on node >= 22.6 with --experimental-strip-types. No dependencies.
 *
 * Exit codes: 0 no errors (warnings allowed) · 1 errors found · 2 usage error.
 */
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export type Level = "error" | "warn" | "info"
export type Lang = "en" | "he"
export type Finding = { level: Level; rule: string; line: number; message: string }
export type Tell = { phrase: string; level: Level; instead: string; re: RegExp }
export type Report = {
  lang: Lang
  type: string
  words: number
  budget: number
  subject: string | null
  findings: Finding[]
  errors: number
  warnings: number
}

export const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..")

// Body words, without greeting and signature. Keep in sync with Anatomy.md "Length budgets".
export const BUDGETS: Record<string, { en: number; he: number }> = {
  followup: { en: 60, he: 50 },
  meeting: { en: 100, he: 85 },
  request: { en: 120, he: 100 },
  reply: { en: 120, he: 100 },
  cold: { en: 125, he: 110 },
  hard: { en: 150, he: 130 },
  update: { en: 200, he: 170 },
  recap: { en: 200, he: 170 },
  announcement: { en: 300, he: 250 },
  formal: { en: 300, he: 250 },
}

const HEB = /[א-ת]/
const SUBJECT_LINE = /^(?:subject|נושא)\s*:\s*(.*)$/i
const GENERIC_SUBJECTS = new Set([
  "hello", "hi", "hey", "question", "quick question", "follow up", "follow-up", "following up",
  "update", "checking in", "important", "urgent", "request", "meeting", "fyi",
  "שלום", "היי", "שאלה", "שאלה קצרה", "עדכון", "בקשה", "תזכורת", "דחוף", "חשוב", "פגישה",
])
// Rules that templates may trigger on purpose; --check-templates ignores them.
const TEMPLATE_EXEMPT = new Set(["placeholder", "length", "subject", "attachment"])

const count = (s: string, re: RegExp) => (s.match(re) ?? []).length
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Curly quotes and Hebrew geresh/gershayim to ASCII, so phrases match either spelling. */
export function normalize(s: string): string {
  return s.replace(/[‘’׳]/g, "'").replace(/[“”״]/g, '"')
}

export function detectLang(text: string): Lang {
  const he = count(text, /[א-ת]/g)
  const en = count(text, /[A-Za-z]/g)
  // Hebrew mail carries English technical terms, so Hebrew wins at a low share.
  return he > 0 && he / (he + en) >= 0.3 ? "he" : "en"
}

function phraseRegex(phrase: string): RegExp {
  const body = escapeRe(phrase)
  // English matches from a word start (delve → delved, not kindly → unkindly).
  // Hebrew matches anywhere: prefixes such as ו, ה, ש, ב, ל, מ attach to the word.
  return HEB.test(phrase) ? new RegExp(body, "u") : new RegExp(`(?<![\\p{L}\\p{N}])${body}`, "iu")
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
      const phrase = normalize(m[1])
      tells.push({ phrase, level, instead: cells[2] ?? "", re: phraseRegex(phrase) })
    }
  }
  return tells
}

let cachedTells: Tell[] | null = null
export function loadTells(): Tell[] {
  cachedTells ??= parseTells(readFileSync(join(SKILL_DIR, "Tells.md"), "utf8"))
  return cachedTells
}

/** Counts body words, leaving out a short greeting line and the sign-off block. */
export function bodyWords(lines: string[]): number {
  const kept = lines.map((l) => l.trim())
  while (kept.length && !kept[0]) kept.shift()
  while (kept.length && !kept[kept.length - 1]) kept.pop()
  const isShortClosing = (l: string) => /[,!:]$/.test(l) && l.split(/\s+/).length <= 6
  if (kept.length && isShortClosing(kept[0])) kept.shift()
  const nonEmpty = kept.map((l, i) => (l ? i : -1)).filter((i) => i >= 0)
  for (const i of nonEmpty.slice(-6).reverse()) {
    if (/[,!]$/.test(kept[i]) && kept[i].split(/\s+/).length <= 4) {
      kept.length = i
      break
    }
  }
  return kept.join(" ").split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
}

export function lint(text: string, opts: { type?: string; lang?: Lang; tells?: Tell[] } = {}): Report {
  const type = opts.type ?? "request"
  const tells = opts.tells ?? loadTells()
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const findings: Finding[] = []
  const add = (level: Level, rule: string, line: number, message: string) =>
    findings.push({ level, rule, line, message })

  const firstIdx = lines.findIndex((l) => l.trim() !== "")
  const subjectMatch = firstIdx >= 0 ? lines[firstIdx].trim().match(SUBJECT_LINE) : null
  const subjectIdx = subjectMatch ? firstIdx : -1
  const subject = subjectMatch ? subjectMatch[1].trim() : null
  const bodyLines = lines.filter((_, i) => i !== subjectIdx)
  const body = bodyLines.join("\n")
  const lang = opts.lang ?? detectLang(body)

  if (!body.trim()) add("error", "empty", 0, "The email has no body.")

  let mentionsAttachment = false
  lines.forEach((raw, i) => {
    const n = i + 1
    const line = i === subjectIdx ? subject ?? "" : raw
    const norm = normalize(line)

    for (const t of tells) {
      if (t.re.test(norm)) add(t.level, "tell", n, `"${t.phrase}": ${t.instead}`)
    }
    if (HEB.test(line) && /[()]/.test(line)) {
      add("error", "hebrew-parens", n, "Parentheses in Hebrew text (house rule). Use a comma, a colon, or a new sentence.")
    }
    const holes = [...line.matchAll(/\[[^\]\n]{1,80}\](?!\()|\{\{[^}\n]+\}\}/g)].map((m) => m[0])
    if (holes.length) add("warn", "placeholder", n, `Unfilled: ${holes.join(" ")}`)
    if (i === subjectIdx) return

    if (/^\s{0,3}#{1,6}\s/.test(line)) add("error", "markdown", n, "Markdown heading: the # shows literally in email.")
    if (/\*\*[^*\n]+\*\*|__[^_\n]+__/.test(line)) add("error", "markdown", n, "Markdown bold: arrives as raw asterisks.")
    if (/\[[^\]\n]+\]\((?:https?:|mailto:|www\.)[^)\s]*\)/.test(line)) {
      add("error", "markdown", n, "Markdown link: put the full URL on its own line.")
    }
    if (/^\s*\|.*\|\s*$/.test(line)) add("error", "markdown", n, "Markdown table: rewrite as sentences or a short list.")
    if (/`[^`\n]+`/.test(line)) add("warn", "markdown", n, "Backticks show literally in email.")

    if (HEB.test(line)) {
      const slashes = [...line.matchAll(/[א-ת]{2,}\/([א-ת]{1,3})(?![א-ת])/g)]
        .filter((m) => m[1] !== "או")
        .map((m) => m[0])
      if (slashes.length) add("warn", "gender-slash", n, `${slashes.join(" ")}: rephrase gender-free (Hebrew.md).`)
      const firstStrong = line.match(/[A-Za-zא-ת]/)
      if (firstStrong && /[A-Za-z]/.test(firstStrong[0])) {
        add("warn", "bidi-start", n, "Hebrew line starts with an English word; it may render left to right. Start with a Hebrew word.")
      }
    }
    if (lang === "en") {
      for (const m of line.matchAll(/(?<![\d/])(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?(?![\d/])/g)) {
        const [a, b] = [Number(m[1]), Number(m[2])]
        if (a >= 1 && b >= 1 && a <= 12 && b <= 12 && a !== b) {
          add("warn", "date", n, `"${m[0]}" reads as two different dates. Write the month name: "Thu 16 Oct".`)
        }
      }
    }
    if (/(?:https?:\/\/|www\.)\S*?[.,;:!?)](?=\s|$)/.test(line)) {
      add("warn", "url-punct", n, "Punctuation right after a URL may become part of the link. Put the URL on its own line.")
    }
    if (/(?<![\p{L}])(?:attach(?:ed|ment|ments|ing)?|enclosed)(?![\p{L}])|מצורף|מצורפת|מצורפים|מצורפות|מצ"ב|צירפתי/iu.test(norm)) {
      mentionsAttachment = true
    }
  })

  const emDashes = count(body, /—/g)
  if (emDashes > 1) add("warn", "em-dash", 0, `${emDashes} em dashes; use at most one. A period or comma usually works.`)
  const bangs = count(body, /!/g)
  if (bangs > 2) add("warn", "exclaim", 0, `${bangs} exclamation marks; keep it to one or two.`)

  if (subject === null) {
    add("info", "subject", 0, 'No "Subject:" line. Add one: specific, under 60 characters.')
  } else {
    const bare = subject.replace(/^(?:(?:re|fwd?|תשובה|הועבר)\s*:\s*)+/i, "").trim().toLowerCase().replace(/[.!?]+$/, "")
    if (!bare) add("warn", "subject", subjectIdx + 1, "Empty subject.")
    else if (GENERIC_SUBJECTS.has(bare)) add("warn", "subject", subjectIdx + 1, `Generic subject "${subject}": name the action or the object.`)
    if (subject.length > 60) add("warn", "subject", subjectIdx + 1, `Subject is ${subject.length} characters; keep it under 60.`)
    if (/[A-Z]{4,}/.test(subject) && subject === subject.toUpperCase() && !HEB.test(subject)) {
      add("warn", "subject", subjectIdx + 1, "ALL-CAPS subject reads as shouting or spam.")
    }
  }

  const budgets = Object.hasOwn(BUDGETS, type) ? BUDGETS[type] : BUDGETS.request
  const budget = budgets[lang]
  const words = bodyWords(bodyLines)
  if (words > budget) add("warn", "length", 0, `${words} body words; the ${type} budget for ${lang} is ${budget}. Cut context, hedges, pleasantries.`)
  if (mentionsAttachment) add("info", "attachment", 0, "Mentions an attachment: remind the user to attach it.")

  const errors = findings.filter((f) => f.level === "error").length
  const warnings = findings.filter((f) => f.level === "warn").length
  return { lang, type, words, budget, subject, findings, errors, warnings }
}

export type TemplateFailure = { file: string; block: number; finding: Finding }

/** Lints every ```text block in Templates*.md; returns findings a template should never have. */
export function checkTemplates(dir: string = SKILL_DIR): { blocks: number; failures: TemplateFailure[] } {
  const failures: TemplateFailure[] = []
  let blocks = 0
  for (const file of readdirSync(dir).filter((f) => /^Templates.+\.md$/.test(f)).sort()) {
    const md = readFileSync(join(dir, file), "utf8")
    let block = 0
    for (const m of md.matchAll(/```text\n([\s\S]*?)```/g)) {
      block++
      blocks++
      for (const finding of lint(m[1], { type: "formal" }).findings) {
        if (finding.level !== "info" && !TEMPLATE_EXEMPT.has(finding.rule)) failures.push({ file, block, finding })
      }
    }
  }
  return { blocks, failures }
}

function formatReport(r: Report): string {
  const subj = r.subject === null ? "none" : `"${r.subject}"`
  const out = [`LintEmail: lang=${r.lang} type=${r.type} words=${r.words}/${r.budget} subject=${subj}`]
  for (const f of r.findings) {
    const where = f.line ? `L${f.line}` : ""
    out.push(`  ${f.level.padEnd(5)}  ${where.padEnd(5)} ${f.rule.padEnd(13)} ${f.message}`)
  }
  out.push(`Result: ${r.errors} error${r.errors === 1 ? "" : "s"}, ${r.warnings} warning${r.warnings === 1 ? "" : "s"}`)
  return out.join("\n")
}

const USAGE = `Usage:
  bun Tools/LintEmail.ts [--type <type>] [--lang en|he] [--json] <file | ->
  bun Tools/LintEmail.ts --check-templates

Types: ${Object.keys(BUDGETS).join(", ")} (default: request)
Exit: 0 no errors · 1 errors found · 2 usage error`

export function main(argv: string[]): number {
  let type = "request"
  let lang: Lang | undefined
  let json = false
  let file: string | undefined
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--help" || a === "-h") {
      console.log(USAGE)
      return 0
    } else if (a === "--check-templates") {
      const { blocks, failures } = checkTemplates()
      for (const f of failures) {
        console.log(`${f.file} block ${f.block} L${f.finding.line}: ${f.finding.rule}: ${f.finding.message}`)
      }
      console.log(`check-templates: ${blocks} blocks, ${failures.length} failure${failures.length === 1 ? "" : "s"}`)
      return failures.length ? 1 : 0
    } else if (a === "--type") {
      type = argv[++i] ?? ""
    } else if (a === "--lang") {
      const v = argv[++i]
      if (v !== "en" && v !== "he") {
        console.error(`--lang must be en or he\n\n${USAGE}`)
        return 2
      }
      lang = v
    } else if (a === "--json") {
      json = true
    } else if (a === "-" || !a.startsWith("-")) {
      file = a
    } else {
      console.error(`Unknown option ${a}\n\n${USAGE}`)
      return 2
    }
  }
  if (!Object.hasOwn(BUDGETS, type)) {
    console.error(`Unknown --type "${type}"\n\n${USAGE}`)
    return 2
  }
  if (!file) {
    console.error(USAGE)
    return 2
  }
  let text: string
  try {
    text = readFileSync(file === "-" ? 0 : file, "utf8")
  } catch (e) {
    console.error(`Cannot read ${file}: ${(e as Error).message}`)
    return 2
  }
  const report = lint(text, { type, lang })
  console.log(json ? JSON.stringify(report, null, 2) : formatReport(report))
  return report.errors > 0 ? 1 : 0
}

const isMain =
  (import.meta as { main?: boolean }).main ??
  (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
if (isMain) process.exit(main(process.argv.slice(2)))
