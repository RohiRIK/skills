# OpenCode Delegation

## Detailed Description

This skill runs when you type `/opencode <task>`, and Claude may also auto-invoke it when a task should be delegated to OpenCode. To make it manual-only again, add `disable-model-invocation: true` to the frontmatter and drop the `USE WHEN` clause from the description.

## How Delegation Maps to Claude Code Tools

OpenCode runs as a subprocess. Orchestrate it with native tools:

| Need | Tool |
|------|------|
| Bounded one-shot task (waits for result) | `Bash` (foreground) |
| Long / multi-file task | `Bash` with `run_in_background: true` |
| Watch a backgrounded run | `BashOutput` (poll) or `Monitor` (block until done) |
| Working directory | `opencode run … --dir <path>` (preferred over `cd`) |

Always wrap runs in `timeout` (see reference.md → Timeouts) so a stalled run self-kills instead of hanging the session. Default model when none is given: `opencode/deepseek-v4-flash-free`.

## Quick Reference

- Flags, models, install, binary pinning, troubleshooting: read reference.md.
- Always preflight `opencode --version` and confirm a provider before the first run.
- Default to `opencode run '<prompt>'` (non-interactive). Never start the bare TUI (`opencode` with no subcommand) — it is interactive and will hang this session.
