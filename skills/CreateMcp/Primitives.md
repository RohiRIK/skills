# CreateMcp — Primitives Reference

The three server building blocks, who controls each, and TypeScript SDK shapes.
Sources: docs/learn/server-concepts + the official TypeScript SDK. `use context7` for current `@modelcontextprotocol/sdk` signatures before coding.

## Control Model — pick the right primitive

| Primitive | Controlled by | Use for | Example |
|-----------|---------------|---------|---------|
| **Tools** | **Model** decides when to call | Actions with side effects, queries the model triggers | search flights, send message, run SQL |
| **Resources** | **Application** pulls into context | Passive read-only data | file contents, DB schema, docs |
| **Prompts** | **User** invokes explicitly | Parameterized templates / workflows | "Plan a vacation", "Summarize meetings" |

Rule of thumb: side effect or model-decides → tool. Context the app reads → resource. A reusable user-triggered template → prompt.

## Server Setup (TypeScript, run via bun)

```ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

// …register tools/resources/prompts here…

const transport = new StdioServerTransport();
await server.connect(transport);
```

> Log to **stderr only** on stdio servers — stdout is the JSON-RPC channel. `console.log` corrupts the protocol; use `console.error`.

## Tools

Functions the model calls. Validate every input with a Zod schema (boundary validation). Return a `content[]` array.

```ts
server.registerTool(
  "add",
  {
    title: "Addition",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }),
);
```

- `description` is how the model decides when to call — make it precise.
- Errors: return `{ content: [...], isError: true }` rather than throwing, so the model sees the failure.
- If the tool set changes at runtime and you declared `listChanged`, the SDK emits `tools/list_changed`.

**Structured output** — declare `outputSchema`, return `structuredContent` alongside `content` (keep both in sync; `content` is the fallback for clients that don't read structured data):

```ts
server.registerTool(
  "add",
  { title: "Addition", inputSchema: { a: z.number(), b: z.number() },
    outputSchema: { sum: z.number() } },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
    structuredContent: { sum: a + b },
  }),
);
```

**Resource link** — a tool result can point at a resource instead of inlining it (large files, resources the client should fetch lazily):

```ts
content: [{ type: "resource_link", uri: "file:///report.csv", name: "report.csv" }]
```

## Resources

Read-only context, addressed by **URI**, with a declared MIME type.

**Direct resource** — fixed URI:

```ts
server.registerResource(
  "schema",
  "db://schema",
  { title: "DB Schema", description: "Live table schema", mimeType: "text/plain" },
  async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "text/plain", text: await loadSchema() }],
  }),
);
```

**Resource template** — parameterized URI (`travel://activities/{city}/{category}`):

```ts
server.registerResource(
  "user",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  { title: "User Profile" },
  async (uri, { userId }) => ({
    contents: [{ uri: uri.href, text: await loadUser(userId) }],
  }),
);
```

Templates carry title/description/MIME so they're self-documenting. Both patterns support parameter completion so clients discover valid values without exact-format knowledge.

## Prompts

Reusable, user-invoked templates. Can reference resources and tools to form a workflow.

```ts
server.registerPrompt(
  "review-code",
  {
    title: "Code Review",
    description: "Review a snippet for bugs and style",
    argsSchema: { code: z.string() },
  },
  ({ code }) => ({
    messages: [
      { role: "user", content: { type: "text", text: `Review this code:\n\n${code}` } },
    ],
  }),
);
```

Discovery: `prompts/list`; retrieval with args: `prompts/get`. Prompts are user-controlled — never auto-fired.

## Client Features (advanced — your server *requests* of the host)

Only usable if the client declared the matching capability during init.

- **Sampling** — `server.server.createMessage(...)` asks the host LLM for a completion. Keeps your server model-agnostic (no embedded LLM SDK).
- **Elicitation** — request structured input from the user mid-tool-call via a JSON schema. Clients validate the response before returning it. Never request passwords or API keys.
- **Roots** — the client advertises which directories are in scope (`roots/list` + `notifications/roots/list_changed`). Read them to focus file operations. Advisory only — still validate and confine paths yourself; roots are not enforcement.
- **Logging** — `notifications/message` to stream structured logs to the client (works on all transports, unlike raw stderr).

**Utilities you can lean on:** progress notifications for long ops, cancellation to abort in-flight requests, and **Tasks (experimental)** to return a task handle now and let the client poll for the result later (expensive/multi-step work).

Keep all of these optional; degrade gracefully when the capability is absent (check what the client declared at init).
