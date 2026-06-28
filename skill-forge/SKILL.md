---
name: skill-forge
description: "Audit the whole skill library for agentic readiness and instrument it with telemetry in bulk. Use when auditing skills for autonomy, finding agentic gaps, or adding execution logging across skills."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [meta, skills]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='skill-forge', file_path='references/add-telemetry.md') before taking any action."
---


# SkillForge

Fleet-level meta-skill for the skill library. Operates on the **whole library at once** — scoring every skill for agentic capability and instrumenting them in bulk. Does not create skills; that's `CreateSkill`'s job. See `references/overview.md` for detailed description and quick reference.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **AuditAgentic** | "audit skills for autonomy", "agentic gaps", "readiness report" | `references/audit-agentic.md` |
| **AddTelemetry** | "add execution logging", "instrument skills" | `references/add-telemetry.md` |

## Gotchas

- Tier-A reference skills are "reference, exempt" — never score them as single-shot failures.
- Telemetry presence is per action workflow, not per skill.
- This audits/instruments the fleet; authoring one skill is `CreateSkill`'s job.

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
