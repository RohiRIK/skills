---
name: BackendDesign
description: "Reference for API design, database schema, and server architecture. USE WHEN designing an API, modeling a schema, or structuring a backend service."
category: reference
effort: low
domain: dev
user-invocable: true
---

# BackendDesign

Backend architecture patterns, Bun-first (Hono / Drizzle / Cloudflare Workers focus). `Patterns.md` carries framework-generic patterns on web-standard `Request`/`Response` that apply to all of them.

## Quick Reference

| Need | Load |
|------|------|
| API design, REST, validation | `API.md` |
| Architecture, DB, caching, auth, queues | `Patterns.md` |
| ClickHouse streaming/analytics | `ClickhouseIo.md` |

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **ApplyPatterns** | "apply backend pattern", "refactor backend", "how should I structure this API", "design this endpoint" |

## Key Principles

- API routes: validate input with Zod before touching business logic
- DB: prefer Drizzle ORM with explicit schema; avoid raw SQL for user input
- Error responses: always return `{ ok: false, error: string }` — never expose stack traces
- Auth: JWT in Authorization header; never in URL params or cookies without SameSite=Strict
- Use context7 before looking up Hono/Drizzle/Zod APIs

## Integration

- `CodingStandards/TypeScript.md` for implementation rules · `SecurityReview` for auth/input audits · `database-reviewer` agent for query optimisation

## Gotchas

- Design the API contract (resource shapes, status codes, pagination, error envelope) before the schema — a schema-first API leaks storage details to clients.
- Index for the query patterns you actually run, not every column; an unused index is write-cost with no read benefit.

## Examples

**Example 1:** "design a paginated /orders API" → ApplyPatterns → resource naming, status codes, cursor pagination, error shape.

**Example 2:** "review this Postgres schema for the cart feature" → ApplyPatterns → normalization, FK/index choices, migration safety.
