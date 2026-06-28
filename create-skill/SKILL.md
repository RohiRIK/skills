---
name: create-skill
description: "Use when creating, validating, testing, improving, or canonicalizing a Hermes skill. Routes to the correct workflow based on intent."
version: 3.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [skills, authoring, workflow, knowledge-management]
    related_skills: [hermes-agent-skill-authoring, hermes-agent]
usage_hint: "After loading this skill, immediately call skill_view(name='create-skill', file_path='references/new-skill.md') before taking any action."
---

# Create Skill

Framework for creating and maintaining production-ready Hermes skills.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **new-skill** | "create a skill", "new skill", "save this as a skill" | `references/new-skill.md` |
| **validate** | "validate skill", "check skill", "audit skill" | `references/validate.md` |
| **update** | "update skill", "add workflow", "fix skill", "patch skill" | `references/update.md` |
| **canonicalize** | "canonicalize", "fix skill structure", "restructure skill" | `references/canonicalize.md` |
| **test-skill** | "test skill", "does this skill work", "skill effectiveness" | `references/test-skill.md` |
| **improve-skill** | "improve skill", "skill output is weak", "skill needs work" | `references/improve-skill.md` |
| **optimize-description** | "skill not triggering", "trigger accuracy", "description routing" | `references/optimize-description.md` |
| **publish** | "publish skill", "submit to hub", "share skill", "make skill installable" | `references/publish.md` |

## Quick Reference

- Structure rules: `references/conventions.md`
- Writing philosophy: `references/writing-guidance.md`
- Skill types: `references/taxonomy.md`

## Gotchas

- SKILL.md > 50 lines means detail belongs in a reference file, not the body — slim it.
- A description without a `Use when` clause won't auto-route; a bare `Use when` with no WHAT clause undertriggers.
- Confusable skills need mutual `NOT FOR` triggers in their descriptions — the description is the router.
- New skills must emit a `## Gotchas` section and `## Examples` — the workflow templates include them; don't drop them.

## Examples

**Example 1: Create a skill from scratch**
```
User: "Create a skill for managing my recipes"
→ loads references/new-skill.md
→ design structure, write SKILL.md + references/ + scripts/ as needed
→ suggests test-skill to verify it helps
```

**Example 2: Skill isn't routing**
```
User: "The Research skill doesn't trigger on pentesting questions"
→ loads references/optimize-description.md
→ 20 should/shouldn't queries → re-test → rewrite description
```

**Example 3: Validate before publishing**
```
User: "Check if the verify skill is production-ready"
→ loads references/validate.md
→ run checklist, report gaps
```
