import { afterAll, beforeAll, describe, expect, test } from "bun:test"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  baseline,
  cells,
  currentGeneration,
  frontmatterField,
  loadSignals,
  main,
  proseLines,
  scanSkill,
  stampText,
} from "./ModelUpgrade.ts"

const skillMd = (name: string, extra = "", body = "# Body\n") =>
  `---\nname: ${name}\ndescription: "Does a thing. USE WHEN you MUST do it."\ncategory: meta\neffort: low\ndomain: meta\n${extra}---\n\n${body}`

let root: string
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "model-upgrade-"))
  const add = (name: string, md: string, workflow?: string) => {
    mkdirSync(join(root, "skills", name, "Workflows"), { recursive: true })
    writeFileSync(join(root, "skills", name, "SKILL.md"), md)
    if (workflow) writeFileSync(join(root, "skills", name, "Workflows", "Run.md"), workflow)
  }
  add("Fresh", skillMd("Fresh", "tuned-for: claude-5.5\ntuned-on: 2026-10-14\n"))
  add("Old", skillMd("Old", "tuned-for: claude-4.5\ntuned-on: 2025-11-01\n"))
  add(
    "Loud",
    skillMd("Loud", "", "# Loud\n\nCRITICAL: You MUST use this tool.\nThink step by step before answering.\n"),
    "# Run\n\n```\nCRITICAL inside a fence is a quote\n```\n\nQuote `NEVER` inline is fine.\nTry to add a summary.\n",
  )
  mkdirSync(join(root, "skills", "Loud", "Tools"), { recursive: true })
  writeFileSync(join(root, "skills", "Loud", "Tools", "Notes.md"), "ALWAYS ignored: Tools is code, not prompt text\n")
  process.env.MODEL_UPGRADE_ROOT = root
})
afterAll(() => {
  delete process.env.MODEL_UPGRADE_ROOT
  rmSync(root, { recursive: true, force: true })
})

describe("Signals.md", () => {
  const signals = loadSignals()
  test("parses every row into a compiled regex with a unique id", () => {
    expect(signals.length).toBeGreaterThanOrEqual(15)
    expect(new Set(signals.map((s) => s.id)).size).toBe(signals.length)
    for (const s of signals) expect(s.re).toBeInstanceOf(RegExp)
  })
  test("escaped pipes stay inside the pattern cell", () => {
    expect(cells("| `a` | g | `x\\|y` | why |")).toEqual(["`a`", "g", "`x|y`", "why"])
    const pressure = signals.find((s) => s.id === "pressure-caps")!
    expect(pressure.re.test("You MUST do it")).toBe(true)
    expect(pressure.re.test("you must do it")).toBe(false)
  })
})

describe("scan", () => {
  test("proseLines drops fenced blocks and blanks inline code, keeping line numbers", () => {
    const lines = proseLines("a\n```\nb\n```\nc `d` e")
    expect(lines).toEqual([
      { line: 1, text: "a" },
      { line: 5, text: "c `` e" },
    ])
  })
  test("finds prose hits, skips fences, inline code, frontmatter, and Tools/", () => {
    const s = scanSkill("Loud", loadSignals(), root)
    const where = s.hits.map((h) => `${h.file.split("/").pop()}:${h.line}:${h.signal}`)
    expect(where).toContain("SKILL.md:11:pressure-caps")
    expect(where).toContain("SKILL.md:12:think-scaffold")
    expect(where).toContain("Run.md:8:hedge")
    expect(s.hits.some((h) => h.line <= 7 && h.file.endsWith("SKILL.md"))).toBe(false)
    expect(s.hits.some((h) => h.file.endsWith("Run.md") && h.signal === "pressure-caps")).toBe(false)
    expect(s.hits.some((h) => h.file.includes("Tools"))).toBe(false)
  })
  test("a clean skill has no hits", () => {
    expect(scanSkill("Fresh", loadSignals(), root).hits).toEqual([])
  })
})

describe("baseline and stamp", () => {
  test("the ledger head is the first generation heading", () => {
    expect(currentGeneration()).toMatch(/^claude-\d/)
  })
  test("classifies current, stale, and missing", () => {
    const rows = Object.fromEntries(baseline(root, "claude-5.5").map((r) => [r.skill, r.status]))
    expect(rows).toEqual({ Fresh: "current", Loud: "missing", Old: "stale" })
  })
  test("stampText inserts after domain and replaces an existing stamp", () => {
    const once = stampText(skillMd("X"), "claude-5.5", "2026-10-14")
    expect(once).toContain("domain: meta\ntuned-for: claude-5.5\ntuned-on: 2026-10-14\n---")
    const twice = stampText(once, "claude-6", "2027-01-02")
    expect(frontmatterField(twice, "tuned-for")).toBe("claude-6")
    expect(twice.match(/tuned-for:/g)?.length).toBe(1)
    expect(twice.split("---\n").pop()).toBe(once.split("---\n").pop())
  })
  test("stamp through main writes the file; --check reflects it", () => {
    expect(main(["baseline", "--check"])).toBe(1)
    expect(main(["stamp", "Loud", "Old", "--gen", currentGeneration(), "--date", "2026-10-14"])).toBe(0)
    expect(frontmatterField(readFileSync(join(root, "skills", "Old", "SKILL.md"), "utf8"), "tuned-on")).toBe("2026-10-14")
  })
})

describe("usage", () => {
  test("bad input exits 2", () => {
    expect(main([])).toBe(2)
    expect(main(["nope"])).toBe(2)
    expect(main(["stamp"])).toBe(2)
    expect(main(["stamp", "Ghost"])).toBe(2)
    expect(main(["stamp", "Fresh", "--date", "14/10/2026"])).toBe(2)
    expect(main(["scan", "--skill", "Ghost"])).toBe(2)
  })
})
