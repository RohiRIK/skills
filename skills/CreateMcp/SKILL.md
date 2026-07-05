---
name: CreateMcp
description: "Build a Model Context Protocol (MCP) server with the official SDK — tools, resources, prompts, transport, and security. USE WHEN creating, scaffolding, connecting, or debugging an MCP server."
category: reference
effort: medium
argument-hint: [what the server should do]
---

# CreateMcp

Scaffold and ship an MCP server that exposes tools, resources, and prompts to AI hosts (Claude Code, Claude Desktop), following the official MCP architecture and security guidance.

The MCP API surface changes between SDK releases. Prepend `use context7` before writing code against `@modelcontextprotocol/sdk` — treat context7 output as authoritative over the snippets here.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **BuildServer** | "create an MCP", "build a server", "add a tool/resource/prompt" | `Workflows/BuildServer.md` |
| **TestServer** | "test the server", "write MCP tests", "security tests", "CI" | `Workflows/TestServer.md` |
| **ConnectServer** | "connect", "register", "add to Claude", "test with inspector" | `Workflows/ConnectServer.md` |

## Quick Reference

Full pipeline (plan → architect → build → secure → test → connect): `Pipeline.md`. Read each file with the Read tool when its topic becomes relevant:
- Mental model (layers, lifecycle, all primitives) → `Architecture.md`
- Primitive specs (tools/resources/prompts + sampling/elicitation/roots + SDK code) → `Primitives.md`
- Security + hardening checklist (OWASP/CoSAI-grounded) → `Security.md`
- Threat model (OWASP LLM × MCP, CoSAI, tool poisoning) → `Threats.md`
- Automated tests (mcp-testing-kit + Inspector CLI + security suite) → `Workflows/TestServer.md`
- Protocol debug (Inspector, logging, failures) → `DebugTest.md`

## Examples

**New server:** "Create an MCP server that queries my Postgres DB" → scaffold TS project, `registerTool("query", …)` with a Zod `inputSchema`, add a schema resource, stdio transport → `ConnectServer`.

**Extend a server:** "Add a send-email tool to my MCP server" → `registerTool` with validated `inputSchema`, return `content[]`, re-check `Security.md`.

## Gotchas

- Validate every tool input with Zod at the boundary — an MCP server is a remote attack surface; an unvalidated tool arg is an injection vector.
- Pick transport deliberately: stdio for local single-client, HTTP for shared/remote — mixing them up breaks discovery.
- **No generic pass-through tool** (`run_query(string)`, `exec`, `call_api(path)`) — it bypasses every guardrail at once; the #1 MCP injection vector. Fixed endpoints + typed params.
- **Excessive Agency is the CRITICAL MCP risk** — ship read-only first; gate writes behind an enforceable `confirm:true` schema param (not a `destructiveHint` annotation — hosts can ignore annotations).
- Tool definitions must be **static first-party code** — never generate names/descriptions/schemas from user or backend data (tool/schema poisoning, MCPTox).
- **Fail closed**: refuse to start without required creds; never `process.env.X || "default"`. Central secret redaction, not per-tool.
- Stdout is the JSON-RPC wire — `console.log` corrupts the protocol; log to stderr.
- Tests aren't optional: `mcp-testing-kit` (in-process unit) + Inspector `--cli` (CI smoke). Every tool gets a happy-path + a negative/security assertion.
