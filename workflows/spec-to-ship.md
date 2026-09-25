---
type: Workflow
title: Spec to ship
description: Know exactly what to build; spec-driven build from criteria to PR.
tags: [build-ship, heavy]
chain: "Spec → Build → Test → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest"
---

# Workflow: spec-to-ship

Spec-driven build — you know exactly what to build. Entry: `Spec`.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill to invoke** (load it with the Skill tool), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Spec → Build → Test → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest
```

## Steps

1. **Spec** — explore the codebase + recall prior work → acceptance criteria (one per task).
2. **Build** — one task per pass, review between tasks.
3. **Test** — regression sweep across all changed files.
4. **Simplify** — cleanup pass.
5. **Reflect** — self-eval the result and record the score in `.agent-state.md`.
6. **Verify** — **mandatory before non-trivial PRs** (tsc → lint → tests → build → security → diff).
7. **GitHubOps:CommitPush** then **GitHubOps:PullRequest** — ship.

## If you came from the command version

| Old command | Portable skill |
|-------------|----------------|
| `/spec`, `/plan` | `Spec` |
| `/build`, `/dev` | `Build` |
| `/test` | `Test` |
| `/simplify` | `Simplify` |
| `/capture` | `Reflect` |
| `/verify` | `Verify` |
| `/commit-push-pr` | `GitHubOps:CommitPush` + `GitHubOps:PullRequest` |

## Shortcuts

| Task | Path |
|------|------|
| Bug fix | `Test` → `Simplify` → `Verify` → `GitHubOps:CommitPush` |
| Small feature | `Spec` → `Build` → `Simplify` → `Verify` → `GitHubOps:CommitPush` |
| Non-trivial | full chain above |

## When to use

Scope is known and you want it spec-driven. Still exploring? → **ship-fast**.
