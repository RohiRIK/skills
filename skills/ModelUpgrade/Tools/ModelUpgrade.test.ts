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
  generations,
  main,
  proseLines,
  resolveModel,
  scanSkill,
  stampText,
  tunedList,
} from "./ModelUpgrade.ts"

const skillMd = (name: string, extra = "", body = "# Body\n") =>
  `---\nname: ${name}\ndescription: "Does a thing. USE WHEN you MUST do it."\ncategory: meta\neffort: low\ndomain: meta\n${extra}---\n\n${body}`

const LEDGER = `# Ledger

## claude-5.5 — 2026-10 · Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1

- note

## gpt-5.5 — 2026-09 · GPT-5.5, GPT-5.5 mini

## claude-5 — 2026 · Opus 5, Sonnet 5

## claude-4.5 — 2025 · Opus 4.5, Sonnet 4.5
`

let root: string
let ledger: string
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "model-upgrade-"))
  ledger = join(root, "Generations.md")
  writeFileSync(ledger, LEDGER)
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
  add("Both", skillMd("Both", "tuned-for: claude-5.5, gpt-5.5\ntuned-on: 2026-10-16\n"))
  process.env.MODEL_UPGRADE_ROOT = root
  process.env.MODEL_UPGRADE_LEDGER = ledger
})
afterAll(() => {
  delete process.env.MODEL_UPGRADE_ROOT
  delete process.env.MODEL_UPGRADE_LEDGER
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

describe("ledger and model resolution", () => {
  test("the real ledger parses and its head is a Claude generation", () => {
    delete process.env.MODEL_UPGRADE_LEDGER
    try {
      expect(currentGeneration()).toMatch(/^claude-\d/)
      expect(generations()[0].models.length).toBeGreaterThan(0)
    } finally {
      process.env.MODEL_UPGRADE_LEDGER = ledger
    }
  })
  test("heads are per family; the first family is the default", () => {
    expect(currentGeneration()).toBe("claude-5.5")
    expect(currentGeneration("claude")).toBe("claude-5.5")
    expect(currentGeneration("gpt")).toBe("gpt-5.5")
    expect(() => currentGeneration("gemini")).toThrow()
    expect(generations().find((g) => g.id === "gpt-5.5")?.models).toEqual(["GPT-5.5", "GPT-5.5 mini"])
  })
  test("resolves host model ids and display names, longest match first", () => {
    expect(resolveModel("claude-opus-5-5[1m]")).toBe("claude-5.5")
    expect(resolveModel("Opus 5.5")).toBe("claude-5.5")
    expect(resolveModel("claude-opus-5")).toBe("claude-5")
    expect(resolveModel("claude-sonnet-4-5-20250929")).toBe("claude-4.5")
    expect(resolveModel("gpt-5.5-mini")).toBe("gpt-5.5")
    expect(resolveModel("gemini-3-pro")).toBeNull()
    expect(main(["resolve", "gemini-3-pro"])).toBe(1)
    expect(main(["resolve", "claude-fable-5-1"])).toBe(0)
  })
})

describe("baseline and stamp", () => {
  test("classifies current, stale, and missing per target family", () => {
    const rows = (gen: string) => Object.fromEntries(baseline(root, gen).map((r) => [r.skill, r.status]))
    expect(rows("claude-5.5")).toEqual({ Both: "current", Fresh: "current", Loud: "missing", Old: "stale" })
    expect(rows("gpt-5.5")).toEqual({ Both: "current", Fresh: "missing", Loud: "missing", Old: "missing" })
  })
  test("stampText inserts after domain and replaces an existing stamp of the same family", () => {
    const once = stampText(skillMd("X"), "claude-5.5", "2026-10-14")
    expect(once).toContain("domain: meta\ntuned-for: claude-5.5\ntuned-on: 2026-10-14\n---")
    const twice = stampText(once, "claude-6", "2027-01-02")
    expect(frontmatterField(twice, "tuned-for")).toBe("claude-6")
    expect(twice.match(/tuned-for:/g)?.length).toBe(1)
    expect(twice.split("---\n").pop()).toBe(once.split("---\n").pop())
  })
  test("stamping another family keeps the existing one", () => {
    const md = stampText(stampText(skillMd("X"), "claude-5.5", "2026-10-14"), "gpt-5.5", "2026-10-16")
    expect(tunedList(md)).toEqual(["gpt-5.5", "claude-5.5"])
    expect(tunedList(stampText(md, "claude-6", "2027-01-02"))).toEqual(["claude-6", "gpt-5.5"])
  })
  test("stamp through main writes the file; --check reflects it; --target takes a model name", () => {
    expect(main(["baseline", "--check"])).toBe(1)
    expect(main(["stamp", "Loud", "Old", "--gen", "claude-5.5", "--date", "2026-10-14"])).toBe(0)
    expect(frontmatterField(readFileSync(join(root, "skills", "Old", "SKILL.md"), "utf8"), "tuned-on")).toBe("2026-10-14")
    expect(main(["baseline", "--check"])).toBe(0)
    expect(main(["stamp", "Fresh", "--target", "GPT-5.5", "--date", "2026-10-16"])).toBe(0)
    expect(tunedList(readFileSync(join(root, "skills", "Fresh", "SKILL.md"), "utf8"))).toEqual(["gpt-5.5", "claude-5.5"])
    expect(main(["baseline", "--target", "gpt-5.5", "--check"])).toBe(1)
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
    expect(main(["stamp", "Fresh", "--target", "gemini-3"])).toBe(2)
    expect(main(["baseline", "--target", "llama-9"])).toBe(2)
  })
})
