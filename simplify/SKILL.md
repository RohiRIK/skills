---
name: simplify
description: "Post-implementation dead-code cleanup. Use when running /simplify after finishing a feature or fix."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [quality]
    related_skills: []
---


# Simplify

Invoke the `code-simplifier` agent on files changed in this session.
See `references/overview.md` for scope rules, agent boundaries, and workflow position.

## Three Phases

| Phase | What happens |
|-------|-------------|
| 1. Static Analysis | Dead code, unused imports, type baseline |
| 2. Simplification | Nesting, naming, TS idioms, constants |
| 3. Verification | `bun tsc --noEmit` + `bun test` |

## Gotchas

- Scope is the session diff, not the repo — for repo-wide dead-code use a dedicated cleanup pass; widening scope here risks unrelated churn.
- Verify behaviour is unchanged after simplifying; "simpler" that alters semantics is a regression, not a cleanup.

## Examples

**Example 1: After a feature**
```
User: "/simplify"
→ flatten nesting, remove dead branches, drop needless abstraction in changed files
```

**Example 2: Post-fix tidy**
```
User: "clean up what I just changed"
→ scoped to the diff → verified no behaviour change
```
