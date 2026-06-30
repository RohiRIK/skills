# Changelog

All notable changes to this skills library. Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## 2026-06-30 — Workflows → OKF bundle

### Added
- **`workflows/` is now an OKF bundle** ([Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)) — every workflow is a markdown *concept* with YAML frontmatter (`type: Workflow`, `title`, `description`, `tags`, `chain`). Reserved files `index.md` (the progressive-disclosure index, renamed from `README.md`) and `log.md` (bundle history). Each concept opens with a read-receipt step: state the `chain` before running it.

### Changed
- **`Workflows` skill made granular + general** — routing is now one row per workflow across two families (**Build & ship software**, **Author & maintain skills**), framed for any developer/researcher rather than this repo only. Invoked without a named workflow → presents the full menu and asks which to run.
- **`gen-manifest.sh` reads workflow frontmatter** — the `workflows` array in `skills.json` now carries `title`, `tags`, `chain`, and `summary` pulled from each concept's frontmatter (was: first heading line); `workflows_index` → `workflows/index.md`. `llms.txt` lists each chain with its sequence.

### Removed
- **`/workflow` slash command** (`commands/workflow.md`) and its `install.sh` command-install plumbing — redundant with the model-invocable `Workflows` skill, which is now the sole router.

## 2026-06-29 — Workflows + CreateMcp

