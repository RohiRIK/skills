# RunLoop Workflow

A bounded PLAN → ACT → VERIFY → REFLECT loop that runs **one pass per turn** and re-invokes itself
through the harness until an exit condition fires. Each pass builds on the last through
`.agent-state.md`, carries failure context forward, and refuses to retry rejected approaches. The
loop always terminates — exit conditions are mandatory.

Why one pass per turn: a skill cannot loop itself inside a single turn. To actually iterate
unattended, each pass ends by scheduling its own re-invocation with `ScheduleWakeup` (the mechanism
behind `/loop` dynamic mode). The turn ends, the harness re-fires `/iterate … --resume`, and
`ResumeLoop` runs the next pass. Omit the wakeup and the loop stops.

## Step 1: Parse Arguments & Apply Defaults

| Arg | Meaning | Default when unset |
|-----|---------|--------------------|
| `--target PATH` | what to iterate on (file, dir, or task) | required |
| `--goal TEXT` | the success condition in plain language | reuse `## Goal` from an existing `.agent-state.md`; if none, **ask the user once** — never invent a goal |
| `--max N` | hard cap on passes (safety backstop) | `5` |
| `--until-goal` | make the goal the primary exit | off; when set, raise the cap to `25` |
| `--threshold F` | Reflect score that counts as done | `4.5` |
| `--delay S` | seconds between passes (ScheduleWakeup interval) | `60` |

An unset flag must never stall a run — always fall back to the default above. Record the resolved
values in `## Config` so every resumed pass reuses them without re-parsing.

## Step 2: Load or Create State

Read `.agent-state.md` at the repo root (schema: `_state/StateFileSchema.md`). If **absent**, create
it: `## Goal` from `--goal`, `## Config` from Step 1, empty `## Progress`, `## Dead Ends`,
`## Iterations`, and a placeholder `## Result`. If **present** (a prior run for the same goal), this
is a resume — route to `ResumeLoop`.

## Step 3: Run Exactly One Pass

Run a **single** pass this turn — do not loop in prose. For pass `N` (next unused iteration number):

1. **PLAN** — read the current state. Pick the **single highest-value change** toward the goal. Skip
   anything in `## Dead Ends`. If nothing of value remains, emit `LOOP_COMPLETE` for this pass.
2. **ACT** — make that one change. Keep it small enough to verify.
3. **VERIFY** — call the **Verify** skill (`Verify/Workflows/RunVerify.md`) on the target.
   - On **NOT READY**: append the full failure context (blocking-issue list, file+line) to
     `.agent-state.md` under iteration `N`. Carry it into the next pass's PLAN — never blind-retry.
     **If the same approach fails twice, move it to `## Dead Ends`** with the reason and plan a
     different approach.
4. **REFLECT** — call the **Reflect** skill (`Reflect/Workflows/RunReflect.md`) on the pass output.
   Record the overall score (Reflect writes it to state rather than printing the full card in a loop).
5. **RECORD** — append one iteration line to `## Iterations`:
   `- Iteration N: <8-word summary> | verify=<ready/not-ready> | reflect=<score>`

## Step 4: Evaluate Exit Conditions (any one ends the loop)

- `--max` passes reached (with `--until-goal`, the raised cap), **or**
- Verify `READY` **and** Reflect ≥ `--threshold`, **or**
- three consecutive `LOOP_COMPLETE` signals (nothing left worth changing).

## Step 5: Continue or Finish

- **Exit condition met** → write the `## Result` block:
  `- Passes: <N> | Exit: <which condition> | Final verify/reflect: <…>`
  **Do not schedule a wakeup.** Give the user a 2-3 sentence report: what changed across the run, the
  final verify/reflect state, and anything parked in Dead Ends. The loop is done.

- **No exit condition met** → schedule the next pass and end the turn:

  ```
  ScheduleWakeup(
    delaySeconds = <--delay, default 60>,
    prompt       = "/iterate --target <PATH> --goal <TEXT> --max <N> --resume",
    reason       = "iterate pass <N+1>/<max> — <8-word goal>"
  )
  ```

  Then stop — do not keep working this turn. The harness re-fires the prompt after the delay and
  `ResumeLoop` runs pass `N+1`. This is the actual iteration: one pass, schedule, stop; repeat.

## Gotchas

- **One pass per turn.** Never try to run passes 2..N in the same turn — that is the old prose-loop
  bug that stalls. Run one pass, then either finish or schedule the next.
- **Always end the turn with exactly one decision:** a `## Result` + report (done), or a single
  `ScheduleWakeup` (continue). Never both, never neither.
- One change per pass. Bundling changes makes a NOT READY verdict ambiguous.
- Dead Ends is binding for the rest of the run. Record *why* an approach failed, not just that it did.
- A pass that only reads/plans without acting still counts toward `--max`; don't burn the budget on
  analysis.
- Launching as `/loop /iterate …` also works — the native loop re-fires `/iterate` and this workflow
  behaves identically. `ScheduleWakeup` is the self-contained path when you invoke `/iterate` directly.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Iterate","workflow":"RunLoop","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
