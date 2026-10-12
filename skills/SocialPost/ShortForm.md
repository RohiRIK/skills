# Short-form: X, Threads, Bluesky, Mastodon

Limits and counting units: `Platforms.md`. Checked 2026-10-12.

## Counting is different on each

`Tools/LintPost.ts --platform <name>` counts with the platform's own unit. The differences that bite:
- **X**: Hebrew, Latin, and Arabic letters cost 1, but emoji, CJK, and many symbols cost 2: `…` `•` `→` `✅` `₪` and the invisible RLM and LRM marks. Every URL costs 23, including bare domains and file names like `README.md`. Niqqud marks cost 1 each, so a voweled `שָׁלוֹם` costs 7 where `שלום` costs 4.
- **Threads**: 500 characters, but each emoji counts as its UTF-8 bytes, 4 or more.
- **Bluesky**: 300 graphemes. Through the API a URL counts in full.
- **Mastodon**: 500 graphemes on most servers; URLs cost 23, and `@user@domain` counts as `@user`.

## Tone per platform

| Platform | Register | What reads as spam |
|---|---|---|
| X | Claim first, one idea per post, dry wit allowed. Hebrew X is fast, sarcastic, and press-driven. | Hashtag strings, "A thread 🧵👇", identical replies, link-only posts |
| Threads | Conversational, first person; a question only when it's genuine | Brand voice, reposted X copy with X conventions |
| Bluesky | Plain and human; people reply to people | Marketing voice, cross-posted copy, hashtag walls |
| Mastodon | Plain and community-minded; content warnings for sensitive topics; alt text always | Promo cadence, link shorteners, untagged images |

## X

- **What the ranking weighs** (open-sourced code, checked 2026-10): replies and quote posts weigh 10 times a like; sharing by copied link weighs most; follows count; mutes, "not interested", and reports weigh heavily against. Write posts people want to answer or forward, not posts that ask to be liked. These weights are directional; the code changes.
- **Hashtags**: 0 by default, 1 for an event or community. The ranking code has no hashtag boost.
- **Links**: X executives said in 2025 that links are no longer deboosted, while 2024 to 2025 data showed near-zero median engagement on link posts from free accounts. Make the post stand alone; the link is extra.
- **Quote or reply**: replies from accounts a reader doesn't follow are mostly filtered out of their feed. To make a take visible beyond your followers, quote-post it.
- **Premium long posts**: the first 280 characters must stand alone and carry every @mention.
- **Spam rules**: identical reply text across posts is labeled copy-paste spam; links through shortener or redirect chains can be labeled spam.

## Threads (the form, any platform)

- Post 1 is a complete post: the hook and the payoff in brief. Many readers see only post 1.
- One idea per post; each post makes sense alone.
- Numbering `1/7` at the end of each post is optional. In Hebrew, no parentheses: `1/7`, never `(1/7)`. Don't open with "Thread:" or "🧵👇".
- The last post: a recap, the link if any, and a specific close.
- Long Hebrew and English versions: post the primary language as the thread, not one language per post alternating.
- `Workflows/Thread.md` splits with each platform's own counter.

## Threads (the Meta app)

- Exactly one topic tag per post, 1 to 50 characters, no `.` or `&`.
- A text attachment up to 10,000 characters can carry the long version; the post itself stays within 500.
- Meta said in 2025 that links aren't intentionally downranked on Threads.

## Bluesky and Mastodon

- Alt text on every image, short and literal. Bluesky allows 2,000 characters, Mastodon up to 10,000 on version 4.6 and later.
- Language tags: set Hebrew posts to `he` (Bluesky `langs`, Mastodon post language), so language filters and Hebrew feeds pick them up.
- Mastodon hashtags are the main way to be found: 1 to 4 relevant tags, CamelCase for English (`#OpenSource`), `_` between Hebrew words.
- Bluesky: 0 to 2 tags. Direction is set once for the whole post, from its first letter, so a Hebrew post must open with a Hebrew word.
