# Chains — the full workflow index

Every composed chain in the library. Pick by task, run the skills left-to-right. Full step-by-step for each is in the repo at `workflows/<name>.md` (from this installed skill: `../../../workflows/<name>.md`).

## A. Build & ship (use the skills on a project)

| Workflow | Chain | When |
|----------|-------|------|
| **ship-fast** | `[observe] → /plan → IMPLEMENT → /capture → /simplify → /verify → /commit-push-pr` | Clear-enough scope, move fast, discover details mid-flight. |
| **spec-to-ship** | `/spec → /plan → /build (or /dev) → /test → /simplify → /capture → /verify → /commit-push-pr` | Know exactly what to build; spec-driven. Bug fix = `/test → /simplify → /verify → ship`. |
| **research-to-build** | `Research → Spec → /plan → /build → Verify → PR` | Unknown domain/library/API — ground the spec first. |
| **research-to-report** | `Research(deep) → DataReportBuilder → Art` | Deliverable is cited findings + visuals, not code. |
| **research-to-buy** | `Research(deep) → comparison matrix → scored pick` | Compare products/tools/vendors before buying or adopting. |
| **onboard** | `CodebaseOnboarding → Research → /spec → spec-to-ship` | Join an unfamiliar repo, then make the first change. |
| **build-cli** | `[Research] → CreateCLI → Test → Verify → PR` | Ship a TypeScript command-line tool. |
| **build-mcp** | `CreateMcp:BuildServer → SecurityReview → :TestServer → :ConnectServer → PR` | Scaffold, secure, test, connect an MCP server. |
| **ui-feature** | `FrontendAesthetics → FrontendDesign → /simplify → Verify → CommitPush` | Frontend change that isn't AI-slop — direction before components. |
| **frontend-build** | `/spec → FrontendAesthetics → FrontendDesign → Art → /plan → /build → /test → Reflect → /verify → PR` | Full frontend build with assets. |
| **api-feature** | `BackendDesign → /spec → /build → Test → SecurityReview → PR` | Backend/API change, security-gated. |
| **security-pass** | `SecurityReview → fix → Verify → CommitPush` | Harden existing code before release. |
| **context-diet** | `ContextBudget → trim → Verify` | Cut context-window bloat. |
| **repo-hygiene** | `Hygiene → fix → GitHubOps:RepoHygiene` | Periodic config + repo cleanup. |

## B. Maintain the library (meta)

| Workflow | Chain | When |
|----------|-------|------|
| **new-skill-quick** | `Prompting → CreateSkill → TestSkill → /simplify → CommitPush` | New skill, clear scope, single capability. |
| **new-skill-heavy** | `IterativeDepth → Spec → CreateSkill → TestSkill → Verify → PR` | Complex, multi-workflow skill; shape unclear. |
| **canonicalize-skill** | `ValidateSkill → CanonicalizeSkill → CommitPush` | Skill structure broken / drifted from canon. |
| **fix-trigger** | `OptimizeDescription → TestSkill → CommitPush` | Skill won't activate or mis-fires. |
| **autonomous-loop** | `Iterate(target, goal, max) → CommitPush` | Improve a target hands-off; Iterate auto-runs Verify+Reflect each pass. |
| **library-audit** | `SkillForge → CanonicalizeSkill ×offenders → RepoHygiene → CommitPush` | Whole-library health sweep. |
| **batch-build** | `Spec → Orchestrate(parallel) → Verify → PR` | Build/refactor many skills at once. |
| **release** | `GitHubOps:RepoHygiene → Changelog → Release` | Cut a tagged version. |

## Operating modes

- **Quick** — clear scope, manual review between steps (ship-fast).
- **Autonomous** — defined goal + exit condition, hands-off loop (autonomous-loop).
- **Heavy** — multi-unit/parallel, PR-gated (spec-to-ship, batch-build).

## Hard rule

Every autonomous loop names its exit condition before it starts. No unbounded loops.
