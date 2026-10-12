import { describe, test, expect } from "bun:test"
import { DEFAULT_FONT, paragraphDir, renderEmail } from "./RenderEmail.ts"

const BILINGUAL = `Subject: מחוץ למשרד | Out of office

שלום,

אני מחוץ למשרד עד יום ה', 16.10. בנושאי Jira אפשר לפנות לדנה.

Hi,

I'm out of the office until Thursday 16 October.

Noa`

describe("RenderEmail", () => {
  test("sets direction per paragraph", () => {
    const html = renderEmail(BILINGUAL)
    expect(html).toContain('<p dir="rtl" style="margin:0 0 1em;text-align:right">אני מחוץ למשרד')
    expect(html).toContain(`<p dir="ltr" style="margin:0 0 1em;text-align:left">I'm out`)
  })
  test("Hebrew with technical English stays right to left", () => {
    expect(paragraphDir("צריך לעשות Enable ל-feature flag בסביבת staging")).toBe("rtl")
    expect(paragraphDir("Please enable the flag")).toBe("ltr")
  })
  test("subject becomes the title, not body text", () => {
    const html = renderEmail(BILINGUAL)
    expect(html).toContain("<title>מחוץ למשרד | Out of office</title>")
    expect(html).not.toContain("Subject:")
  })
  test("uses one font stack for both scripts, overridable", () => {
    expect(renderEmail("Hi")).toContain(`font-family:${DEFAULT_FONT}`)
    expect(renderEmail("Hi", { font: "David, Arial", size: 16 })).toContain("font-family:David, Arial;font-size:16px")
  })
  test("lists, links, and escaping", () => {
    const html = renderEmail("Items:\n- one <b>\n- two\n\nSee https://example.com/a?b=1&c=2.")
    expect(html).toContain("<ul")
    expect(html).toContain("<li>one &lt;b&gt;</li>")
    expect(html).toContain('<a href="https://example.com/a?b=1&amp;c=2">https://example.com/a?b=1&amp;c=2</a>.')
  })
  test("mostly Hebrew email gets a Hebrew page", () => {
    expect(renderEmail("שלום,\n\nתודה רבה.\n\nנועה")).toContain('<html lang="he" dir="rtl">')
  })
})
