# Skill Taxonomy

Before creating any skill, identify which of the 9 types it is. The type shapes structure and testing decisions. Derived from Anthropic's skill taxonomy (Thariq Shihipar, "Lessons from Building Claude Code", Mar 2026).

## The 9 Types

| # | Type | Focus | Key structure | Example |
|---|------|-------|---------------|---------|
| 1 | Library/API Reference | Gotchas, edge cases the model gets wrong | Lightweight, gotchas-heavy, reference snippets | coding-standards, docker-patterns |
| 2 | Product Validation | Test/verify code works | State assertions, browser/CLI automation, output recording | verify |
| 3 | Data Fetching | Connect to data systems | Credential refs, query patterns, dashboard pointers | a metrics skill |
| 4 | Business Process | Automate repetitive workflows | Execution logs, consistency tracking | data-report-builder |
| 5 | Code Scaffolding | Generate framework boilerplate | Template files, project-aware scripts | create-skill, create-cli |
| 6 | Code Quality | Enforce standards, review | Deterministic scripts, hook integration | simplify, code-review |
| 7 | CI/CD & Deployment | Deploy with safety patterns | Pre-deploy checks, smoke tests, rollback | a deploy skill |
| 8 | Operations Runbook | Map phenomena to diagnostics | Phenomenon → tool → query → report | a healthcheck skill |
| 9 | Infrastructure Ops | Maintenance with safety guardrails | Safety gates, audit logging, orphan detection | an infra-maintenance skill |

## How Type Shapes Structure

- **Type 1 (Reference):** Mostly gotchas. Keep SKILL.md thin — it's a lookup, not a workflow.
- **Type 2 (Validation):** Needs state assertions, expected-output recording, automation scripts.
- **Type 3 (Data Fetching):** Credential references, query patterns, dashboard pointers.
- **Type 4 (Business Process):** Execution logs, consistency tracking, idempotency.
- **Type 5 (Scaffolding):** Ships templates, generates boilerplate, project-aware.
- **Type 6 (Code Quality):** Deterministic scripts, hook integration, pass/fail gates.
- **Type 7 (CI/CD):** Safety gates, rollback procedures, smoke tests.
- **Type 8 (Ops Runbook):** Phenomenon → tool → query → report pattern.
- **Type 9 (Infra Ops):** Safety guardrails, audit logging, orphan detection.

## Type vs Category

The 9 types are an authoring lens (what kind of skill am I building?). The `category` frontmatter key (`workflow · reference · delegation · meta · visual · prompting · quality`) is a coarser routing/grouping annotation. They are related but not identical:

- Type 6 (Code Quality) usually → `category: quality`
- Type 5 (Scaffolding) usually → `category: meta`
- Type 1 (Reference) usually → `category: reference`

Pick the type first for structure, then set `category` for grouping.
