#!/usr/bin/env bun
/**
 * ModelUpgrade: mechanical helpers for re-tuning the skill library to a new model generation.
 *
 *   bun Tools/ModelUpgrade.ts scan [--skill <Name>]... [--json]
 *   bun Tools/ModelUpgrade.ts baseline [--check] [--json]
 *   bun Tools/ModelUpgrade.ts stamp (--all | <Name>...) [--gen <id>] [--date YYYY-MM-DD]
 *
 * scan      Greps every skill's markdown (except this one, unless named with --skill) for the dated-prompt signals in ../Signals.md and prints
 *           counts and file:line hits. Fenced code blocks and inline `code` spans are skipped, since
 *           they usually quote a pattern rather than use it. A hit is a lead for the judge, not a verdict.
 * baseline  Lists each skill's `tuned-for` / `tuned-on` frontmatter against the newest generation in
 *           ../Generations.md. --check exits 1 when any skill is missing or behind.
 * stamp     Writes `tuned-for` (default: newest generation) and `tuned-on` (default: today, UTC)
 *           into the named skills' SKILL.md frontmatter, directly after `domain:`.
 *
 * The library root is found by walking up from this file to the directory holding `skills/`;
 * set MODEL_UPGRADE_ROOT to point it elsewhere (tests do). Runs on bun, or on node >= 22.6 with
 * --experimental-strip-types. No dependencies.
 *
 * Exit codes: 0 ok · 1 --check found missing or stale skills · 2 usage error.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export type Signal = { id: string; group: string; re: RegExp; why: string }
export type Hit = { signal: string; group: string; file: string; line: number; text: string }
export type SkillScan = { skill: string; hits: Hit[]; counts: Record<string, number> }
export type BaselineRow = { skill: string; tunedFor: string | null; tunedOn: string | null; status: "current" | "stale" | "missing" }

export const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SELF = "ModelUpgrade"

export function libraryRoot(): string {
  if (process.env.MODEL_UPGRADE_ROOT) return resolve(process.env.MODEL_UPGRADE_ROOT)
  let dir = SKILL_DIR
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, "skills")) && statSync(join(dir, "skills")).isDirectory()) return dir
    dir = dirname(dir)
  }
  throw new Error("ModelUpgrade: no skills/ directory above " + SKILL_DIR)
}

// Split a markdown table row on pipes that are not escaped as \|.
export function cells(row: string): string[] {
  const parts = row.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/)
  return parts.map((c) => c.trim().replace(/\\\|/g, "|"))
}

// Signals live in ../Signals.md: every table row whose first cell is a backticked id and whose
// third cell is a backticked regex. Keeping them in markdown lets the judge read the same list.
export function loadSignals(path = join(SKILL_DIR, "Signals.md")): Signal[] {
  const out: Signal[] = []
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    if (!raw.trim().startsWith("|")) continue
    const c = cells(raw)
    if (c.length < 4) continue
    const id = c[0].match(/^`([a-z0-9-]+)`$/)?.[1]
    const pattern = c[2].match(/^`(.+)`$/)?.[1]
    if (!id || !pattern) continue
    out.push({ id, group: c[1], re: new RegExp(pattern), why: c[3] })
  }
  return out
}

export function listSkills(root = libraryRoot()): string[] {
  const dir = join(root, "skills")
  return readdirSync(dir)
    .filter((n) => existsSync(join(dir, n, "SKILL.md")))
    .sort()
}

function markdownFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === "Tools" || name.startsWith(".") || name === "node_modules") continue
      out.push(...markdownFiles(p))
    } else if (name.endsWith(".md")) out.push(p)
  }
  return out
}

// Lines outside fenced blocks, with inline code spans blanked. Line numbers are preserved.
export function proseLines(text: string): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = []
  let fenced = false
  text.split("\n").forEach((raw, i) => {
    if (/^\s*(```|~~~)/.test(raw)) {
      fenced = !fenced
      return
    }
    if (fenced) return
    out.push({ line: i + 1, text: raw.replace(/`[^`]*`/g, "``") })
  })
  return out
}

function frontmatterEnd(lines: string[]): number {
  if (lines[0] !== "---") return 0
  const end = lines.indexOf("---", 1)
  return end === -1 ? 0 : end + 1
}

export function scanSkill(skill: string, signals: Signal[], root = libraryRoot()): SkillScan {
  const hits: Hit[] = []
  for (const file of markdownFiles(join(root, "skills", skill))) {
    const text = readFileSync(file, "utf8")
    const skip = frontmatterEnd(text.split("\n")) // the description is routing text, judged separately
    for (const { line, text: l } of proseLines(text)) {
      if (line <= skip) continue
      for (const s of signals) {
        if (s.re.test(l)) hits.push({ signal: s.id, group: s.group, file: relative(root, file), line, text: l.trim().slice(0, 160) })
      }
    }
  }
  const counts: Record<string, number> = {}
  for (const h of hits) counts[h.signal] = (counts[h.signal] ?? 0) + 1
  return { skill, hits, counts }
}

export function frontmatterField(skillMd: string, key: string): string | null {
  const lines = skillMd.split("\n")
  const end = frontmatterEnd(lines)
  for (const l of lines.slice(1, end - 1)) {
    const m = l.match(new RegExp(`^${key}:\\s*"?([^"]*)"?\\s*$`))
    if (m) return m[1].trim() || null
  }
  return null
}

// Newest generation = first "## <id> ..." heading in Generations.md, where id looks like claude-5.5.
export function currentGeneration(path = join(SKILL_DIR, "Generations.md")): string {
  const m = readFileSync(path, "utf8").match(/^## ([a-z]+-[0-9][0-9.]*)\b/m)
  if (!m) throw new Error("ModelUpgrade: no '## <generation-id>' heading in " + path)
  return m[1]
}

export function baseline(root = libraryRoot(), gen = currentGeneration()): BaselineRow[] {
  return listSkills(root).map((skill) => {
    const md = readFileSync(join(root, "skills", skill, "SKILL.md"), "utf8")
    const tunedFor = frontmatterField(md, "tuned-for")
    const tunedOn = frontmatterField(md, "tuned-on")
    const status = !tunedFor ? "missing" : tunedFor === gen ? "current" : "stale"
    return { skill, tunedFor, tunedOn, status }
  })
}

export function stampText(skillMd: string, gen: string, date: string): string {
  const lines = skillMd.split("\n")
  const end = frontmatterEnd(lines)
  if (!end) throw new Error("SKILL.md has no frontmatter")
  const body = lines.slice(1, end - 1).filter((l) => !/^tuned-(for|on):/.test(l))
  const at = body.findIndex((l) => /^domain:/.test(l))
  const insert = [`tuned-for: ${gen}`, `tuned-on: ${date}`]
  if (at === -1) body.push(...insert)
  else body.splice(at + 1, 0, ...insert)
  return ["---", ...body, "---", ...lines.slice(end)].join("\n")
}

function usage(msg: string): number {
  console.error(`ModelUpgrade: ${msg}\nusage: ModelUpgrade.ts scan [--skill N]... [--json] | baseline [--check] [--json] | stamp (--all | N...) [--gen id] [--date YYYY-MM-DD]`)
  return 2
}

export function main(argv: string[]): number {
  const [cmd, ...rest] = argv
  const flag = (f: string) => rest.includes(f)
  const value = (f: string) => {
    const i = rest.indexOf(f)
    return i === -1 ? undefined : rest[i + 1]
  }
  const root = libraryRoot()

  if (cmd === "scan") {
    const signals = loadSignals()
    const names: string[] = []
    rest.forEach((a, i) => a === "--skill" && rest[i + 1] && names.push(rest[i + 1]))
    const all = listSkills(root)
    const unknown = names.filter((n) => !all.includes(n))
    if (unknown.length) return usage(`unknown skill(s): ${unknown.join(", ")}`)
    // This skill's own docs quote every signal on purpose; scan it only when named.
    const scans = (names.length ? names : all.filter((n) => n !== SELF)).map((s) => scanSkill(s, signals, root))
    if (flag("--json")) console.log(JSON.stringify(scans, null, 2))
    else
      for (const s of scans) {
        const summary = Object.entries(s.counts).map(([k, v]) => `${k}×${v}`).join(" ") || "clean"
        console.log(`${s.skill}: ${summary}`)
        for (const h of s.hits) console.log(`  ${h.file}:${h.line} [${h.signal}] ${h.text}`)
      }
    return 0
  }

  if (cmd === "baseline") {
    const gen = currentGeneration()
    const rows = baseline(root, gen)
    if (flag("--json")) console.log(JSON.stringify({ current: gen, skills: rows }, null, 2))
    else {
      const behind = rows.filter((r) => r.status !== "current").length
      console.log(`current generation: ${gen} · ${rows.length - behind} current, ${behind} behind or missing`)
      for (const r of rows) console.log(`${r.status.padEnd(8)} ${r.skill.padEnd(22)} ${r.tunedFor ?? "-"} ${r.tunedOn ?? ""}`.trimEnd())
    }
    return flag("--check") && rows.some((r) => r.status !== "current") ? 1 : 0
  }

  if (cmd === "stamp") {
    const gen = value("--gen") ?? currentGeneration()
    const date = value("--date") ?? new Date().toISOString().slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return usage(`--date must be YYYY-MM-DD, got ${date}`)
    const skip = new Set([value("--gen"), value("--date")].filter(Boolean))
    const all = listSkills(root)
    const names = flag("--all") ? all : rest.filter((a) => !a.startsWith("--") && !skip.has(a))
    if (!names.length) return usage("stamp needs --all or at least one skill name")
    const unknown = names.filter((n) => !all.includes(n))
    if (unknown.length) return usage(`unknown skill(s): ${unknown.join(", ")}`)
    for (const n of names) {
      const p = join(root, "skills", n, "SKILL.md")
      writeFileSync(p, stampText(readFileSync(p, "utf8"), gen, date))
      console.log(`stamped ${n}: tuned-for ${gen}, tuned-on ${date}`)
    }
    return 0
  }

  return usage(cmd ? `unknown command ${cmd}` : "missing command")
}

const isMain =
  (import.meta as { main?: boolean }).main ??
  (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
if (isMain) process.exit(main(process.argv.slice(2)))
