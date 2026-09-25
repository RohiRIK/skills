# Chains — the full workflow index

Every composed chain in the library, named by **skill**, never by host slash command — the same table runs on any MCP-compatible host. Pick by task, run the skills left-to-right. In this repo the full step-by-step for each lives in the **OKF bundle** at `workflows/<name>.md` (each doc has YAML frontmatter: `type: Workflow`, `chain`, `tags`; index `workflows/index.md`). This table is the portable mirror for when the bundle isn't reachable — chains come from each concept's `chain:` frontmatter, and `./gen-manifest.sh` fails if the three copies drift.

## A. Build & ship (developer / researcher work on a project)

| Workflow | Chain | When |
|----------|-------|------|
| **ship-fast** | ` → Spec → Build → Reflect → Simplify → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest` | Clear-enough scope, move fast, discover details mid-flight. |
| **spec-to-ship** | `Spec → Build → Test → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest` | Know exactly what to build; spec-driven. Bug fix = `Test → Simplify → Verify → ship`. |
| **research-to-build** | `Research(standard\|deep) → Spec → Build → Verify → GitHubOps:PullRequest` | Unknown domain/library/API — ground the spec first. |
| **research-to-report** | `Research(deep) → DataReportBuilder → Art(diagrams)` | Deliverable is cited findings + visuals, not code. |
| **research-to-buy** | `Research(deep) → comparison matrix → scored recommendation` | Compare products/tools/vendors before buying or adopting. |
| **onboard** | `CodebaseOnboarding → Research(fill gaps) → Spec (first change) → spec-to-ship` | Join an unfamiliar repo, then make the first change. |
| **build-cli** | `[Research(API, if wrapping)] → CreateCLI → Test → Verify → GitHubOps:PullRequest` | Ship a TypeScript command-line tool. |
| **build-mcp** | `CreateMcp:BuildServer → SecurityReview → CreateMcp:TestServer → CreateMcp:ConnectServer → Verify → GitHubOps:PullRequest` | Scaffold, secure, test, connect an MCP server. |
| **ui-feature** | `FrontendAesthetics:DesignBrief → FrontendDesign(build) → FrontendAesthetics:SlopAudit → Simplify → Verify → GitHubOps:CommitPush` | Frontend change that isn't AI-slop — brief before build, audit after. |
| **frontend-build** | `Spec → FrontendAesthetics:DesignBrief → FrontendDesign → Art → Spec → Build → Test → FrontendAesthetics:SlopAudit → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest` | Full frontend build with assets. |
| **api-feature** | `BackendDesign(ref) → Spec → Build → Test → SecurityReview → GitHubOps:PullRequest` | Backend/API change, security-gated. |
| **security-pass** | `SecurityReview → fix CRITICAL/HIGH → Verify → GitHubOps:CommitPush` | Harden existing code before release. |
| **context-diet** | `ContextBudget → trim agents / skills / MCP / rules → Verify` | Cut context-window bloat. |
| **repo-hygiene** | `Hygiene → fix → GitHubOps:RepoHygiene` | Periodic config + repo cleanup. |

## B. Maintain the library (build your own skill library — not specific to this repo)

| Workflow | Chain | When |
|----------|-------|------|
| **new-skill-quick** | `Prompting → CreateSkill(scaffold) → CreateSkill:TestSkill → Simplify → GitHubOps:CommitPush` | New skill, clear scope, single capability. |
| **new-skill-heavy** | `Iterate:RunLenses → Spec → CreateSkill → CreateSkill:TestSkill → Verify → GitHubOps:PullRequest` | Complex, multi-workflow skill; shape unclear. |
| **canonicalize-skill** | `CreateSkill:ValidateSkill → CreateSkill:CanonicalizeSkill → GitHubOps:CommitPush` | Skill structure broken / drifted from canon. |
| **fix-trigger** | `CreateSkill:OptimizeDescription → CreateSkill:TestSkill → GitHubOps:CommitPush` | Skill won't activate or mis-fires. |
| **autonomous-loop** | `Iterate(target, goal, max) → [Verify + Reflect each pass] → GitHubOps:CommitPush` | Improve a target hands-off. `Iterate` picks its pass driver from the host: a wake primitive (`ScheduleWakeup`, `/loop` on Claude Code) means one pass per turn, no primitive means passes run inline in one turn. Unset args default. |
| **library-audit** | `SkillForge → CreateSkill:CanonicalizeSkill ×offenders → GitHubOps:RepoHygiene → GitHubOps:CommitPush` | Whole-library health sweep. |
| **batch-build** | `Spec → Orchestrate(Decompose → RunLayer → MergeQueue) → Verify [final integration gate — Orchestrate already verifies each unit] → GitHubOps:PullRequest` | Build/refactor many skills at once. |
| **release** | `GitHubOps:RepoHygiene → GitHubOps:Changelog → GitHubOps:Release` | Cut a tagged version. |

## Operating modes

- **Quick** — clear scope, manual review between steps (ship-fast).
- **Autonomous** — defined goal + exit condition, hands-off passes (autonomous-loop). `Iterate`
  re-invokes itself only where the host gives it a wake primitive; elsewhere the passes run inline.
- **Heavy** — multi-unit/parallel, PR-gated (spec-to-ship, batch-build).

## Host loop primitives (optional)

Chains never depend on these. `Iterate` uses one only if the host exposes it:
- **Claude Code `ScheduleWakeup` / `/loop`** — re-fires `/iterate … --resume` between passes (wake mode).
- **`/schedule`** — Claude Code only: move a recurring routine to a cloud cron.
- **`/goal`** — Claude Code research preview: evaluator-enforced exit condition. Without it, `Iterate`'s
  state-file exit conditions are the equivalent.

## Hard rule

Every autonomous loop names its exit condition before it starts. No unbounded loops.
