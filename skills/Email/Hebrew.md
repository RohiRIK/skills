# Hebrew: writing rules

Read with `Anatomy.md` and `Tone.md` for any Hebrew email. Draft directly in Hebrew. A word-by-word translation of an English draft produces calques (`Tells.md`) that a native reader notices in the first line.

## Register: modern Israeli business Hebrew

- Short, direct, warm, informal: first names, "שלום" or "היי", "תודה". Formal Hebrew with "לכבוד", "הנדון", and "בכבוד רב" is for authorities, legal matters, and official complaints.
- Everyday words over high register in ordinary mail: "עכשיו" over "כעת", "צריך" over "יש צורך", "אפשר" over "ניתן", "לשלוח" over "להעביר לידיכם". The formal words are right in formal letters.

## Technical English stays in English

Israeli professionals write technical terms in English inside Hebrew sentences. Translate the sentence, not the terms.

- **Keep in English letters, exactly as the source writes them**: product and company names (Jira, Salesforce, Google Drive), UI labels and buttons (Enable, Save, Settings), code, commands, file names, error messages, environment names (staging, production), acronyms (API, CRM, SLA, KPI, PR), and technical terms the team says in English (deploy, release, feature flag, pull request, dashboard).
- **Don't invent Hebrew equivalents**: "ממשק תכנות יישומים" for API, "בקשת משיכה" for pull request, "לאפשר" when the button says Enable. The reader looks for the English word on screen.
- **Don't gloss**: no "להפעיל (Enable)", no "ה-API (ממשק)". Use the English term alone.
- **Prefixes take a hyphen** before a Latin word or a number: "ה-API", "ב-Jira", "ל-staging", "ב-15:00".
- Loanwords already written in Hebrew letters in everyday speech, such as באג, פיצ'ר, דדליין, פידבק, ספרינט, work either way. Follow the profile or the thread, and stay consistent within one email.
- Example: "צריך לעשות Enable ל-feature flag בסביבת staging לפני ה-release ביום ה'."

## No parentheses

House rule: Hebrew emails use no parentheses. A parenthetical aside is usually a sentence that wants to stand alone, and it reads translated in Hebrew. Modern renderers draw parentheses correctly in a right-to-left line, but they land on the wrong side when a line flips to left-to-right, for example in a left-to-right compose window or a line that opens with an English word. The lint rejects any parenthesis in a Hebrew line.

