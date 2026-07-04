# Onboarding Guide: [Project Name]

## Overview
[2-3 sentences: what this project does and who it serves]

## Tech Stack
<!-- Example for a Next.js project — replace with detected stack -->
| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | 5.x |
| Framework | Next.js | 14.x |
| Database | PostgreSQL | 16 |
| ORM | Prisma | 5.x |
| Testing | Jest + Playwright | - |

## Architecture
[Diagram or description of how components connect]

## Key Entry Points
<!-- Example for a Next.js project — replace with detected paths -->
- **API routes**: `src/app/api/` — Next.js route handlers
- **UI pages**: `src/app/(dashboard)/` — authenticated pages
- **Database**: `prisma/schema.prisma` — data model source of truth
- **Config**: `next.config.ts` — build and runtime config

## Directory Map
[Top-level directory → purpose mapping]

## Request Lifecycle
[Trace one API request from entry to response]

## Conventions
- [File naming pattern]
- [Error handling approach]
- [Testing patterns]
- [Git workflow]

## Common Tasks
<!-- Example for a Node.js project — replace with detected commands -->
- **Run dev server**: `npm run dev`
- **Run tests**: `npm test`
- **Run linter**: `npm run lint`
- **Database migrations**: `npx prisma migrate dev`
- **Build for production**: `npm run build`

## Where to Look
<!-- Example for a Next.js project — replace with detected paths -->
| I want to... | Look at... |
|--------------|-----------|
| Add an API endpoint | `src/app/api/` |
| Add a UI page | `src/app/(dashboard)/` |
| Add a database table | `prisma/schema.prisma` |
| Add a test | `tests/` matching the source path |
| Change build config | `next.config.ts` |
