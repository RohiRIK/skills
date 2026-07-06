# Changelog

All notable changes to this skills library. Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## 2026-07-05 — Anti-slop frontend pipeline, CreateSkill/CreateCLI/CreateMcp fleet audit, Art/BackendDesign canonicalization

Subagent audit of CreateSkill, CreateCLI, CreateMcp, front-end skills, and the workflows bundle, followed by a full FrontendAesthetics rebuild and cleanup passes across Art, BackendDesign, CodebaseOnboarding, ContextBudget, and CodingStandards.

### Added
- **FrontendAesthetics anti-slop pipeline**: `DesignBrief` workflow writes a `design-brief.md` token artifact *before* any code is written (design read, dials, OKLCH palette, typography, signature element, similar-prompt critique); `SlopAudit` gates *after* the build (11 mechanical checks + 7-axis scored rubric, one revision loop); `Redesign` handles existing sites (mode detection, brand-token extraction, preservation rules).
- **Craft.md, Tells.md, Vocabulary.md**: new FrontendAesthetics material — 12 tone-tagged font pairings, an OKLCH palette-construction formula with worked examples, a motion spec, a banned-pattern catalog, and a named-pattern vocabulary (adapted from `Leonxlnx/taste-skill`).
- **FrontendDesign** gained React 19 / RSC / Next.js App Router patterns (`use()`, Actions, `useOptimistic`, ref-as-prop) and a design-brief-aware `GenerateComponent` step 0.
- `skills/SkillForge/Tools/SyncMirrors.ts` — resyncs `skills.json`/`llms.txt` descriptions from SKILL.md frontmatter.

### Fixed
- **CreateSkill**: `Frontmatter.md` mandated lowercase-hyphen `name:` values, contradicting the repo's TitleCase convention used by all 34 skills — corrected with an explicit documented deviation from Anthropic's upstream spec. Removed references to a fictional `SkillSearch()` loading tool (also fixed in CreateMcp, Hygiene) in favor of plain Read-tool wording.
- **CreateCLI**: stripped donor-system leftovers (`${PAI_DIR}`, "KAI", `~/.claude/Bin/llcli/` paths) from Patterns.md/TypescriptPatterns.md/FrameworkComparison.md; fixed broken workflow references (`CliFirstArchitecture.md`, `add-testing.md`, `setup-distribution.md` never existed); Tier 1 now defaults to `node:util` `parseArgs` instead of hand-rolled argv scanning; Commander cited at current v15 (ESM-only, Node ≥22.12).
- **CreateMcp**: `npx -y` → `bunx`; OAuth 2.0 → 2.1 with RFC 8707/9728 requirements; added the `## Examples` section every other skill already had; added structured tool output (`outputSchema`/`structuredContent`) and `resource_link` examples.
- **Workflows bundle**: `workflows/index.md` and `skills/Workflows/Chains.md` had drifted from each other and from the per-workflow `chain:` frontmatter (bare names like `ValidateSkill` instead of `CreateSkill:ValidateSkill` — not real top-level skills); resynced verbatim. `build-mcp` gained a `Verify` gate before PR; `batch-build`'s redundant `Verify` step annotated as the final integration gate.
- **FrontendDesign**: broken 3-hop reference chain (`Context-Overview.md` → `Context-FrontendPatterns.md`, a file that never existed); orphaned `Tools/GenerateComponent.ts` now wired into its own workflow.
- **Art**: dropped unreferenced Midjourney/Discord-bot tools (zero call sites); removed a dead `PREFERENCES.md`/`CharacterSpecs.md` customization block that pointed at files that don't exist; D3Dashboards palette now derives per-brief via OKLCH instead of a fixed "deep purple" default.
- **BackendDesign**: middleware pattern rewritten from Next.js `(req, res)` to web-standard `Request`/`Response` (works across Hono/Bun.serve/App Router/Workers); dead `ApplyPatterns` workflow reference to a nonexistent `Context-Patterns.md`; stray skill-style frontmatter stripped from `Patterns.md` and `ClickhouseIo.md`.
- Stray SKILL.md-style frontmatter (donor leftover) removed from `TddWorkflow/Overview.md` and `SecurityReview/Overview.md`.
- All PAI/KAI donor-branding references removed fleet-wide (Prompting, Art, CreateCLI).

### Changed
- **CodingStandards, CodebaseOnboarding, ContextBudget**: trimmed SKILL.md back under the 50-line cap; the latter two had their 4-phase workflow content extracted into proper `Workflows/*.md` files instead of living inline in SKILL.md.
- **CreateCLI**: `category: meta` → `reference` (meta is reserved for library-management skills); package.json template gained an `engines` pin.
- `ui-feature` and `frontend-build` workflow chains now run `FrontendAesthetics:DesignBrief` before the build and `FrontendAesthetics:SlopAudit` before shipping.
- Both FrontendAesthetics and FrontendDesign are now `user-invocable: true`.

## 2026-07-04 — Fleet audit: broken refs repaired, triggers fixed, big skills split

Library-wide SKILL.md audit (all 34 skills scanned for frontmatter validity, trigger quality, and dangling references) — re-scan reports zero issues.

### Fixed
- **Broken internal references**: Art routed to a deleted `YouTubeThumbnail.md` workflow; CodingStandards routed to a nonexistent `Workflows/Review.md` and six nonexistent `StarterTemplates/*.md` paths (files exist flat as `StarterTemplateX.md`).
- **Six frontmatter names didn't match their directory** (DockerPatterns, DataReportBuilder, Hygiene, Pi, Agy, OpenCode) — normalized to the PascalCase house convention.
- **Five descriptions lacked USE WHEN triggers** (StrategicCompact, BackendDesign, DockerPatterns, FrontendDesign, Hygiene) — Hygiene in particular never triggered despite covering config audits.

### Changed
- **GitWorkflow** split: 15.4KB monolithic SKILL.md → 2.5KB router + six on-demand `References/*.md` (branching, commits, merge/rebase, PRs, releases, config).
- **CodebaseOnboarding** split: embedded output templates moved to `Templates/`; SKILL.md 239→155 lines.
- **Build, Spec, Test, Simplify** are now user-invocable (`user-invocable: false` removed) — their `~/.claude` command wrappers pointed at long-renamed skill names and were deleted.

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
