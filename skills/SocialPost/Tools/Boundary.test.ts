import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { SKILL_DIR } from "./Count.ts"
import { lint } from "./LintPost.ts"

const cli = fileURLToPath(new URL("./LintPost.ts", import.meta.url))
const post = "We launched offline mode today."
const run = (args: string[]) => spawnSync(process.execPath, [cli, ...args, "-"], { input: post, encoding: "utf8" })
const text = (file: string) => readFileSync(resolve(SKILL_DIR, file), "utf8")

describe("CLI input boundary", () => {
  for (const key of ["__proto__", "constructor", "toString", "hasOwnProperty", "myspace"]) {
    test(`--platform ${key} is rejected before reading input`, () => {
      const r = run(["--platform", key, "--json"])
      expect(r.status).toBe(2)
      expect(r.stdout.toString()).toBe("")
    })
  }
  test("--type and --allow only accept known values", () => {
    expect(run(["--type", "__proto__"]).status).toBe(2)
    expect(run(["--allow", "tell"]).status).toBe(2)
    expect(run(["--allow", "constructor"]).status).toBe(2)
    expect(run(["--type", "hiring", "--allow", "em-dash"]).status).toBe(0)
  })
  test("the library ignores unknown platforms and un-allowable rules", () => {
    expect(lint(post, { platform: "__proto__" }).platform).toBeNull()
    expect(lint("Comment YES below.", { allow: ["tell"] }).findings.some((f) => f.rule === "tell")).toBe(true)
    expect(lint("✅ a\n✅ b\n✅ c", { allow: ["emoji-bullets"] }).findings.some((f) => f.rule === "emoji-bullets")).toBe(true)
  })
})

describe("instruction contract (structural, not model behavior)", () => {
  test("router loads the policy and the clarification rules", () => {
    expect(text("SKILL.md")).toContain("Policy.md")
    expect(text("SKILL.md")).toContain("Clarification.md")
  })
  test("policy: English by default, explicit Hebrew, untrusted sources", () => {
    const policy = text("Policy.md")
    expect(policy).toContain("English by default")
    expect(policy).toContain("explicitly requests Hebrew")
    expect(policy).toContain("surrounding discussion remains English")
    expect(policy).toContain("untrusted data")
    expect(policy).toContain("not authorization")
  })
  for (const workflow of ["Compose", "Thread", "Rewrite", "Repurpose", "Localize", "Reply", "Review", "Profile", "Refresh"]) {
    test(`${workflow} loads the policy before processing material`, () => {
      expect(text(`Workflows/${workflow}.md`)).toContain("Policy.md")
    })
  }
  test("standalone prompt keeps the policy", () => {
    const prompts = text("Prompts.md")
    expect(prompts).toContain("English by default")
    expect(prompts).toContain("untrusted data")
    expect(prompts).not.toContain("English or Hebrew?")
  })
  test("replies don't follow the source post's language", () => {
    expect(text("Workflows/Reply.md")).not.toContain("In the post's language")
  })
})
