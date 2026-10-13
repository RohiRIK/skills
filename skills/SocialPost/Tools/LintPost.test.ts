import { describe, test, expect } from "bun:test"
import { checkFacts, checkTemplates, foldPreview, lint, loadTells, main, splitThread } from "./LintPost.ts"

const rules = (text: string, opts = {}) => lint(text, opts).findings.map((f) => f.rule)
const levelOf = (text: string, rule: string, opts = {}) => lint(text, opts).findings.find((f) => f.rule === rule)?.level

const CLEAN_EN = `We cut our standup from 15 minutes to 5 by dropping status updates.

Instead, everyone posts blockers in the team channel before 10:00, and the standup only covers those. Two months in, nobody wants the old format back.

If you've tried something similar, what replaced the status round for you?`

const CLEAN_HE = `קיצרנו את ה-standup מ-15 דקות ל-5, כשהפסקנו לעדכן סטטוס.

במקום זה, כל אחד כותב את החסמים שלו בערוץ של הצוות עד 10:00, וה-standup עוסק רק בהם. חודשיים אחרי, אף אחד לא רוצה לחזור לפורמט הישן.

מי שניסה משהו דומה, מה בא אצלכם במקום סבב הסטטוס?`

describe("Tells.md", () => {
  test("parses all Phrase tables in both languages", () => {
    const all = loadTells().map((t) => t.phrase)
    expect(all.length).toBeGreaterThan(120)
    for (const p of ["comment yes", "תגיבו כן", "let that sink in", "נרגש לשתף", "as we spoke"]) expect(all).toContain(p)
  })
})

describe("clean posts pass", () => {
  test("English, on LinkedIn and X", () => {
    expect(lint(CLEAN_EN, { platform: "linkedin" }).findings).toEqual([])
    expect(lint("We cut our standup from 15 minutes to 5 by dropping status updates.", { platform: "x" }).findings).toEqual([])
  })
  test("Hebrew with technical English, on LinkedIn", () => {
    const r = lint(CLEAN_HE, { platform: "linkedin" })
    expect(r.lang).toBe("he")
    expect(r.findings).toEqual([])
  })
})

describe("bait, leaks, and tells", () => {
  test("engagement bait is an error in both languages", () => {
    expect(levelOf("Comment YES and I'll send the guide.", "tell")).toBe("error")
    expect(levelOf("תגיבו כן ואשלח לכם את המדריך.", "tell")).toBe("error")
    expect(levelOf("תייגו חברה שצריכה לשמוע את זה.", "tell")).toBe("error")
  })
  test("bait phrases don't fire on ordinary sentences", () => {
    expect(rules("It looks like if we ship Friday we're fine.")).not.toContain("tell")
    expect(rules("The trial period ends on Sunday.")).not.toContain("tell")
  })
  test("chatbot preamble, quotes around the post, and a Hashtags label", () => {
    expect(rules("Here's a LinkedIn post about our launch:\n\nWe launched.")).toContain("chatbot-leak")
    expect(rules("Here's my post-mortem of Tuesday's outage.")).not.toContain("chatbot-leak")
    expect(rules('"We launched offline mode today."')).toContain("chatbot-leak")
    expect(rules("We launched.\n\nHashtags: #AI")).toContain("chatbot-leak")
  })
  test("three warn-level tells become a density error", () => {
    const r = lint("This game-changer will elevate and empower your team.")
    expect(r.findings.find((f) => f.rule === "tell-density")?.level).toBe("error")
  })
  test("contrast structures: one warns, two are an error", () => {
    expect(levelOf("It's not about the money, it's about freedom.", "contrast")).toBe("warn")
    expect(levelOf("It's not about the money, it's about freedom. Not a tool. Not a feature. A movement.", "contrast")).toBe("error")
    expect(levelOf("זה לא עניין של כסף, זה עניין של חופש.", "contrast")).toBe("warn")
    expect(rules("it's not ready yet, but we're close")).not.toContain("contrast")
  })
})

describe("formatting", () => {
  test("markdown and fake Unicode styling are errors", () => {
    expect(rules("**Big** news")).toContain("markdown")
    expect(rules("𝗕𝗶𝗴 news today")).toContain("fake-styling")
    expect(rules("Ｆｕｌｌｗｉｄｔｈ text")).toContain("fake-styling")
    expect(rules("Café, ½, ™, and שלום are fine")).not.toContain("fake-styling")
  })
  test("Telegram allows **bold**", () => {
    expect(rules("**Big** news", { platform: "telegram" })).not.toContain("markdown")
  })
  test("emoji bullets, em dashes, broetry", () => {
    expect(levelOf("✅ one\n✅ two\n✅ three", "emoji-bullets")).toBe("error")
    expect(levelOf("One — two — three.", "em-dash")).toBe("error")
    expect(levelOf("We shipped.\n\nIt broke.\n\nWe fixed it.\n\nWe learned.", "broetry")).toBe("warn")
  })
  test("--allow suppresses style rules but never bans", () => {
    expect(rules("One — two.", { allow: ["em-dash"] })).not.toContain("em-dash")
    expect(rules("Comment YES below.", { allow: ["tell"] })).toContain("tell")
  })
})

