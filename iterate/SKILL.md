---
name: iterate
description: "Refine a target across bounded passes toward a goal, with a state file and a hard exit condition. Use when iterate, refine, loop, keep improving, or run until done."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='iterate', file_path='references/run-loop.md') before taking any action."
---

# Iterate

Run repeated PLAN → ACT → VERIFY → REFLECT passes on a target until the goal is met, max iterations reached, or a completion signal fires.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunLoop** | "loop", "iterate on", "keep improving" | `references/run-loop.md` |
| **ResumeLoop** | "resume the loop", "continue iterating", "--resume" | `references/resume-loop.md` |

## Gotchas
- Exit conditions are mandatory — never loop unbounded; if you can't name the exit you're driving toward, stop.
- `## Dead Ends` is binding for the rest of the run — record *why* an approach failed, not just that it did.
- One change per pass; bundling makes a NOT READY verdict ambiguous.

## Examples
**Example 1: Iterate on a skill until it routes cleanly**
```
User: "/iterate --target ~/.claude/skills/Research --goal 'output is more concise' --max 5"
→ Reads/creates .agent-state.md, runs up to 5 PLAN→ACT→VERIFY→REFLECT passes
→ Stops early when Verify passes AND Reflect score ≥ 4.5
```
**Example 2: Resume an interrupted loop**
```
User: "resume the loop"
→ Reads .agent-state.md, skips anything in Dead Ends, continues from last iteration
```
**Example 3: Iterate on a prompt file overnight**
```
User: "/iterate --target prompts/summarize.md --goal 'less filler' --max 20"
→ Each pass's Reflect feeds the next pass's PLAN; halts on three consecutive LOOP_COMPLETE or at 20
```
