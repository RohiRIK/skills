# Backend Design Principles & Integration

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
