---
description: Improve the user's own email draft to a stated goal while keeping their voice, facts, and intent.
---

# Workflow: Rewrite

Input: the user's draft and what they want changed. Output: the rewritten draft and a short list of what changed.

The draft is the user's voice. Change what the goal requires and leave the rest. A phrase from `Tells.md` that the user clearly chose stays, unless the goal is to remove tells.

## Step 1: Map the request to an edit depth

| The user says | Do |
|---|---|
| "fix", "proofread", "check grammar", "תתקן" | Minimal: grammar, spelling, Hebrew gender agreement, tells. Keep wording and structure. |
| "polish", "improve", "make it better" | Moderate: point first, a clearer ask with a date, tighter sentences. Keep voice and facts. |
| "shorter", "too long" | Cut to the length budget (`Anatomy.md`): context, then hedges, then pleasantries. Never the ask. |
| "warmer", "friendlier", "softer" | One notch: one specific human line, imperatives into questions, a friendlier greeting and sign-off. |
| "firmer", "more direct", "stronger" | The ask in line 1, no hedges or apologies, a date. A consequence only if the user stated it. |
| "more formal", "less formal" | One step on the `Tone.md` ladder: greeting, sign-off, contractions, word choice, all consistent. |
| "sound native", "for a US client" | Heblish pass with the `English.md` calque table, plus softeners from the `Tone.md` culture bridge. |
| "make it sound Israeli", "less American" | Cut the warm-up, the ask in line 1, first names, shorter. |
| nothing specific | Moderate. |

## Step 2: Rewrite

- Keep every fact, name, number, and commitment. Something looks wrong, such as a date that doesn't match the weekday: flag it, don't silently change it.
- Keep the language. Changing language is `Workflows/Localize.md`.
- Hebrew: apply the technical-English, no-parentheses, and gender rules from `Hebrew.md` whatever the edit depth; these are house rules, not style.

## Step 3: Review

Run `Workflows/Review.md` on the result.

## Step 4: Deliver

The rewritten draft in a `text` fence, then `Changes:` with two to four bullets, the most important first. The draft was already good: say so and change only what the goal needed.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Email","workflow":"Rewrite","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
