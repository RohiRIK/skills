---
name: agy
description: "Delegate a coding, refactor, PR-review, or image task to the Antigravity CLI (agy) as an autonomous worker. Use when delegating such a task to agy/Antigravity, or running the agy CLI."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [delegation]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='agy', file_path='references/delegate.md') before taking any action."
---
# Agy

Delegate work to [Antigravity CLI](https://antigravity.google) (`agy`) and orchestrate via `Bash`.
For delegation mapping, flags, and full reference see `references/delegation-guide.md`.
Image generation via Nano Banana — see `references/generate-image.md`.

Task to delegate: **$ARGUMENTS**

## Workflow Routing

| Intent | Trigger words | File |
|--------|---------------|------|
| Generate / edit an image | "image", "picture", "render", "logo", "mockup" | `references/generate-image.md` |
| Implement / refactor / fix | "add", "build", "refactor", "fix", "implement" | `references/delegate.md` |
| Review a PR or diff | "review PR", "review pr #", "review diff" | `references/review-pr.md` |

## Gotchas

- `agy` is an autonomous worker, not a deterministic API — give it an exact task + acceptance criteria and verify the result.
- On non-zero worker exit the failure context is written to `.agent-state.md` so a `/iterate` pass replans instead of blind-retrying.
- Confirm the agy CLI is signed in before delegating; a stale OAuth fails silently mid-task.

## Examples

**Example 1: Delegate a refactor**
```
User: "have agy extract the auth logic into a module"
→ Delegate workflow → agy runs autonomously → result verified before reporting
```

**Example 2: Second opinion / image task**
```
User: "use agy to review this PR" / "generate a hero image with agy"
→ ReviewPR or GenerateImage workflow → monitored, result summarized
```
