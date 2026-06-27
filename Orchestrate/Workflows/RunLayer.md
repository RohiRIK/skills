# RunLayer Workflow

Execute one dependency layer: run its independent units in parallel via the delegation skills, gate each with Verify, and review each in a context that did not write it. Operates on the plan `Decompose` wrote to `.agent-state.md`.

## Step 1: Select the Layer

From `.agent-state.md`, take the lowest-numbered layer whose dependencies are all satisfied. Its units run in parallel.

## Step 2: Delegate Each Unit (parallel)

Dispatch each unit to an existing delegation skill — **`Agy`, `OpenCode`, or `Pi`** (not a new mechanism). Each worker gets:
- the unit's `acceptance` criteria,
- its tier's pipeline depth (from `Decompose` Step 3),
- an **isolated branch or worktree** so parallel workers don't clobber each other.

Spread units across the three delegation skills (and/or background agents) so they genuinely run in parallel.

## Step 3: Gate Each Unit with Verify

When a worker finishes, run the **Verify** skill (`Verify/Workflows/RunVerify.md`) on its branch.
- **NOT READY** → capture the blocking-issue context into `.agent-state.md` under the unit's current iteration and send it back to the worker (no blind-retry — the worker replans with the failure context). If the same approach fails twice, move it to `## Dead Ends`.

## Step 4: Separate-Context Review (small+ tiers)

For small/medium/large units, review the unit's diff in a **fresh context that did not write the code** (spawn a reviewer agent with only the diff + acceptance criteria). This eliminates author bias — the writer can't rubber-stamp its own work. Trivial units skip review.

## Step 5: Mark Ready

A unit that is Verify-passing **and** reviewed is marked ready in `.agent-state.md`. When every unit in the layer is ready, the next layer becomes eligible; hand the ready units to `MergeQueue`.

## Gotchas

- Workers must be on isolated branches/worktrees — two parallel workers on the same branch corrupt each other's state.
- The reviewer must not be the writer. Reusing the writing context defeats the entire point of the review step.
- A worker that exits non-zero writes failure context to state (see the delegation skills' wiring) — read it before redispatching, or you'll repeat the failure.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Orchestrate","workflow":"RunLayer","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
