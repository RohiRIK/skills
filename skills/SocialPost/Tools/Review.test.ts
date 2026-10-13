// Regressions from the adversarial review of 2026-10-12: each case reproduced a real false positive or a miss.
import { describe, test, expect } from "bun:test"
import { foldPreview, lint, main, splitThread } from "./LintPost.ts"

const rules = (text: string, opts = {}) => lint(text, opts).findings
const errorsOf = (text: string, opts = {}) => rules(text, opts).filter((f) => f.level === "error").map((f) => f.rule)
const has = (text: string, rule: string, opts = {}) => rules(text, opts).some((f) => f.rule === rule)

describe("Hebrew: ordinary sentences are not bait", () => {
  test.each([
    "רוב הלקוחות הגיבו כן להצעה החדשה.",
    "בסקר הפנימי, 64% מהעובדים כתבו כן לשבוע עבודה מקוצר.",
    "בתוך שעה, מאות אנשים כתבו אמן מתחת לפוסט.",
    "רק 3 אנשים עשו לייק וגם קראו את המאמר עד הסוף.",
    "בכנס, שני עובדים תייגו חברה מהצוות הקודם בתמונה.",
    "בקשה קטנה: אל תתייגו חברים שלא היו מעורבים בפרויקט.",
    "בקשה אחת: אל תתנו לייק לפוסטים שמפיצים פייק.",
    "שתפו אם גם אצלכם זה קרה, ומה עשיתם.",
    "אשמח שתשתפו אם יש לכם טיפים לגבי מעבר ל-Kubernetes.",
    "צירפתי את התבנית שלנו, אפשר לערוך לפי הצורך.",
    "כל אחד בצוות מוזמן לערוך את דף ה-onboarding.",
    "ילדים שגדלים בעולם של היום לא מכירים חיים בלי מסכים.",
    "לפני שבוע הם קראו שוב את הדוח ומצאו טעות.",
    "אחד הדברים שלמדתי השנה: לבקש עזרה מוקדם.\nמינוף פיננסי הוא חלק בלתי נפרד מכל עסקת נדל\"ן.\nחשוב לציין שזה לא ייעוץ השקעות.",
  ])("%s", (text) => {
    expect(errorsOf(text)).toEqual([])
  })
})

describe("Hebrew: real bait and hype are caught", () => {
  test.each([
    ['תגיבו "מדריך" ואשלח לכם בפרטי.', "bait"],
    ['תגיבו ״כן״ ואשלח לכם את המדריך', "bait"],
    ['כתבו "רוצה" בתגובות ואשלח את הקובץ.', "tell"],
    ["הגיבו 'מעוניין' ואשלח בפרטי.", "bait"],
    ["שתפו שיגיע לכמה שיותר אנשים.", "tell"],
    ["תייגו את מי שחייב לראות את זה.", "tell"],
    ["אנחנו גאים להכריז על סבב גיוס.", "tell"],
    ["בהתרגשות רבה אני מודיעה שהצטרפתי ל-Wix.", "tell"],
  ])("%s", (text, rule) => {
    expect(errorsOf(text)).toContain(rule)
  })
  test("common Hebrew clichés warn", () => {
    for (const text of ["בסופו של יום, מה שחשוב זה האנשים.", "ספוילר: זה עבד.", "מחשבות?", "עקבו אחריי לעוד טיפים כאלה."]) {
      expect(has(text, "tell")).toBe(true)
    }
  })
})

describe("English: word boundaries and context", () => {
  test.each([
    "I left a comment yesterday on the RFC.",
    "Join my podcast this Thursday.",
    "We will share with 100 beta users first.",
    "I didn't write yesterday, and the streak is gone.",
    "We rewrote the UI in React with TypeScript, moved storage from Realm to SQLite, and our test harness now runs in CI.",
    "Terraform makes you type yes before every apply.",
    "It's like if you took a spreadsheet and gave it a brain.",
    "I'd build it like this if I were starting over.",
    "Happy to share if you want the slides.",
    'Her only review comment "why does this need a queue?" saved us a month.',
    "Here's the post-mortem from Tuesday's outage:\n\n- 14:02 deploy",
    "Here's a thread on how we cut CI time from 40 minutes to 9:",
    "הנה הצעה לכל מי שמגייס השנה מפתחים ראשונים:",
    "הנה גרסה 2.0 של האפליקציה, ומה השתנה בה:",
    '"Ship it." My first manager said that about everything. Years later I still call shipping "the only real test."',
    "Tags: v2.0 and v2.1 are both on npm now.",
    "Don't put network calls in __init__ methods.",
    "Python tip: def run(*args, **kwargs) forwards everything, so wrap(**opts, **extra) merges two dicts.",
  ])("%s", (text) => {
    expect(errorsOf(text)).toEqual([])
  })
  test.each([
    "Comment GUIDE and I'll send it over.",
    "Comment 'guide' below and I'll DM it to you.",
    "Reply YES and I'll DM you the link.",
    "Want the template? Comment PLAYBOOK below.",
    "Type 'AI' below for the free PDF.",
    "Drop a 🔥 in the comments and I'll send the checklist.",
    "Repost ♻️ to help someone in your network.",
  ])("bait: %s", (text) => {
    expect(errorsOf(text)).toContain("bait")
  })
  test("a real chatbot preamble is still caught", () => {
    expect(errorsOf("Here's a LinkedIn post about our launch:\n\nWe launched.")).toContain("chatbot-leak")
  })
})

