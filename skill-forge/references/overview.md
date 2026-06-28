# SkillForge — Overview

Fleet-level meta-skill for the skill library. Where `CreateSkill` operates on **one skill at a time** (scaffold, validate, test, improve), SkillForge operates on the **whole library at once** — scoring every skill for agentic capability and instrumenting them in bulk.

It does not create skills. Authoring a new skill is `CreateSkill`'s job (and the upgraded `CreateSkill` already makes new skills loop-ready). SkillForge answers a different question: across everything I already have, what is missing and what needs instrumenting?

## Quick Reference

- Agentic-readiness rubric (5 axes): Iteration, Verification, Reflection, State, Telemetry
- Scope is the whole library — fleet audit, not single-skill authoring (that's `CreateSkill`)
- Pairs with `CreateSkill` (builds one skill) and `Prompting` (wording); SkillForge measures + instruments the set
- Shared state lives in `.agent-state.md`; telemetry in `~/.claude/state/execution.jsonl`
