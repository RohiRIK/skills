---
name: CreateHook
description: "Generate lifecycle hooks for AI agent runtimes (Claude Code, OpenCode, OpenClaw, Hermes Agent). USE WHEN writing, wiring, or debugging an event hook, plugin hook, or agent automation trigger."
category: meta
effort: medium
domain: dev
---

# CreateHook

Scaffold event-driven hooks that fire on agent lifecycle events (session start/end, pre/post tool call, pre/post LLM call) across four runtimes with unrelated hook mechanics. Detail lives in `RuntimeMap.md` (which runtime uses which event names, language, and discovery path) and `HookDesign.md` (idempotency, failure modes, security shared across all four).

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **ClaudeCode** | "Claude Code hook", "PreToolUse/PostToolUse", "settings.json hook" | `Workflows/ClaudeCode.md` |
| **OpenCode** | "OpenCode plugin hook", "opencode.json hook" | `Workflows/OpenCode.md` |
| **OpenClaw** | "OpenClaw hook", "openclaw hooks dir" | `Workflows/OpenClaw.md` |
| **Hermes** | "Hermes plugin", "~/.hermes/plugins", "pre_llm_call" | `Workflows/Hermes.md` |

## Quick Reference

- Each runtime has its own event vocabulary and language — read `RuntimeMap.md` before writing, don't assume Claude Code's event names port over.
- Bash hooks (Claude Code) exit non-zero to block; TS/Python hooks (OpenCode, OpenClaw, Hermes) throw or return a deny value instead — check the target's convention, don't default to exit codes.
- If the target runtime is unnamed or ambiguous ("make a hook"), ask which of the four before scaffolding — the mechanics don't generalize.

## Gotchas

- A hook that shells out to a network call on every tool call adds latency to every single agent turn — gate expensive hooks behind an event filter (specific tool name / specific command pattern), not a blanket match.
- Claude Code hooks receive JSON on stdin and must emit JSON (or plain text + exit code) on stdout — printing debug logs to stdout corrupts the hook's return channel; log to stderr.
- OpenClaw and Hermes both use directory auto-discovery (`hooks/` dir, `~/.hermes/plugins/`) — a hook file with a syntax error can silently fail to load rather than erroring loudly; verify registration after writing, don't assume the file dropped in is live.
- Hermes hook names (`pre_llm_call`, `post_llm_call`, `on_session_start`, `on_session_end`) are NOT the same set as Claude Code's (`PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop`) — don't cross-paste event names between runtimes.

## Examples

**Example 1:** "block git push in Claude Code" → ClaudeCode workflow → `PreToolUse` hook matching `Bash` tool, regex on command, exit 2 to block → wired into `settings.json`.

**Example 2:** "log every LLM call in Hermes" → Hermes workflow → Python plugin in `~/.hermes/plugins/` implementing `pre_llm_call`/`post_llm_call`, appends to a log file.
