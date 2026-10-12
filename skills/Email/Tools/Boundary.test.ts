import { describe, expect, test } from "bun:test"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { lint } from "./LintEmail.ts"

const cli = fileURLToPath(new URL("./LintEmail.ts", import.meta.url))
const draft = "Subject: Contract review\n\nPlease review the contract."

describe("lint type boundary", () => {
  for (const type of ["__proto__", "constructor", "toString", "hasOwnProperty", "nope"]) {
    test(`CLI rejects ${type} before reading input`, () => {
      const result = spawnSync(process.execPath, [cli, "--type", type, "--json", "-"], { input: draft, encoding: "utf8" })
      expect(result.status).toBe(2)
      expect(result.stderr.toString()).toContain("Unknown --type")
      expect(result.stdout.toString()).toBe("")
    })
  }
  test("valid CLI type retains its numeric budget", () => {
    const result = spawnSync(process.execPath, [cli, "--type", "request", "--json", "-"], { input: draft, encoding: "utf8" })
    expect(result.status).toBe(0)
    expect(JSON.parse(result.stdout.toString()).budget).toBe(120)
  })
  test("library fallback cannot select an inherited property", () => {
    for (const type of ["__proto__", "constructor", "toString", "nope"]) {
      const report = lint(draft, { type })
      expect(report.budget).toBe(120)
    }
  })
})
