# Craft: what makes a post worth reading

Feeds are full of generic, machine-smooth posts, and readers now skip that voice on sight. LinkedIn started cutting the reach of generic "AI slop" in May 2026. Specific beats polished: a name, a number, a date, a thing that happened. Every rule here serves that.

## The shape

1. **Hook**: the first line, which must make sense alone, because on LinkedIn, Facebook, and Instagram it is all most people see (`Platforms.md` folds). State the news, the claim, or the story beat. No warm-up.
2. **One idea**: one post, one point. A second point is a second post or a thread.
3. **The concrete detail**: at least one specific fact from the user: what happened, a number, a name, a before and after. This is the line that makes the post theirs. No detail available? Ask for one, or use a `[placeholder]`. Never invent one.
4. **Body**: short paragraphs of one to three sentences. Mix lengths. A list only when the content is a list, with its real count.
5. **Close**: end on the most specific line, or one narrow question that needs a real answer. Never a reaction request (`Tells.md`).
6. **Tags and links**: per `Platforms.md` and the platform guide.

## The concrete-detail rule

Before drafting, find the detail. Ask the user when the request has none:

| Post type | The detail to get |
|---|---|
| Launch, announcement | What changed for users, one number or one before and after |
| Lesson, opinion | The specific situation it came from, with what happened |
| Job change, milestone | What you'll actually do; who to thank and for what |
| Hiring | The actual work, the team, one real reason to join |
| Event recap | One thing said or learned there, with who said it |
| Offer, promotion | The price or terms, the deadline, who it's for |

## Hooks by goal

Pick the goal first; it decides the hook. Each pattern names the user fact it needs, so nothing gets made up. These are patterns, not lines to paste.

| Goal | Pattern | English | Hebrew |
|---|---|---|---|
| Comments | A specific claim others can test against their own experience | "We cut our standup from 15 minutes to 5 by dropping status updates. Here's what replaced them." | "קיצרנו את ה-standup מ-15 דקות ל-5, כשהפסקנו לעדכן סטטוס. זה מה שבא במקומו." |
| Saves | A useful, specific how-to with a real count | "The 4 checks I run before every database migration, after one took production down." | "4 בדיקות שאני עושה לפני כל migration, מאז שמיגרציה אחת הפילה לנו את ה-production." |
| Shares | A number or result worth forwarding | "Our onboarding emails went from 3 to 1. Activation went up 22%." | "צמצמנו את מיילי ה-onboarding משלושה לאחד, וה-activation עלתה ב-22%." |
| Follows | A point of view with evidence, from the user's own work | "Most code review delays aren't about reviewers. In our team, 70% were PRs over 400 lines." | "רוב העיכובים ב-code review לא נובעים מה-reviewers. אצלנו, 70% מהם היו PRs של יותר מ-400 שורות." |
| Story | The moment, then the stakes | "At 2 a.m. on launch night, the payment provider went down." | "בשתיים בלילה, בליל ההשקה, ספק התשלומים נפל." |

A question as the first line measures worst on LinkedIn in creator-tool data (AuthoredUp, 2025 to 2026, vendor data). Use one only when the question itself is the content.

The Hebrew hooks only use first-person forms spelled the same for both genders: past tense, and present-tense verbs like "עושה". Most present-tense verbs and adjectives differ by gender ("שמח" or "שמחה"), so adapt from the profile (`Hebrew.md`).

## Closers

| Instead of | Write |
|---|---|
| "Thoughts?" · "Agree?" · "מסכימים?" | A narrow question: "If you've moved off Jenkins, what broke first?" · "מי שעבר מ-Jenkins, מה נשבר ראשון?" |
| "Follow for more" · "♻️ Repost to help" | Nothing. End on the strongest line. |
| "Comment GUIDE and I'll send it" | The link, per the platform's link rule. |
| "Let that sink in." · "Read that again." | Delete it; the line before is the ending. |

## Length

Length follows the content. Ranges come from creator-tool data and are directional:
- LinkedIn insight, lesson, or opinion posts: about 1,300 to 2,500 characters perform well. Announcements and job changes: 300 to 800.
- X: one idea in 280. More than one idea: a thread (`Workflows/Thread.md`).
- Facebook and Instagram: the hook inside the fold, then as long as the story needs.
- Hebrew often runs shorter than English; in one measured sample a sentence was about 30% shorter. Count the actual draft with `Tools/LintPost.ts`.

Never pad to reach a length. Never cut the concrete detail to fit.

## Formatting that survives every platform

- Plain text and line breaks. Markdown shows up as raw asterisks and hashes.
- No Unicode "bold" letters such as 𝗯𝗼𝗹𝗱: screen readers skip or spell them, search can't find them, and Hebrew has no such letters anyway.
- Lists with `-` or `1.`, never emoji bullets. At most two or three emoji in a post, each carrying meaning, unless the profile says otherwise.
- One blank line between paragraphs. On Instagram, a space before a line break reportedly deletes the break; check the preview.
- Deliver the draft in a `text` fence so line breaks survive copy and paste.
