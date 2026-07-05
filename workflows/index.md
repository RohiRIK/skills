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
| Research → build | `Research(standard\|deep) → Spec → /plan → /build → Verify → GitHubOps:PullRequest` | [research-to-build.md](research-to-build.md) |
| Research → report | `Research(deep) → DataReportBuilder → Art(diagrams)` | [research-to-report.md](research-to-report.md) |
| Research → buy (compare options) | `Research(deep) → comparison matrix → scored recommendation` | [research-to-buy.md](research-to-buy.md) |
| Onboard a codebase | `CodebaseOnboarding → Research(fill gaps) → /spec (first change) → spec-to-ship` | [onboard.md](onboard.md) |
| Build a CLI | `[Research(API, if wrapping)] → CreateCLI → Test → Verify → GitHubOps:PullRequest` | [build-cli.md](build-cli.md) |
| Build an MCP server | `CreateMcp:BuildServer → SecurityReview → CreateMcp:TestServer → CreateMcp:ConnectServer → Verify → GitHubOps:PullRequest` | [build-mcp.md](build-mcp.md) |
| UI feature (anti-slop) | `FrontendAesthetics:DesignBrief → FrontendDesign(build) → FrontendAesthetics:SlopAudit → /simplify → Verify → GitHubOps:CommitPush` | [ui-feature.md](ui-feature.md) |
| Frontend build (full) | `/spec → FrontendAesthetics:DesignBrief → FrontendDesign → Art → /plan → /build → /test → FrontendAesthetics:SlopAudit → /simplify → Reflect → /verify → /commit-push-pr` | [frontend-build.md](frontend-build.md) |
| Backend / API feature | `BackendDesign(ref) → /spec → /build → Test → SecurityReview → GitHubOps:PullRequest` | [api-feature.md](api-feature.md) |
| Security pass | `SecurityReview → fix CRITICAL/HIGH → Verify → GitHubOps:CommitPush` | [security-pass.md](security-pass.md) |
| Context diet | `ContextBudget → trim agents / skills / MCP / rules → Verify` | [context-diet.md](context-diet.md) |
| Repo hygiene | `Hygiene → fix → GitHubOps:RepoHygiene` | [repo-hygiene.md](repo-hygiene.md) |

## B. Maintain the library

| Workflow | Chain | Doc |
|----------|-------|-----|
| New skill — quick | `Prompting → CreateSkill(scaffold) → CreateSkill:TestSkill → /simplify → GitHubOps:CommitPush` | [new-skill-quick.md](new-skill-quick.md) |
| New skill — heavy | `IterativeDepth → Spec → CreateSkill → CreateSkill:TestSkill → Verify → GitHubOps:PullRequest` | [new-skill-heavy.md](new-skill-heavy.md) |
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
