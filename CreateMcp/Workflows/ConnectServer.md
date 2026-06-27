# ConnectServer Workflow

Register a local stdio server with a host and verify it connects. Source: docs/develop/connect-local-servers.

## Step 1 — Test in isolation first

Before any host, confirm the server runs standalone:

```bash
bunx @modelcontextprotocol/inspector bun run /abs/path/to/index.ts
```

If the Inspector lists your primitives and calls succeed, the server is good. Most "server won't connect" issues are really server crashes — catch them here.

## Step 2 — Register with the host

### Claude Code (CLI)

```bash
claude mcp add my-server -- bun run /abs/path/to/index.ts
claude mcp list           # verify it appears
```

Scope flags: `--scope local` (default, this project) · `--scope user` (all your projects) · `--scope project` (shared via `.mcp.json`).

### Claude Desktop (config file)

Open the config (Settings → Developer → Edit Config), or edit directly:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "my-server": {
      "command": "bun",
      "args": ["run", "/abs/path/to/index.ts"]
    }
  }
}
```

Rules:
- **Use absolute paths** — relative paths fail.
- The key (`"my-server"`) is the display name shown in the host.
- Add `"env": { "API_KEY": "..." }` for secrets the server reads from `process.env`.
- **Restart Claude Desktop completely** after editing — it only loads config at launch.

## Step 3 — Verify & troubleshoot

Server missing / tools icon absent:
1. Restart the host completely.
2. Validate JSON syntax of the config.
3. Confirm every path is absolute and exists.
4. Re-run the server manually (Step 1) — read the error.
5. Check logs:
   - macOS: `~/Library/Logs/Claude/` — `mcp.log` (connections), `mcp-server-<NAME>.log` (your stderr).
   - Windows: `%APPDATA%\Claude\logs`
   ```bash
   tail -n 20 -f ~/Library/Logs/Claude/mcp-server-my-server.log
   ```

## Step 4 — Use safely

Tool calls execute with real privileges; the host shows an approval dialog per call. Review each request before approving; deny anything you're unsure about. Re-check `Security.md` if the server touches credentials, the network, or the filesystem.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateMcp","workflow":"ConnectServer","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
