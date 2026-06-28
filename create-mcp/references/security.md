# CreateMcp — Security

Run this checklist before exposing a server — especially anything beyond a personal local stdio tool. Source: docs/tutorials/security/security_best_practices + MCP Authorization spec + OAuth 2.0 BCP (RFC 9700).

## Always (every server)

- **Validate all tool inputs** at the boundary with Zod/Pydantic. Never interpolate raw input into shell, SQL, or file paths — parameterize and allowlist.
- **Constrain scope.** A filesystem server gets explicit, absolute allowed directories — not the whole disk. Least privilege for every credential.
- **Secrets from env, never hardcoded.** `process.env.X` with a startup check that throws if missing. Don't log secrets.
- **Log to stderr, not stdout** on stdio servers (stdout is the JSON-RPC wire).
- **Don't leak internals in errors.** Return actionable, non-sensitive messages.

## Remote / HTTP servers (auth involved)

### Token Passthrough — forbidden
An MCP server **must not** accept a token from the client and forward it to a downstream API without validating the token was issued *for this server*. Passthrough breaks rate-limiting/validation controls, destroys the audit trail, and lets a stolen token traverse services.

**Mitigation:** validate the token **audience** is your server; reject anything not issued to you. Mint/exchange a separate credential for downstream calls.

### Confused Deputy — guard the proxy
A proxy MCP server fronting a third-party API can be tricked into emitting authorization codes without user consent.

**Mitigation:** the consent cookie/session holding the `state` value **must not** be set until *after* the user approves the consent screen at the server's authorization endpoint. Setting it earlier lets an attacker craft a request that skips consent.

### General authorization hygiene
- Follow the MCP Authorization spec + OAuth 2.0 security BCP.
- Validate `state` (CSRF), use PKCE, short-lived tokens, exact redirect-URI matching.
- Bind tokens to audience/scope; re-check on every request.

## Host-side trust

Tool calls run with real privileges. Hosts gate them behind approval dialogs — respect that: review each request, deny anything uncomfortable, and design tools so a single approval can't do unbounded damage (scope, confirm destructive ops, no hidden side effects).

## Pre-ship gate

- [ ] Every tool input schema-validated; no injection sinks
- [ ] Credentials from env, least-privilege, not logged
- [ ] (HTTP) token audience validated — no passthrough
- [ ] (HTTP proxy) consent set only after approval; `state`/PKCE in place
- [ ] Errors leak nothing sensitive; logs go to stderr
