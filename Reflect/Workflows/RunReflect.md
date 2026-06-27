# RunReflect Workflow

Score the just-finished output on five axes, each with evidence, then fix any small gap in place. This is a reflection step, not a pass/fail gate — it catches omissions and overconfidence before the user has to.

## Step 1: Score Five Axes (1-5, independently)

Score each axis on its own merits — don't pick an overall feeling and backfill the parts.

| Axis | Asks | A 5 looks like |
|------|------|----------------|
| **Accuracy** | Is every claim correct? | No false statements; assumptions flagged |
| **Completeness** | Did it cover everything asked? | All parts of the request handled, edge cases noted |
| **Clarity** | Is it easy to follow? | Clean structure, no ambiguity |
| **Actionability** | Can the reader act on it now? | Concrete next steps, paths, commands |
| **Conciseness** | Is anything wasted? | No filler, no repetition, signal-dense |

## Step 2: Evidence Rule

**Every score below 5 names the exact gap — show the gap, don't just name it.** "Completeness 3" is useless; "Completeness 3 — the timeout case in `fetch()` at retry.ts:40 is unhandled" is actionable. A score with no cited evidence is not a valid score.

## Step 3: Fix-Now Rule

- Any axis scored **≤ 3 that is fixable in under 30 seconds → fix it in place now**, then re-score that axis.
- Larger gaps → flag explicitly with the specific fix that would raise the score (don't silently leave it).

## Step 4: Output

**Standalone (default):**
```
## Reflect Scorecard
Accuracy:       5
Completeness:   4  — <gap + evidence>
Clarity:        5
Actionability:  4  — <gap + evidence>
Conciseness:    5

Overall: 4.6   (1-decimal average)
Top gap: <the single highest-leverage fix>
```

**Inside a Loop:** don't print the full card — write the overall score to `.agent-state.md` for the current iteration (the score steers the next pass and feeds the exit check at ≥ 4.5). See `_state/StateFileSchema.md`.

## Gotchas

- Don't average first and reverse-engineer the axes — score each independently, then average for the overall.
- The fix-now rule is what makes this worth running; a scorecard nobody acts on is theatre. If an axis is ≤3 and trivially fixable, fixing it is mandatory, not optional.
- Be honest about your own output — the bias is to over-score. If you can't cite evidence for a 5, it isn't a 5.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Reflect","workflow":"RunReflect","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
