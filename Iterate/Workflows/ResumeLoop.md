# ResumeLoop Workflow

Continue an interrupted loop from where it stopped, with all prior context intact. Same pass mechanics as `RunLoop` — this workflow only handles rehydration and the budget check.

## Step 1: Rehydrate from State

Read `.agent-state.md` at the repo root (schema: `_state/StateFileSchema.md`). Extract:
- `## Goal` — the original objective.
- `## Dead Ends` — approaches that are still off-limits.
- `## Iterations` — the last iteration number `N` and the most recent failure context.
- `## Result` — present only if the loop already exited.

If there is no `.agent-state.md`, there is nothing to resume — tell the user and suggest `RunLoop`.

## Step 2: Budget Check

Determine the original `--max`. If the loop already hit it (the last run exited on "max reached") or `## Result` is filled in, **confirm with the user before extending** — ask for a new `--max` rather than silently looping past the original bound.

## Step 3: Continue the Pass Iterate

Resume `RunLoop` Step 3 starting at iteration `N+1`:
- Feed the most recent failure context into the first PLAN so the resumed pass replans rather than repeating.
- Keep skipping everything in `## Dead Ends`.
- Honour the same exit conditions (`RunLoop` Step 4).

## Step 4: Finish

Update the `## Result` block and give the 2-3 sentence report, noting that this was a resumed run and how many additional passes it took.

## Gotchas

- Don't reset the iteration counter — continuity of the iteration log is what makes Dead Ends and failure context meaningful.
- A resume that ignores the prior failure context is just a blind retry with extra steps; always carry it into the first PLAN.
- If the goal in state no longer matches what the user now wants, start a fresh `RunLoop` instead of resuming a stale goal.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Iterate","workflow":"ResumeLoop","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
