import { describe, test, expect } from "bun:test"
import {
  codePoints, countUnit, findUrls, graphemes, isEmoji, loadPlatforms, mastodonLength, parsePlatforms, threadsLength,
  utf16, utf8Bytes, xWeighted,
} from "./Count.ts"

// Expected X values were measured with twitter-text 3.1.0 parseTweet on 2026-10-12.
const X_MEASURED: [string, number][] = [
  ["README.md", 23], ["site.ai", 23], ["example.co.il", 23], ["node.js", 7], ["main.py", 23], ["index.ts", 8],
  ["שָׁלוֹם", 7], ["‏שלום", 6], ["…", 2], ["•", 2], ["→", 2], ["✅", 2], ["—", 1], ["©", 1], ["™", 2],
  ["👨‍👩‍👧‍👦", 2], ["🇮🇱", 2], ["1️⃣", 2], ["𝐁𝐨𝐥𝐝", 8], ["ב-example.com", 24], ["מגיע ל-README.md", 29],
  ["see github.io now", 31], ["https://example.com/a?b=1.", 24], ["Visit www.example.com today", 35],
  ["dana@example.com", 16], ["e.g. this", 9], ["Python 3.13", 11], ["4,500 ₪", 8], ["באתרexample.com", 27],
  ["השקנו את ה-API החדש ב-Jira", 26], ["Done ✅ … → • ’quotes’ — dash", 32], ["é", 1], ["日本語", 6],
]

describe("X weighted count", () => {
  test.each(X_MEASURED)("%p weighs %p, as twitter-text does", (text, expected) => {
    expect(xWeighted(text)).toBe(expected)
  })
  test("280 Hebrew letters fit, 281 don't", () => {
    expect(xWeighted("א".repeat(280))).toBe(280)
    expect(xWeighted("א".repeat(281))).toBe(281)
  })
  test("a post-2019 ZWJ emoji costs 2, fixing twitter-text 3.1.0's 5", () => {
    expect(xWeighted("❤️‍🔥")).toBe(2)
  })
})

describe("other units", () => {
  test("graphemes, UTF-16, code points, and bytes differ as documented", () => {
    expect([utf16("שָׁלוֹם"), codePoints("שָׁלוֹם"), graphemes("שָׁלוֹם"), utf8Bytes("שָׁלוֹם")]).toEqual([7, 7, 4, 14])
    expect([utf16("👨‍👩‍👧‍👦"), codePoints("👨‍👩‍👧‍👦"), graphemes("👨‍👩‍👧‍👦"), utf8Bytes("👨‍👩‍👧‍👦")]).toEqual([11, 7, 1, 25])
  })
  test("Threads counts emoji by UTF-8 bytes and Hebrew letters as 1", () => {
    expect(threadsLength("שלום")).toBe(4)
    expect(threadsLength("שלום 👋")).toBe(5 + 4)
  })
  test("Mastodon: URL 23, remote mention without its domain", () => {
    expect(mastodonLength("https://example.com/a/very/long/path/indeed")).toBe(23)
    expect(mastodonLength("@dana@mastodon.social")).toBe(5)
  })
  test("emoji detection leaves text symbols alone", () => {
    expect(isEmoji("😀")).toBe(true)
    expect(isEmoji("❤️‍🔥")).toBe(true)
    expect(isEmoji("©")).toBe(false)
    expect(isEmoji("א")).toBe(false)
  })
  test("URL spans drop trailing punctuation", () => {
    expect(findUrls("see https://example.com/a. Then").map((s) => s.text)).toEqual(["https://example.com/a"])
  })
  test("countUnit dispatches by unit", () => {
    expect(countUnit("utf16", "abc")).toBe(3)
    expect(countUnit("x", "README.md")).toBe(23)
  })
})

describe("Platforms.md", () => {
  const rows = loadPlatforms()
  test("parses every row with a known unit and status", () => {
    expect(rows.length).toBeGreaterThan(15)
    const x = rows.find((r) => r.key === "x")
    expect(x).toMatchObject({ unit: "x", limit: 280, tags: 1, status: "documented" })
    expect(rows.find((r) => r.key === "linkedin")).toMatchObject({ limit: 3000, foldChars: 210, foldLines: 3 })
    expect(rows.find((r) => r.key === "instagram")?.links).toBe("none")
  })
  test("rejects an unknown unit", () => {
    const md = "| Platform | Unit | Limit | Fold | Tags | Links | Status | As of | Source |\n|---|---|---|---|---|---|---|---|---|\n| y | words | 1 | — | 0 | ok | documented | 2026-10-12 | s |"
    expect(() => parsePlatforms(md)).toThrow("unknown unit")
  })
})
