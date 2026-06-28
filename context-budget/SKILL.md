---
name: context-budget
description: "Audit context-window consumption across agents, skills, MCP servers, and rules, and produce prioritized token-savings recommendations. Use when context feels bloated or you want to cut token usage."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [meta, skills]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='context-budget', file_path='references/context-budget-workflow.md') before taking any action."
---

# Context Budget

Analyze token overhead across every loaded component and surface actionable optimizations to reclaim context space.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **context-budget-workflow** | "/context-budget", "audit context", "token usage" | `references/context-budget-workflow.md` |

## Quick Reference

- Token estimation: `words × 1.3` for prose, `chars / 4` for code-heavy files
- MCP is the biggest lever: each tool schema costs ~500 tokens
- Agent descriptions load always — even if never invoked

## Gotchas

- Measure before cutting — a skill's frontmatter cost (always loaded) differs from its body cost (loaded on invocation); target the always-on consumers first.
- Disabling a skill that another skill composes with breaks the dependent; check the composition map before recommending removal.

## Examples

**Basic audit**
```
User: /context-budget
Skill: Scans setup → flags 3 heavy agents, 14 MCP servers (3 CLI-replaceable)
       Top saving: remove 3 MCP servers → -27,500 tokens (47% overhead reduction)
```

**Pre-expansion check**
```
User: I want to add 5 more MCP servers, do I have room?
Skill: Current overhead 33% → adding 5 servers pushes to 45%
       Recommendation: remove 2 CLI-replaceable servers first
```
