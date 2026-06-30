---
type: Workflow
title: Spec to ship
description: Know exactly what to build; spec-driven build from criteria to PR.
tags: [build-ship, heavy]
chain: "/spec → /plan → /build (or /dev) → /test → /simplify → /capture → /verify → /commit-push-pr"
---

# Workflow: spec-to-ship

Spec-driven build — you know exactly what to build. Entry: `/spec`.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
/spec → /plan → /build (or /dev) → /test → /simplify → /capture → /verify → /commit-push-pr
```

## Steps

1. **/spec** — recall LTM + explore the codebase → acceptance criteria (one per task).
2. **/plan** — each task maps to one acceptance criterion.
3. **/build** (task-by-task, review between) **or /dev** (full automation, all tasks).
4. **/test** — regression sweep across all changed files.
5. **/simplify** — cleanup pass.
6. **/capture** — save context + `/learn`.
7. **/verify** — **mandatory before non-trivial PRs** (tsc → lint → tests → build → security → diff).
8. **/commit-push-pr** — ship.

## Command → skill (this repo)

| `/command` | Skill | `/command` | Skill |
|-----------|-------|-----------|-------|
| `/spec` | Spec | `/test` | Test |
| `/plan` | plan | `/simplify` | Simplify |
| `/build` | Build | `/verify` | Verify |
| `/dev` | dev | `/capture` | `openltm:memory learn --save-context` |
| `/commit-push-pr` | GitHubOps:PullRequest | | |

## Shortcuts

| Task | Path |
|------|------|
| Bug fix | `/test` → `/simplify` → `/capture` → `/verify` → `/commit-push-pr` |
| Small feature | `/plan` → `/build` → `/simplify` → `/capture` → `/verify` → `/commit-push-pr` |
| Non-trivial | full chain above with `/dev` |

## When to use

Scope is known and you want it spec-driven. Still exploring? → **ship-fast**.
