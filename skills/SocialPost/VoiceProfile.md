# Voice profile

What makes a draft sound like this person rather than like the feed. Every workflow reads the profile when it exists; `Workflows/Profile.md` creates and updates it from the user's own posts.

It holds personal data, so it lives outside this public skill folder:
- Default path: `~/.claude/state/social-profile.md`. A path the user names, or the host's memory, also works.
- It inherits `name` and `he_gender` from the Email skill's profile at `~/.claude/state/email-profile.md` when that exists, so the user sets them once.
- Never write a filled profile into the skill folder or commit it.

## Fields

```yaml
name: ""                    # as the user signs posts
he_gender: ""               # m | f | neutral: Hebrew first-person agreement (אני שמח / אני שמחה)
handles:                    # only the user's own handles
  x: ""
  linkedin: ""
languages:                  # set only by the owner: en (default) | he | both
  linkedin: en
  facebook: en
  x: en
register:                   # per platform: formal | professional | friendly | casual
  linkedin: professional
  facebook: friendly
  x: casual
length: medium              # short | medium | long
emoji: sparing              # none | sparing | ok
hashtags: few               # none | few | platform-max
em_dash: avoid              # avoid | ok; ok passes --allow em-dash to the lint
tech_terms_in_hebrew: latin # latin = English letters (default) | mixed = everyday loanwords like באג in Hebrew letters
openers_to_keep: []         # the user's own habits worth keeping
closers_to_keep: []
avoid_phrases: []           # banned for this user, beyond Tells.md
topics: []                  # what the user posts about, to keep drafts on-voice
samples: []                 # file paths to the user's own posts; never their text
notes: ""                   # e.g. "never post on Shabbat", "company page uses אנחנו"
```

## When the profile is missing

Check approved owner context first and ask only what `Clarification.md` calls essential. Write in English, use the default registers in the platform guides, sparing emoji, and a few hashtags; if Hebrew is requested, use gender-free first-person forms. Offer the Profile workflow only when persistent saving is useful and approved.

## Using the profile in the lint

Profile choices map to lint flags, so the gate respects the user's voice: `em_dash: ok` → `--allow em-dash`; `emoji: ok` → `--allow emoji-count`; `openers_to_keep` and `closers_to_keep` → `--keep`, for warn-level phrases only. Ban-level rules (bait, leaks, fake formatting, Hebrew parentheses) can't be allowed away.