describe("contrast structures", () => {
  test.each([
    "That's not a bug, it's a feature.",
    "It isn't about speed, it's about trust.",
    "Leadership isn't about titles. It's about trust.",
    "Success is not a destination, it's a journey.",
    "It's not a bug — it's a feature.",
  ])("%s", (text) => {
    expect(has(text, "contrast")).toBe(true)
  })
  test("two on one line count as two", () => {
    expect(errorsOf("It's not the code, it's the culture. It's not the tools, it's the habits.")).toContain("contrast")
  })
})

describe("Hebrew parentheses, slashes, and fragments", () => {
  test("emoticons, URLs, and an English line's gloss aren't Hebrew parentheses", () => {
    expect(has("תודה לכל מי שהגיע אתמול למיטאפ :)", "hebrew-parens")).toBe(false)
    expect(has("הכתבה בוויקיפדיה: https://en.wikipedia.org/wiki/Mercury_(planet)", "hebrew-parens")).toBe(false)
    expect(has("We celebrated Purim (פורים) at the office with the whole team.", "hebrew-parens")).toBe(false)
    expect(has("השקנו את המוצר (סוף סוף).", "hebrew-parens")).toBe(true)
  })
  test("כן/לא is not a gender slash; a URL fragment is not a hashtag", () => {
    expect(has("בסקר שאלנו שאלת כן/לא אחת בלבד, ו-70% ענו כן.", "gender-slash")).toBe(false)
    expect(has("תוכל/י לשלוח?", "gender-slash")).toBe(true)
    expect(has("Read the docs at https://docs.example.com/api#authentication before you upgrade.", "hashtag-portable")).toBe(false)
  })
  test("bidi-start covers tech-heavy lines in a Hebrew post", () => {
    expect(has("השקנו מצב offline.\n\nOffline mode עכשיו ב-iOS וב-Android.", "bidi-start", { platform: "linkedin" })).toBe(true)
  })
})

describe("formatting checks", () => {
  test("symbol bullets and RLM-prefixed emoji bullets", () => {
    expect(errorsOf("What we shipped:\n✔ Faster builds\n✔ Smaller bundles\n✔ Fewer flaky tests")).toContain("emoji-bullets")
    expect(errorsOf("מה השקנו החודש:\n‏✅ מצב offline\n‏✅ סנכרון מהיר\n‏✅ תמיכה ב-iPad")).toContain("emoji-bullets")
  })
  test("small capitals are fake styling", () => {
    expect(errorsOf("ᴡᴇ ᴀʀᴇ ʜɪʀɪɴɢ a backend engineer.")).toContain("fake-styling")
  })
})

describe("disclosure must open the first line", () => {
  test.each([
    "This is not an ad, I just really like this keyboard.",
    "זו לא פרסומת, פשוט אני אוהבת את המקלדת הזאת.",
    `${"I have been using this keyboard for a month and the travel is great. ".repeat(3)}Code ACME20 #ad`,
    "Our ads team loved it.",
  ])("%s", (text) => {
    expect(errorsOf(text, { sponsored: true })).toContain("disclosure")
  })
  test("labels and the employer form pass", () => {
    for (const text of ["Ad: I've used this keyboard for a month.", "#ad The keyboard I use.", "I work at Acme, so take this with salt.", "פרסומת: המקלדת שלי."]) {
      expect(errorsOf(text, { sponsored: true })).not.toContain("disclosure")
    }
  })
})

describe("--keep lets the user's own phrases through", () => {
  const post = "Hot take: my journey into Rust started with one bug.\n\nThoughts?"
  test("three kept warn phrases are no longer a density error", () => {
    expect(errorsOf(post)).toContain("tell-density")
    expect(errorsOf(post, { keep: ["hot take", "my journey", "thoughts?"] })).not.toContain("tell-density")
  })
  test("ban phrases can't be kept", () => {
    expect(errorsOf("Comment YES below.", { keep: ["comment yes"] })).toContain("tell")
  })
})

describe("thread splitting", () => {
  test("URLs with a query string come out unchanged", () => {
    const text = `${"We measured every step of the pipeline. ".repeat(6)}The old endpoint was https://example.com/search?q=offline+mode&page=2 and it was slow. Watch https://www.youtube.com/watch?v=dQw4w9WgXcQ for details.`
    const joined = splitThread(text, "x").join(" ")
    expect(joined).toContain("https://example.com/search?q=offline+mode&page=2")
    expect(joined).toContain("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
  })
  test("line breaks inside a paragraph survive", () => {
    const posts = splitThread("What changed:\n- cached installs\n- sharded tests\n- skipped docs builds", "x")
    expect(posts[0]).toContain("What changed:\n- cached installs\n- sharded tests")
  })
  test("empty input and limitless platforms are refused", () => {
    expect(main(["--platform", "x", "--split", "/dev/null"])).toBe(1)
    expect(main(["--platform", "whatsapp", "--split", "/dev/null"])).toBe(2)
  })
})

describe("folds", () => {
  test("a line that exactly fills the budget doesn't leak the next one", () => {
    expect(foldPreview(`${"a".repeat(280)}\nhidden`, 280, null)).toBe("a".repeat(280))
  })
  test("leading blank lines don't trigger hook-cut", () => {
    expect(has(`\n\n${"word ".repeat(20).trim()}\n\nmore`, "hook-cut", { platform: "linkedin" })).toBe(false)
  })
})

describe("check-facts arguments", () => {
  test("--today works after --check-facts and must be a real date", () => {
    expect(main(["--check-facts", "--today", "2026-10-12"])).toBe(0)
    expect(main(["--check-facts", "--today", "2027-06-01"])).toBe(1)
    expect(main(["--check-facts", "--today", "garbage"])).toBe(2)
    expect(main(["--check-facts", "--today", "2026-02-30"])).toBe(2)
  })
})
