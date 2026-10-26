---
name: Spec
description: "Explores code and project memory, then writes acceptance criteria. USE WHEN defining what to build before planning."
category: workflow
effort: medium
domain: dev
tuned-for: claude-5.5
tuned-on: 2026-10-14
---

# Spec

Before writing a spec, explore the codebase and recall prior decisions from project memory. Produces acceptance criteria that feed directly into `Build`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **ExploreAndSpec** | "spec", "define what to build", "requirements", "before plan" | `Workflows/ExploreAndSpec.md` |

## Examples

**Example 1: New feature on existing project**
```
User: "/spec add rate limiting to the API"
→ Recalls project memory for auth/API decisions
→ Explores existing middleware and route files
→ Writes spec with acceptance criteria into specs/
→ Hands off to Build
```

**Example 2: Bug investigation**
```
User: "/spec the session token expires too early"
→ Recalls project memory for session/auth gotchas
→ Explores auth files and session logic
→ Writes spec with reproduce steps and acceptance criteria
→ Hands off to Test:ProveIt
```

## Gotchas

- Acceptance criteria must be testable — "works well" is not a criterion; "returns 404 for unknown id" is.
- For high-stakes work use `--deep` (runs Iterate/RunLenses first) so criteria cover failure, security, and integration lenses, not just the happy path.
