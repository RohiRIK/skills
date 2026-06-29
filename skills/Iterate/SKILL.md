---
name: Iterate
description: "Refine a target across bounded passes toward a goal, with a state file and a hard exit condition. USE WHEN iterate, refine, loop, keep improving, or run until done."
category: workflow
effort: medium
disable-model-invocation: true
argument-hint: [--target PATH --goal TEXT --max N]
---

# Iterate

Run repeated PLAN → ACT → VERIFY → REFLECT passes on a target until the goal is met, max iterations is reached, or a completion signal fires. State persists between passes in `.agent-state.md`, so each pass builds on the last instead of starting blind.

This is the autonomous-iteration primitive. Unlike a single workflow run, `/iterate` carries failure context forward, refuses to retry rejected approaches (dead-ends ledger), and self-rates each pass before deciding whether to continue.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunLoop** | "loop", "iterate on", "keep improving" | `Workflows/RunLoop.md` |
| **ResumeLoop** | "resume the loop", "continue iterating", "--resume" | `Workflows/ResumeLoop.md` |

## Quick Reference

- State-file schema (`.agent-state.md`): goal, progress, dead-ends, per-iteration log
- Exit conditions are mandatory — never loop unbounded
- Each pass calls the `Verify` skill as its quality gate and the `Reflect` skill as its self-evaluation step
- On failure, capture full context into state and change approach — do not blind-retry

## Gotchas

- Exit conditions are mandatory — never loop unbounded; if you can't name the exit you're driving toward, stop.
- `## Dead Ends` is binding for the rest of the run — record *why* an approach failed, not just that it did.
- One change per pass; bundling makes a NOT READY verdict ambiguous.

## Examples

**Example 1: Iterate on a skill until it routes cleanly**
```
User: "/iterate --target ~/.claude/skills/Research --goal 'output is more concise' --max 5"
→ Invokes RunLoop workflow
→ Reads/creates .agent-state.md, runs up to 5 PLAN→ACT→VERIFY→REFLECT passes
→ Stops early when Verify passes AND Reflect score ≥ 4.5
```

**Example 2: Resume an interrupted loop**
```
User: "resume the loop"
→ Invokes ResumeLoop workflow
→ Reads .agent-state.md, skips anything in Dead Ends, continues from last iteration
```

**Example 3: Iterate on a prompt file overnight**
```
User: "/iterate --target prompts/summarize.md --goal 'less filler' --max 20"
→ Runs unattended, each pass's Reflect feeds the next pass's PLAN
→ Halts on three consecutive LOOP_COMPLETE signals or at 20 iterations
```
