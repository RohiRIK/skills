---
name: reflect
description: "Self-rate the just-finished output on five axes with evidence, then fix any gap scored ≤3. Use when a non-trivial task finishes — 3+ files, a multi-step workflow, or 3+ debug"
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [quality]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='reflect', file_path='references/run-reflect.md') before taking any action."
---

# Reflect

After a non-trivial task, pause and rate your own output on five axes — accuracy, completeness, clarity, actionability, conciseness — with concrete evidence per axis. Every score below 5 cites the specific gap, and anything fixable in under 30 seconds gets fixed immediately.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunReflect** | "reflect", "rate yourself", "how good was that?", end of a non-trivial task | `references/run-reflect.md` |

## Gotchas

- Score each axis independently; don't pick an overall feeling and backfill the parts.
- Every sub-5 score must cite the exact gap — "show the gap, don't just name it".
- The bias is to over-score your own output; if you can't cite evidence for a 5, it isn't a 5.

## Examples

**Example 1: After a multi-file change**
```
User finishes a feature spanning 4 files
→ Invokes RunReflect
→ Scorecard with evidence; Completeness=4 flags a missing timeout case → fixed inline
```

**Example 2: Explicit request**
```
User: "rate yourself on that"
→ RunReflect → 5-axis scorecard + overall + top gap with fix
```

**Example 3: Inside a loop**
```
Iterate pass completes ACT + VERIFY
→ Reflect runs → score recorded in .agent-state.md; ≥4.5 contributes to the exit check
```
