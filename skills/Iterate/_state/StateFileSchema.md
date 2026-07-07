# `.agent-state.md` — State File Schema

The single state file for an autonomous `Iterate` run, written at the **repo root** as
`.agent-state.md`. `RunLoop` creates it on the first pass; every subsequent pass (including a
`ResumeLoop` after a `ScheduleWakeup` re-invocation) reads it, appends to it, and rewrites the
`## Result` block. It is what carries context across turns — each pass builds on the last instead of
starting blind.

One state file per run. If a stale one exists for a *different* goal, start fresh (see `ResumeLoop`
Step 1).

## Required sections

```markdown
# Iterate — <target basename>

## Goal
<the --goal text, verbatim. Set once on the first pass, never rewritten.>

## Config
- target: <path>
- max: <N>            # hard cap on passes (safety backstop)
- reflect_threshold: <float, default 4.5>
- delay_s: <int, default 60>   # ScheduleWakeup interval between passes
- until_goal: <true|false>     # true = goal is primary exit, max raised to backstop

## Progress
<running plain-language notes: what has actually changed across passes so far.>

## Dead Ends
<approaches that failed twice — binding for the rest of the run, never retried.
 Each entry records *why* it failed, not just that it did.>
- <approach>: <reason it was abandoned>

## Iterations
<one line per pass, appended, never reset. This log is what makes the counter,
 Dead Ends, and carried-forward failure context meaningful.>
- Iteration 1: <8-word summary> | verify=<ready|not-ready> | reflect=<score>
- Iteration 2: ...

## Result
<empty until an exit condition fires. On exit:>
- Passes: <N> | Exit: <max-reached | verify+reflect | 3x-loop-complete> | Final verify/reflect: <…>
```

## Rules

- **`## Goal` is immutable** for the life of the file. If the user's goal changes, start a fresh run
  rather than editing it (a resumed run against a rewritten goal is a silent scope change).
- **`## Iterations` is append-only.** Never reset the counter, even across a `ScheduleWakeup`
  re-invocation or a manual `--resume` — continuity is what makes Dead Ends and failure context work.
- **`## Dead Ends` is binding.** Once an approach lands here, no later pass may retry it.
- **`## Config` is written once** by `RunLoop` after applying defaults, so every resumed pass reuses
  the same bounds without re-parsing flags.
- **`## Result` presence = the loop already exited.** `ResumeLoop` treats a filled-in Result as
  "confirm before extending past the original budget".