### Added
- **Workflows** skill (`skills/Workflows/`) — installed, model-invocable router that gives an AI agent the composed chains as an actionable layer (the `workflows/` docs themselves aren't symlinked into `~/.claude`). `SKILL.md` routes a task → workflow; `Chains.md` holds all 22 chains with their skill sequences. Skill count 33 → 34.
- **`workflows/`** — composed skill chains documenting how to combine skills into full jobs, **one document per workflow**, in two families. Build & ship: `ship-fast`, `spec-to-ship`, `research-to-build`, `research-to-report`, `research-to-buy`, `onboard`, `build-cli`, `build-mcp`, `ui-feature`, `api-feature`, `security-pass`, `context-diet`, `repo-hygiene`. Maintain the library: `new-skill-quick`, `new-skill-heavy`, `canonicalize-skill`, `fix-trigger`, `autonomous-loop`, `library-audit`, `batch-build`, `release`. Indexed by `workflows/index.md`; pointers added to `README.md` + `CLAUDE.md`.
- **CreateMcp** — `Threats.md` (OWASP LLM × MCP, CoSAI, tool poisoning) and `Workflows/TestServer.md` (mcp-testing-kit + Inspector CLI + security suite), both wired into routing.

### Changed
- **AI discovery now covers workflows** — `gen-manifest.sh` emits the `workflows/` chains into `skills.json` (`workflows` array + `workflows_index`) and `llms.txt` (a "Workflows" section + how-to-consume pointer). An AI fetching the repo discovers the composed chains, not just individual skills. Added the `frontend-build` workflow.
- **Repo restructure** — all 33 skill folders moved from the repo root into **`skills/`**. `install.sh` + `gen-manifest.sh` now scan `skills/*`; `skills.json` / `llms.txt` paths are `skills/<Name>/`; README, CLAUDE.md, AGENTS.md, INSTALL-AI.md updated. `workflows/`, `rules/`, `_state/`, `assets/` stay at root. **Re-run `install.sh` to relink** (old symlinks dangle after the move).
- **CreateMcp** — `SKILL.md` slimmed 74 → 48 lines to meet the ≤50-line canon (dupe Pipeline/Decide sections dropped, examples relocated to `BuildServer.md`); expanded `Security.md` pre-ship gates.
- `.gitignore` consolidated — collapsed granular `doc/` staging rules into a single `doc/` guard; ignore personal `DataReportBuilder/Tools/build-*-report.ts` (hardcoded private paths).

### Removed
- `doc/` — untracked staging dump (stale duplicate skill copies, donor downloads, zips). Nothing tracked lost.

## 2026-06-27 — GitHubOps

### Added
- **GitHubOps** — manage a GitHub repo via the `gh` CLI. Five workflows: RepoHygiene (audit + fix branches/secrets/paths/large-files/gitignore), Changelog (build from commits since last tag), CommitPush (conventional, branch-first, sanitized), PullRequest (summary from full commit range), Release (semver tag + `gh release create`). Outward/irreversible actions are confirmed before running.

### Changed
- `GitWorkflow` and `GitHubOps` carry mutual `NOT FOR` triggers — reference (git theory) vs action (gh operations).
- Skill count 32 → 33; `skills.json` + `llms.txt` regenerated.

## 2026-06-27 — Agentic skill suite

Upgraded the library from a flat set of skills into a composable agentic system. Skill count 18 → 32.

### Added — agentic primitives & drivers
- **Verify** — six-phase quality gate (build → type → lint → test → secret → diff) ending in a `READY` / `NOT READY` verdict. Called by Iterate, Build, Test, Orchestrate.
- **Reflect** — 5-axis self-evaluation scorecard (accuracy, completeness, clarity, actionability, conciseness) with evidence + fix-now rule.
- **Iterate** — bounded PLAN → ACT → VERIFY → REFLECT loop with a state file and hard exit conditions (`/iterate`). (Named `Iterate`, not `Loop`, to avoid colliding with Claude Code's built-in `/loop`.)
- **Orchestrate** — decompose a spec into a dependency DAG, run units in parallel via delegation, review each in a separate context, land via an eviction-recovering merge queue.
- **IterativeDepth** — 2–8 multi-lens passes to surface hidden requirements; feeds Spec / Orchestrate.
- **Research** — three-depth research (quick / standard / deep multi-agent fan-out) via the delegation skills + web search, with cited synthesis.
- **SkillForge** — fleet meta-skill: audit the whole library for agentic readiness + instrument telemetry in bulk.

### Added — developer quality-of-life & generators
- **CreateCLI** — generate production-ready TypeScript CLIs (3-tier: manual argv / Commander / oclif), Bun-only, gated by Verify.
- **FrontendAesthetics** — anti-slop visual direction (Anthropic core + ECC review gate + taste dials), split out from the engineering-only FrontendDesign.
- **CodebaseOnboarding**, **ContextBudget**, **GitWorkflow** — ported from ECC.

### Changed
- **CreateSkill** replaced with the full LifeOS canon (7 workflows across structure + effectiveness tracks, 9-type taxonomy, BPE check, public/private boundary), PAI-stripped.
- **Prompting** — templates reorganized into `Primitives/` `Evals/` `Data/`; added `Agentic.md` + Claude 4.x behavioral notes.
- **Art** — deleted ~50MB of foreign PNG assets; pulled `FillFrame.ts`, `RemoveBackground.md`, `YouTubeThumbnailChecklist.md`.
- Every skill now carries `category` + `effort` frontmatter, a `## Gotchas` section, and `## Examples`; descriptions trimmed toward the ≤30-word routing canon.
- `Build` gates commits on Verify; `Test` calls Reflect; `Spec --deep` runs IterativeDepth; delegation skills capture failure context to `.agent-state.md`.

### Added — conventions & AI discovery
- `rules/system.md` — canonical skill-system spec; `CLAUDE.md` + `AGENTS.md` are thin loaders with the composition map.
- `_state/StateFileSchema.md` + `_state/ExecutionLog.md` — shared `.agent-state.md` schema and `~/.claude/state/execution.jsonl` telemetry; every action workflow is instrumented.
- `llms.txt` + `skills.json` — AI-discovery index and machine-readable manifest, generated by `gen-manifest.sh`.

### Removed
- All PAI coupling (`localhost:31337` voice notifications, `SKILLCUSTOMIZATIONS`, hardcoded `~/.claude/PAI/...` paths) stripped from every ported skill.
