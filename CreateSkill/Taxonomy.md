# CreateSkill — Skill Taxonomy

Before creating any skill, identify which of the 9 types it is (from Anthropic's skill taxonomy, via Thariq Shihipar's "Lessons from Building Claude Code", Mar 2026). The type shapes structure and testing decisions.

| # | Type | Focus | Key structure | Example |
|---|------|-------|---------------|---------|
| 1 | Library/API Reference | Gotchas, edge cases the model gets wrong | Lightweight, gotchas-heavy, reference snippets | CodingStandards, DockerPatterns |
| 2 | Product Validation | Test/verify code works | State assertions, browser/CLI automation, output recording | Verify |
| 3 | Data Fetching | Connect to data systems | Credential refs, query patterns, dashboard pointers | a metrics skill |
| 4 | Business Process | Automate repetitive workflows | Execution logs, consistency tracking | DataReportBuilder |
| 5 | Code Scaffolding | Generate framework boilerplate | Template files, project-aware scripts | CreateSkill, CreateCLI |
| 6 | Code Quality | Enforce standards, review | Deterministic scripts, hook integration | Simplify, code-review |
| 7 | CI/CD & Deployment | Deploy with safety patterns | Pre-deploy checks, smoke tests, rollback | a deploy skill |
| 8 | Operations Runbook | Map phenomena to diagnostics | Phenomenon → tool → query → report | a healthcheck skill |
| 9 | Infrastructure Ops | Maintenance with safety guardrails | Safety gates, audit logging, orphan detection | an infra-maintenance skill |

The type informs structure decisions — e.g. Type 1 skills are mostly gotchas; Type 7 needs safety gates and rollback; Type 5 ships templates.

## Skill Types vs the category Frontmatter Key

The 9 types above are an authoring lens (what kind of skill am I building?). The `category` frontmatter key (`workflow · reference · delegation · meta · visual · prompting · quality`) is a coarser routing/grouping annotation. They are related but not identical — a Type 6 (Code Quality) skill usually carries `category: quality`; a Type 5 (Scaffolding) skill usually carries `category: meta`. Pick the type first for structure, then set `category` for grouping.
