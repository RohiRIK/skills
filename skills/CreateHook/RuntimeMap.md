# Hook — Runtime Map

Four runtimes, four unrelated hook mechanics. Confirm the target before scaffolding — nothing here ports across rows.

| Runtime | Language | Discovery | Config/registration | Event names |
|---------|----------|-----------|----------------------|-------------|
| **Claude Code** | Bash (any executable) | Explicit — listed in `settings.json` | `hooks` key in `~/.claude/settings.json` or project `.claude/settings.json`, matched by tool pattern | `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `SessionEnd`, `Stop`, `Notification`, `PreCompact` |
| **OpenCode** | TypeScript | Explicit — plugin file exports hook object | `opencode.json` / plugin entry point (`Plugin` export) | `tool.execute.before`/`after`, `chat.message`, `event` (generic), experimental `chat.params`/`system-prompt` transforms |
| **OpenClaw** | TypeScript | Automatic — files dropped in a `hooks/` directory, enabled/disabled via CLI | dir-based; no central config file, CLI toggles per-hook | session lifecycle (new session, reset, gateway boot), command events; built-ins: `session-memory`, `bootstrap-extra-files`, `command-logger`, `boot-md` |
| **Hermes Agent** (NousResearch) | Python | Automatic — files dropped in `~/.hermes/plugins/` or project `.hermes/plugins/`, or pip entry points | plugin manifest / entry-point metadata | `pre_llm_call`, `post_llm_call`, `on_session_start`, `on_session_end` |

## Shared shape, different syntax

All four follow the same underlying pattern: **event fires → handler receives context → handler can inspect/modify/block → agent continues (or halts)**. The differences are surface-level (language, file location, exact event names) not conceptual — design the hook's logic once, then translate into the target's syntax using the per-runtime workflow file.

## Picking the right event

- Want to see/modify a tool call before it runs → Claude Code `PreToolUse`, OpenCode `tool.execute.before`.
- Want to react after a tool call completes → Claude Code `PostToolUse`, OpenCode `tool.execute.after`.
- Want to touch every model request/response → Hermes `pre_llm_call`/`post_llm_call`; OpenCode's experimental prompt/message transforms cover the prompt side.
- Want session-boundary behavior (save context, load workspace files) → Claude Code `SessionStart`/`SessionEnd`, Hermes `on_session_start`/`on_session_end`, OpenClaw's built-in `session-memory`/`bootstrap-extra-files`.
