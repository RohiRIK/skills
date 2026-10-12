import { describe, test, expect } from "bun:test"
import { bodyWords, checkTemplates, detectLang, lint, loadTells, main } from "./LintEmail.ts"

const rules = (text: string, opts = {}) => lint(text, opts).findings.map((f) => f.rule)
const phrases = (text: string) => lint(text).findings.filter((f) => f.rule === "tell").map((f) => f.message)

const CLEAN_EN = `Subject: Signed contract by Thu 16 Oct

Hi Dana,

Could you send me the signed contract by Thursday 16 October? It's the last piece I need to file the permit on Friday.

If legal needs more time, a quick note with a new date works too.

Thanks,
Noa`

const CLEAN_HE = `Subject: בקשה: החוזה החתום עד יום ה', 16.10

שלום דנה,

אשמח לקבל את החוזה החתום עד יום ה', 16.10. זה החלק האחרון שחסר כדי להגיש את הבקשה להיתר ביום ו'.

צריך גם לעשות Enable ל-feature flag בסביבת staging לפני ה-release.

תודה,
נועה`

describe("Tells.md parsing", () => {
  const tells = loadTells()
  test("reads every Phrase table", () => {
    expect(tells.length).toBeGreaterThan(80)
    const all = tells.map((t) => t.phrase)
    for (const p of ["hope this email finds you", "as we spoke", "אל תהסס", "עושה שכל", "kindly"]) {
      expect(all).toContain(p)
    }
  })
  test("ban maps to error, warn to warn", () => {
    expect(tells.find((t) => t.phrase === "don't hesitate to")?.level).toBe("error")
    expect(tells.find((t) => t.phrase === "kindly")?.level).toBe("warn")
  })
})

describe("English drafts", () => {
  test("a clean email has no findings", () => {
    const r = lint(CLEAN_EN)
    expect(r.lang).toBe("en")
    expect(r.findings).toEqual([])
  })
  test("AI filler is an error, with a replacement", () => {
    const r = lint("Subject: Budget file\n\nHi Dana,\n\nI hope this email finds you well. Please don't hesitate to ask.\n\nBest,\nNoa")
    expect(r.errors).toBe(2)
    expect(phrases("I hope this email finds you well.")[0]).toContain("Start with the point")
  })
  test("Hebrew-English calques are caught", () => {
    expect(phrases("As we spoke, I will be happy if you send it.").length).toBe(2)
  })
  test("phrases match from a word start only", () => {
    expect(phrases("He spoke unkindly.")).toEqual([])
    expect(phrases("Kindly send it.")).toHaveLength(1)
    expect(phrases("We delved into it.")).toHaveLength(1)
  })
  test("curly apostrophes match straight ones", () => {
    expect(phrases("Please don’t hesitate to call.")).toHaveLength(1)
  })
  test("markdown is an error", () => {
    expect(rules("Subject: x y z\n\n**Important:** see [the doc](https://x.io/doc)\n\n## Next")).toEqual(
      expect.arrayContaining(["markdown"]),
    )
    expect(lint("Subject: Plan\n\n**Bold** text").errors).toBe(1)
  })
  test("ambiguous numeric dates warn, unambiguous ones don't", () => {
    expect(rules("Subject: Call\n\nCan we talk on 3/4?")).toContain("date")
    expect(rules("Subject: Call\n\nCan we talk on 16/10? It's 24/7.")).not.toContain("date")
  })
  test("subject checks: missing, generic, long, all caps", () => {
    expect(lint("Hi,\n\nBody.").findings.find((f) => f.rule === "subject")?.level).toBe("info")
    expect(rules("Subject: Quick question\n\nBody.")).toContain("subject")
    expect(rules(`Subject: ${"word ".repeat(15)}\n\nBody.`)).toContain("subject")
    expect(rules("Subject: PAYMENT OVERDUE\n\nBody.")).toContain("subject")
  })
  test("length over the type budget warns", () => {
    const long = `Subject: Status\n\nHi,\n\n${"word ".repeat(70)}\n\nThanks,\nNoa`
    expect(rules(long, { type: "followup" })).toContain("length")
    expect(rules(long, { type: "request" })).not.toContain("length")
  })
  test("em dashes, exclamation marks, placeholders, URL punctuation, attachments", () => {
    const r = rules("Subject: Deck\n\nHi [Name] — here — now! Great! Yes! See https://x.io/a. I've attached it.")
    expect(r).toEqual(expect.arrayContaining(["em-dash", "exclaim", "placeholder", "url-punct", "attachment"]))
  })
})

describe("Hebrew drafts", () => {
  test("a clean email with technical English has no findings", () => {
    const r = lint(CLEAN_HE)
    expect(r.lang).toBe("he")
    expect(r.findings).toEqual([])
  })
  test("calques are errors", () => {
    expect(lint("Subject: עדכון פרויקט\n\nאני מקווה שהמייל הזה מוצא אותך בטוב.").errors).toBe(1)
    expect(phrases("ואל תהססי לפנות")).toHaveLength(1)
  })
  test("parentheses in Hebrew lines are errors; English lines are untouched", () => {
    expect(rules("Subject: בדיקה\n\nהדוח (גרסה 2) מצורף.")).toContain("hebrew-parens")
    expect(rules("Subject: Check\n\nThe report (v2) is attached.")).not.toContain("hebrew-parens")
    expect(rules("Subject: Check\n\nPlease deploy (פריסה) today.")).toContain("hebrew-parens")
  })
  test("slash gender forms warn; ו/או does not", () => {
    expect(rules("Subject: בקשה\n\nתוכל/י לשלוח את הקובץ?")).toContain("gender-slash")
    expect(rules("Subject: בקשה\n\nאפשר לשלוח קובץ ו/או קישור.")).not.toContain("gender-slash")
  })
  test("a Hebrew line starting with English warns; English mid-line does not", () => {
    expect(rules("Subject: בקשה\n\nEnable צריך לעשות לפיצ'ר.")).toContain("bidi-start")
    expect(rules("Subject: בקשה\n\nצריך לעשות Enable לפיצ'ר.")).not.toContain("bidi-start")
  })
  test("language detection tolerates many technical terms", () => {
    expect(detectLang("צריך לעשות Enable ל-feature flag בסביבת staging לפני ה-release")).toBe("he")
    expect(detectLang("Please review the PR before Thursday")).toBe("en")
  })
  test("gershayim variants match the same tell", () => {
    expect(lint("Subject: x\n\nיש בעיה בחשבונית, מצ״ב").findings.some((f) => f.rule === "attachment")).toBe(true)
  })
})

describe("word count", () => {
  test("drops the greeting and the sign-off block", () => {
    expect(bodyWords(["Hi Dana,", "", "One two three.", "", "Best regards,", "Noa", "Phone"])).toBe(3)
    expect(bodyWords(["שלום דנה,", "", "אחת שתיים שלוש.", "", "בברכה,", "נועה"])).toBe(3)
  })
})

describe("templates", () => {
  test("every template block passes the house rules", () => {
    const { blocks, failures } = checkTemplates()
    expect(blocks).toBeGreaterThan(40)
    expect(failures).toEqual([])
  })
})

describe("CLI", () => {
  test("usage errors exit 2", () => {
    expect(main(["--type", "nope", "x.txt"])).toBe(2)
    expect(main(["--lang", "fr", "x.txt"])).toBe(2)
    expect(main([])).toBe(2)
  })
})
