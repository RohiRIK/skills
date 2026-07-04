---
name: Agy
description: "Delegate a coding, refactor, PR-review, or image task to the Antigravity CLI (agy) as an autonomous worker. USE WHEN delegating such a task to agy/Antigravity, or running the agy CLI."
category: delegation
effort: medium
argument-hint: [task description]
---

# Agy

Delegate work to the [Antigravity CLI](https://antigravity.google) (`agy`,
Google's Gemini-powered terminal agent) and orchestrate it from this session via
`Bash`. Its standout feature is **image generation** via Nano Banana — see
`Workflows/GenerateImage.md`.

This skill runs when you type `/agy <task>`, and Claude may also auto-invoke it when
a task should be delegated to Antigravity/agy. To make it manual-only again, add
`disable-model-invocation: true` to the frontmatter and drop the `USE WHEN` clause
from the description.

Task to delegate: **$ARGUMENTS**

## How delegation maps to Claude Code tools

Agy runs as a subprocess. Orchestrate it with native tools:

| Need | Tool |
|------|------|
| Bounded one-shot task (waits for result) | `Bash` (foreground) |
| Long / multi-file task | `Bash` with `run_in_background: true` |
| Watch a backgrounded run | `BashOutput` (poll) or `Monitor` (block until done) |
| Working directory | `agy … --add-dir <path>` (adds dir to the workspace; repeatable) |

Agy print mode has a built-in cap (`--print-timeout`, default 5m). Still wrap runs
in an outer `timeout` (see `Reference.md` → Timeouts) as a hard backstop.

## Workflow Routing

Read `$ARGUMENTS`, classify intent, load the matching workflow.

| Intent | Trigger words | File |
|--------|---------------|------|
| Generate / edit an image | "image", "picture", "render", "logo", "mockup", "generate an image" | `Workflows/GenerateImage.md` |
| Implement / refactor / fix | "add", "build", "refactor", "fix", "implement" | `Workflows/Delegate.md` |
| Review a PR or diff | "review PR", "review pr #", "review diff" | `Workflows/ReviewPR.md` |

## Quick Reference

- Flags, models, install, auth, image setup, troubleshooting: read `Reference.md`.
- Preflight `agy --version` and confirm auth before the first run.
- Default to **print mode** `agy -p '<prompt>'` (non-interactive, prints, exits).
  Never start the bare TUI (`agy` with no `-p`) — it is interactive and will hang
  this session.

## Gotchas

- `agy` is an autonomous worker, not a deterministic API — give it an exact task + acceptance criteria and verify the result; do not assume it did what was asked.
- On non-zero worker exit the failure context is written to `.agent-state.md` (see the workflow) so a `/iterate` or `Orchestrate` pass replans instead of blind-retrying.
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
