# OpenClaw Workflow

Generate an OpenClaw hook: a small TypeScript function auto-discovered from a `hooks/` directory, toggled on/off via the OpenClaw CLI.

## Step 1: Pick the Trigger

OpenClaw hooks respond to agent lifecycle and command events rather than a fixed enum — common triggers: new session start, conversation reset, gateway boot, a specific command being issued. Check the built-ins for the closest existing pattern before writing from scratch:

| Built-in | Fires on | Does |
|----------|----------|------|
| `session-memory` | `/new` | saves session context to the agent workspace |
| `bootstrap-extra-files` | session/workspace init | injects additional bootstrap files |
| `command-logger` | any command event | logs command events |
| `boot-md` | gateway startup | runs `BOOT.md` |

## Step 2: Write the Hook

```typescript
export default {
  name: "block-force-push",
  event: "command", // match the event family closest to the trigger picked in Step 1
  handler: async (ctx) => {
    if (ctx.command?.includes("git push") && ctx.command.includes("--force")) {
      return { block: true, reason: "Force-push requires manual confirmation" }
    }
    return { block: false }
  },
}
```

Confirm the exact handler signature and `ctx` shape against current OpenClaw docs (`openclawlab.com/docs/automation/hooks`) before finalizing — the hook API is young.

## Step 3: Drop In and Enable

Place the file in the hooks directory (project-local or global, per current docs), then enable via CLI:

```bash
openclaw hooks list
openclaw hooks enable block-force-push
```

## Step 4: Verify

A hook with a syntax error can fail to load silently rather than erroring loudly — after enabling, re-run `openclaw hooks list` and confirm the hook shows as active, not just present as a file, before trusting it in production.

## Telemetry

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateHook","workflow":"OpenClaw","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
