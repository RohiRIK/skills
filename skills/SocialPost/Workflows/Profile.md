---
description: Build or update the user's social voice profile from their own posts, stored outside the repo.
---

# Workflow: Profile

Input: 3 to 10 of the user's own posts per language, or answers to a few questions. Output: a saved profile (`VoiceProfile.md` has the fields and the path).

## Step 1: Start from what exists

Read `~/.claude/state/social-profile.md` if it exists, and the Email skill's profile for `name` and `he_gender`. Show current values; update rather than start over.

## Step 2: Choose a route

- **Samples** (better): the user pastes 3 to 10 posts they wrote, per language and platform. Their own posts only; never a famous creator's posts to imitate.
- **Questions**: platforms and languages, Hebrew grammatical gender for first person (masculine, feminine, or keep it gender-free), emoji habit, hashtag habit, length.

## Step 3: Extract from samples

| Field | What to look for |
|---|---|
| `he_gender` | First-person present tense and adjectives in their Hebrew: "אני שמח" or "אני שמחה". No evidence: ask. |
| `register`, `languages` | Per platform: greeting style, formality, which language they use where |
| `length` | Median post length per platform |
| `emoji`, `hashtags`, `em_dash` | How often, and where |
| `openers_to_keep`, `closers_to_keep` | Recurring natural habits; keep them even if `Tells.md` warns on them |
| `tech_terms_in_hebrew` | Technical words in English letters or Hebrew letters |
| `topics` | What they post about |

Extract style only. Posts contain other people's names and details; never copy those into the profile. Store sample file paths, not their text.

## Step 4: Confirm and save

Show the profile, let the user correct it, and save it to `~/.claude/state/social-profile.md` or the path they name. Never inside the skill folder or the repo.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SocialPost","workflow":"Profile","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
