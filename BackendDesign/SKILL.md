---
name: BackendDesign
description: "Reference for API design, database schema, and server architecture."
category: reference
effort: low
user-invocable: false
---

# BackendDesign

Backend architecture patterns and best practices for Bun/Hono/Drizzle/Cloudflare Workers stacks.

## Quick Reference

| Need | Load |
|------|------|
| API design, REST, validation | `API.md` |
| DB schema, queries, indexing | `Patterns.md` |
| ClickHouse streaming/analytics | `clickhouse-io.md` |
| Project-specific guidelines | `project-guidelines-example.md` |

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **ApplyPatterns** | "apply backend pattern", "refactor backend", "how should I structure this API", "best practice for X", "design this endpoint" |

Run a workflow:
`Run the ApplyPatterns workflow`

## Key Principles (from Patterns.md)

- API routes: validate input with Zod before touching business logic
- DB: prefer Drizzle ORM with explicit schema; avoid raw SQL for user input
- Error responses: always return `{ ok: false, error: string }` — never expose stack traces
- Auth: JWT in Authorization header; never in URL params or cookies without SameSite=Strict
- Use context7 before looking up Hono/Drizzle/Zod APIs

## Integration

- Pairs with `CodingStandards/TypeScript.md` for implementation rules
- Pairs with `SecurityReview` for auth/input handling audits
- Pairs with `database-reviewer` agent for query optimisation

## Gotchas

- Design the API contract (resource shapes, status codes, pagination, error envelope) before the schema — a schema-first API leaks storage details to clients.
- Index for the query patterns you actually run, not every column; an unused index is write-cost with no read benefit.

## Examples

**Example 1: New endpoint**
```
User: "design a paginated /orders API"
→ ApplyPatterns → resource naming, status codes, cursor pagination, error shape
```

**Example 2: Schema review**
```
User: "review this Postgres schema for the cart feature"
→ ApplyPatterns → normalization, FK/index choices, migration safety
```
