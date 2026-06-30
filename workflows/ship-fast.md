---
type: Workflow
title: Ship fast
description: Clear-enough scope; move fast and discover the details mid-flight.
tags: [build-ship, quick]
chain: "[observe] → /plan → IMPLEMENT → /capture → /simplify → /verify → /commit-push-pr"
---

# Workflow: ship-fast

Move fast — explore while you build. Scope is clear enough to start; you'll discover the details as you go. Entry: `/plan`.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
[observe] → /plan → IMPLEMENT (auto-accept: Shift+Tab×2) → /capture → /simplify → /verify → /commit-push-pr
```

## Steps

1. **[observe]** — auto-fires (PrePlan hook); injects git state + topic-scoped LTM recalls. You don't call it.
2. **/plan** — before any non-trivial change. After it confirms, switch to **auto-accept** (Shift+Tab×2) for the implement burst.
3. **IMPLEMENT** — write the change.
4. **/capture** — save session context + fire `/learn` in one shot.
5. **/simplify** — flatten nesting, drop dead abstraction in the diff.
6. **/verify** — gate (optional on small changes).
7. **/commit-push-pr** — ship.

## Command → skill (this repo)

| `/command` | Skill | `/command` | Skill |
|-----------|-------|-----------|-------|
| `/plan` | plan | `/verify` | Verify |
| `/simplify` | Simplify | `/capture` | `openltm:memory learn --save-context` |
| `/commit-push-pr` | GitHubOps:CommitPush | | |

## When to use

You have a task and want to move; you'll figure out specifics mid-flight. When you know exactly what to build up front → **spec-to-ship**.
