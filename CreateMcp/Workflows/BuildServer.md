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

Run the `Security.md` pre-ship gate *now*, not after shipping. Hard gates: validate inputs · **no generic pass-through tool** · never return secrets (central redaction) · **fail closed** on missing creds · read-only default, writes behind enforceable `confirm` · per-tool least privilege · pagination cap + rate limit + outbound timeout · static first-party tool defs · (HTTP) token-audience validation + TLS 1.3 + SSRF checks. `Threats.md` explains why each control exists.

## Step 6 — Test

Write automated tests → `Workflows/TestServer.md`: `mcp-testing-kit` unit tests + a security suite asserting the Step 5 gates + an Inspector `--cli` CI smoke. Every tool gets a happy-path **and** a negative test.

## Step 7 — Smoke test (interactive)

```bash
bunx @modelcontextprotocol/inspector bun run index.ts
```

The Inspector lists your tools/resources/prompts and lets you call them without a host. Fix errors before connecting.

→ Register with a host: `Workflows/ConnectServer.md`.

## Examples

**New server from scratch**
```
User: "Create an MCP server that queries my Postgres DB"
→ scaffold TS project, registerTool("query", …) with a Zod inputSchema,
  add a resource for the schema, stdio transport → ConnectServer to register + test.
```

**Extend an existing server**
```
User: "Add a send-email tool to my MCP server"
→ registerTool with validated inputSchema, return content[] result,
  re-check Security.md (input validation, no token passthrough).
```

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateMcp","workflow":"BuildServer","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
