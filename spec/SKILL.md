---
name: spec
description: "Explores code + LTM, then writes acceptance criteria. Use when defining what to build before planning."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='spec', file_path='references/explore-and-spec.md') before taking any action."
---


# Spec

Before writing a spec, explore the codebase and recall prior decisions from LTM. Produces acceptance criteria that feed directly into `/plan`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **ExploreAndSpec** | "spec", "define what to build", "requirements", "before plan" | `references/explore-and-spec.md` |

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
- For high-stakes work use `--deep` (runs IterativeDepth/Explore first) so criteria cover failure, security, and integration lenses, not just the happy path.
