---
name: CreatePlugin
description: "Package a project as an AI-agent plugin with Hermes, Claude, OpenClaw, Pi, OpenCode, and MCP adapters. USE WHEN porting workflows across agent hosts. NOT FOR standalone CLIs (use CreateCLI)."
category: meta
effort: high
domain: agents
---

# CreatePlugin

Package a project as one maintainable plugin with one canonical workflow source and thin host-specific adapters. Read official host documentation before writing manifests; do not guess unsupported fields.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreatePlugin** | "convert this project into a portable AI-agent plugin", "port this workflow to agent hosts" | `Workflows/CreatePlugin.md` |

## Quick Reference

- Put substantive instructions once in `plugin/skills/`; host files only route to them.
- Inspect project context, existing integrations, Git status, and official host docs before editing.
- Use native host packages or skills where documented; use MCP as the common fallback.
- Treat static validation, successful loading, and interactive/runtime evidence as different claims.

## Gotchas

- Hermes, Claude, Pi, and OpenCode package formats are not interchangeable; shared name/version/path fields must agree.
- An OpenClaw installer must be idempotent and refuse to replace unrelated files.
- Global or user-level configuration, publishing, deployment, and production actions require explicit approval.

## Examples

**Example 1:** "Port this project to Claude, Pi, and OpenCode" → CreatePlugin → inspect project and host docs → create one shared package plus three thin adapters → run static, host, and MCP verification.

**Example 2:** "Add a Hermes manifest" → read the existing plugin and Hermes docs first → update only the Hermes adapter → validate without changing global configuration.
