---
name: Simplify
description: "Post-implementation dead-code cleanup. USE WHEN running /simplify after finishing a feature or fix."
category: quality
effort: low
disable-model-invocation: true
user-invocable: false
---

# Simplify

Invoke the `code-simplifier` agent on files changed in this session.

## Three Phases

| Phase | What happens |
|-------|-------------|
| 1. Static Analysis | Dead code, unused imports, type baseline |
| 2. Simplification | Nesting, naming, TS idioms, constants |
| 3. Verification | `bun tsc --noEmit` + `bun test` |

## Scope Rules

- Default: files in `git diff --name-only HEAD`
- With argument: specific file or directory passed to `/simplify`
- Never touch files outside the session diff without an explicit argument

## Agent Boundaries

| Need | Agent |
|------|-------|
| Post-implementation cleanup | `code-simplifier` (this) |
| Repo-wide dead code | `refactor-cleaner` |
| Security audit | `security-reviewer` |
| Final quality gate | `code-reviewer` |

## Workflow Position

```
/plan → implement → /capture → /simplify → /verify → /commit-push-pr
```

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
