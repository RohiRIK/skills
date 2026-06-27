---
name: CreateSkill
description: "Create, validate, canonicalize, test, improve, and optimize-triggers for skills. USE WHEN create/new/validate/test/improve/canonicalize a skill, or a skill isn't triggering. NOT FOR TypeScript CLI generation (use CreateCLI)."
category: meta
effort: medium
---

# CreateSkill

The skill factory. Two tracks: **structure** (create, validate, update, canonicalize — conform to the canon) and **effectiveness** (test, improve, optimize triggers — make the skill actually help and route reliably). Every skill it produces is born loop-ready: `category`/`effort` frontmatter, a `## Gotchas` section, and the telemetry line.

Canon lives in context files: `Conventions.md` (structure), `Frontmatter.md` (tier + field reference), `WritingGuidance.md` (principles, BPE, public/private boundary), `Taxonomy.md` (the 9 skill types — classify before building).

## Workflow Routing

| Workflow | Track | Trigger | File |
|----------|-------|---------|------|
| **CreateSkill** | structure | "create a new skill", "scaffold skill" | `Workflows/CreateSkill.md` |
| **ValidateSkill** | structure | "validate skill", "check skill structure" | `Workflows/ValidateSkill.md` |
| **UpdateSkill** | structure | "update skill", "add workflow" | `Workflows/UpdateSkill.md` |
| **CanonicalizeSkill** | structure | "canonicalize", "fix skill structure" | `Workflows/CanonicalizeSkill.md` |
| **TestSkill** | effectiveness | "test skill", "does this skill work" | `Workflows/TestSkill.md` |
| **ImproveSkill** | effectiveness | "improve skill", "skill output is weak" | `Workflows/ImproveSkill.md` |
| **OptimizeDescription** | effectiveness | "skill not triggering", "trigger accuracy" | `Workflows/OptimizeDescription.md` |

## Quick Reference

- Classify the skill against the 9 types (`Taxonomy.md`) before building — type shapes structure.
- Every skill needs a `## Gotchas` section — "the highest information density in any skill". Gotchas accumulate after every failure.
- Run the **BPE check** before finalizing: "would a smarter model make this skill unnecessary?" Keep anti-fragile (gotchas, tool wrappers, verification); question fragile (reasoning scaffolds, format parsers).
- Progressive disclosure: frontmatter → SKILL.md body → context files loaded on demand.
- Public (`TitleCase`) vs private (`_ALLCAPS`) naming is the release boundary — see `WritingGuidance.md`.

## Gotchas

- SKILL.md > 50 lines means detail belongs in a context file, not the body — slim it.
- A description without a `USE WHEN` clause won't auto-route (Tier C/D); a bare `USE WHEN` with no WHAT clause undertriggers.
- Confusable skills need mutual `NOT FOR` triggers in their descriptions — the description is the router.
- New skills must emit `category`/`effort`, a `## Gotchas` section, and the telemetry line — the CreateSkill workflow templates already include them; don't drop them.

## Examples

**Example 1: Create a skill from scratch**
```
User: "Create a skill for managing my recipes"
→ CreateSkill workflow → classify type → scaffold TitleCase dir + SKILL.md + Workflows/
→ Suggests TestSkill to verify it helps
```

**Example 2: Skill isn't routing**
```
User: "The Research skill doesn't trigger on pentesting questions"
→ OptimizeDescription → 20 should/shouldn't queries → re-test → rewrite description
```

**Example 3: Validate before publishing**
```
User: "check the Iterate skill is canon-compliant"
→ ValidateSkill → naming, frontmatter (incl. category/effort), Gotchas, structure → COMPLIANT / NON-COMPLIANT
```
