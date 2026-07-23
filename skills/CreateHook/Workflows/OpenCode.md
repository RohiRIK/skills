# OpenCode Workflow

Generate an OpenCode plugin hook: a TypeScript function exported from a plugin file that intercepts tool calls or agent events.

## Step 1: Pick the Hook Point

| Hook | Fires | Common use |
|------|-------|------------|
| `tool.execute.before` | before a tool runs | validate/block/rewrite tool args |
| `tool.execute.after` | after a tool runs | log result, trigger a follow-up action |
| `event` | generic system event | catch-all for events without a dedicated hook |
| `chat.message` (experimental) | before a chat message is sent | transform message content |
| system-prompt transform (experimental) | before the system prompt is sent | inject/modify prompt content |

## Step 2: Scaffold the Plugin

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const BlockForcePush: Plugin = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash" && /git push .*--force/.test(output.args.command ?? "")) {
        throw new Error("Blocked: force-push requires manual confirmation")
      }
    },
  }
}
```

- Throwing in a `before` hook blocks the call; the thrown message surfaces to the agent as the reason.
- Return normally (or a mutated `output`) to allow, optionally with modified args depending on the hook's contract — check the SDK types for the exact shape (`use context7` on `@opencode-ai/plugin` before relying on a signature from memory, the plugin API is young and changes between releases).

## Step 3: Register

Point OpenCode at the plugin file via `opencode.json` (or the plugin auto-load path, per current SDK docs) — confirm the exact registration key with context7 since this is a fast-moving API surface.

## Step 4: Verify

Trigger the matching tool call in an OpenCode session and confirm the block/allow/log behavior fires as expected.

## Telemetry

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateHook","workflow":"OpenCode","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
