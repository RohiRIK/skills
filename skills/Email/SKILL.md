---
name: Email
description: "Write, reply to, rewrite, and localize emails in English and Hebrew with native templates, tone rules, and an AI-tell lint. USE WHEN drafting, answering, polishing, or translating any email (מייל)."
category: workflow
effort: medium
domain: docs
---

# Email

Bilingual email kit: brief-first workflows, 23 scenario templates written natively in English and in Hebrew, register and culture rules, a lint gate for AI tells, calques, and markdown leaks, and an RTL-safe HTML renderer. Drafts only: no mailbox access, nothing is sent.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Compose** | "write an email to…", "draft a message asking…", "תכתוב מייל ל…" | `Workflows/Compose.md` |
| **Reply** | pasted email or thread + "reply", "answer this", "מה לענות" | `Workflows/Reply.md` |
| **Rewrite** | "fix / shorten / polish my draft", "make it warmer / firmer / more formal" | `Workflows/Rewrite.md` |
| **Localize** | "translate this email to Hebrew / English", "send it in both languages" | `Workflows/Localize.md` |
| **Review** | "check this email", "is it ok to send?"; last step of every workflow above | `Workflows/Review.md` |
| **Profile** | "learn my writing style", "set my signature", first run with no profile | `Workflows/Profile.md` |

## Context files (read when the topic is relevant)

| File | Carries |
|------|---------|
| `Anatomy.md` | Subject lines, point-first, the ask, length budgets, replies, plain text, fonts and HTML |
| `Tone.md` | Register ladder with greetings and sign-offs per language; Israel ↔ US/UK culture bridge |
| `English.md` / `Hebrew.md` | Language rules; Hebrew gender agreement, technical English, no parentheses, RTL, calendar |
| `Tells.md` | Banned AI-isms and calques in EN, HE, and Hebrew-English, with fixes; the lint reads it |
| `Templates.md` | Scenario index → `Templates*.md`: requests, meetings, outreach, hard news, updates, formal |
| `VoiceProfile.md` | Sender profile: name, signatures, Hebrew grammatical gender, registers, font |
| `Prompts.md` | Drop-in prompts: email-agent system prompt, brief capture, quick edits, judge |

## Gotchas

- Never invent facts. Names, dates, prices, links, and commitments come from the user or the thread; anything missing becomes a `[placeholder]`. Don't interrogate the user either: draft, then list assumptions and placeholders.
- Write Hebrew in Hebrew, not as a translation of an English draft. Keep technical English terms, product names, and UI labels in English letters. No parentheses in Hebrew text.
- Hebrew verbs and adjectives carry gender. Take the sender's from the profile; never guess anyone's from their name; use neutral forms (`Hebrew.md`) when unknown.
- Email is plain text: no `**bold**`, `#` headings, or tables. Deliver the draft in a `text` fence so line breaks survive; use `Tools/RenderEmail.ts` when the user wants rich text.
- NEVER send email or call a mail-sending tool from this skill. Sending is irreversible; hand over the draft.

## Examples

- "Email my landlord in Hebrew that the boiler broke again" → Compose → TemplatesHard complaint → formal-lite register → Review → draft + placeholders.
- Pasted English thread + "decline politely" → Reply → answers each point in order → TemplatesHard decline → Review.
- "Make this Hebrew update ready for our US client" → Localize → keeps tech terms, removes Heblish, adds softeners → Review.
