---
name: backend-design
description: "Use when reference for API design, database schema, and server architecture."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='backend-design', file_path='references/apply-patterns.md') before taking any action."
---
# BackendDesign
Backend architecture patterns for Bun/Hono/Drizzle/Cloudflare Workers stacks.
For key principles and integration details see `references/principles.md`.

## Quick Reference

| Need | Load |
|------|------|
| API design, REST, validation | api.md |
| DB schema, queries, indexing | patterns.md |
| ClickHouse streaming/analytics | `clickhouse-io.md` |
| Project-specific guidelines | `project-guidelines-example.md` |

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **ApplyPatterns** | "apply backend pattern", "refactor backend", "how should I structure this API", "best practice for X", "design this endpoint" |

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
