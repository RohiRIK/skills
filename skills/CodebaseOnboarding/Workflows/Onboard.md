# Onboard — the 4-phase analysis

## Phase 1: Reconnaissance

Gather raw signals without reading every file — Glob/Grep, parallel, Read only for ambiguous signals:

1. **Package manifests** — package.json, go.mod, Cargo.toml, pyproject.toml, pom.xml, build.gradle, Gemfile, composer.json, mix.exs, pubspec.yaml
2. **Framework fingerprints** — next.config.*, nuxt.config.*, angular.json, vite.config.*, django settings, flask app factory, fastapi main, rails config
3. **Entry points** — main.*, index.*, app.*, server.*, cmd/, src/main/
4. **Directory snapshot** — top 2 levels, ignoring node_modules, vendor, .git, dist, build, __pycache__, .next
5. **Config & tooling** — .eslintrc*, .prettierrc*, tsconfig.json, Makefile, Dockerfile, docker-compose*, .github/workflows/, .env.example
6. **Test structure** — tests/, __tests__/, *_test.go, *.spec.ts, pytest.ini, jest/vitest configs

## Phase 2: Architecture Mapping

From the signals, identify:
- **Tech stack** — languages + versions, frameworks, DBs/ORMs, build tools, CI/CD.
- **Architecture pattern** — monolith / monorepo / microservices / serverless; frontend-backend split; API style (REST, GraphQL, gRPC, tRPC).
- **Key directories** — map top-level dirs to purpose (only non-obvious ones).
- **Data flow** — trace ONE request end-to-end: entry (router/handler) → validation (middleware/schema) → business logic (services) → persistence (ORM/queries).

## Phase 3: Convention Detection

- **Naming** — file case style, component/class patterns, test-file naming.
- **Code patterns** — error handling (try/catch vs Result), DI vs direct imports, state management, async style.
- **Git** — branch naming, commit style, PR workflow from recent history. Shallow/no history → note "Git history unavailable" and skip.

Verify, don't guess: if config says one framework and the code uses another, trust the code. Can't determine something confidently → say so ("Could not determine test runner"), never invent.

## Phase 4: Generate Artifacts

1. **Onboarding Guide** — from `../Templates/OnboardingGuide.md`; replace every example (Next.js/Prisma/npm) with the detected stack. Scannable in 2 minutes.
2. **Starter CLAUDE.md** — from `../Templates/StarterClaudeMd.md`, written to the project root. If one exists: read it, preserve project-specific instructions, enhance, and call out what changed. Keep under 100 lines; capture the non-obvious (conventions, gotchas, build quirks), not the file tree.

Anti-patterns: listing every dependency (only the ones that shape code), explaining obvious directories, copying the README.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CodebaseOnboarding","workflow":"Onboard","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