| Instead of | Write |
|---|---|
| הדוח (גרסה 2) מצורף. | מצורפת גרסה 2 של הדוח. |
| ניפגש ביום ג' (14.10) בזום. | ניפגש ביום ג', 14.10, בזום. |
| לחצו על הכפתור (Enable). | לחצו על Enable. |
| המחיר (כולל מע"מ) הוא 4,500 ₪. | המחיר הוא 4,500 ₪ כולל מע"מ. |

Use a comma, a colon, a second sentence, or a new line.

## Gender agreement

Hebrew marks gender on present-tense verbs, second-person future and imperative verbs, and adjectives. Getting it wrong, or defaulting everything to masculine, is the most visible failure. Two people matter.

**The sender, in first person.** Present tense and adjectives agree with the sender: "אני שמח" or "אני שמחה", "אני זמין" or "אני זמינה", "אני מצטער" or "אני מצטערת".
- Source: `he_gender` in the profile, or the user's own Hebrew in the request ("אני צריכה" is feminine). Never infer it from a name.
- Unknown or `neutral`: use first-person forms that carry no gender. Past tense ("שלחתי", "בדקתי"), future tense ("אשלח", "אעדכן", "אצטרך"), and above all "אשמח": "אשמח לעזור" instead of "אני שמח לעזור".

**The recipient, in second person.** "תוכל" or "תוכלי", "שלח" or "שלחי", "אתה" or "את", "מוזמן" or "מוזמנת".
- Source: the user says so, or the recipient's own Hebrew in the thread shows it ("אני זמינה מחר" is feminine). Never infer it from a name.
- Unknown: use neutral constructions, in this order of preference:
  1. A first-person request: "אשמח לקבל את הקובץ עד יום ה'" instead of "תשלח לי את הקובץ".
  2. A question about possibility: "האם יש אפשרות להקדים ל-10:00?" or "אפשר לקבל…?"
  3. Plural address, natural for a company, team, or service: "אשמח אם תוכלו לבדוק".
  4. Words spelled the same for both genders without niqqud: "לך", "אותך", "שלך", "ממך", "לטיפולך", "לידיעתך", and past-tense second person such as "שלחת" and "חשבת".
  5. Verbs whose present tense is spelled the same for both genders: "פונה", "רואה", "קונה".
- Slash forms ("תוכל/י", "את/ה") are acceptable only in internal mail to a whole group. The lint warns on them.

Groups: masculine plural ("תוכלו", "מוזמנים") is the grammatical default for mixed groups. Use feminine plural ("מוזמנות") only when the user says the group is all women.

## Phrases that sound native

| Purpose | Natural Hebrew |
|---|---|
| Continue a conversation | "בהמשך לשיחתנו," |
| State the purpose | "אני פונה בנוגע ל…" |
| Update | "רציתי לעדכן ש…" |
| Ask | "אשמח לקבל את … עד …" · "אפשר לקבל …?" · "האם יש אפשרות ל…?" |
| Attach | "מצורף הקובץ." · "צירפתי את …" · formal: "מצ"ב" |
| Action needed | "לטיפולך" · "לטיפולכם" |
| FYI | "לידיעתך" · "לידיעתכם" |
| As agreed | "כפי שסיכמנו" |
| Thanks | "תודה רבה על …" with the specific thing · "תודה מראש", natural in Hebrew, once |
| Offer help | "אם יש שאלות, אשמח לעזור." |
| Close | "בברכה," · "תודה," |

## Punctuation and typography

- Acronyms take gershayim: מצ"ב, עו"ד, בע"מ, ש"ח, מע"מ. The keyboard `"` is standard; `״` is also fine. Be consistent.
- Abbreviations take a geresh: "יום ג'", "גב'", "מס'", "וכו'".
- Dates as DD.MM or DD.MM.YYYY: "16.10.2026". Days as "יום א'" through "יום ו'", and "שבת".
- Times in 24-hour format: "14:30".
- Money: "4,500 ₪" or "4,500 ש"ח".
- Asides: a comma or a second sentence. A spaced en dash " – " is the Hebrew convention when you need one; at most once.
- No niqqud, except to disambiguate a name.

## Direction: RTL and mixed text

- Hebrew is stored in reading order and laid out by the display. If Hebrew looks reversed in a terminal, the terminal lacks bidi support; the text is fine. Never reverse characters to "fix" it. Check it in a browser or a mail client.
- Start every Hebrew line with a Hebrew word. Clients that detect direction per paragraph lay out a line that opens with an English word left to right, scrambling it. Write "צריך לעשות Enable ל…", not "Enable צריך לעשות ל…". The lint warns on this.
- URLs, email addresses, international phone numbers, and code go on their own line.
- Plain-text clients need the compose window set to right-to-left. For a reliable layout, especially bilingual mail, render HTML with `Tools/RenderEmail.ts`, which sets `dir` per paragraph (`Anatomy.md`).

## The Israeli calendar and business rhythm

- The work week is Sunday to Thursday. Friday is a half day or off, Saturday is off. Don't propose Friday-afternoon or Saturday meetings. "By end of week" means Thursday.
- For readers abroad, spell the day out ("Thursday 16 Oct"): their Sunday is not a workday, and Israel's Friday often isn't.
- Holidays follow the Hebrew calendar: Rosh Hashanah, Yom Kippur, and Sukkot fall in September and October, Passover in March or April. "אחרי החגים" is a real deferral. When scheduling in those months, confirm dates with the user instead of assuming.
- Formal letters to authorities follow a fixed shape: see `TemplatesFormal.md`.
