# Workflow: autonomous-loop

Hands-off improvement. Point `Iterate` at a target with a goal and an exit condition; it runs repeated PLAN → ACT → VERIFY → REFLECT passes unattended, each pass building on the last.

```
Iterate (target, goal, max)  →  [Verify + Reflect each pass]  →  GitHubOps:CommitPush
```

## Invoke

```
/Iterate --target <path> --goal "<measurable outcome>" --max <N>
```

Example:
```
/Iterate --target CreateMcp/SKILL.md --goal "routing section tighter, no detail >50 lines" --max 5
```

## How a pass works

1. **PLAN** — read `.agent-state.md`, pick ONE change (skip anything in `## Dead Ends`).
2. **ACT** — make that one change.
3. **VERIFY** — the `Verify` skill is the quality gate (READY / NOT READY).
4. **REFLECT** — the `Reflect` skill self-rates 5 axes; score feeds the next PLAN.

## Exit conditions (mandatory — pick before starting)

- Verify passes **AND** Reflect ≥ 4.5, **or**
- `--max N` iterations reached, **or**
- 3 consecutive `LOOP_COMPLETE` signals.

If you can't name the exit, don't start the loop.

## Rules

- **One change per pass** — bundling makes a NOT READY verdict ambiguous.
- **`## Dead Ends` is binding** — record *why* an approach failed; never blind-retry it.
- State lives in **`.agent-state.md`** (gitignored). Interrupted? Resume with `resume the loop` (ResumeLoop).

## When to use

- Tightening a skill's prose, trimming filler, improving routing copy.
- Any target with a measurable goal you can hand off overnight.

## When NOT to use

- The change needs a human decision each step → use **fix-skill** (manual branches).
- No measurable exit → stop and define one first.

## Safe to run unattended?

Yes if: target is a single file/skill, goal is measurable, `--max` set, and a destructive step (push, delete) is **not** inside the loop. Ship via `GitHubOps:CommitPush` *after* the loop exits, not during.
