# ResumeLoop Workflow

Run the next pass of an in-flight loop from where it stopped, with all prior context intact. This is
what a `ScheduleWakeup` re-invocation (or a manual `--resume`) lands in. Same pass mechanics as
`RunLoop` — this workflow handles rehydration, the budget check, and the reschedule-or-stop decision.

One wake = one pass. It does not run to completion in a single turn.

## Step 1: Rehydrate from State

Read `.agent-state.md` at the repo root (schema: `_state/StateFileSchema.md`). Extract:
- `## Goal` — the original objective.
- `## Config` — target, max, threshold, delay, until_goal (reuse these; do not re-parse flags).
- `## Dead Ends` — approaches that are still off-limits.
- `## Iterations` — the last iteration number `N` and the most recent failure context.
- `## Result` — present only if the loop already exited.

If there is no `.agent-state.md`, there is nothing to resume — tell the user and suggest `RunLoop`.

## Step 2: Budget Check

Using `## Config` max: if the loop already hit it (last run exited on "max reached") or `## Result` is
filled in, **confirm with the user before extending** — ask for a new `--max` rather than silently
looping past the original bound. Otherwise proceed.

## Step 3: Run Exactly One Pass

Run `RunLoop` Step 3 once, at iteration `N+1`:
- Feed the most recent failure context into this PLAN so the pass replans rather than repeating.
- Keep skipping everything in `## Dead Ends`.
- RECORD the iteration line — never reset the counter.

## Step 4: Evaluate Exit Conditions

Apply `RunLoop` Step 4 (max reached / Verify READY + Reflect ≥ threshold / 3× `LOOP_COMPLETE`).

## Step 5: Continue or Finish

Identical to `RunLoop` Step 5:
- **Exit met** → write `## Result`, give a 2-3 sentence report noting this was a resumed run and how
  many total passes it took. **No wakeup.**
- **Not met** → `ScheduleWakeup(delaySeconds=<config delay>, prompt="/iterate --target … --goal …
  --max … --resume", reason="iterate pass <N+2>/<max>")`, then stop. The harness re-fires and the
  next wake runs the following pass.

## Gotchas

- Don't reset the iteration counter — continuity of the log is what makes Dead Ends and failure
  context meaningful.
- A resume that ignores the prior failure context is just a blind retry with extra steps; always
  carry it into the first PLAN.
- If the goal in state no longer matches what the user now wants, start a fresh `RunLoop` instead of
  resuming a stale goal.
- One pass per wake — end the turn with exactly one `## Result`+report or one `ScheduleWakeup`, never
  both.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Iterate","workflow":"ResumeLoop","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
