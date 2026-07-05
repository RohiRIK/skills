# CreateMcp — Security & Hardening

The hardening canon for any MCP server. Apply from the first tool, not after shipping. An MCP server sits at two attack surfaces at once: **LLM→MCP** (host turns NL intent into tool calls — agency + injection risk) and **MCP→API** (traditional auth/authz/egress). The overlap is the highest-risk zone.

Sources: MCP security best practices + MCP Authorization spec + OAuth 2.0 BCP (RFC 9700) + OWASP LLM Top 10 (2025) + OWASP Agentic Top 10 (2026) + CoSAI/OASIS MCP threat model + NSA MCP design considerations + MCPTox tool-poisoning research. Threat→control map in `Threats.md`.

## Non-negotiable gates (every server)

- **Validate every tool input at the boundary** with Zod/Pydantic. Typed, bounded, allowlisted. Never interpolate raw input into shell, SQL, URLs, or file paths. An unvalidated tool arg is a remote injection vector.
- **No generic pass-through tool.** A `run_query(string)` / `call_api(path)` / `exec(cmd)` tool bypasses every guardrail at once. Map each tool to a *fixed* endpoint with typed params. Attack surface = sum of tool schemas, not the whole backend.
- **Never return secrets.** Centralize redaction (one `redactSensitiveValues()` that blocks keys matching `secret|token|password|credential|key|thumbprint`) — never rely on individual tool authors. Tokens cached in memory only, never to disk.
- **Fail closed.** Server refuses to start when required config/credentials are missing. No `process.env.X || "default"`. Missing perms → clear error, not degraded behavior.
- **Secrets from env, validated at startup.** Never hardcoded, never logged (stderr or stdout).
- **Log to stderr** on stdio (stdout is the JSON-RPC wire). Use `notifications/message` for client-visible logs.
- **Normalize errors.** Dedicated error module strips raw response bodies, stack traces, and credential metadata. 403 → least-privilege remediation hint, not token details. 404 → generic (don't reveal existence).

## Least privilege & agency (LLM→MCP)

- **Read-only by default.** Ship reads first; defer write tools until HITL + audit + rate-limit + recovery exist. Excessive Agency (LLM06) is the CRITICAL MCP risk — an unregistered tool can't be called, hallucinated or not.
- **Per-tool narrow scopes**, never one broad credential shared across tools ("might need it" = every read-only tool inherits write). Each tool declares its minimum permission.
- **HITL for destructive/sensitive ops** — two-phase confirm: tool returns a *preview + warning* with `confirm:false`, executes only on `confirm:true`. Use an enforceable **schema parameter**, not a tool annotation (`destructiveHint` is informational; the host can ignore it — a required param it cannot). Tie confirm to the specific operation (atomic), not a reusable separate approval call.
- **Minimal default fields / bounded ranges.** Return concise field sets; require explicit date bounds on log/audit queries; caller opts into more.

## Tool & schema poisoning (LLM04 / MCPTox)

- **Static, first-party tool definitions.** Names, descriptions, schemas defined in your repo code — never generated from user input or backend data. No dynamic `tools/list` from untrusted sources.
- **No third-party tool metadata** imported from untrusted MCP servers.
- Treat all AI-generated and backend-returned data as **untrusted input** at the tool boundary.
- Optional: build-time linter that fails if a tool description contains authorization claims or instruction-like text.

## Resource exhaustion / denial-of-wallet (LLM10)

- **Pagination caps** — default page small (e.g. 20), hard max (e.g. 100). Bound auto-pagination (follow `nextLink` only to the cap).
- **Per-tool rate limiter** before handler execution; stricter limits on expensive queries; cooldown after a backend 429.
- **Request timeout / AbortSignal** on every outbound call — no hanging connections.
- Recommended: per-session / per-agent request budget; weight expensive queries.
- Return `nextLink` as a **bounded marker** (`more-available`), not an arbitrary URL the host can fetch (SSRF vector).

## Isolation (limit blast radius)

- **Stateless handlers** — no shared mutable state between calls.
- **No filesystem access, no child-process spawn** unless the tool's whole purpose; then confine to declared roots and validate paths (roots are advisory, enforce yourself).
- **Single outbound destination** by default; any base-URL override is reviewed; egress allowlist for managed deployments.
- Container hardening (non-root, read-only FS, restricted egress) is *hardening, not a complete boundary* — combine with least privilege + logging.

## Transport

| | stdio (local) | Streamable HTTP (remote) |
|---|---|---|
| Exposure | local pipe, no network | network — must harden |
| Auth | process ownership | **OAuth 2.1 + PKCE** (required) or mTLS (don't reuse backend creds for transport) |
| Required | — | TLS 1.3 min · bind loopback by default · CORS origin allowlist · payload limits · reject pre-init unauthorized RPC · validate redirect targets, block private/link-local URLs (SSRF) |

Per the current MCP authorization spec: clients **MUST** implement RFC 8707 (Resource Indicators) so an access token is scoped to the intended server, and servers **MUST** implement RFC 9728 (Protected Resource Metadata) so clients can discover the correct authorization server. Both are non-negotiable for HTTP-transport servers, not optional hardening.

### Token Passthrough — forbidden
A server **must not** accept a client token and forward it downstream without validating it was issued *for this server*. Breaks rate-limit/validation controls, destroys audit trail, lets a stolen token traverse services. **Validate token audience = your server; reject otherwise.** Mint a separate credential for downstream calls.

### Confused Deputy — guard the proxy
A proxy fronting a third-party API can be tricked into emitting auth codes without consent. **The consent cookie/session holding `state` must not be set until after the user approves consent.** Use `state` (CSRF) + PKCE + short-lived tokens + exact redirect-URI match; re-check audience/scope every request.

## Credentials (when the server authenticates to a backend)

- Prefer **certificate / managed identity** over a shared secret in production. Secret expiry ≤ 6 months. Two overlapping secrets for zero-downtime rotation; revoke immediately on exposure.
- Stable API versions only (no beta/undocumented endpoints).
- Lifecycle: inventory approved server versions/owners/launch commands (catch shadow MCP servers); recertify high-risk permissions after backend API changes; alert on credential expiry (30/14/7 days).

## Supply chain (LLM03)

- Pin dependency versions to exact releases; commit the lockfile; minimal runtime dep surface; static imports only (no dynamic `require`/`import`).
- Run `bun audit` regularly; generate an SBOM for release artifacts; bundle to a single reviewable artifact.
- Block unapproved MCP server launch commands in managed AI clients.

## Defensive output design (reduce LLM misuse)

- Explicit nulls (`"has no manager"` not empty) so the model doesn't hallucinate "not found".
- Empty list → `[]`, never an error — model distinguishes "none" from "failure".
- Structured metadata + IDs + timestamps; don't let the model overstate completeness of a bounded page.
- Don't accept system/host prompts as tool inputs (LLM07 leakage); avoid logging raw tool inputs in production.

## Audit (when writes exist)

- Structured audit entry per write: `{ tool, timestamp, target, result }` — **redact args before building the entry.** Persist to a rotating file / SIEM with immutable retention only after redaction is test-covered. Correlate to host session where privacy policy allows. Alert if N destructive ops in M minutes.

## Pre-ship gate

- [ ] Every tool input schema-validated; bounded/typed; no injection sink
- [ ] No generic pass-through / arbitrary-query tool exists
- [ ] No tool returns secrets; central redaction enforced
- [ ] Server fails to start without required credentials (fail-closed)
- [ ] Read-only by default; writes gated behind enforceable `confirm` + preview
- [ ] Per-tool least-privilege scopes; no shared broad credential
- [ ] Pagination caps + per-tool rate limit + outbound timeout
- [ ] Tool defs static/first-party; no dynamic metadata from untrusted data
- [ ] Errors normalized; logs to stderr; no stack traces or cred metadata
- [ ] (HTTP) token audience validated · TLS 1.3 · loopback bind · CORS allowlist · payload limits · SSRF redirect validation
- [ ] (HTTP) OAuth 2.1 + PKCE enforced; client implements RFC 8707, server implements RFC 9728
- [ ] (proxy/auth) consent before `state`; PKCE; exact redirect-URI
- [ ] Deps pinned + lockfile + `bun audit`; approved-server inventory
- [ ] Security tests assert all of the above (see `Workflows/TestServer.md`)
