# Tells: AI-isms and calques

Phrases that mark an email as machine-written or translated. Each one is banned as a default. If the user's own draft uses one on purpose, Rewrite keeps it: the user's voice wins over this list.

`Tools/LintEmail.ts` reads every table on this page whose first header is `Phrase`. Each backtick span in that column is one case-insensitive phrase to match; English phrases match from the start of a word, Hebrew phrases match anywhere, since Hebrew prefixes attach to words. `Level` is `ban` (lint error) or `warn`. Adding a tell is just adding a row; keep pipes out of the cells.

## English: AI filler

| Phrase | Level | Write instead |
|---|---|---|
| `hope this email finds you` · `hope this message finds you` · `trust this email finds you` · `hope this finds you` | ban | Start with the point. |
| `I wanted to reach out` · `I am reaching out` · `I'm reaching out` · `just reaching out` | ban | "I'm writing about X", or simply the ask. |
| `don't hesitate to` · `do not hesitate to` | ban | "Questions? Just reply.", or nothing. |
| `apologize for any inconvenience` · `apologies for any inconvenience` | ban | Name the specific thing and own it. |
| `as per my last email` · `per my previous email` · `as previously stated` | ban | Restate the one thing you need, neutrally. |
| `Great question` · `Absolutely!` · `Certainly!` | ban | Answer directly. |
| `in today's fast-paced` · `in the ever-evolving` · `in today's digital` | ban | Delete the sentence. |
| `just checking in` · `just following up` · `just circling back` · `just wanted to` | warn | Follow up with something new: a date, a decision, an easier ask. |
| `let me know if you have any questions` · `feel free to reach out` | warn | Drop it, or name the question you expect. |
| `at your earliest convenience` · `as soon as possible` · `ASAP` | warn | A day and date. |
| `delve` · `leverage` · `synergy` · `seamless` · `game-changer` · `game changer` · `unlock` · `elevate` · `empower` · `streamline` · `cutting-edge` · `robust` | warn | The plain verb or noun: use, improve, connect, speed up, solid. |
| `I'm thrilled` · `I am thrilled` · `I'm excited to` · `I am excited to` | warn | State the news; specifics carry the enthusiasm. |
| `To whom it may concern` · `Dear Sir or Madam` · `Dear Sir/Madam` | warn | "Dear [team or role]," such as "Dear Claims Team,". |
| `I hope this helps` · `hope that helps` | warn | Fine once at the end of a real answer; never as filler. |
| `please find attached` · `attached please find` · `enclosed please find` | warn | "I've attached the …". |
| `kindly` | warn | "Please", or a question: "Could you…?" Keep it if the profile says it's the user's normal style. |

## English: Hebrew calques (Heblish)

| Phrase | Level | Write instead |
|---|---|---|
| `I will be happy if you` · `I'll be happy if you` · `I will be glad if you` | ban | "Could you …?" |
| `as we spoke` | ban | "As we discussed" |
| `in continuation to` · `in continuation of our` | ban | "Following up on our …" |
| `I am turning to you` · `I'm turning to you` | ban | "I'm writing about …" |
| `according to what we agreed` | ban | "As agreed" |
| `confirm receiving` | ban | "Confirm you've received it" |
| `I'll be glad for` · `I will be glad for` | ban | "I'd appreciate …" |
| `waiting for your answer` · `waiting for your response` · `waiting to your` | warn | "Could you let me know by [day]?" |
| `tell me if it's ok` · `tell me if it is ok` · `tell me if this is ok` | warn | "Let me know if that works." |
| `to close the subject` · `to close the issue` | warn | "To wrap this up" or "to finalize" |
| `we are in the stage of` · `we're in the stage of` | warn | "We're currently …" |

## Hebrew: calques and AI filler

| Phrase | Level | Write instead |
|---|---|---|
| `מוצא אותך בטוב` · `מוצא אותך טוב` · `מוצא אותך היטב` · `ימצא אותך בטוב` | ban | פותחים ישר בעניין. A literal calque of "I hope this email finds you well". |
| `רציתי להגיע אליך` · `רציתי להגיע אלייך` · `אני מגיע אליך בנוגע` | ban | "אני פונה בנוגע ל…" |
| `אל תהסס` | ban | "אם יש שאלות, אשמח לעזור." Gendered and filler. |
| `עושה שכל` | ban | "הגיוני" · "מסתדר לי" |
| `שיהיה לך יום נפלא` · `יום מקסים` | warn | "יום טוב," · "שבוע טוב," |
| `מעריך את זה` · `מעריכה את זה` | warn | "תודה רבה על …" with the specific thing. |
| `תחזור אלי` · `תחזרי אלי` | warn | "אשמח לתשובה עד [יום]." Also neutral for gender. |
| `בהקדם האפשרי` | warn | A day and date: "עד יום ג', 14.10". |
| `כותב לך כדי` · `כותבת לך כדי` · `כותב לך על מנת` | warn | Start with the purpose: "אני פונה בנוגע ל…" |
| `לקחת צעד אחורה` · `לקחת צעד לאחור` | warn | "לעצור רגע ולבחון" |
| `עושה הבדל` · `לעשות הבדל` | warn | "משנה" · "משפיע" |
| `נרגש לבשר` · `נרגשת לבשר` · `נרגשים לבשר` | warn | Just the news. |
| `מינוף` · `סינרגיה` · `בעולם המשתנה` · `בעידן של היום` · `חוויה חלקה` | warn | Plain words; delete scene-setting sentences. |

## Structural tells: judged in Review, not linted

- Every list has exactly three items; "not just X, but Y"; every paragraph ends with a summary line.
- The request restated back to the requester ("You asked about X. Regarding X, …").
- Bold mini-headers inside a short email.
- Balanced pros and cons when the user wanted a recommendation.
- A closing paragraph that repeats the opening.
- Apology, gratitude, and enthusiasm stacked in one short email.
- A technical term translated into invented Hebrew, or glossed in parentheses (`Hebrew.md`).
- More than one em dash, or more than two exclamation marks (the lint warns).
