# Create Skill Workflow

Create a new production-ready Hermes skill with the correct structure.

## Prerequisites

- Task/pattern identified that warrants a skill
- User has approved creating the skill

> **Sequential only — never create skills in parallel.**
> Create one skill fully (SKILL.md → references/ → scripts/ → validate) before starting the next.
> Parallel creation causes cross-contamination of file paths and missed validation.

## Steps

### Step 1: Check for existing skill

Before creating, scan for a skill that already covers the topic:

```python
skills_list()
```

If a close match exists — prefer extending it over creating a new sibling. Load the existing skill and use `references/update.md` instead.

### Step 2: Read the Canon

Read these reference files before building:
- `references/conventions.md` — structure rules (lowercase-hyphens, folder layout, subdirs)
- `references/writing-guidance.md` — principles, BPE, description best practices
- `references/taxonomy.md` — the 9 skill types

Then study one canonical example already in the skills directory (e.g. the `verify` skill or the `test-driven-development` skill).

### Step 3: Understand the Request

Ask the user: What does the skill do? What should trigger it? What workflows does it need?

### Step 4: Classify the Skill Type

Classify against the 9 types in `references/taxonomy.md`. The type shapes structure — Type 1 is mostly gotchas; Type 7 needs safety gates; Type 5 ships templates.

### Step 5: BPE Check

Apply the bitter-lesson test: **"Would a smarter model make this skill unnecessary?"** Proceed if the skill provides knowledge the model can't derive (API quirks, org decisions) or tools it can't replicate (API calls, automation). Question it if it only orchestrates the model's reasoning. See `references/writing-guidance.md`.

### Step 6: Determine Category

Decide which category the skill belongs to: `software-development`, `devops`, `creative`, etc. This maps to the subdirectory under `~/.hermes/skills/`.

### Step 7: Design the Structure

Decide which files the skill needs:

| Question | Answer → Action |
|---|---|
| Does it have multiple distinct procedures? | Yes → create `references/<workflow>.md` per procedure |
| Does it run automation? | Yes → create `scripts/<tool>.ts` |
| Does it have reference material (>30 lines)? | Yes → create `references/<context>.md` |
| Is it simple enough for one file? | Yes → SKILL.md only is fine |

### Step 8: Create SKILL.md (router, ≤ 50 lines)

Use this template — note the required frontmatter fields and the `## Gotchas` section:

```yaml
---
name: skill-name
description: "Use when <trigger>. <one-line behavior>. NOT FOR <confusable alternative>."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [tag1, tag2]
    related_skills: [related-skill]
usage_hint: "After loading this skill, immediately call skill_view(name='skill-name', file_path='references/primary-workflow.md') before taking any action."
---

# Skill Title

One-line description.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **workflow-name** | "trigger phrase" | `references/workflow-name.md` |

## Quick Reference

- Detail: `references/context-file.md`

## Gotchas

- Known failure mode, API quirk, non-obvious ordering — accumulate after every failure

## Examples

**Example 1: Common use case**
```
User: "[typical request]"
→ loads references/workflow-name.md
→ [what happens]
```
```

Create via:
```python
skill_manage(
  action='create',
  name='skill-name',
  category='software-development',
  content='[full SKILL.md content]'
)
```

### Step 9: Write Reference Files

For each workflow in the routing table, create `references/<name>.md`:

```python
skill_manage(
  action='write_file',
  name='skill-name',
  file_path='references/workflow-name.md',
  file_content='[workflow content]'
)
```

Each reference file must be a **complete standalone procedure** — someone should be able to execute it without reading SKILL.md.

Format: Prerequisites → numbered Steps with exact commands → Exit Criteria.

### Step 10: Write Scripts (if needed)

For executable automation, create `scripts/<name>.ts`:

```python
skill_manage(
  action='write_file',
  name='skill-name',
  file_path='scripts/tool-name.ts',
  file_content='[bun TS script content]'
)
```

Script must:
- Have usage comment at top (`#!/usr/bin/env bun`)
- Accept `--help` flag
- Exit 0 (success) or exit 1 (failure)
- Print result to stdout, errors to stderr

### Step 11: Add usage_hint to SKILL.md

Every skill with reference files MUST include a `usage_hint` in frontmatter that names the primary reference file to load immediately:

```yaml
usage_hint: "After loading this skill, immediately call skill_view(name='skill-name', file_path='references/primary-workflow.md') before taking any action."
```

This is the mechanism that forces Hermes to load the reference — without it, Hermes may act from SKILL.md alone and miss critical steps.

### Step 12: Validate

Load `references/validate.md` and run it against the new skill:

```python
skill_view(name='skill-name')
```

Run the full validation checklist.

### Step 13: Suggest Effectiveness Testing

Offer to run `references/test-skill.md` (does the skill help vs baseline?) and `references/optimize-description.md` (does it route reliably?).

## Cross-Profile Skill Creation

When creating a skill for a **different profile** (e.g. `bob-the-second-bot`):

- `skill_manage(action='create')` always targets the **current** profile — it cannot write to another profile's skills directory.
- Use `write_file(path='~/.hermes/profiles/<profile>/skills/<category>/<name>/SKILL.md', cross_profile=True)` instead.
- Same for reference files and scripts — all need `cross_profile=True`.
- Validate by running a one-shot query under the target profile:
  ```bash
  <profile-name> chat -q "Load the <skill-name> skill and confirm you can see it."
  ```
- The target profile's gateway needs a restart to pick up new skills in its skill list.

## Exit Criteria

- SKILL.md loads without errors via `skill_view`
- `usage_hint` present and points to the correct primary reference file
- All reference files exist and are reachable via `skill_view(name, file_path)`
- All scripts run without errors: `bun ~/.hermes/skills/<category>/<name>/scripts/<tool>.ts --help`
- Full validation checklist passes
- No `workflows/` or `tools/` directories used (Hermes only allows `references/`, `scripts/`, `templates/`, `assets/`)
