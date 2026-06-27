# State File Schema — `.agent-state.md`

Loop and multi-pass skills persist progress in a repo-local `.agent-state.md` at the root of the repo they operate on. It bridges context between independent passes and agents: each pass reads the prior state, acts, and writes back — so failure context carries forward and rejected approaches are never retried.

`Loop` (RunLoop / ResumeLoop) and `Orchestrate` (Decompose / RunLayer / MergeQueue) both read and write this file. `.agent-state.md` is gitignored — it is working state, not a tracked artifact.

## Fixed Sections

```markdown
## Goal
<one line — what this run is trying to achieve>

## Progress
- [ ] <pending step>
- [x] <done step>

## Dead Ends        # never retry anything listed here
- <rejected approach> — <why it failed>

## Iterations
- Iteration <N>: <8-word summary> | verify=<ready/not-ready> | reflect=<score>

## Result
- Passes: <N> | Exit: <reason> | Final verify/reflect: <…>
```

## Rules

- **`## Dead Ends` is binding.** Any approach listed there is never attempted again. An approach moves here after it fails twice (Loop) or after it is evicted (Orchestrate MergeQueue) with the reason recorded.
- **One iteration line per pass.** Append; never rewrite history. The 8-word summary plus the `verify`/`reflect` values are enough for the next pass to plan.
- **Failure context is captured, not discarded.** On a NOT READY verify or a non-zero worker exit, append the full context (command, exit code, last output, relevant diff) under the current iteration so the next pass replans instead of repeating.
- **`## Result` is written once, at exit.** It records why the run stopped (max reached / verify READY + reflect ≥ 4.5 / three consecutive LOOP_COMPLETE / eviction) and the final scores.

## Who Writes What

| Section | Loop | Orchestrate |
|---------|------|-------------|
| Goal | RunLoop sets from `--goal` | Decompose sets from the spec |
| Progress | each pass updates | RunLayer marks units ready |
| Dead Ends | RunLoop on 2nd failure | MergeQueue on eviction |
| Iterations | one line per pass | one line per layer/pass |
| Result | RunLoop at exit | MergeQueue when the queue drains |
