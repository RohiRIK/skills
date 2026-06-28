---
name: prompting
description: "Vendor-agnostic prompt-engineering standard library. Use when authoring or refining a prompt, system message, skill, agent instruction, or rule file."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [prompting]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='prompting', file_path='references/templates.md') before taking any action."
---

# Prompting

Standard library for prompt engineering. Vendor-agnostic core plus opt-in per-model addenda. Load before writing any system prompt, rule file, skill content, agent instruction, or user-facing prompt.

## Map

| File | Load when you need… |
|------|--------------------|
| core.md | The universal principles — start here |
| frameworks.md | A structural scaffold (COSTAR / RISEN / RTF) |
| reasoning.md | A reasoning technique to layer on a frame |
| templates.md | A fill-in prompt skeleton + section matrix |
| templating-system.md | Programmatic Handlebars template generation |
| `references/claude.md` | Claude target — XML steering, imperative calibration, thinking |
| `references/openai.md` | GPT / Copilot target |
| `references/gemini.md` | Gemini target |
| `references/how-to-use-and-principles.md` | Detailed usage, two-layer principle, tools |

## Gotchas

- This skill is the base; when porting from markdown-only houses, keep the XML steering for Claude — a wholesale swap to markdown-only is a downgrade.
- Reserve `CRITICAL`/`MUST`/`NEVER` for genuine safety gates; forceful language makes eager models overtrigger (see `references/claude.md`).

## Examples

**Example 1: Author a skill prompt**
```
User: "word this SKILL.md well"
→ Core.md principles + a Frameworks.md frame (RISEN) + references/claude.md calibration
```

**Example 2: Render a templated prompt**
```
User: "build an agent roster prompt"
→ Primitives/Roster.hbs + Data/Agents.yaml via scripts/render-template.ts
```
