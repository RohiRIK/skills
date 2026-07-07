# Workflow: Delegate

Hand an implement / refactor / fix task to Agy and report the result.

## 1. Preflight

```bash
agy --version          # confirm installed
agy inspect            # confirm auth + which config/skills/plugins are loaded
```

Resolve the target directory from the task (default: current working dir). Confirm
it is a git repo with a clean-enough tree — Agy writes files, so uncommitted changes
will be intermixed with its edits. Add the dir to the workspace with `--add-dir`.

## 2. Write a precise prompt

Agy acts on the prompt verbatim. Make it self-contained:

- State the goal, the files/areas in scope, and the done condition.
- Tell it to run tests / typecheck after editing when the repo has them.
- Add every relevant dir with `--add-dir` (repeatable).

```bash
timeout 360 agy -p 'Add retry-with-backoff to all outbound HTTP calls in src/api/. \
Use the existing logger. Add unit tests and run `bun test` until green.' \
  --add-dir /path/to/project
```

Always wrap in an outer `timeout` (see `Reference.md` → Timeouts). Pin a model with
`-m <model>` if the task needs one; omit to use the configured default.

## 3. Run — pick foreground vs background

**Bounded task (a couple minutes):** run foreground with `Bash`, read the result.

**Long or multi-file task:** run with `run_in_background: true` inside a generous
outer `timeout` and a matching `--print-timeout`, then watch:

- `BashOutput` — poll incremental output, decide whether to keep waiting.
- `Monitor` — block until the process exits when you have nothing else to do.

If output is large, redirect and tail rather than streaming into context:

```bash
timeout 900 agy -p '<prompt>' --add-dir /path/to/project --print-timeout 14m \
  > /tmp/agy-run.log 2>&1
```

## 4. Parallel runs (optional)

For independent tasks, isolate each in its own git worktree so edits don't collide,
and background each:

```bash
git worktree add ../task-a -b task-a
timeout 900 agy -p '<task A>' --add-dir ../task-a    # run_in_background: true
git worktree add ../task-b -b task-b
timeout 900 agy -p '<task B>' --add-dir ../task-b    # run_in_background: true
```

Poll each with `BashOutput`. Clean up worktrees when done.

## 5. Double-check the result, then report

An autonomous worker can exit 0 and still leave broken, partial, or off-spec work — exit code is not
correctness. Verify before you trust it.

After Agy exits:

- Run `git status` / `git diff --stat` in the target dir to see what changed.
- **Run the `Verify` skill** (`Verify/Workflows/RunVerify.md`) on the changed files against the task's
  done condition — do this even on a clean (exit 0) run.
  - **NOT READY** → append the failure context (blocking issues, file+line, the diff) to
    `.agent-state.md` under the current iteration (schema: `_state/StateFileSchema.md`), exactly as a
    non-zero exit would, so a `/iterate` or `Orchestrate` pass replans instead of trusting bad work.
- Summarize: what it did, files touched, the Verify verdict, anything left incomplete or flagged.
- Do **not** commit Agy's work automatically — surface the diff and let the user decide (follow this
  repo's normal commit workflow).

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Agy","workflow":"Delegate","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

## Wiring: capture failure to state

On a non-zero worker exit **or a NOT READY Verify verdict** (Step 5), append the failure context — command, exit code, last output, and the relevant diff — to `.agent-state.md` under the current iteration (schema: `_state/StateFileSchema.md`). A `/iterate` or `Orchestrate` pass then replans around the failure instead of blind-retrying.
