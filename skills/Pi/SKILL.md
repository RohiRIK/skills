---
name: Pi
description: "Delegate a coding, refactor, or PR-review task to the Pi (pi.dev) CLI as an autonomous worker. USE WHEN delegating such a task to Pi, or running the pi CLI."
category: delegation
effort: medium
argument-hint: [task description]
---

# Pi

Delegate work to the [Pi](https://pi.dev) coding agent CLI (`pi`, from
earendil-works) — a provider-agnostic autonomous agent — and orchestrate it from
this session via `Bash`.

This skill runs when you type `/pi <task>`, and Claude may also auto-invoke it when
a task should be delegated to Pi. To make it manual-only again, add
`disable-model-invocation: true` to the frontmatter and drop the `USE WHEN` clause
from the description.

Task to delegate: **$ARGUMENTS**

## How delegation maps to Claude Code tools

Pi runs as a subprocess. Orchestrate it with native tools:

| Need | Tool |
|------|------|
| Bounded one-shot task (waits for result) | `Bash` (foreground) |
| Long / multi-file task | `Bash` with `run_in_background: true` |
| Watch a backgrounded run | `BashOutput` (poll) or `Monitor` (block until done) |
| Working directory | Pi has **no `--dir`** — run from the target dir (`cd <path> && …`) |

Always wrap runs in `timeout` (see `Reference.md` → Timeouts) so a stalled run
self-kills instead of hanging the session.

## Workflow Routing

Read `$ARGUMENTS`, classify intent, load the matching workflow.

| Intent | Trigger words | File |
|--------|---------------|------|
| Implement / refactor / fix | "add", "build", "refactor", "fix", "implement" | `Workflows/Delegate.md` |
| Review a PR or diff | "review PR", "review pr #", "review diff" | `Workflows/ReviewPR.md` |

## Quick Reference

- Flags, modes, install, auth, troubleshooting: read `Reference.md`.
- Preflight `pi --version` and confirm a provider/API key before the first run.
- Default to **print mode** `pi -p '<prompt>'` (non-interactive, prints final
  answer, exits). Never start the bare TUI (`pi` with no `-p`/`--mode`) — it is
  interactive and will hang this session.
- Non-interactive modes ignore project-local context unless you pass `-a`/`--approve`.

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
