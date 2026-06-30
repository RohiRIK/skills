---
type: Workflow
title: Onboard a codebase
description: Get productive in an unfamiliar repo fast, then make the first change.
tags: [build-ship]
chain: "CodebaseOnboarding → Research(fill gaps) → /spec (first change) → spec-to-ship"
---

# Workflow: onboard-codebase

Get productive in an unfamiliar repo fast, then make the first change.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
CodebaseOnboarding → Research(fill gaps) → /spec (first change) → spec-to-ship
```

1. **CodebaseOnboarding** — architecture map, entry points, conventions, a starter `CLAUDE.md`.
2. **Research** — dig into any subsystem the onboarding flags as unclear (delegates + web for the stack's docs).
3. **/spec** — write acceptance criteria for your first change against the real conventions.
4. Hand to **spec-to-ship** to build → verify → ship.

## When to use

- Joining a new project or inheriting a codebase.
- First OSS contribution to an unfamiliar repo.

## Tip

Commit the generated `CLAUDE.md` early — every later chain in the repo benefits from it being auto-loaded.
