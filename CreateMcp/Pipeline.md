# CreateMcp — End-to-End Pipeline

The full path from idea to a connected, secure MCP server. Each stage points at the file that drives it. Spec baseline: 2025-11-25.

```
PLAN → ARCHITECT → DESIGN PRIMITIVES → BUILD → SECURE → TEST/DEBUG → CONNECT → ITERATE
```

## 1. PLAN — what should this server do?

Write a one-paragraph capability spec before any code:
- **Goal:** what context/actions does the host gain?
- **Capabilities:** enumerate each, tag it tool / resource / prompt (model / app / user controlled).
- **Inputs & outputs:** params per tool (→ Zod schema), data shape per resource (→ URI + MIME).
- **External deps:** APIs, DBs, files, secrets (→ env vars).
- **Trust level:** personal/local vs shared/remote (drives transport + auth).

## 2. ARCHITECT — pick the shape → `Architecture.md`

- **Transport:** local subprocess → **stdio** (default). Hosted/shared → **Streamable HTTP** + OAuth.
- **Lifecycle:** initialize → capability negotiation → operation → shutdown. Declare only the capabilities you implement.
- **Primitive set:** server (tools/resources/prompts), client (sampling/elicitation/roots/logging), utility (notifications/progress/cancellation/ping/tasks).

## 3. DESIGN PRIMITIVES → `Primitives.md`

Map each planned capability to a concrete registration:
- Action / side effect / model-triggered → **tool** (`registerTool`, Zod `inputSchema`).
- Read-only context the app pulls → **resource** (direct URI or `ResourceTemplate`).
- User-invoked template/workflow → **prompt** (`registerPrompt`, `argsSchema`).
- Need the host LLM, user input, or file scope → **sampling / elicitation / roots** (optional, capability-gated).

## 4. BUILD → `Workflows/BuildServer.md`

Scaffold (TS + `bun`), register primitives, wire `StdioServerTransport`. `use context7` for current SDK signatures. Log to stderr only.

## 5. SECURE → `Security.md`

Run the pre-ship gate now, not later: input validation, env-only secrets, least privilege, no token passthrough (HTTP), consent-before-`state` (proxy/auth).

## 6. TEST / DEBUG → `DebugTest.md`

Prove it in the **MCP Inspector** before any host. Fix stdout pollution, schema mismatches, env gaps. Use host logs (`mcp-server-<NAME>.log`) when a host won't connect.

## 7. CONNECT → `Workflows/ConnectServer.md`

Register with the host: `claude mcp add` (Claude Code) or `claude_desktop_config.json` (Desktop, absolute paths, restart). Verify the tools appear and calls are approved.

## 8. ITERATE

Adding a capability re-enters at stage 3 (design the primitive) → 4 (build) → 5 (re-run security gate) → 6 (re-test in Inspector). If the tool list changes at runtime and you declared `listChanged`, the SDK emits `tools/list_changed` and the host re-lists.

## Source map (built from modelcontextprotocol.io)

| Stage | Doc page |
|-------|----------|
| Architecture, lifecycle, layers | `/docs/learn/architecture` |
| Server primitives | `/docs/learn/server-concepts` |
| Client primitives (sampling/elicitation/roots) | `/docs/learn/client-concepts` |
| Build tutorial + logging | `/docs/develop/build-server` |
| Local connection + config | `/docs/develop/connect-local-servers` |
| Inspector + debugging | `/legacy/tools/inspector`, `/legacy/tools/debugging` |
| Security + authorization | `/docs/tutorials/security/security_best_practices` |
| SDKs (TS/Python Tier-1) | `/docs/sdk` |
| Agent-skill-driven build | `/docs/develop/build-with-agent-skills` |
