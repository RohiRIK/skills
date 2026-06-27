# BuildServer Workflow

Scaffold (or extend) an MCP server. Default stack: TypeScript + official SDK, run via `bun`.

## Step 0 — Load context

- `SkillSearch('createmcp architecture')` — layers, lifecycle, transport choice.
- `SkillSearch('createmcp primitives')` — tool/resource/prompt SDK shapes.
- `use context7` for `@modelcontextprotocol/sdk` — the API shifts between releases; context7 overrides any snippet here.

## Step 1 — Decide

1. **Primitives** — list each capability and tag it tool / resource / prompt (model / app / user controlled).
2. **Transport** — local → **stdio** (default). Hosted/shared → Streamable HTTP (then read `Security.md` auth section).
3. **Inputs** — for each tool, the exact params and their types (becomes the Zod schema).

## Step 2 — Scaffold

```bash
mkdir my-mcp-server && cd my-mcp-server
bun init -y
bun add @modelcontextprotocol/sdk zod
```

`package.json`: set `"type": "module"`, entry `index.ts`.

## Step 3 — Server skeleton

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "my-mcp-server", version: "1.0.0" });

// register primitives (Step 4)

const transport = new StdioServerTransport();
await server.connect(transport);
```

> stdout is the JSON-RPC channel — log only with `console.error`. A stray `console.log` corrupts the protocol.

## Step 4 — Register primitives

Copy the matching pattern from `Primitives.md`:
- **Tool** → `server.registerTool(name, { title, description, inputSchema }, handler)` returning `{ content: [...] }`. Validate inputs; on failure return `{ content, isError: true }`.
- **Resource** → `server.registerResource(...)` (direct URI or `ResourceTemplate`) returning `{ contents: [...] }`.
- **Prompt** → `server.registerPrompt(...)` returning `{ messages: [...] }`.

Make tool `description`s precise — that text is how the model decides to call them.

## Step 5 — Security pass

Run the `Security.md` pre-ship gate: input validation, env-only secrets, least privilege, no token passthrough (HTTP). Do this *now*, not after shipping.

## Step 6 — Smoke test

```bash
bunx @modelcontextprotocol/inspector bun run index.ts
```

The Inspector lists your tools/resources/prompts and lets you call them without a host. Fix errors before connecting.

→ Register with a host: `Workflows/ConnectServer.md`.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateMcp","workflow":"BuildServer","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
