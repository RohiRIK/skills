---
type: Workflow
title: API feature
description: A backend or API change, security-gated from design to PR.
tags: [build-ship]
chain: "BackendDesign(ref) → /spec → /build → Test → SecurityReview → GitHubOps:PullRequest"
---

# Workflow: api-feature

A backend / API change, security-gated.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
BackendDesign(ref) → /spec → /build → Test → SecurityReview → GitHubOps:PullRequest
```

1. **BackendDesign** — reference for API shape, database schema, server architecture.
2. **/spec** — acceptance criteria (incl. error contracts, auth boundaries).
3. **/build** — implement against the spec.
4. **Test** — unit **+ integration** (endpoints, DB ops).
5. **SecurityReview** — mandatory: input validation, authz, injection, secret handling, rate limiting.
6. **PR**.

## Add-ons

- Containerized? Slot **DockerPatterns** in before ship.
- Postgres-heavy? Pair with the `database-reviewer` agent on migrations.

## When to use

New endpoint, schema/migration change, server-side feature.

## Gate

SecurityReview is non-negotiable for anything touching user input, auth, or data — that's most API work.
