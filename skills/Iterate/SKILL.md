---
name: Iterate
description: "Bounded multi-pass loop: improve mode (self-re-invokes via ScheduleWakeup until done) or analysis mode (--lenses, read-only, feeds Spec). USE WHEN iterate, refine, keep improving, or explore deeper."
category: workflow
effort: medium
domain: meta
disable-model-invocation: true
argument-hint: [--target PATH --goal TEXT --max N]
---

# Iterate

Run repeated PLAN → ACT → VERIFY → REFLECT passes on a target until the goal is met, max iterations is reached, or a completion signal fires. State persists between passes in `.agent-state.md`, so each pass builds on the last instead of starting blind.

This is the autonomous-iteration primitive. Unlike a single workflow run, `/iterate` carries failure context forward, refuses to retry rejected approaches (dead-ends ledger), and self-rates each pass before deciding whether to continue.

It actually re-invokes itself. A skill can't loop inside one turn, so each pass runs **one** change,
then either finishes or schedules its own re-fire with `ScheduleWakeup` (the `/loop` dynamic-mode
mechanism) and ends the turn. The harness re-fires `/iterate … --resume` and the next pass runs from
state — repeating unattended until an exit condition. Unset flags fall back to defaults, so a run
never stalls on a missing argument.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunLoop** | "loop", "iterate on", "keep improving" (improve mode — modifies the target) | `Workflows/RunLoop.md` |
| **ResumeLoop** | "resume the loop", "continue iterating", "--resume" | `Workflows/ResumeLoop.md` |
| **RunLenses** | "--lenses", "explore deeper", "multi-angle", "what am I missing?" (analysis mode — read-only, produces criteria) | `Workflows/RunLenses.md` |

**Two modes:** *improve* (RunLoop) acts on the target and gates on Verify, re-invoking via
`ScheduleWakeup` until done. *analysis* (RunLenses) reads the target through rotating lenses and gates
on convergence in a single turn, handing criteria to `Spec`. Pick by intent: change it vs. understand it.

## Quick Reference

- One pass per turn: PLAN → ACT → VERIFY → REFLECT → RECORD, then finish or `ScheduleWakeup` to re-fire
- State-file schema at `_state/StateFileSchema.md` (`.agent-state.md`: goal, config, progress, dead-ends, per-iteration log)
- Defaults when unset: `--max 5`, `--threshold 4.5`, `--delay 60`s; `--until-goal` raises the cap to 25
- Exit conditions are mandatory — never loop unbounded (max reached / Verify READY + Reflect ≥ threshold / 3× LOOP_COMPLETE)
- Each pass calls the `Verify` skill as its quality gate and the `Reflect` skill as its self-evaluation step
- On failure, capture full context into state and change approach — do not blind-retry
- Depends on the native `ScheduleWakeup` tool for re-invocation; `/loop /iterate …` is an equivalent launch

## Gotchas

- One pass per turn — run a single change, then finish or schedule the next. Never try to run every
  pass in one turn; that's the prose-loop bug that stalls after ~1 pass.
- End each turn with exactly one decision: a `## Result` + report (done), or one `ScheduleWakeup`
  (continue). Never both, never neither.
- Exit conditions are mandatory — never loop unbounded; if you can't name the exit you're driving toward, stop.
- `## Dead Ends` is binding for the rest of the run — record *why* an approach failed, not just that it did.
- One change per pass; bundling makes a NOT READY verdict ambiguous.

## Examples

**Example 1: Iterate on a skill until it routes cleanly**
```
User: "/iterate --target ~/.claude/skills/Research --goal 'output is more concise' --max 5"
→ Invokes RunLoop: creates .agent-state.md, runs pass 1, then ScheduleWakeup re-fires
  "/iterate … --resume"; each wake runs one more pass from state
→ Stops (no further wakeup) when Verify passes AND Reflect ≥ 4.5, or at --max 5
```

**Example 2: Resume an interrupted loop**
```
User: "resume the loop"   (or the ScheduleWakeup auto-fires "/iterate … --resume")
→ Invokes ResumeLoop: reads .agent-state.md, skips Dead Ends, runs the next pass at N+1
```

**Example 3: Run until the goal is done, defaults filled in**
```
User: "/iterate --target prompts/summarize.md --goal 'less filler' --until-goal"
→ No --max given: cap defaults to 25 (backstop), goal is the primary exit; --delay 60s
→ Runs unattended pass-by-pass via ScheduleWakeup, each Reflect feeding the next PLAN
→ Stops when Verify READY + Reflect ≥ 4.5, or asks before extending past the cap
```

**Example 4: Analysis mode — surface hidden requirements before building**
```
User: "/iterate --target 'this API redesign' --lenses 5"   (or "explore deeper on this")
→ Invokes RunLenses (read-only, no ScheduleWakeup)
→ Pass 1 functional · 2 failure · 3 security · 4 integration · 5 temporal — each adds NEW criteria
→ Stops on convergence; hands the deduplicated criteria to Spec
```
