# RunLoop Workflow

A bounded PLAN → ACT → VERIFY → REFLECT loop. Each pass builds on the last through `.agent-state.md`, carries failure context forward, and refuses to retry rejected approaches. The loop always terminates — exit conditions are mandatory.

## Step 1: Parse Arguments

| Arg | Meaning | Default |
|-----|---------|---------|
| `--target PATH` | what to iterate on (file, dir, or task) | required |
| `--goal TEXT` | the success condition in plain language | required |
| `--max N` | hard cap on passes | 5 |

## Step 2: Load or Create State

Read `.agent-state.md` at the repo root (schema: `_state/StateFileSchema.md`). If absent, create it with the `## Goal` set from `--goal`, an empty `## Progress`, `## Dead Ends`, `## Iterations`, and a placeholder `## Result`. If present (a prior run), treat this as a resume and route to `ResumeLoop`.

## Step 3: The Pass Iterate

Repeat until an exit condition fires (Step 4). For pass `N`:

1. **PLAN** — read the current state. Pick the **single highest-value change** toward the goal. Skip anything in `## Dead Ends`. If nothing of value remains, emit `LOOP_COMPLETE` for this pass.
2. **ACT** — make that one change. Keep it small enough to verify.
3. **VERIFY** — call the **Verify** skill (`Verify/Workflows/RunVerify.md`) on the target.
   - On **NOT READY**: append the full failure context (the blocking-issue list, file+line) to `.agent-state.md` under iteration `N`. Carry it into the next pass's PLAN — never blind-retry. **If the same approach fails twice, move it to `## Dead Ends`** with the reason and plan a different approach.
4. **REFLECT** — call the **Reflect** skill (`Reflect/Workflows/RunReflect.md`) on the pass output. Record the overall score (Reflect writes it to state rather than printing the full card inside a loop).
5. **RECORD** — append one iteration line:
   `- Iteration N: <8-word summary> | verify=<ready/not-ready> | reflect=<score>`

## Step 4: Exit Conditions (mandatory — any one ends the loop)

- `--max` passes reached, **or**
- Verify `READY` **and** Reflect ≥ 4.5, **or**
- three consecutive `LOOP_COMPLETE` signals (nothing left worth changing).

## Step 5: Finish

Write the `## Result` block:
`- Passes: <N> | Exit: <which condition> | Final verify/reflect: <…>`

Then give the user a 2-3 sentence report: what changed across the run, the final verify/reflect state, and anything parked in Dead Ends.

## Gotchas

- One change per pass. Bundling changes makes a NOT READY verdict ambiguous — you can't tell which change broke the gate.
- Dead Ends is binding for the rest of the run. Record *why* an approach failed, not just that it did, so the next plan doesn't circle back.
- Never loop unbounded — if you can't name which exit condition you're driving toward, stop and report.
- A pass that only reads/plans without acting still counts toward `--max`; don't burn the budget on analysis.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Iterate","workflow":"RunLoop","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
