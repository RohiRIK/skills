---
name: hygiene
description: "Use when audit ~/.claude for git, skill, code, and rules hygiene issues."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [quality]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='hygiene', file_path='references/auto-fix.md') before taking any action."
---

# Hygiene

Audits `~/.claude` across 5 dimensions and auto-fixes safe problems.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunHygiene** | `/hygiene` | `references/run-hygiene.md` |
| **AutoFix** | `/hygiene --fix` | `references/auto-fix.md` |

## Gotchas
- Repo hygiene is not a build gate — for build/type/test correctness use `Verify`; this skill audits git/skill/code/rules hygiene of `~/.claude`.
- Report before auto-fixing; some "issues" are intentional local config.

## Examples
**Example 1: Health check**
```
User: "check my ~/.claude hygiene"
→ RunHygiene → flags stale symlinks, malformed skills, rule drift
```
**Example 2: Auto-fix**
```
User: "fix the safe ones"
→ AutoFix → applies low-risk fixes, lists the rest
```
