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
| **ConnectServer** | "connect", "register", "add to Claude", "test with inspector" | `Workflows/ConnectServer.md` |

## Quick Reference

Built from the full modelcontextprotocol.io docs. Load the layer you need:

- **Full pipeline** (plan → architect → build → secure → test → connect): `SkillSearch('createmcp pipeline')` → `Pipeline.md`
- Mental model (layers, lifecycle, all primitives): `SkillSearch('createmcp architecture')` → `Architecture.md`
- Primitive specs (tools/resources/prompts + sampling/elicitation/roots + SDK code): `SkillSearch('createmcp primitives')` → `Primitives.md`
- Security + authorization checklist: `SkillSearch('createmcp security')` → `Security.md`
- Test + debug (Inspector, logging, failures): `SkillSearch('createmcp debug')` → `DebugTest.md`

## Pipeline (the whole job)

```
PLAN → ARCHITECT → DESIGN PRIMITIVES → BUILD → SECURE → TEST/DEBUG → CONNECT → ITERATE
```

Read `Pipeline.md` for the stage-by-stage runbook. For a single build pass, jump to the `BuildServer` workflow.

## Decide First

1. **Primitives needed?** Actions the model triggers → **tools**. Read-only context the app pulls → **resources**. User-invoked templates → **prompts**. Need the host LLM / user input / file scope → **sampling / elicitation / roots** (client features, optional).
2. **Transport?** Runs on the user's machine → **stdio** (default, simplest). Hosted/shared over network → **Streamable HTTP** (needs OAuth — see `Security.md`).
3. **Language?** TypeScript or Python are Tier-1 SDKs. Default TypeScript run via `bun`.

## Examples

**Example 1: New server from scratch**
```
User: "Create an MCP server that queries my Postgres DB"
→ BuildServer: scaffold TS project, registerTool("query", …) with a Zod inputSchema,
  add a resource for the schema, stdio transport → ConnectServer to register + test.
```

**Example 2: Extend an existing server**
```
User: "Add a send-email tool to my MCP server"
→ BuildServer: registerTool with validated inputSchema, return content[] result,
  re-check Security.md (input validation, no token passthrough).
```
