# Workflow: build-mcp

Scaffold, secure, test, and connect a Model Context Protocol server.

```
CreateMcp:BuildServer → SecurityReview → CreateMcp:TestServer → CreateMcp:ConnectServer → GitHubOps:PullRequest
```

1. **BuildServer** — scaffold TS + official SDK, register tools/resources/prompts, stdio transport. `use context7` for current SDK signatures.
2. **SecurityReview** + `CreateMcp/Security.md` gates — input validation · **no generic pass-through tool** · fail-closed on missing creds · read-only default, writes behind enforceable `confirm` · static first-party tool defs.
3. **TestServer** — `mcp-testing-kit` unit + security suite (asserts the gates) + Inspector `--cli` smoke. Every tool: happy-path + negative.
4. **ConnectServer** — register with the host (`claude mcp add` / desktop config), verify tools appear and calls are approved.

## When to use

Create, scaffold, connect, or debug an MCP server.

## Reminder

An MCP server is a remote attack surface — the SecurityReview step is not optional. Ship read-only first; gate writes behind `confirm:true` (schema param, not a host-ignorable annotation).
