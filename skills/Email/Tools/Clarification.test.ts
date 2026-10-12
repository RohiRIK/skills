import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { SKILL_DIR } from "./LintEmail.ts"
const text = (name: string) => readFileSync(resolve(SKILL_DIR, name), "utf8")

describe("needed clarification guidance (structural)", () => {
  test("shared rule permits one batch of up to four needed questions", () => {
    const rule = text("Clarification.md")
    expect(rule).toContain("up to four")
    expect(rule).toContain("one batch")
    expect(rule).toContain("Do not re-ask")
    expect(rule).toContain("signature")
    expect(rule).toContain("language")
    expect(rule).toContain("tone")
  })
  for (const file of ["SKILL.md", "VoiceProfile.md", "Workflows/Compose.md", "Workflows/Reply.md", "Workflows/Localize.md"]) {
    test(`${file} routes missing essentials to clarification`, () => {
      expect(text(file)).toContain("Clarification.md")
    })
  }
  test("standalone prompt does not silently replace a missing signature", () => {
    expect(text("Prompts.md")).toContain("up to four")
    expect(text("VoiceProfile.md")).not.toContain("ask for nothing up front")
    expect(text("Workflows/Compose.md")).not.toContain("Ask at most two questions")
  })
})
