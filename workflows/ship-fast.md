---
type: Workflow
title: Ship fast
description: Clear-enough scope; move fast and discover the details mid-flight.
tags: [build-ship, quick]
chain: "Spec → Build → Reflect → Simplify → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest"
---

# Workflow: ship-fast

Move fast — explore while you build. Scope is clear enough to start; you'll discover the details as you go. Entry: `Spec`.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill to invoke** (load it with the Skill tool), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Spec → Build → Reflect → Simplify → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest
```

## Steps

1. **Spec** — quick pass before any non-trivial change; keep it light, this is the fast lane.
2. **Build** — write the change.
3. **Reflect** — self-eval the result, record the score in `.agent-state.md`.
4. **Simplify** — flatten nesting, drop dead abstraction in the diff.
5. **Verify** — gate (optional on small changes).
6. **GitHubOps:CommitPush** then **GitHubOps:PullRequest** — ship.

## If you came from the command version

| Old command | Portable skill |
|-------------|----------------|
| `/plan` | `Spec` |
| `IMPLEMENT`, `/build` | `Build` |
| `/capture` | `Reflect` |
| `/simplify` | `Simplify` |
| `/verify` | `Verify` |
| `/commit-push-pr` | `GitHubOps:CommitPush` + `GitHubOps:PullRequest` |

## When to use

You have a task and want to move; you'll figure out specifics mid-flight. When you know exactly what to build up front → **spec-to-ship**.
