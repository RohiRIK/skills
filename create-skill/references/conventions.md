# Create Skill — Conventions

Structural rules for all Hermes skills. Apply when creating, validating, or canonicalizing.

---

## Naming Convention

**All naming uses `lowercase-hyphens`.**

| Component | Format | Example |
|---|---|---|
| Skill directory | lowercase-hyphens | `build-loop`, `dev-workflow`, `create-skill` |
| Workflow files | lowercase-hyphens.md | `create-skill.md`, `run-gates.md` |
| Reference docs | lowercase-hyphens.md | `conventions.md`, `api-reference.md` |
| Tool files | lowercase-hyphens.ts | `verify-gates.ts`, `scaffold-capture.ts` |

**Never use:** `BuildLoop`, `build_loop`, `BUILD_LOOP`, `CreateSkill.md`

---

## Folder Structure
```
~/.hermes/skills/<category>/<name>/
├── SKILL.md                  ← router only, 30-50 lines max
├── AGENTS.md                 ← optional: dev conventions, version bump checklist
├── references/
│   ├── conventions.md        ← reference/context docs loaded on-demand
│   ├── main-workflow.md      ← full step-by-step execution workflows
│   └── alt-workflow.md       ← alternative flows
└── scripts/
    └── do-thing.ts           ← executable Bun TS scripts
```

**Hermes subdirectory constraints** — `skill_manage` only allows these subdirs:
- `references/` — all workflow docs, context files, guides, SOPs
- `scripts/` — executable scripts (Bun TS preferred: `.ts`, or `.sh`)
- `templates/` — reusable file templates
- `assets/` — images, static files

**Rules:**
- `SKILL.md` is a router — routes to `references/` files, does NOT contain execution instructions
- Workflows go in `references/<workflow-name>.md` — one file per workflow
- Tools/scripts go in `scripts/<tool-name>.ts` — Bun TS preferred
- Max depth: 2 levels — never go deeper

**AGENTS.md (optional):** Development conventions for the skill itself. Keeps SKILL.md clean: operational content only (how to USE), while AGENTS.md holds meta-development content (how to DEVELOP/MAINTAIN the skill). Hermes auto-loads AGENTS.md when working inside the skill directory.

**AGENTS.md belongs:**
- Version bump checklists (bump version → update CHANGELOG → update README badges/tables/counts → check live projects)
- Dev environment quirks (snap bun sandboxing, path constraints)
- Publishing/contribution guides
- Repo management rules (`.gitignore` patterns, public vs private, what to exclude)
- Instructions-to-self ("explain before executing", "use create-skill workflow for new tooling")
- Live project inspection guidance ("what can we improve?" means the project, not the skill)

**SKILL.md belongs:**
- Workflow routing table
- Tool/script usage with examples
- Operational pitfalls (things that break at runtime — gate-skipping, cron stagger overflow, variable naming)
- Template mappings, examples

**Rule of thumb:** if a pitfall is about *how the system behaves* → SKILL.md. If it's about *how to develop/maintain the skill* → AGENTS.md. User corrections like "this doesn't belong in SKILL.md" are a strong signal you mixed the two.

---

## Dynamic Loading Pattern

SKILL.md stays slim by offloading detail to other files.

| Layer | What it contains | When loaded |
|---|---|---|
| `SKILL.md` | Frontmatter, routing table, quick reference | On skill invocation |
| Root `.md` files | SOPs, conventions, reference guides | On-demand, cited in SKILL.md |
| `workflows/*.md` | Full execution procedures | When workflow is triggered |
| `tools/*.ts` | Runnable automation | When Hermes executes a step |

**SKILL.md should never exceed 50 lines.** If it does, move content to a workflow or reference file.

---

## Frontmatter Fields

### Required
```yaml
name: skill-name          # lowercase-hyphens, ≤64 chars
description: Use when ... # starts with "Use when", ≤1024 chars
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [tag1, tag2]
    related_skills: [other-skill]
```

### Optional
```yaml
platforms: [linux, macos, windows]
```

---

## Description Format

Always starts with `"Use when ..."` followed by the trigger and behavior.

| Good | Bad |
|---|---|
| `"Use when creating a new Hermes skill."` | `"Skill creation tool"` |
| `"Use when you're ready to commit. Runs the full pre-commit gate."` | `"verify, commit, quality, gates"` |
| `"Use when fixing a bug. Enforces RED-GREEN-REFACTOR."` | `"TDD workflow for bug fixes"` |

**Never:** keyword lists, more than 1024 chars, missing "Use when" prefix.

---

## Workflow File Format

Each `workflows/<name>.md` is a standalone execution document:

```markdown
# Workflow Name

Brief one-line description of what this workflow does.

## Prerequisites
What must exist before running this workflow.

## Steps

### Step 1: Do Thing
Description.

```bash
exact command here
```

### Step 2: Next Thing
...

## Exit Criteria
How you know the workflow completed successfully.
```

---

## Script File Format

Each `scripts/<name>.ts` is a standalone Bun TS script:

```typescript
#!/usr/bin/env bun
/**
 * tool-name.ts
 * One-line description of what this tool does.
 * Usage: bun ~/.hermes/skills/<category>/<name>/tools/<name>.ts [flags]
 */

// parse args, do work, exit with 0 (success) or 1 (failure)
// print actionable output to stdout
// print errors to stderr
```

**Conventions:**
- Always include usage comment at top
- Exit 0 = success, exit 1 = failure
- Stdout = result Hermes reads, stderr = errors
- Accept `--help` flag
- No side effects beyond the declared purpose
