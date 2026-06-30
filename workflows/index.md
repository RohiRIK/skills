# Workflows — composed skill chains

A single skill does one thing. A **workflow** wires several into a full job. **One workflow per document** — this file is the index; click through for the steps.

This directory is an **OKF bundle** ([Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)): every workflow is a markdown *concept* with YAML frontmatter (`type: Workflow`, plus `title`, `description`, `tags`, and a `chain` field carrying the canonical skill sequence). `index.md` (this file) and `log.md` are the OKF reserved files.

**A chain is executable, not descriptive.** Each step in a `chain` (e.g. `Spec`, `Verify`, `CreateMcp:BuildServer`, `/plan`) names a **skill or slash-command you must fetch and invoke** — load the skill with the Skill tool, or run the `/command`. Reading the doc is not running it. To traverse: read this index for the menu, open a concept, state its `chain` to the user, then invoke each step in order.

Two families (carried in each concept's `tags`):
- **Build & ship** (`build-ship`) — use the skills on a real project.
- **Maintain the library** (`maintain-library`) — meta chains that keep *this* repo healthy.

## A. Build & ship

| Workflow | Chain | Doc |
|----------|-------|-----|
| **Ship fast** (explore while building) | `[observe] → /plan → IMPLEMENT → /capture → /simplify → /verify → /commit-push-pr` | [ship-fast.md](ship-fast.md) |
| **Spec to ship** (spec-driven) | `/spec → /plan → /build (or /dev) → /test → /simplify → /capture → /verify → /commit-push-pr` | [spec-to-ship.md](spec-to-ship.md) |
| Research → build | `Research → Spec → /plan → /build → Verify → PR` | [research-to-build.md](research-to-build.md) |
| Research → report | `Research(deep) → DataReportBuilder → Art` | [research-to-report.md](research-to-report.md) |
| Research → buy (compare options) | `Research(deep) → comparison matrix → scored pick` | [research-to-buy.md](research-to-buy.md) |
| Onboard a codebase | `CodebaseOnboarding → Research → /spec → spec-to-ship` | [onboard.md](onboard.md) |
| Build a CLI | `[Research] → CreateCLI → Test → Verify → PR` | [build-cli.md](build-cli.md) |
| Build an MCP server | `CreateMcp:BuildServer → SecurityReview → :TestServer → :ConnectServer → PR` | [build-mcp.md](build-mcp.md) |
| UI feature (anti-slop) | `FrontendAesthetics → FrontendDesign → /simplify → Verify → CommitPush` | [ui-feature.md](ui-feature.md) |
| Frontend build (full) | `/spec → FrontendAesthetics → FrontendDesign → Art → /plan → /build → /test → Reflect → /verify → PR` | [frontend-build.md](frontend-build.md) |
| Backend / API feature | `BackendDesign → /spec → /build → Test → SecurityReview → PR` | [api-feature.md](api-feature.md) |
| Security pass | `SecurityReview → fix → Verify → CommitPush` | [security-pass.md](security-pass.md) |
| Context diet | `ContextBudget → trim → Verify` | [context-diet.md](context-diet.md) |
| Repo hygiene | `Hygiene → fix → GitHubOps:RepoHygiene` | [repo-hygiene.md](repo-hygiene.md) |

## B. Maintain the library

| Workflow | Chain | Doc |
|----------|-------|-----|
| New skill — quick | `Prompting → CreateSkill → TestSkill → /simplify → CommitPush` | [new-skill-quick.md](new-skill-quick.md) |
| New skill — heavy | `IterativeDepth → Spec → CreateSkill → TestSkill → Verify → PR` | [new-skill-heavy.md](new-skill-heavy.md) |
| Canonicalize a skill | `ValidateSkill → CanonicalizeSkill → CommitPush` | [canonicalize-skill.md](canonicalize-skill.md) |
| Fix a skill's trigger | `OptimizeDescription → TestSkill → CommitPush` | [fix-trigger.md](fix-trigger.md) |
| Iterate a skill (hands-off) | `Iterate(target, goal, max) → CommitPush` | [autonomous-loop.md](autonomous-loop.md) |
| Library-wide audit | `SkillForge → CanonicalizeSkill ×offenders → RepoHygiene → CommitPush` | [library-audit.md](library-audit.md) |
| Multi-skill batch build | `Spec → Orchestrate(parallel) → Verify → PR` | [batch-build.md](batch-build.md) |
| Release | `RepoHygiene → Changelog → Release` | [release.md](release.md) |

## Operating modes

| Layer | When | Control |
|-------|------|---------|
| **Quick** | Clear scope | Manual — review between steps (ship-fast) |
| **Autonomous** | Defined goal + exit condition | Hands-off loop (autonomous-loop), you check the result |
| **Heavy** | Multi-unit, complex, parallel | Spec → Orchestrate, PR-gated (spec-to-ship, batch-build) |

## Auto-composition (already wired)

- `Iterate` → calls **Verify** + **Reflect** every pass; carries dead-ends forward.
- `Orchestrate` → gates each unit with **Verify**, reviews each in its own context.
- `IterativeDepth` → feeds criteria into **Spec** / **Orchestrate**.
- `Research` → fans out to **Agy / OpenCode / Pi** + web search.

## State & telemetry

- Loop/multi-pass workflows share **`.agent-state.md`** (gitignored).
- Action workflows append a JSON line to **`~/.claude/state/execution.jsonl`**.

## Hard rule

Every autonomous loop names its **exit condition** before it starts. No unbounded loops.

> The ship-fast / spec-to-ship chains are adapted from [claude-code-config](https://github.com/RohiRIK/claude-code-config) (`CLAUDE.md`, `rules/workflow-guide.md`).
