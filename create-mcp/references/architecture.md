# CreateMcp — Architecture

The mental model behind every MCP server. Source: modelcontextprotocol.io/docs/learn/architecture.

## Participants

MCP is **client–server**. An MCP **host** (Claude Code, Claude Desktop) spins up one MCP **client** per server, and each client holds a **dedicated 1:1 connection** to its server. A server is a standalone program exposing capabilities; it never talks to other servers — the host orchestrates.

```
Host (AI app) ──┬── Client A ──── stdio ──── Server A (local)
                └── Client B ──── HTTP ──── Server B (remote)
```

MCP governs *only* the context-exchange protocol. It does not dictate how the host uses the LLM or manages context.

## Two Layers

| Layer | Role |
|-------|------|
| **Data layer** (inner) | JSON-RPC 2.0 protocol: lifecycle, capability negotiation, and the primitives (tools, resources, prompts, notifications). This is where you spend your time. |
| **Transport layer** (outer) | Communication channel + auth: connection setup, message framing, security. |

The SDK abstracts most of this — you register primitives and pick a transport.

## Transports

| Transport | When | Auth |
|-----------|------|------|
| **stdio** | Server runs locally as a subprocess of the host. Default, simplest, no network. | OS process boundary |
| **Streamable HTTP** | Server is hosted / shared over a network. | OAuth 2.0 — see `Security.md` |

Default to stdio for personal/local servers.

## Lifecycle

1. **Initialize** — client sends `initialize` with its `protocolVersion` (e.g. `2025-06-18`), `capabilities`, and `clientInfo`. Server replies with its own. **If no mutually compatible protocol version is negotiated, terminate the connection.**
2. **Capability negotiation** — each side declares what it supports. Examples:
   - Server: `"tools": { "listChanged": true }` → supports tools *and* will emit `tools/list_changed` notifications.
   - Server: `"resources": {}` → supports resources, no change notifications.
   - Client: `"elicitation": {}` → can handle `elicitation/create` requests.
   Declaring capabilities avoids calling operations the other side can't handle.
3. **Operation** — discover (`*/list`), retrieve (`*/get`), execute (`tools/call`). Listings are dynamic; clients re-list when a `*_list_changed` notification arrives.
4. **Shutdown** — clean connection termination.

## Primitives at a Glance

**Server → client** (what you usually build):

| Primitive | What | Discovery / Use |
|-----------|------|-----------------|
| **Tools** | Functions the model invokes to *act* (API calls, DB writes, file ops). | `tools/list`, `tools/call` |
| **Resources** | Read-only data the app pulls for *context* (files, schemas, records). | `resources/list`, `resources/read` |
| **Prompts** | Reusable interaction templates the user invokes. | `prompts/list`, `prompts/get` |

**Client → server** (features the client exposes; servers *request* of the host):

- **Sampling** (`sampling/createMessage`) — server asks the host's LLM for a completion. Stay model-independent: no LLM SDK inside your server.
- **Elicitation** (`elicitation/create`) — server asks the user for structured input mid-operation (never passwords/API keys).
- **Roots** — client tells the server which filesystem directories are in scope. A *coordination* mechanism, not a security boundary: spec says servers SHOULD respect roots, not MUST enforce.
- **Logging** — server sends log messages to the client for debugging/monitoring.

**Cross-cutting utility primitives:**

- **Notifications** — real-time `*_list_changed` updates so clients re-list dynamic primitives.
- **Progress tracking** — status for long-running operations.
- **Cancellation / Ping** — abort in-flight requests; liveness checks.
- **Tasks (Experimental)** — durable execution wrappers: defer result retrieval and track status for expensive/long requests (batch jobs, multi-step workflows). Use when a `tools/call` can't return synchronously.

> **Complete primitive set (spec 2025-11-25):** server = tools · resources · prompts. client = sampling · elicitation · roots · logging. utility = notifications · progress · cancellation · ping · tasks.

→ Full per-primitive specs and SDK code in `Primitives.md`.
