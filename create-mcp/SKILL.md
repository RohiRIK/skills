---
name: create-mcp
description: "Build a Model Context Protocol (MCP) server with the official SDK — tools, resources, prompts, transport, and security. Use when creating, scaffolding, connecting, or debugging an MCP server."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='create-mcp', file_path='references/connect-server.md') before taking any action."
---


# CreateMcp

Scaffold and ship an MCP server that exposes tools, resources, and prompts to AI hosts (Claude Code, Claude Desktop).
The MCP API surface changes between SDK releases. Prepend `use context7` before writing code against `@modelcontextprotocol/sdk`.
For pipeline, design decisions, and full quick reference see `references/pipeline-guide.md`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **BuildServer** | "create an MCP", "build a server", "add a tool/resource/prompt" | `references/build-server.md` |
| **ConnectServer** | "connect", "register", "add to Claude", "test with inspector" | `references/connect-server.md` |

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

## Gotchas

- Validate every tool input with Zod at the boundary — an MCP server is a remote attack surface; an unvalidated tool arg is an injection vector.
- Pick transport deliberately: stdio for local single-client, HTTP for shared/remote — mixing them up breaks discovery.
