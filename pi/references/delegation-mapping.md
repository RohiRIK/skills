# Pi Delegation

## Detailed Description

This skill runs when you type `/pi <task>`, and Claude may also auto-invoke it when a task should be delegated to Pi. To make it manual-only again, add `disable-model-invocation: true` to the frontmatter and drop the `USE WHEN` clause from the description.

## How Delegation Maps to Claude Code Tools

Pi runs as a subprocess. Orchestrate it with native tools:

| Need | Tool |
|------|------|
| Bounded one-shot task (waits for result) | `Bash` (foreground) |
| Long / multi-file task | `Bash` with `run_in_background: true` |
| Watch a backgrounded run | `BashOutput` (poll) or `Monitor` (block until done) |
| Working directory | Pi has **no `--dir`** — run from the target dir (`cd <path> && …`) |

Always wrap runs in `timeout` (see reference.md → Timeouts) so a stalled run self-kills instead of hanging the session.

## Quick Reference

- Flags, modes, install, auth, troubleshooting: read reference.md.
- Preflight `pi --version` and confirm a provider/API key before the first run.
- Default to **print mode** `pi -p '<prompt>'` (non-interactive, prints final answer, exits). Never start the bare TUI (`pi` with no `-p`/`--mode`) — it is interactive and will hang this session.
- Non-interactive modes ignore project-local context unless you pass `-a`/`--approve`.
