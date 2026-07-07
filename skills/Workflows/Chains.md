# Chains — the full workflow index

Every composed chain in the library. Pick by task, run the skills left-to-right. Full step-by-step for each is in the repo as an **OKF bundle** at `workflows/<name>.md` (from this installed skill: `../../../workflows/<name>.md`) — each doc has YAML frontmatter (`type: Workflow`, `chain`, `tags`); bundle index `workflows/index.md`. This table is the portable mirror for when the bundle isn't reachable.

## A. Build & ship (developer / researcher work on a project)

| Workflow | Chain | When |
|----------|-------|------|
| **ship-fast** | `[observe] → /plan → IMPLEMENT → /capture → /simplify → /verify → /commit-push-pr` | Clear-enough scope, move fast, discover details mid-flight. |
| **spec-to-ship** | `/spec → /plan → /build (or /dev) → /test → /simplify → /capture → /verify → /commit-push-pr` | Know exactly what to build; spec-driven. Bug fix = `/test → /simplify → /verify → ship`. |
| **research-to-build** | `Research(standard\|deep) → Spec → /plan → /build → Verify → GitHubOps:PullRequest` | Unknown domain/library/API — ground the spec first. |
| **research-to-report** | `Research(deep) → DataReportBuilder → Art(diagrams)` | Deliverable is cited findings + visuals, not code. |
| **research-to-buy** | `Research(deep) → comparison matrix → scored recommendation` | Compare products/tools/vendors before buying or adopting. |
| **onboard** | `CodebaseOnboarding → Research(fill gaps) → /spec (first change) → spec-to-ship` | Join an unfamiliar repo, then make the first change. |
| **build-cli** | `[Research(API, if wrapping)] → CreateCLI → Test → Verify → GitHubOps:PullRequest` | Ship a TypeScript command-line tool. |
| **build-mcp** | `CreateMcp:BuildServer → SecurityReview → CreateMcp:TestServer → CreateMcp:ConnectServer → Verify → GitHubOps:PullRequest` | Scaffold, secure, test, connect an MCP server. |
| **ui-feature** | `FrontendAesthetics:DesignBrief → FrontendDesign(build) → FrontendAesthetics:SlopAudit → /simplify → Verify → GitHubOps:CommitPush` | Frontend change that isn't AI-slop — brief before build, audit after. |
| **frontend-build** | `/spec → FrontendAesthetics:DesignBrief → FrontendDesign → Art → /plan → /build → /test → FrontendAesthetics:SlopAudit → /simplify → Reflect → /verify → /commit-push-pr` | Full frontend build with assets. |
| **api-feature** | `BackendDesign(ref) → /spec → /build → Test → SecurityReview → GitHubOps:PullRequest` | Backend/API change, security-gated. |
| **security-pass** | `SecurityReview → fix CRITICAL/HIGH → Verify → GitHubOps:CommitPush` | Harden existing code before release. |
| **context-diet** | `ContextBudget → trim agents / skills / MCP / rules → Verify` | Cut context-window bloat. |
| **repo-hygiene** | `Hygiene → fix → GitHubOps:RepoHygiene` | Periodic config + repo cleanup. |

## B. Maintain the library (build your own skill library — not specific to this repo)

| Workflow | Chain | When |
|----------|-------|------|
| **new-skill-quick** | `Prompting → CreateSkill(scaffold) → CreateSkill:TestSkill → /simplify → GitHubOps:CommitPush` | New skill, clear scope, single capability. |
| **new-skill-heavy** | `Iterate(--lenses) → Spec → CreateSkill → CreateSkill:TestSkill → Verify → GitHubOps:PullRequest` | Complex, multi-workflow skill; shape unclear. |
| **canonicalize-skill** | `CreateSkill:ValidateSkill → CreateSkill:CanonicalizeSkill → GitHubOps:CommitPush` | Skill structure broken / drifted from canon. |
| **fix-trigger** | `CreateSkill:OptimizeDescription → CreateSkill:TestSkill → GitHubOps:CommitPush` | Skill won't activate or mis-fires. |
| **autonomous-loop** | `Iterate(target, goal, [max]) → [one pass/turn, Verify + Reflect, ScheduleWakeup re-fires until exit] → GitHubOps:CommitPush` | Improve a target hands-off. Iterate runs one pass per turn and re-invokes itself via `ScheduleWakeup` until goal met or cap; unset args default. Launch directly or as `/loop /iterate …`. |
| **library-audit** | `SkillForge → CreateSkill:CanonicalizeSkill ×offenders → GitHubOps:RepoHygiene → GitHubOps:CommitPush` | Whole-library health sweep. |
| **batch-build** | `Spec → Orchestrate(Decompose → RunLayer → MergeQueue) → Verify [final integration gate — Orchestrate already verifies each unit] → GitHubOps:PullRequest` | Build/refactor many skills at once. |
| **release** | `GitHubOps:RepoHygiene → GitHubOps:Changelog → GitHubOps:Release` | Cut a tagged version. |

## Operating modes

- **Quick** — clear scope, manual review between steps (ship-fast).
- **Autonomous** — defined goal + exit condition, hands-off loop (autonomous-loop). Self-re-invokes
  via `ScheduleWakeup`; use `/schedule` to make it recurring on a cron.
- **Heavy** — multi-unit/parallel, PR-gated (spec-to-ship, batch-build).

## Native loop primitives

The autonomous chains sit on the harness's built-in loop surface:
- **`/loop <interval> <prompt>`** — re-run a prompt/command on your machine on an interval; omit the
  interval for model-paced (dynamic) re-invocation. `/loop /iterate …` drives the autonomous-loop chain.
- **`/schedule`** — move a recurring routine to a cloud cron (survives your machine being off).
- **`ScheduleWakeup`** — the tool `Iterate` calls to re-fire itself pass-by-pass; the self-contained
  path when you invoke `/iterate` directly rather than under `/loop`.
- **`/goal`** — evaluator-enforced exit condition. Research preview; if unavailable, `Iterate`'s
  state-file exit conditions provide the equivalent.

## Hard rule

Every autonomous loop names its exit condition before it starts. No unbounded loops.
