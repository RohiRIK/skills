---
name: SkillForge
description: "Audits the whole skill library for agentic readiness (loops, verification, self-reflection, shared state, telemetry) and instruments it in bulk. USE WHEN auditing skills for autonomy, finding agentic gaps, or adding execution logging across skills. NOT FOR creating or scaffolding a single skill (use CreateSkill)."
category: meta
effort: medium
---

# SkillForge

Fleet-level meta-skill for the skill library. Where `CreateSkill` operates on **one skill at a time** (scaffold, validate, test, improve), SkillForge operates on the **whole library at once** — scoring every skill for agentic capability and instrumenting them in bulk.

It does not create skills. Authoring a new skill is `CreateSkill`'s job (and the upgraded `CreateSkill` already makes new skills loop-ready). SkillForge answers a different question: across everything I already have, what is missing and what needs instrumenting?

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **AuditAgentic** | "audit skills for autonomy", "agentic gaps", "readiness report" | `Workflows/AuditAgentic.md` |
| **AddTelemetry** | "add execution logging", "instrument skills" | `Workflows/AddTelemetry.md` |

## Quick Reference

- Agentic-readiness rubric (5 axes): Iteration, Verification, Reflection, State, Telemetry
- Scope is the whole library — fleet audit, not single-skill authoring (that's `CreateSkill`)
- Pairs with `CreateSkill` (builds one skill) and `Prompting` (wording); SkillForge measures + instruments the set
- Shared state lives in `.agent-state.md`; telemetry in `~/.claude/state/execution.jsonl`

## Examples

**Example 1: Score the whole library**
```
User: "audit my skills for autonomy"
→ Invokes AuditAgentic workflow
→ Scores every skill on the 5-axis readiness rubric
→ Ranked report: which skills are reference-exempt, single-shot, partial, or loop-ready
```

**Example 2: Instrument existing skills in bulk**
```
User: "add execution logging to all my skills"
→ Invokes AddTelemetry workflow
→ Appends the standard JSONL execution-log line to each action workflow that lacks it
```

**Example 3: Find what to fix next**
```
User: "where are the agentic gaps in my library?"
→ AuditAgentic → top fixes ranked by how many skills each change unblocks
```
