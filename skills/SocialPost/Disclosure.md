# Disclosure: ads, giveaways, AI

Checked 2026-10-12. Laws change and this is not legal advice; anything with money, prizes, or regulated products goes to a lawyer. Rows marked **verify** were not confirmed against a primary source.

## When a post needs an ad label

Ask once, in Compose and Review: **is there a material connection?** Payment, a free product, a discount code or affiliate link that earns money, an employer, or a close personal tie to the brand. If yes:
1. Put the label at the **start of the first line**, in the post's language, visible without clicking "see more".
2. Also turn on the platform's paid-partnership or branded-content toggle. The toggle alone may not be enough.
3. Hashtags buried at the end, or a label only in the bio, don't count.

| Audience | Label | Source |
|---|---|---|
| US (FTC) | `Ad:` · `#ad` · `Sponsored` · `Paid partnership with [brand]`; for an employer: `I work at [company]` | FTC Endorsement Guides, revised 2023-06-29 |
| Israel | `פרסומת:` · `תוכן ממומן:` · `בשיתוף פעולה בתשלום עם [מותג]`, never in parentheses | Consumer Protection Law §7; the Consumer Protection Authority requires a clear marking that needs no click or scroll. Exact wording: **verify** |
| France | `Publicité` or `Collaboration commerciale`; `Image retouchée` or `Image virtuelle` on edited or AI images of people | Loi 2023-451 |
| EU generally | A clear ad label plus the platform's commercial-content toggle | Unfair Commercial Practices Directive; DSA Art. 26(2) |

`LintPost.ts --sponsored` fails a post whose first line has no label.

## Testimonials and claims

- Never write a testimonial, review, quote, or result the user didn't supply. The FTC rule on consumer reviews and testimonials, in force since 2024-10-21, bans fake and AI-generated testimonials, and Israel's Consumer Protection Authority treats paid or fake reviews as advertising.
- Income and results claims ("I made $10k in a month") only with the user's real figure.

## Giveaways and contests

- Meta requires official rules, eligibility, and a statement that the promotion isn't sponsored by or associated with Facebook or Instagram. Entry can't require sharing on a personal timeline or tagging friends on a personal timeline.
- In Israel, lotteries are restricted by the Penal Code. Israeli giveaways usually pick winners by a judged answer rather than a random draw and publish a תקנון. **verify** with a lawyer for anything of value.
- Put `[link to rules]` as a placeholder in every giveaway draft.

## Messages and broadcasts in Israel

The anti-spam law ("חוק הספאם", Communications Law §30A) requires prior consent for advertising messages, and courts have applied it to WhatsApp and SMS. A channel people chose to follow is fine. Adding people to a commercial group or sending them promotional messages without consent is not.

## AI labels

- **Text**: no platform requires an AI label on text the user reviews and posts as their own, and labels measurably lower trust even on true content. Don't add one by default; never deny AI use if asked; offer an optional line if the user wants one.
- **Images, video, audio**: realistic AI media needs the platform's AI label: Meta's "AI info", TikTok's AI-generated toggle, YouTube's altered or synthetic disclosure, LinkedIn's Content Credentials. Tell the user to set it.
- **EU AI Act Art. 50**: AI-generated text published to inform the public on matters of public interest needs disclosure unless a person reviews it and holds editorial responsibility, which covers a user posting a reviewed draft. Bots and unreviewed auto-posting are not covered. Application dates were under revision in 2025 to 2026: **verify** before quoting a date.
