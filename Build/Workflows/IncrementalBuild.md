# IncrementalBuild

Implement each plan task with TDD, compile gate, and a commit before moving on.

## Prerequisites

A plan must exist with at least one pending task. Each task should have acceptance criteria.

## Per-Task Loop

Repeat these steps for each pending task until all are complete:

### Step 1: Pick the next task

Read the next pending task from the plan. Load its acceptance criteria — these define what "done" means for this task.

### Step 2: Load context

Read the relevant existing code, types, and patterns used nearby. Understand the shape of the change before writing anything.

### Step 3: TDD — RED → GREEN → REFACTOR

Run `TddWorkflow:RedGreenRefactor` scoped to this task's acceptance criteria:
- Write a failing test that captures the acceptance criteria (RED)
- Write the minimum implementation to pass it (GREEN)
- Refactor while keeping tests green (REFACTOR)

### Step 4: Compile gate

Run `bunx tsc --noEmit` (or `bun run build` if the project has a build script).

This catches type errors before they land in a commit. If compile fails, invoke `/build-fix` then retry this step.

### Step 5: Regression sweep

Run `bun test` across all files. If any existing test breaks, stop and report which test failed and why — do not commit until regressions are resolved.

### Step 6: Verify gate → Commit

Call the **Verify** skill (`Verify/Workflows/RunVerify.md`) on the change. **Gate the commit on `READY`** — if Verify returns NOT READY, do not commit; fix the blocking issues (or, under `/loop`, capture them to `.agent-state.md` and let the next pass replan) and re-verify.

On READY, commit with a conventional message that references the task title:

```
feat: <task title>
```

### Step 7: Advance

Mark the task complete. Move to the next pending task. Repeat from Step 1.

## Idempotency (loop-drivable)

Re-running this workflow on a clean tree with all tasks complete is a no-op — it picks no task, verifies nothing to commit, and exits. This lets `/loop` drive `Build` safely: a pass that finds nothing to do contributes a `LOOP_COMPLETE` signal rather than re-committing.

## Exit

All tasks marked complete. Report: tasks completed, commits made, final Verify verdict + test status.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Build","workflow":"IncrementalBuild","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
