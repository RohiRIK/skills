---
name: open-code
description: "Delegate a coding, refactor, or PR-review task to the OpenCode CLI as an autonomous worker. Use when delegating such a task to OpenCode, or running the opencode CLI."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [delegation]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='open-code', file_path='references/delegate.md') before taking any action."
---

# OpenCode

Delegate work to the [OpenCode](https://opencode.ai) CLI — a provider-agnostic autonomous coding agent — and orchestrate it from this session via `Bash`.

Task to delegate: **$ARGUMENTS**

## Workflow Routing

Read `$ARGUMENTS`, classify intent, load the matching workflow.

| Intent | Trigger words | File |
|--------|---------------|------|
| Implement / refactor / fix | "add", "build", "refactor", "fix", "implement" | `references/delegate.md` |
| Review a PR or diff | "review PR", "review pr #", "review diff" | `references/review-pr.md` |

## Gotchas
- OpenCode runs autonomously — scope the task and verify the diff; treat its output as a worker's draft, not finished truth.
- Non-zero exit writes failure context to `.agent-state.md` so the next loop/orchestrate pass replans rather than repeating.

## Examples
**Example 1: Delegate a coding task**
```
User: "have opencode add pagination to the list endpoint"
→ Delegate workflow → runs autonomously → diff verified before reporting
```
**Example 2: PR review**
```
User: "opencode review this PR"
→ ReviewPR workflow → findings summarized
```
