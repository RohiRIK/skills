# CreateMcp — Test & Debug

How to prove a server works and diagnose it when it doesn't. Sources: legacy/tools/inspector + legacy/tools/debugging + build-server logging.

## Debugging layers

1. **MCP Inspector** — interactive, transport-agnostic UI. Connect to stdio or Streamable HTTP, invoke tools/prompts/resources, watch the notification stream. **First stop, always — before touching a host.**
2. **Server logging** — structured logs to **stderr** (stdio transport) or via `notifications/message` (all transports).
3. **Client dev tools** — most hosts expose logs + connection state (see host logs below).

## MCP Inspector

```bash
# run your server under the inspector (no host needed)
bunx @modelcontextprotocol/inspector bun run index.ts

# a published/npm server
bunx @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-filesystem /path
```

In the UI: list and call **Tools**, read **Resources** (direct + templates), fetch **Prompts**, and inspect the live request/response + notification stream. If a call fails here, it will fail in the host too — fix it here first.

## Logging rule (stdio) — non-negotiable

stdout **is** the JSON-RPC channel. Writing to stdout corrupts the protocol and the connection dies.

```ts
// ❌ Bad (STDIO) — breaks the wire
console.log("Server started");

// ✅ Good — stderr is safe
console.error("Server started");
```

Same rule every language: log to stderr (`log.Println` / `fmt.Fprintln(os.Stderr, …)` in Go, `logging` to stderr in Python). On HTTP transport this constraint relaxes, but stick to a real logger.

## Host logs (Claude Desktop)

- macOS: `~/Library/Logs/Claude/` · Windows: `%APPDATA%\Claude\logs`
- `mcp.log` — connection-level events and failures.
- `mcp-server-<NAME>.log` — your server's stderr.

```bash
tail -n 20 -f ~/Library/Logs/Claude/mcp-server-<NAME>.log
```

## Passing env vars

stdio servers inherit only a limited, platform-dependent subset of env vars. Inject what you need explicitly:

```json
{
  "mcpServers": {
    "myserver": {
      "command": "bun",
      "args": ["run", "/abs/index.ts"],
      "env": { "MYAPP_API_KEY": "some_key" }
    }
  }
}
```

## Common failures → fixes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Server missing / no tools icon | config not loaded | Restart host **completely**; validate JSON; at least one server must be configured. |
| Server won't start | path / permission | Use **absolute** `command` path; confirm files exist + executable. |
| Connects then dies | stdout pollution | Remove every `console.log`; log to stderr only. |
| `-32602 Invalid params` | capability / schema mismatch | Check protocol version + capability negotiation; verify tool `inputSchema` matches the call. |
| Version error on init | incompatible `protocolVersion` | Negotiate a shared version, else the connection terminates by design. |
| Missing env var at runtime | env not inherited | Add to the `env` block in config. |

## Test checklist before connecting to a host

- [ ] Inspector lists every tool / resource / prompt you registered
- [ ] Each tool call returns valid `content[]`; errors return `isError: true` (not a throw)
- [ ] No stdout writes anywhere on the stdio path
- [ ] Required env vars present; secrets from env
- [ ] Initialize succeeds with the host's protocol version