describe("Hebrew and RTL", () => {
  test("parentheses in a Hebrew line are an error", () => {
    expect(levelOf("השקנו את המוצר (סוף סוף).", "hebrew-parens")).toBe("error")
  })
  test("only a Latin first letter flips a line; digits, emoji, # and @ don't", () => {
    expect(rules("Figma השיקה היום כלי חדש.")).toContain("bidi-start")
    expect(rules("@dana כתבה על זה פוסט מצוין.")).toContain("bidi-start")
    for (const ok of ["2026 הייתה שנה של למידה.", "🚀 השקנו היום גרסה חדשה.", "#הייטק זה לא רק קוד.", "השקנו את Figma Make."]) {
      expect(rules(ok)).not.toContain("bidi-start")
    }
  })
  test("pointers, phones, signs, and English sentences mid-line", () => {
    expect(rules("לכל הפרטים 👉 בקישור")).toContain("wrong-way-pointer")
    expect(rules("חייגו 054 123 4567 עכשיו")).toContain("spaced-phone")
    expect(rules("ירידה של -5% במכירות")).toContain("leading-sign")
    expect(rules("כמו שאמר Steve Jobs: Stay hungry, stay foolish. וזה נכון.")).toContain("en-quote-midline")
    expect(rules("השקנו את Figma. עכשיו כולם משתמשים.")).not.toContain("en-quote-midline")
  })
  test("hashtag and mention portability", () => {
    expect(rules('גיוס עובדים #צה"ל')).toContain("hashtag-portable")
    expect(rules("הכנס על #AI_בעברית")).not.toContain("hashtag-portable")
    expect(rules("מדברים על ב#AI")).toContain("hashtag-portable")
    expect(rules("#AI #בינה_מלאכותית")).toContain("mixed-tag-line")
    expect(rules("תודה ל-@dana על העזרה")).toContain("mention-portable")
    expect(rules("תודה רבה @dana על העזרה")).not.toContain("mention-portable")
  })
  test("gender slash forms warn, except in hiring posts", () => {
    expect(rules("אני שמח/ה לשתף")).toContain("gender-slash")
    expect(rules("דרוש/ה מפתח/ת backend", { type: "hiring" })).not.toContain("gender-slash")
  })
  test("a Hebrew prefix glued to a link", () => {
    expect(rules("פרטים ב-example.com")).toContain("link-glued")
  })
})

describe("platform rules", () => {
  test("over the limit is an error, in the platform's unit", () => {
    expect(levelOf("א".repeat(281), "length", { platform: "x" })).toBe("error")
    expect(rules("א".repeat(280), { platform: "x" })).not.toContain("length")
  })
  test("hashtag cap, dead links, and the hook fold", () => {
    expect(rules("Launch day #a1 #b2", { platform: "x" })).toContain("hashtag-count")
    expect(rules("New drop. Link: https://example.com", { platform: "instagram" })).toContain("link-dead")
    expect(rules(`${"word ".repeat(60)}\n\nmore`, { platform: "linkedin" })).toContain("hook-cut")
  })
  test("sponsored posts need a label on the first line", () => {
    expect(levelOf("Loving this new keyboard.", "disclosure", { sponsored: true })).toBe("error")
    expect(rules("Ad: Loving this new keyboard.", { sponsored: true })).not.toContain("disclosure")
    expect(rules("פרסומת: המקלדת החדשה שלי.", { sponsored: true })).not.toContain("disclosure")
  })
  test("fold preview stops at the line budget", () => {
    expect(foldPreview("one\n\ntwo\n\nthree", 210, 3)).toBe("one\n\ntwo")
  })
})

describe("thread splitting", () => {
  const long = Array.from({ length: 15 }, (_, i) => `זה המשפט מספר ${i + 1} בשרשור, והוא מסביר רעיון אחד בצורה ברורה.`).join(" ")
  test("every post fits X and carries n/N", () => {
    const posts = splitThread(long, "x")
    expect(posts.length).toBeGreaterThan(1)
    posts.forEach((p, i) => {
      expect(lint(p, { platform: "x" }).count).toBeLessThanOrEqual(280)
      expect(p.endsWith(` ${i + 1}/${posts.length}`)).toBe(true)
    })
  })
  test("abbreviations don't end a sentence", () => {
    const posts = splitThread(`Dr. Cohen joined us. ${"More words here. ".repeat(30)}`, "x")
    expect(posts[0].startsWith("Dr. Cohen joined us.")).toBe(true)
  })
})

describe("maintenance checks", () => {
  test("every template block passes the house rules", () => {
    const { blocks, failures } = checkTemplates()
    expect(blocks).toBeGreaterThan(40)
    expect(failures).toEqual([])
  })
  test("facts are fresh as of the research date and stale 200 days later", () => {
    expect(checkFacts(new Date("2026-10-12T00:00:00Z"))).toEqual([])
    expect(checkFacts(new Date("2027-05-01T00:00:00Z")).length).toBeGreaterThan(0)
  })
  test("usage errors exit 2", () => {
    expect(main(["--platform", "myspace", "x.txt"])).toBe(2)
    expect(main(["--lang", "fr", "x.txt"])).toBe(2)
    expect(main([])).toBe(2)
  })
})
