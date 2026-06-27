# MergeQueue Workflow

Land ready units onto `main` one safe step at a time, recovering from conflicts by eviction rather than force. Consumes the units `RunLayer` marked ready in `.agent-state.md`.

## Step 1: Order the Queue

Take all ready units. Land **non-overlapping units first** (disjoint file sets — they can't conflict). Queue **overlapping units one at a time**, with a rebase between each, so each lands against the others' already-merged changes.

## Step 2: Land One Unit

For the unit at the head of the queue:

1. **Rebase** its branch onto the current `main`.
   - Conflict → **EVICT** (Step 3).
2. **Verify** (`Verify/Workflows/RunVerify.md`) on the rebased branch.
   - FAIL → **EVICT** (Step 3).
3. **Fast-forward** merge into `main`, **push**, and **delete** the unit's branch.

Then move to the next unit. Because every unit rebases onto the freshly-updated `main`, later units see earlier ones' changes.

## Step 3: Eviction (conflict or Verify fail)

Don't force the merge. Instead capture the full context into `.agent-state.md` under the unit:
- the conflicting files (or the Verify blocking-issue list),
- the unit's diff,
- the failing output.

Record the unit in `## Dead Ends` only if its current *approach* is what failed; otherwise leave it eligible. The evicted unit **re-enters the next pass** (back through `RunLayer`) so it is restructured around the conflict — never blind-retried. This is why the loop converges: each eviction adds context that changes the next attempt.

## Step 4: Finish

When the queue drains, write the `## Result` block in `.agent-state.md` (units landed, units evicted-and-pending, final state) and report.

## Gotchas

- Fast-forward only — a merge commit on a conflicted rebase is exactly the silent breakage this queue exists to prevent.
- Eviction is not failure; it's the recovery mechanism. The captured context is what lets the unit restructure instead of repeating.
- Land disjoint units before overlapping ones — it shrinks the conflict surface for the hard cases.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Orchestrate","workflow":"MergeQueue","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
