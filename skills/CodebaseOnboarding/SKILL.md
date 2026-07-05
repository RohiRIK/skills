---
name: CodebaseOnboarding
description: "Analyze an unfamiliar codebase and produce an onboarding guide — architecture map, entry points, conventions, starter CLAUDE.md. USE WHEN joining a new project or onboarding a repo."
category: workflow
effort: medium
---

# CodebaseOnboarding

Systematically analyze an unfamiliar codebase and produce a structured onboarding guide plus a starter `CLAUDE.md`. For developers joining a project or setting up Claude Code in an existing repo.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Onboard** | "onboard me", "help me understand this codebase", "walk me through this repo", "generate a CLAUDE.md" | `Workflows/Onboard.md` |

Partial runs: "generate a CLAUDE.md" → phases 1-3 + CLAUDE.md only; "update the CLAUDE.md" → read existing, phases 1-3, merge with changes marked.

## Quick Reference

| Need | Load |
|------|------|
| The 4 phases (recon → architecture → conventions → artifacts) | `Workflows/Onboard.md` |
| Onboarding guide template | `Templates/OnboardingGuide.md` |
| Starter CLAUDE.md template | `Templates/StarterClaudeMd.md` |

## Gotchas

- Don't read everything — reconnaissance is Glob/Grep; Read only resolves ambiguous signals.
- Don't trust the README's architecture claims over the code — verify entry points and data flow against source.
- Existing `CLAUDE.md` gets enhanced, never replaced; preserve project-specific instructions and mark what changed.
- The starter CLAUDE.md captures the non-obvious (conventions, gotchas, build quirks) in <100 lines — not the file tree.
- Can't confidently detect a convention → say so; a flagged unknown beats a wrong answer.

## Examples

**Example 1:** "Onboard me to this codebase" → full 4-phase run → guide in conversation + `CLAUDE.md` at project root.

**Example 2:** "Generate a CLAUDE.md for this project" → phases 1-3 → project-specific `CLAUDE.md` only.

**Example 3:** "Update the CLAUDE.md with current conventions" → read existing → phases 1-3 → merged file, additions marked.
