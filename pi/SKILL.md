---
name: pi
description: "Delegate a coding, refactor, or PR-review task to the Pi (pi.dev) CLI as an autonomous worker. Use when delegating such a task to Pi, or running the pi CLI."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [delegation]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='pi', file_path='references/delegate.md') before taking any action."
---

# Pi

Delegate work to the [Pi](https://pi.dev) coding agent CLI (`pi`, from earendil-works) — a provider-agnostic autonomous agent — and orchestrate it from this session via `Bash`.

Task to delegate: **$ARGUMENTS**

## Workflow Routing

Read `$ARGUMENTS`, classify intent, load the matching workflow.

| Intent | Trigger words | File |
|--------|---------------|------|
| Implement / refactor / fix | "add", "build", "refactor", "fix", "implement" | `references/delegate.md` |
| Review a PR or diff | "review PR", "review pr #", "review diff" | `references/review-pr.md` |

## Gotchas
- Pi is an autonomous worker — give it acceptance criteria and verify; do not assume the task is done because it exited 0.
- Non-zero exit writes failure context to `.agent-state.md` for replanning (no blind retry).

## Examples
**Example 1: Delegate a refactor**
```
User: "have pi migrate these tests to vitest"
→ Delegate workflow → runs autonomously → result verified
```
**Example 2: PR review**
```
User: "pi review this branch"
→ ReviewPR workflow → findings summarized
```
