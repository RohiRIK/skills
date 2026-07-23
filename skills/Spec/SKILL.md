---
name: Spec
description: "Explores code + LTM, then writes acceptance criteria. USE WHEN defining what to build before planning."
category: workflow
effort: medium
domain: dev
---

# Spec

Before writing a spec, explore the codebase and recall prior decisions from LTM. Produces acceptance criteria that feed directly into `/plan`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **ExploreAndSpec** | "spec", "define what to build", "requirements", "before plan" | `Workflows/ExploreAndSpec.md` |

## Examples

**Example 1: New feature on existing project**
```
User: "/spec add rate limiting to the API"
→ Recalls LTM for auth/API decisions
→ Explores existing middleware and route files
→ Writes spec with acceptance criteria into specs/
→ Hands off to /plan
```

**Example 2: Bug investigation**
```
User: "/spec the session token expires too early"
→ Recalls LTM for session/auth gotchas
→ Explores auth files and session logic
→ Writes spec with reproduce steps and acceptance criteria
→ Hands off to /test (ProveIt)
```

## Gotchas

- Acceptance criteria must be testable — "works well" is not a criterion; "returns 404 for unknown id" is.
- For high-stakes work use `--deep` (runs Iterate/RunLenses first) so criteria cover failure, security, and integration lenses, not just the happy path.
