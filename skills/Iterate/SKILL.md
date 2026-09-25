---
name: Iterate
description: "Bounded multi-pass loop: improve mode (one change per pass, Verify + Reflect, inline or wake-driven) or analysis mode (--lenses, read-only). USE WHEN iterate, refine, keep improving, or explore deeper."
category: workflow
effort: medium
domain: meta
argument-hint: "[--target PATH --goal TEXT --max N] | [--lenses N]"
---

# Iterate

Repeated PLAN → ACT → VERIFY → REFLECT passes until the goal is met, the cap is reached, or the lenses
converge. State persists between passes in `.agent-state.md` (schema: `StateFileSchema.md`). Two modes
by intent: **improve** (`RunLoop`) changes a target and gates on `Verify`; **analysis** (`RunLenses`)
reads one and gates on convergence.

**The pass driver is host-dependent.** With a wake primitive (Claude Code `ScheduleWakeup` / `/loop`)
each pass ends the turn and schedules its re-fire; without one (pi, opencode, most MCP hosts) the
passes run inline in the same turn, up to the cap. The tool is an optimization, never a dependency.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunLoop** | "loop", "iterate on", "keep improving" (improve mode) | `Workflows/RunLoop.md` |
| **ResumeLoop** | "resume the loop", "continue iterating", "--resume" | `Workflows/ResumeLoop.md` |
| **RunLenses** | "--lenses", "explore deeper", "multi-angle", "what am I missing?" | `Workflows/RunLenses.md` |

## Gotchas

- No wake primitive is not a reason to stop after one pass — run inline. Fabricating a wake call is worse than either, and ending a turn with neither a `## Result` nor a continuation is the stall bug.
- Defaults when unset: `--max 5`, `--threshold 4.5` (`--until-goal` → cap 25). Exits are mandatory — cap reached / Verify READY + Reflect ≥ threshold / 3× `LOOP_COMPLETE`. Each pass calls `Verify` then `Reflect`; full flag table in `RunLoop.md` Step 1.
- `## Dead Ends` is binding for the rest of the run; record *why* an approach failed, not just that it did. One change per pass — bundling makes a NOT READY verdict ambiguous.
- `--lenses` is analysis mode (read-only, single turn), not a modifier on the improve loop.

## Examples

**Example 1: Iterate on a skill until it routes cleanly**
```
User: "/iterate --target skills/Research --goal 'output is more concise' --max 5"
→ RunLoop creates state, runs pass 1 (plan → act → Verify → Reflect → record), then
   schedules the re-fire (wake primitive) or runs passes 2..N inline → stops on
   Verify READY + Reflect ≥ 4.5, or at the cap
```

**Example 2: Resume, or explore deeper**
```
User: "resume the loop"        → ResumeLoop: rehydrates state, next pass, reports the count
User: "explore deeper on this" → RunLenses: one read-only pass per lens, stops on convergence → Spec
```
