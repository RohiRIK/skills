---
description: Draft a new post for one or more platforms from the user's intent, natively in English or Hebrew, with Review as the gate.
---

# Workflow: Compose

Input: what the user wants to post, and where. Output: one ready-to-paste draft per platform, with counts, plus anything to fill in.

## Step 1: Read the profile

Load the voice profile if it exists (`VoiceProfile.md` says where): name, Hebrew grammatical gender, default languages and registers per platform, emoji and hashtag habits.

## Step 2: Build the brief

| Field | Source, in order |
|---|---|
| Platform | the request → the profile's main platform → ask |
| Goal | the request; infer from the content: news → shares, how-to → saves, opinion → comments |
| Language | the request → the profile's default for that platform → the language of the request |
| The concrete detail | the request; if there is none, ask for one: what happened, a number, a name (`Craft.md` table) |
| Disclosure | ask once if the post promotes anything: paid, gifted, affiliate, employer (`Disclosure.md`) |
| Timing | only if the user is scheduling: run the pause check in `Hebrew.md` and ask about current events |

Ask at most two questions, and only for the platform, the purpose, or the concrete detail. Everything else gets a sensible default and a `[placeholder]`.

## Step 3: Pick the scenario and the hook

Find the scenario in `Templates.md` and read its file and the platform guide (`LinkedIn.md`, `ShortForm.md`, `Meta.md`, `Channels.md`). Pick a hook pattern for the goal from `Craft.md`. Take the moves; rewrite every line.

## Step 4: Draft

- Write directly in the target language: `Hebrew.md` or `English.md`.
- The first line works alone and fits the fold in `Platforms.md`.
- One idea, the concrete detail, a specific close, tags and links per the platform guide.
- Plain text. No markdown, no Unicode bold, no emoji bullets.
- One post per platform. For several platforms, write each natively; that is `Workflows/Repurpose.md`.
- More than the platform holds: switch to `Workflows/Thread.md`.

## Step 5: Review

Run `Workflows/Review.md` with the platform and language. Fix every error, and every warning that isn't the user's deliberate style.

## Step 6: Deliver

Per platform:

```text
[the post]
```

Under the fence, only the lines that apply:
- `x: 213/280 · fold ok`: the count from the lint, in the platform's unit.
- `Fill before posting:` every placeholder.
- `Add:` alt text for images, the link location, the paid-partnership toggle.
- `Assumptions:` one line, if any were made.
- First run with no profile: one line offering the Profile workflow.

Never publish, schedule, or call a posting tool.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SocialPost","workflow":"Compose","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
