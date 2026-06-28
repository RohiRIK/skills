# Agy Delegation Guide

## How delegation maps to Claude Code tools

Agy runs as a subprocess. Orchestrate it with native tools:

| Need | Tool |
|------|------|
| Bounded one-shot task (waits for result) | `Bash` (foreground) |
| Long / multi-file task | `Bash` with `run_in_background: true` |
| Watch a backgrounded run | `BashOutput` (poll) or `Monitor` (block until done) |
| Working directory | `agy … --add-dir <path>` (adds dir to the workspace; repeatable) |

Agy print mode has a built-in cap (`--print-timeout`, default 5m). Still wrap runs
in an outer `timeout` (see reference.md → Timeouts) as a hard backstop.

## Quick Reference

- Flags, models, install, auth, image setup, troubleshooting: read reference.md.
- Preflight `agy --version` and confirm auth before the first run.
- Default to **print mode** `agy -p '<prompt>'` (non-interactive, prints, exits).
  Never start the bare TUI (`agy` with no `-p`) — it is interactive and will hang
  this session.

## Task delegation

Read `$ARGUMENTS`, classify intent, load the matching workflow.

| Intent | Trigger words | File |
|--------|---------------|------|
| Generate / edit an image | "image", "picture", "render", "logo", "mockup", "generate an image" | `references/generate-image.md` |
| Implement / refactor / fix | "add", "build", "refactor", "fix", "implement" | `references/delegate.md` |
| Review a PR or diff | "review PR", "review pr #", "review diff" | `references/review-pr.md` |
