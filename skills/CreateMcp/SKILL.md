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

Built from the full modelcontextprotocol.io docs. Load the layer you need:

- **Full pipeline** (plan → architect → build → secure → test → connect): `SkillSearch('createmcp pipeline')` → `Pipeline.md`
- Mental model (layers, lifecycle, all primitives): `SkillSearch('createmcp architecture')` → `Architecture.md`
- Primitive specs (tools/resources/prompts + sampling/elicitation/roots + SDK code): `SkillSearch('createmcp primitives')` → `Primitives.md`
- Security + hardening checklist (OWASP/CoSAI-grounded): `SkillSearch('createmcp security')` → `Security.md`
- Threat model (OWASP LLM × MCP, CoSAI, tool poisoning): `SkillSearch('createmcp threats')` → `Threats.md`
- Automated tests (mcp-testing-kit + Inspector CLI + security suite): `SkillSearch('createmcp test')` → `Workflows/TestServer.md`
- Protocol debug (Inspector, logging, failures): `SkillSearch('createmcp debug')` → `DebugTest.md`

## Pipeline (the whole job)

`PLAN → ARCHITECT → DESIGN PRIMITIVES → BUILD → SECURE → TEST/DEBUG → CONNECT → ITERATE` — stage-by-stage runbook (incl. primitive/transport/language decisions) in `Pipeline.md`. For a single build pass, jump to `BuildServer`; examples live there too.

## Gotchas

- Validate every tool input with Zod at the boundary — an MCP server is a remote attack surface; an unvalidated tool arg is an injection vector.
- Pick transport deliberately: stdio for local single-client, HTTP for shared/remote — mixing them up breaks discovery.
- **No generic pass-through tool** (`run_query(string)`, `exec`, `call_api(path)`) — it bypasses every guardrail at once; the #1 MCP injection vector. Fixed endpoints + typed params.
- **Excessive Agency is the CRITICAL MCP risk** — ship read-only first; gate writes behind an enforceable `confirm:true` schema param (not a `destructiveHint` annotation — hosts can ignore annotations).
- Tool definitions must be **static first-party code** — never generate names/descriptions/schemas from user or backend data (tool/schema poisoning, MCPTox).
- **Fail closed**: refuse to start without required creds; never `process.env.X || "default"`. Central secret redaction, not per-tool.
- Stdout is the JSON-RPC wire — `console.log` corrupts the protocol; log to stderr.
- Tests aren't optional: `mcp-testing-kit` (in-process unit) + Inspector `--cli` (CI smoke). Every tool gets a happy-path + a negative/security assertion.
