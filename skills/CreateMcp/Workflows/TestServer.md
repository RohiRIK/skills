# TestServer Workflow

Automated tests for an MCP server: unit (in-process), integration (scripted CLI), and a security suite that asserts the `Security.md` gates. `use context7` for current framework APIs before coding — they drift.

## Framework choice

| Framework | Layer | When | Spawn? |
|-----------|-------|------|--------|
| **mcp-testing-kit** (npm, TS) | unit | call tools/resources/prompts in-process, assert results — fast, deterministic | no |
| **MCP Inspector `--cli`** (official) | integration / CI | scripted real protocol over stdio or HTTP, JSON output | yes (real transport) |
| **mcptools** (`f/mcptools`, Go) | exploratory / guard | interactive shell, mock/proxy/**guard** modes, shell-script integration | yes |

Default: `mcp-testing-kit` + `vitest` for unit + security assertions; Inspector `--cli` for a CI smoke pass.

## Step 1 — Unit tests (mcp-testing-kit + vitest)

```bash
bun add -d vitest mcp-testing-kit
```

Export the server instance from your entry module, then drive it with a mock client:

```ts
// server.test.ts
import server from "../src/index.js";
import { describe, it, expect, afterEach } from "vitest";
import { connect, close } from "mcp-testing-kit";

describe("MCP server", () => {
  afterEach(async () => { await close(server); });

  it("tool returns expected content", async () => {
    const client = await connect(server);
    const res = await client.callTool("add", { a: 10, b: 2 });
    expect(res.content[0].text).toBe("12");
  });

  it("lists exactly the registered tools", async () => {
    const client = await connect(server);
    const { tools } = await client.listTools();
    expect(tools.map(t => t.name).sort()).toEqual(["add"]);
  });
});
```

## Step 2 — Security suite (the differentiator)

Turn each `Security.md` gate into an assertion. These catch the MCP-specific risks unit-happy-path tests miss:

```ts
it("rejects malformed / out-of-bound input", async () => {
  const client = await connect(server);
  await expect(client.callTool("add", { a: "DROP TABLE", b: 2 }))
    .rejects.toThrow();                 // Zod boundary holds
});

it("never returns secret-like fields", async () => {
  const client = await connect(server);
  const res = await client.callTool("get_config", {});
  const text = JSON.stringify(res);
  expect(text).not.toMatch(/secret|token|password|api[_-]?key/i);  // central redaction
});

it("exposes no generic pass-through tool", async () => {
  const client = await connect(server);
  const { tools } = await client.listTools();
  expect(tools.some(t => /query|exec|run_|call_api/i.test(t.name))).toBe(false);
});

it("write tool requires confirm:true", async () => {
  const client = await connect(server);
  const preview = await client.callTool("delete_thing", { id: "x" });   // confirm omitted
  expect(JSON.stringify(preview)).toMatch(/preview|confirm/i);          // no execution
});

it("enforces pagination cap", async () => {
  const client = await connect(server);
  await expect(client.callTool("list_things", { top: 10000 })).rejects.toThrow();
});
```

Also assert (where applicable): fail-closed on missing env (import server with creds unset → throws), error messages carry no stack trace / cred metadata, tool definitions are static.

## Step 3 — Integration smoke (Inspector CLI, for CI)

```bash
# list tools — non-zero exit fails CI
bunx @modelcontextprotocol/inspector --cli bun run src/index.ts --method tools/list

# call a tool with args
bunx @modelcontextprotocol/inspector --cli bun run src/index.ts \
  --method tools/call --tool-name add --tool-arg a=10 --tool-arg b=2

# JSON args
bunx @modelcontextprotocol/inspector --cli bun run src/index.ts \
  --method tools/call --tool-name search --tool-arg 'opts={"format":"json"}'
```

Pipe JSON output to `jq` for assertions. Remote: pass the URL instead of the launch command.

## Step 4 — Wire into CI + coverage

```jsonc
// package.json
"scripts": {
  "test": "vitest run --coverage",
  "test:smoke": "bunx @modelcontextprotocol/inspector --cli bun run src/index.ts --method tools/list"
}
```

Target ≥ 80% coverage. Every new tool adds: happy-path unit test + at least one security assertion (bad input, redaction, or confirm gate). Run `mcptools guard` locally when you want to interactively probe tool/resource access restrictions.

## Done

Unit + security suite green, CI smoke passes, coverage ≥ 80%, every tool has a negative test. Then `Workflows/ConnectServer.md`.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateMcp","workflow":"TestServer","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
