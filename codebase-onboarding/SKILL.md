---
name: codebase-onboarding
description: "Analyze an unfamiliar codebase and produce an onboarding guide — architecture map, entry points, conventions, starter CLAUDE.md. Use when joining a new project or onboarding a repo."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
---

# Codebase Onboarding

Systematically analyze an unfamiliar codebase and produce a structured onboarding guide. Designed for developers joining a new project or setting up Claude Code in an existing repo for the first time.

## Workflow Routing

| Step | Action | Reference |
|------|--------|-----------|
| 1 | Determine when to trigger | [when-to-use.md](references/when-to-use.md) |
| 2 | Run 4-phase workflow (recon → architecture → conventions → artifacts) | [workflow.md](references/workflow.md) |
| 3 | Apply best practices, avoid anti-patterns | [best-practices.md](references/best-practices.md) |
| 4 | Produce Onboarding Guide + Starter CLAUDE.md | [workflow.md § Phase 4](references/workflow.md#phase-4-generate-onboarding-artifacts) |

## Gotchas

- Don't trust a README's architecture claims over the code — verify entry points and data flow against the actual source before writing the guide.
- The starter CLAUDE.md should capture what's non-obvious (conventions, gotchas, build quirks), not restate what the file tree already shows.
- If a repo has shallow git history (`git clone --depth 1`), skip git convention detection and note it explicitly.

## Examples

**"Onboard me to this codebase"** → Run full 4-phase workflow → print Onboarding Guide + write `CLAUDE.md` to project root.

**"Generate a CLAUDE.md for this project"** → Run Phases 1-3, skip Onboarding Guide, produce only CLAUDE.md.

**"Update the CLAUDE.md with current project conventions"** → Read existing CLAUDE.md, run Phases 1-3, merge new findings with additions clearly marked.
