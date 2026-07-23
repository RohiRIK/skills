# ClaudeCode Workflow

Generate a Claude Code lifecycle hook: a shell command wired into `settings.json` that fires on a named event.

## Step 1: Pick the Event

| Event | Fires | Common use |
|-------|-------|------------|
| `PreToolUse` | before a tool call executes | block/allow a tool call, rewrite args |
| `PostToolUse` | after a tool call completes | log, react to result, chain a follow-up |
| `UserPromptSubmit` | when the user submits a prompt | inject context, validate/redirect input |
| `SessionStart` | new session or resume | load project context, print a banner |
| `SessionEnd` | session ends | persist state, cleanup |
| `Stop` | Claude finishes responding | notify, run a post-response check |
| `PreCompact` | before context compaction | snapshot state before it's summarized |
| `Notification` | Claude Code emits a notification | forward to an external channel |

## Step 2: Write the Handler

A hook is any executable that reads a JSON payload on **stdin** and communicates its decision via **exit code + stdout/stderr**:

```bash
#!/usr/bin/env bash
set -euo pipefail

payload=$(cat)
tool_name=$(jq -r '.tool_name' <<<"$payload")
command=$(jq -r '.tool_input.command // empty' <<<"$payload")

if [[ "$tool_name" == "Bash" && "$command" =~ ^git\ push\ .*--force ]]; then
  echo "Blocked: force-push requires manual confirmation" >&2
  exit 2   # non-zero blocks the tool call; message goes to Claude via stderr
fi

exit 0
```

- Exit `0`: allow, stdout ignored unless it's a `PreToolUse`/`UserPromptSubmit` hook expecting JSON output to modify behavior.
- Exit `2`: block (for `PreToolUse`) — stderr is surfaced to Claude as the reason.
- Other non-zero: non-blocking error, logged but doesn't halt execution.
- Never `console.log`/`echo` debug output to stdout in a hook that returns structured JSON — it corrupts the parse. Debug via stderr.

## Step 3: Register in settings.json

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "/absolute/path/to/hook.sh" }]
      }
    ]
  }
}
```

`matcher` filters by tool name (omit to match all tools for that event). Use project `.claude/settings.json` for repo-scoped hooks, `~/.claude/settings.json` for global ones.

## Step 4: Verify

```bash
chmod +x /absolute/path/to/hook.sh
```

Trigger the matching tool call manually and confirm the hook fires (check for the expected block/allow behavior and that stderr shows the right message on block).

## Telemetry

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateHook","workflow":"ClaudeCode","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
