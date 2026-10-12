# Anatomy of an email that gets answered

The reader is on a phone or in a preview pane, triaging dozens of messages. They decide from the subject and the first two lines whether to act, defer, or ignore. Every rule here serves that reader.

## The shape

1. **Subject**: what this is and what you need. Specific enough to find again in search.
2. **Greeting**: one line, matched to the register (`Tone.md`).
3. **Point first**: line 1 says why you are writing: the ask, the decision, or the news. Context comes after it, never before.
4. **Context**: only what the reader needs to act. One idea per paragraph, one to three sentences each.
5. **The ask**: one request with an owner and a day and date. Make yes easy: a yes/no question, two options, or a stated default ("If I don't hear back by Wednesday, I'll book Tuesday 10:00").
6. **Close**: one line at most, and only if it adds something. Filler closers are tells (`Tells.md`).
7. **Signature**: from the profile (`VoiceProfile.md`), otherwise `[Your name]`.

One email, one topic. A second unrelated topic gets its own email so each can be answered and searched separately.

## Subject lines

- At most 60 characters; phones show about 40. Put the key words first.
- Name the action or the object, plus a date when there is one.
- Keep `Re:` on replies. Change the subject only when the topic changes: `New topic (was: old topic)`.
- Generic subjects ("Hello", "Quick question", "Following up", "Update", "שאלה", "עדכון") get skipped and can't be searched; ALL CAPS and "URGENT!!" read as spam.

| Purpose | English pattern | Hebrew pattern |
|---|---|---|
| Request | `Request: [thing] by [day date]` | `בקשה: [נושא] עד [יום ותאריך]` |
| Decision | `Decision needed: [A or B] by [day]` | `נדרשת החלטה: [א' או ב'] עד [יום]` |
| FYI | `FYI: [what changes] from [date]` | `לידיעתכם: [מה משתנה] החל מ-[תאריך]` |
| Meeting | `Meeting: [topic], [length], week of [date]` | `פגישה: [נושא], [משך], בשבוע של [תאריך]` |
| Recap | `Recap + next steps: [meeting], [date]` | `סיכום ומשימות: [פגישה], [תאריך]` |
| Intro | `Intro: [Name] <> [Name]` | `היכרות: [שם] <> [שם]` |
| Complaint | `Complaint: order [#], [problem]` | `תלונה: הזמנה [מס'], [הבעיה]` |

## Length budgets

Body words, without greeting and signature. Hebrew runs about 20% fewer words than English for the same content, because prepositions, articles, and conjunctions attach to words as prefixes. `Tools/LintEmail.ts --type <type>` checks these numbers.

| `--type` | Covers | English | Hebrew |
|---|---|---|---|
| `followup` | nudges, reminders, out-of-office | 60 | 50 |
| `meeting` | meeting requests, reschedules | 100 | 85 |
| `request` | asks, introductions | 120 | 100 |
| `reply` | answers, confirmations, thank-yous | 120 | 100 |
| `cold` | first contact, job applications | 125 | 110 |
| `hard` | decline, apology, bad news, complaint, pushback, resignation | 150 | 130 |
| `update` | status updates, handovers | 200 | 170 |
| `recap` | meeting recaps | 200 | 170 |
| `announcement` | team or customer announcements | 300 | 250 |
| `formal` | letters to authorities and institutions | 300 | 250 |

Over budget? Cut context first, then hedges, then pleasantries. Never cut the ask or the date.

## Replies

- Answer in the order they asked. With three or more questions, answer inline: quote each question in one line, answer under it.
- Lead with what they most need: the yes or no, the date, the number.
- Don't restate their email back to them.
- If you can't answer something yet, say when you will.
- Reply in their language, and in their register or one notch more formal; never less formal than they were.
- Reply-all only when everyone on the thread needs your answer.

## Recipients

- To: people who must act. CC: people who need to know. BCC: large external lists, to protect addresses.
- With several people in To, name each one next to their action: "Dana: the contract by Thursday. Yossi: the invoice."

## Facts and placeholders

- Every name, number, date, link, price, and promise traces to the user's input or the thread.
- Unknown facts become placeholders in square brackets, in the email's language: `[date]`, `[תאריך]`. List every placeholder under the draft.
- Don't commit the sender to anything they didn't say: deadlines, discounts, attendance, consequences. Use a placeholder such as `[confirm: can you attend Tue?]` or ask.
- Mentioned an attachment? Remind the user to attach it; the draft can't.

## Dates, times, money

- Dates without ambiguity: "Thu 16 Oct" in English, "יום ה', 16.10" in Hebrew. A bare 10/12 means different days in the US and everywhere else.
- Times across borders carry a zone or both local times: "15:00 Israel time, 08:00 New York".
- Money with a currency: "$1,200", "€900", "4,500 ₪" or "4,500 ש"ח".

## Plain text by default

Email clients don't render Markdown. `**bold**` arrives as asterisks, `#` as a hash, a table as broken pipes.

- Paragraphs separated by one blank line.
- Lists with `-` or `1.` at line start, at most about five items, only for parallel items: steps, options, action items.
- A URL goes on its own line with no punctuation after it, so auto-linkers don't swallow a period.
- No emoji in professional email unless the profile or the thread uses them.
- Deliver the draft in a `text` fence in chat, so line breaks and characters survive copy-paste:

```text
Subject: [subject]

[body]
```

## Rich text, fonts, and HTML

Plain text is the default because it renders the same everywhere. Use rich text when the user asks for formatting, an HTML version, or a bilingual email that must lay out cleanly, since an HTML email can set direction per paragraph.

- **Font**: one font for both scripts, so Hebrew and English share size and weight. Default stack `Arial, 'Segoe UI', Tahoma, sans-serif`: Arial ships with every client and has good Hebrew glyphs. Use David only when the user asks for the classic Israeli formal-letter look. Web fonts such as Heebo, Rubik, or Assistant don't load in Outlook desktop or Gmail and fall back unpredictably.
- **Size**: 14px body, line height 1.5. No colored or decorative fonts.
- **Direction**: every Hebrew paragraph gets `dir="rtl"`, every English paragraph `dir="ltr"`. That one attribute fixes most mixed-text layout bugs.
- **How**: `bun Tools/RenderEmail.ts draft.txt > email.html` turns a plain-text draft into that HTML. The user opens it in a browser, copies all, and pastes into Gmail or Outlook; formatting and direction survive the paste. `--font` overrides the stack, and so does `font` in the profile.
- In a plain-text client, the user sets direction: Gmail's "Right-to-left" button, Outlook's right-to-left paragraph option.
