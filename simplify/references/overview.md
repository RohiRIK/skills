# Simplify — Overview

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
