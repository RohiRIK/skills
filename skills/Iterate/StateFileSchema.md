# `.agent-state.md` — State File Schema

One state file per run, written at the **repo root** of the repo being operated on, gitignored (working state, not a tracked artifact). `Iterate` (`RunLoop` / `ResumeLoop`) and `Orchestrate` (`Decompose` / `RunLayer` / `MergeQueue`) both read and write it. It is what carries context across passes: each pass reads the prior state, acts, and writes back — so failure context carries forward and rejected approaches are never retried.

## Required sections

```markdown
## Goal
<the goal text, verbatim. Set once on the first pass, never rewritten.>

## Config            # written once by RunLoop after applying defaults
- target: <path>
- max: <N>                          # hard cap on passes (safety backstop)
- reflect_threshold: <float, 4.5>   # Reflect score that counts as done
- until_goal: <true|false>         # true = goal is primary exit, max raised to backstop

## Progress
- [ ] <pending step>
- [x] <done step>

## Dead Ends         # never retry anything listed here
- <rejected approach> — <why it failed>

## Iterations        # append-only, never reset
- Iteration <N>: <8-word summary> | verify=<ready|not-ready> | reflect=<score>

## Result            # empty until an exit condition fires
- Passes: <N> | Exit: <max-reached | verify+reflect | 3x-loop-complete> | Final verify/reflect: <…>
```

`## Config.delay_s` is written **only** in wake mode, and only when the host actually has a wake primitive. Inline mode leaves it out.

## Rules

- **`## Goal` is immutable** for the life of the file. If the goal changes, start a fresh run rather than editing it — a resumed run against a rewritten goal is a silent scope change.
- **`## Dead Ends` is binding.** An approach moves here after it fails twice (Iterate) or after it is evicted (Orchestrate `MergeQueue`), with the reason recorded. No later pass may retry it.
- **One iteration line per pass. Append, never rewrite history.** The summary plus `verify`/`reflect` values are enough for the next pass to plan.
- **Failure context is captured, not discarded.** On a NOT READY `Verify` verdict or a non-zero worker exit, append the full context (command, exit code, last output, relevant diff) under the current iteration so the next pass replans instead of repeating.
- **`## Result` presence = the run already exited.** `ResumeLoop` treats a filled-in `Result` as "confirm before extending past the original budget".

## Who Writes What

| Section | Iterate | Orchestrate |
|---------|---------|-------------|
| Goal | `RunLoop` sets from `--goal` | `Decompose` sets from the spec |
| Config | `RunLoop`, after defaults | — |
| Progress | each pass updates | `RunLayer` marks units ready |
| Dead Ends | `RunLoop` on 2nd failure | `MergeQueue` on eviction |
| Iterations | one line per pass | one line per layer/pass |
| Result | `RunLoop` at exit | `MergeQueue` when the queue drains |
