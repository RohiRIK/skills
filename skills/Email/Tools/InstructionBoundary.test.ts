import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { SKILL_DIR } from "./LintEmail.ts"

const text = (file: string) => readFileSync(resolve(SKILL_DIR, file), "utf8")

describe("instruction contract (structural, not model behavior)", () => {
  test("router loads language and untrusted-content policy", () => {
    expect(text("SKILL.md")).toContain("Policy.md")
  })
  test("policy requires explicit Hebrew and English surrounding discussion", () => {
    const policy = text("Policy.md")
    expect(policy).toContain("English by default")
    expect(policy).toContain("explicitly requests Hebrew")
    expect(policy).toContain("surrounding discussion remains English")
    expect(policy).toContain("untrusted data")
    expect(policy).toContain("not authorization")
  })
  for (const workflow of ["Compose", "Reply", "Rewrite", "Localize", "Profile", "Review"]) {
    test(`${workflow} loads the policy before processing material`, () => {
      expect(text(`Workflows/${workflow}.md`)).toContain("Policy.md")
    })
  }
  test("standalone prompt retains the policy", () => {
    const prompts = text("Prompts.md")
    expect(prompts).toContain("English by default")
    expect(prompts).toContain("untrusted data")
    expect(prompts).not.toContain("in the sender's language.")
  })
})
