# Platforms: dated facts

Every platform number the skill uses lives here, with a date, a status, and a source. Platforms change limits without notice, so nothing about a platform is quoted from memory. `Tools/Count.ts` and `Tools/LintPost.ts` parse the table below, and `LintPost.ts --check-facts` fails any row older than 180 days. To update a row, run `Workflows/Refresh.md`.

**Status**: `documented` = the platform's own docs or code · `observed` = measured or consistently reported by tools, not documented · `reported` = third-party reports only · `folklore` = never used as a rule.

**Unit**: how the platform counts. `x` = twitter-text weighting: NFC, most Latin, Hebrew, and Arabic characters cost 1, emoji and most symbols 2, every URL 23. `threads` = characters, with emoji counted as their UTF-8 bytes. `graphemes` = what a reader sees as one character. `mastodon` = graphemes, every URL 23, `@user@domain` counted as `@user`. `utf16` = JavaScript string length, the conservative choice where the platform doesn't say.

**Fold**: characters and lines shown before "see more", as `chars/lines`. Folds are estimates on every platform: screens differ, and blank lines count as lines.

**Tags**: the recommended maximum hashtags. **Links**: `ok`, or `none` when caption links aren't clickable.

| Platform | Unit | Limit | Fold | Tags | Links | Status | As of | Source |
|---|---|---|---|---|---|---|---|---|
| x | x | 280 | — | 1 | ok | documented | 2026-10-12 | twitter-text config v3.json, measured with twitter-text 3.1.0 |
| x-premium | x | 25000 | 280/- | 1 | ok | reported | 2026-10-12 | Publer and ContentStudio docs; X Help Center unreachable from the research network |
| threads | threads | 500 | — | 1 | ok | documented | 2026-10-12 | developers.facebook.com/docs/threads/posts: 500 characters, emoji counted as UTF-8 bytes; text attachment up to 10,000 since 2025-09-04 |
| bluesky | graphemes | 300 | — | 2 | ok | documented | 2026-10-12 | atproto lexicon app.bsky.feed.post: maxGraphemes 300, maxLength 3000 bytes |
| mastodon | mastodon | 500 | — | 4 | ok | documented | 2026-10-12 | Mastodon StatusLengthValidator default; each server can change it, pass --max |
| linkedin | utf16 | 3000 | 210/3 | 3 | ok | documented | 2026-10-12 | LinkedIn Help: 3,000-character posts; fold observed at about 210 desktop, 140 mobile |
| linkedin-comment | utf16 | 1250 | — | 0 | ok | observed | 2026-10-12 | composer behavior reported by Postiz and creator tools |
| facebook | utf16 | 63206 | 125/3 | 3 | ok | reported | 2026-10-12 | Postiz maxLength; fold about 125 characters on mobile |
| instagram | utf16 | 2200 | 125/2 | 5 | none | reported | 2026-10-12 | caption limit per Postiz and Instagram Help; 5-hashtag cap announced 2025-12-18 by @creators |
| instagram-reel | utf16 | 2200 | 55/1 | 5 | none | reported | 2026-10-12 | same caption limit; Reels show about 55 characters |
| tiktok | utf16 | 2200 | — | 5 | none | documented | 2026-10-12 | TikTok Content Posting API caption limit; in-app 4,000 is undocumented |
| youtube-title | utf16 | 100 | 60/1 | 0 | none | documented | 2026-10-12 | YouTube Help: titles up to 100 characters; about 60 show in results |
| youtube-desc | utf16 | 5000 | 150/3 | 3 | ok | documented | 2026-10-12 | YouTube Help: 5,000 characters; more than 60 hashtags and all are ignored |
| telegram | utf16 | 4096 | — | 3 | ok | documented | 2026-10-12 | Telegram limits: 4,096 per message |
| telegram-caption | utf16 | 1024 | — | 3 | ok | documented | 2026-10-12 | Telegram limits: 1,024 per media caption; Premium higher |
| whatsapp | utf16 | — | — | 0 | ok | reported | 2026-10-12 | WhatsApp Channels: no published text limit; native *bold* _italic_ ~strike~ |
| reddit-title | utf16 | 300 | — | 0 | ok | reported | 2026-10-12 | Reddit: 300-character titles; subreddits can set stricter rules |
| reddit-body | utf16 | 40000 | — | 0 | ok | reported | 2026-10-12 | Reddit: 40,000-character text posts |

## Hashtags, mentions, and direction per platform

Taken from the platforms' own parser code where it is open (twitter-text, atproto, Mastodon) and marked untested elsewhere. The portable rule works everywhere: a space or line start before `#` or `@`, then letters, digits, and `_` only, with at least one letter.

| Platform | Hebrew hashtags | Mentions | Text direction |
|---|---|---|---|
| X | `_` joins words. Real ״ ׳ ־ stay inside a tag; ASCII `"`, `'`, `-` cut it: `#צה"ל` becomes `#צה` | Latin handles only; `@` plus Hebrew is plain text. `ל-@dana` and even `ל@dana` still link | Undocumented; test on the device |
| Bluesky | A tag runs to the next space; trailing punctuation is dropped; at most 64 graphemes | Needs a space, line start, or `(` before `@`: `ל-@dana` does not link | One direction for the whole post, from its first strong letter |
| Mastodon | ״ ׳ ־ cut the tag; `_` joins words | `ל-@dana` links; `ל@dana` does not | Per paragraph, from its first strong letter |
| LinkedIn, Facebook, Instagram, Threads, Telegram, WhatsApp | Untested: use the portable form | Untested: use the portable form | Untested: start every Hebrew line with a Hebrew letter |

## Other platform rules worth knowing

- **X**: free accounts 280; Premium long posts fold around 280, and mentions after the first 280 characters reportedly don't notify. Bare domains and file names with a country ending cost 23: `README.md`, `main.py`, `site.ai`. A Hebrew prefix glued to a domain breaks the link: `ב-example.com` links `-example.com`.
- **Threads**: exactly one topic tag per post, 1 to 50 characters, no `.` or `&`. The API rejects more than 5 links.
- **Bluesky**: through the API every URL character counts; the app shortens pasted links. Set `langs: ["he"]` on Hebrew posts. No polls.
- **Instagram and TikTok**: caption links aren't clickable for normal accounts; say where the link is instead.
- **Facebook**: Meta tested limiting non-subscribed professional profiles and Pages to 2 link posts a month from 2025-12-16; links in comments were not limited. Current status unknown; check with the user before relying on links.
- **Polls**: X 2 to 4 options of 25 characters; Mastodon 2 to 4 of 50 graphemes, up to 7 days in the app; LinkedIn question 140, options 30, observed. Bluesky has none.
