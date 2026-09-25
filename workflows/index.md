# Workflows — composed skill chains

A single skill does one thing. A **workflow** wires several into a full job. **One workflow per document** — this file is the index; click through for the steps.

This directory is an **OKF bundle** ([Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)): every workflow is a markdown *concept* with YAML frontmatter (`type: Workflow`, plus `title`, `description`, `tags`, and a `chain` field carrying the canonical skill sequence). `index.md` (this file) and `log.md` are the OKF reserved files.

**A chain is executable, not descriptive.** Each step in a `chain` (e.g. `Spec`, `Verify`, `CreateMcp:BuildServer`) names a **skill you must fetch and invoke** (or `Skill:Workflow` for one step of a skill), never a host slash command — the same chain runs on any MCP-compatible host. Reading the doc is not running it. To traverse: read this index for the menu, open a concept, state its `chain` to the user, then invoke each step in order.

Two families (carried in each concept's `tags`):
- **Build & ship** (`build-ship`) — use the skills on a real project.
- **Maintain the library** (`maintain-library`) — meta chains that keep *this* repo healthy.

## A. Build & ship

| Workflow | Chain | Doc |
|----------|-------|-----|
| **Ship fast** (explore while building) | ` → Spec → Build → Reflect → Simplify → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest` | [ship-fast.md](ship-fast.md) |
| **Spec to ship** (spec-driven) | `Spec → Build → Test → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest` | [spec-to-ship.md](spec-to-ship.md) |
| Research → build | `Research(standard\|deep) → Spec → Build → Verify → GitHubOps:PullRequest` | [research-to-build.md](research-to-build.md) |
| Research → report | `Research(deep) → DataReportBuilder → Art(diagrams)` | [research-to-report.md](research-to-report.md) |
| Research → buy (compare options) | `Research(deep) → comparison matrix → scored recommendation` | [research-to-buy.md](research-to-buy.md) |
| Onboard a codebase | `CodebaseOnboarding → Research(fill gaps) → Spec (first change) → spec-to-ship` | [onboard.md](onboard.md) |
| Build a CLI | `[Research(API, if wrapping)] → CreateCLI → Test → Verify → GitHubOps:PullRequest` | [build-cli.md](build-cli.md) |
| Build an MCP server | `CreateMcp:BuildServer → SecurityReview → CreateMcp:TestServer → CreateMcp:ConnectServer → Verify → GitHubOps:PullRequest` | [build-mcp.md](build-mcp.md) |
| UI feature (anti-slop) | `FrontendAesthetics:DesignBrief → FrontendDesign(build) → FrontendAesthetics:SlopAudit → Simplify → Verify → GitHubOps:CommitPush` | [ui-feature.md](ui-feature.md) |
| Frontend build (full) | `Spec → FrontendAesthetics:DesignBrief → FrontendDesign → Art → Spec → Build → Test → FrontendAesthetics:SlopAudit → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest` | [frontend-build.md](frontend-build.md) |
| Backend / API feature | `BackendDesign(ref) → Spec → Build → Test → SecurityReview → GitHubOps:PullRequest` | [api-feature.md](api-feature.md) |
| Security pass | `SecurityReview → fix CRITICAL/HIGH → Verify → GitHubOps:CommitPush` | [security-pass.md](security-pass.md) |
| Context diet | `ContextBudget → trim agents / skills / MCP / rules → Verify` | [context-diet.md](context-diet.md) |
| Repo hygiene | `Hygiene → fix → GitHubOps:RepoHygiene` | [repo-hygiene.md](repo-hygiene.md) |

## B. Maintain the library

| Workflow | Chain | Doc |
|----------|-------|-----|
| New skill — quick | `Prompting → CreateSkill(scaffold) → CreateSkill:TestSkill → Simplify → GitHubOps:CommitPush` | [new-skill-quick.md](new-skill-quick.md) |
| New skill — heavy | `Iterate:RunLenses → Spec → CreateSkill → CreateSkill:TestSkill → Verify → GitHubOps:PullRequest` | [new-skill-heavy.md](new-skill-heavy.md) |
| Canonicalize a skill | `CreateSkill:ValidateSkill → CreateSkill:CanonicalizeSkill → GitHubOps:CommitPush` | [canonicalize-skill.md](canonicalize-skill.md) |
| Fix a skill's trigger | `CreateSkill:OptimizeDescription → CreateSkill:TestSkill → GitHubOps:CommitPush` | [fix-trigger.md](fix-trigger.md) |
| Iterate a skill (hands-off) | `Iterate(target, goal, max) → [Verify + Reflect each pass] → GitHubOps:CommitPush` | [autonomous-loop.md](autonomous-loop.md) |
| Library-wide audit | `SkillForge → CreateSkill:CanonicalizeSkill ×offenders → GitHubOps:RepoHygiene → GitHubOps:CommitPush` | [library-audit.md](library-audit.md) |
| Multi-skill batch build | `Spec → Orchestrate(Decompose → RunLayer → MergeQueue) → Verify [final integration gate — Orchestrate already verifies each unit] → GitHubOps:PullRequest` | [batch-build.md](batch-build.md) |
| Release | `GitHubOps:RepoHygiene → GitHubOps:Changelog → GitHubOps:Release` | [release.md](release.md) |

## Operating modes

| Layer | When | Control |
|-------|------|---------|
| **Quick** | Clear scope | Manual — review between steps (ship-fast) |
| **Autonomous** | Defined goal + exit condition | `Iterate` runs the passes; you check the result |
| **Heavy** | Multi-unit, complex, parallel | Spec → Orchestrate, PR-gated (spec-to-ship, batch-build) |

## Auto-composition (already wired)

- `Iterate` → calls **Verify** + **Reflect** every pass; carries dead-ends forward; picks wake or inline pass driver from the host's capabilities.
- `Orchestrate` → gates each unit with **Verify**, reviews each in its own context.
- `Iterate:RunLenses` → feeds criteria into **Spec** / **Orchestrate**.
- `Research` → fans out to **Agy / OpenCode / Pi** + web search.

## State & telemetry

- Loop/multi-pass workflows share **`.agent-state.md`** (gitignored).
- Action workflows append a JSON line to **`~/.claude/state/execution.jsonl`**.

## Hard rule

Every autonomous loop names its **exit condition** before it starts. No unbounded loops.

> A `chain` is the single source of truth: it lives in each concept's `chain:` frontmatter, and `skills/Workflows/Chains.md` mirrors it. `./gen-manifest.sh` fails if the three copies drift.

> The ship-fast / spec-to-ship chains are adapted from [claude-code-config](https://github.com/RohiRIK/claude-code-config) (`CLAUDE.md`, `rules/workflow-guide.md`).
