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

## 5. SECURE → `Security.md` (threat model: `Threats.md`)

Run the pre-ship gate now, not later. Core gates: input validation · **no generic pass-through tool** · never return secrets (central redaction) · **fail closed** on missing creds · read-only default with writes behind enforceable `confirm` · per-tool least privilege · pagination caps + rate limit + outbound timeout · static first-party tool defs · (HTTP) token-audience validation, TLS 1.3, SSRF redirect checks · (proxy) consent-before-`state`. Reason about *why* each control exists in `Threats.md` (OWASP LLM × MCP, CoSAI, tool poisoning).

## 6. TEST → `Workflows/TestServer.md` · DEBUG → `DebugTest.md`

Automated tests: **mcp-testing-kit** (in-process unit) + a **security suite** asserting the gates above (bad input rejected, no secrets in output, no generic tool, confirm-gated writes, pagination cap) + **Inspector `--cli`** CI smoke. Target ≥ 80% coverage; every tool gets a happy-path + a negative test. For live protocol debugging (stdout pollution, schema mismatch, env gaps, host won't connect) use `DebugTest.md` + host logs (`mcp-server-<NAME>.log`).

## 7. CONNECT → `Workflows/ConnectServer.md`

Register with the host: `claude mcp add` (Claude Code) or `claude_desktop_config.json` (Desktop, absolute paths, restart). Verify the tools appear and calls are approved.

## 8. ITERATE

Adding a capability re-enters at stage 3 (design the primitive) → 4 (build) → 5 (re-run security gate + add its security test) → 6 (unit + security suite + Inspector smoke). If the tool list changes at runtime and you declared `listChanged`, the SDK emits `tools/list_changed` and the host re-lists.

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
| Test frameworks | `mcp-testing-kit` (npm) · MCP Inspector `--cli` · `f/mcptools` |
| Threat model (`Threats.md`) | OWASP LLM Top 10 2025 · OWASP Agentic 2026 · CoSAI/OASIS MCP Security · NSA MCP guidance · MCPTox |
