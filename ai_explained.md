# ai_explained.md — Build Prompt for the Agentic Skill Suite

> **You are a coding agent working on the `RohiRIK/skills` repository.** This is your build order. It tells you exactly what to BUILD, what to UPDATE, and what to ADD. The skeleton already exists in this folder — six skill directories, each with a complete `SKILL.md` and empty workflow files. Your job is to fill the workflow bodies and apply the updates below. Work in priority order. Do not invent scope beyond this document.

> **CRITICAL — read the source, do not trust descriptions.** Wherever this document points you at a donor skill, **fetch and read that exact file from the source repo before porting**. Descriptions here are pointers, not specifications — implement from the real file so you don't reproduce a wrong variation. When a path is given, that path is authoritative.

## Source repos (exact paths — always read the real file)

- **This repo (target):** `RohiRIK/skills`, default branch `main`. Existing skills are at the repo root, e.g. `Prompting/`, `Art/`, `CreateSkill/`.
- **LifeOS (donor):** `danielmiessler/LifeOS`, branch `main`. Skills live under:
  `Releases/v5.0.0/.claude/skills/<SkillName>/`
  Raw-file pattern: `https://raw.githubusercontent.com/danielmiessler/LifeOS/main/Releases/v5.0.0/.claude/skills/<SkillName>/<file>`
- **ECC (donor):** `affaan-m/ECC`, branch `main`. Skills live under:
  `skills/<skill-name>/`
  Raw-file pattern: `https://raw.githubusercontent.com/affaan-m/ECC/main/skills/<skill-name>/<file>`

Every donor reference below is given as a repo-relative path under one of these bases. Resolve it, read it, then port.

---


---

## 0. Rules of Engagement (read first)

- **Canon:** every skill follows `CreateSkill/Conventions.md` + `CreateSkill/Frontmatter.md`. TitleCase dirs and files; `SKILL.md` ≤ 50 lines; context files in the skill root (never a `Context/` subdir); each skill has a `## Workflow Routing` table and a `## Examples` section.
- **Wording:** author every SKILL.md/workflow with the `Prompting` skill — `Core.md` for principles, a frame from `Frameworks.md` (RISEN suits agentic/workflow skills), and `vendors/Claude.md` for calibration. Reserve `CRITICAL`/`MUST`/`NEVER` for genuine safety/irreversibility gates only; plain declarative phrasing everywhere else.
- **Frontmatter (NEW convention):** every skill gets two extra top-level keys — `category` and `effort` — placed directly under `description`. See §4.A for values. These are tooling annotations (the Claude Code loader ignores unknown keys; safe to add).
- **Telemetry:** every action workflow ends with one JSONL line appended to `~/.claude/state/execution.jsonl`. Snippet in §4.B.
- **State convention:** loop/multi-pass skills read and write a repo-local `.agent-state.md`. Schema in §2.A.
- **After each skill:** run `CreateSkill/ValidateSkill` (structure) and add a README row.
- **Porting caveat for any skill copied from ECC or LifeOS:** strip environment-specific bits — LifeOS's mandatory `localhost:31337/notify` voice-notification block and hardcoded `~/.claude/PAI/...` paths; ECC's references to its own metrics log or Context7 MCP unless the corresponding service is connected. Keep skills portable.

---


---

## 1. REPLACE CreateSkill FIRST (PAI-stripped) — do this before anything else

> **Why first:** CreateSkill is the factory that shapes every other skill. Replacing it up front means everything you build or touch afterward (templates, Gotchas, BPE check, `category`/`effort` in frontmatter) is created against the new canon — not the old one and then re-fixed. Do this section before §2.

**Do not patch your existing `CreateSkill`. Replace it wholesale** with the LifeOS v5.0.0 version, which is a far more complete skill (yours is a 1.7KB structure-only fork of a 23KB skill). Take the **entire long canon**, but **strip every PAI-specific coupling as you port** — that coupling is in all eight files.

**Source:** `Releases/v5.0.0/.claude/skills/CreateSkill/` (in `danielmiessler/LifeOS`) — SKILL.md + 7 workflows under `Workflows/`. Read every file there before porting.

**Port these seven workflows in full:**

| Workflow | Track | What it does |
|---|---|---|
| **CreateSkill** | structure | Scaffold a new skill in canonical form |
| **ValidateSkill** | structure | Check a skill against the canon, report compliance |
| **UpdateSkill** | structure | Add workflows / modify an existing skill |
| **CanonicalizeSkill** | structure | Restructure a non-conforming skill to canon |
| **TestSkill** | effectiveness | Spawn with-skill vs baseline agents in parallel, compare outputs — the real test that a skill *helps* |
| **ImproveSkill** | effectiveness | Diagnose root cause, rewrite instructions favoring reasoning over rigid constraints |
| **OptimizeDescription** | effectiveness | Generate ~20 should/shouldn't-trigger queries, test routing accuracy, rewrite the description |

**Carry over the full SKILL.md canon, including:**
- The **two-track model** (structure + effectiveness) and both routing tables.
- The **9-type skill taxonomy** (Library/API Reference · Product Validation · Data Fetching · Business Process · Code Scaffolding · Code Quality · CI-CD & Deployment · Operations Runbooks · Infrastructure Ops) — classify a skill before building it.
- The **mandatory `## Gotchas` section** rule ("highest information density in any skill") + the directive that gotchas accumulate after every failure.
- The **BPE (Bitter-Pilled Engineering) check** — "would a smarter model make this skill unnecessary?" anti-fragile (keep) vs fragile (question).
- **Progressive disclosure** (frontmatter → SKILL.md body → reference files), the skill-writing principles (don't state the obvious; explain the why; keep it lean; generalize don't overfit; set appropriate degrees of freedom), and the description best-practices (descriptions are for models; slightly pushy; include `NOT FOR` negative triggers).
- The **public/private naming boundary** (`TitleCase` = public, `_ALLCAPS` = private/never-released) and the pre-flight grep — relevant since you publish this repo.

**STRIP all of the following while porting (replace, don't keep):**
- The **`## MANDATORY: Voice Notification` block** and every `curl ... localhost:31337/notify` call — delete entirely.
- The **`## Customization` block** pointing at `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/...` — delete (or, if you want per-skill overrides later, repoint to a path you choose; default: delete).
- Hardcoded **`~/.claude/PAI/...` paths** — the authoritative-source pointer (`PAI/DOCUMENTATION/Skills/SkillSystem.md`), the execution-log path (`PAI/MEMORY/SKILLS/execution.jsonl`), and any `PAI/` reference. Repoint the execution log to **`~/.claude/state/execution.jsonl`** (your convention from §4.B). Drop the SkillSystem.md pointer or replace it with your own `CreateSkill/Conventions.md`.
- Any **PAI-specific skill examples** in the taxonomy table (e.g. `_CLICKUP`, `_BROADCAST`, `_HEALTHCHECK`) — replace with neutral placeholders or your own skills.

**Merge with your conventions:**
- Keep your **A/B/C/D tier system** and your `Frontmatter.md` (LifeOS uses a looser `effort`+`disable-model-invocation` scheme; yours is clearer). Fold the new `category`/`effort` keys (§4.A) into it.
- Update the SKILL.md/workflow **templates** so every generated skill is born with: `category`+`effort` frontmatter, a `## Gotchas` section, and the `~/.claude/state/execution.jsonl` telemetry line.
- Your `CreateSkill` description should now reflect both tracks. Re-classify it `category: meta`, `effort: medium` (it grew).

**Verify:** `grep -rn "31337\|PAI/\|SKILLCUSTOMIZATIONS" ~/.claude/skills/CreateSkill/` returns nothing; all seven workflows present; `ValidateSkill` passes on a test skill; the templates emit `category`/`effort` + `## Gotchas` + telemetry.


---

## 2. BUILD — fill the workflow bodies of the six skeleton skills

The `SKILL.md` for each is already written and correct. Author the workflow files (currently skeletons) to match.

### 2.A — Shared state-file schema (create this first)

Create `_state/StateFileSchema.md` documenting `.agent-state.md`. Fixed sections:

```markdown
## Goal
<one line>
## Progress
- [ ] <pending>
## Dead Ends        # never retry anything listed here
- <rejected approach> — <why>
## Iterations
- Iteration <N>: <8-word summary> | verify=<ready/not-ready> | reflect=<score>
## Result
- Passes: <N> | Exit: <reason> | Final verify/reflect: <…>
```

`Iterate` and `Orchestrate` both read/write this. Reference it from their workflows.

### 2.B — Iterate (Tier B, `/iterate`) — `category: workflow`, `effort: medium`

- **RunLoop** — bounded PLAN→ACT→VERIFY→REFLECT loop. Parse `--target/--goal/--max` (default max 5). Load/create `.agent-state.md`. Each pass: pick the single highest-value change (skip Dead Ends) → make it → call the **Verify** skill (on NOT READY, append full failure context to state and carry it into the next pass — never blind-retry; if the same approach fails twice, move it to Dead Ends) → call the **Reflect** skill, record the score → append an iteration line. **Exit conditions (mandatory):** max reached, OR Verify READY + Reflect ≥ 4.5, OR three consecutive `LOOP_COMPLETE`. End with a `## Result` block and a 2-3 sentence report.
- **ResumeLoop** — rehydrate from `.agent-state.md`, skip Dead Ends, continue from the last iteration number with prior failure context as input. If the original `--max` was already hit, confirm before extending.

### 2.C — Verify (Tier B, `/verify`) — `category: quality`, `effort: medium`

- **RunVerify** — detect the stack first (package.json / pyproject / Cargo.toml…), then run six phases in order: build → type-check → lint → test → secret-scan → diff-review. Missing tooling → mark `SKIP`, don't FAIL. A build FAIL halts the gate (later phases unreliable). Output a fixed report ending in a `READY | NOT READY` verdict with a concrete blocking-issue list (file + line where possible). This is the gate `Iterate`, `Build`, and `Test` all call.

### 2.D — Reflect (Tier C auto) — `category: quality`, `effort: low`

- **RunReflect** — score the just-finished output 1-5 on five axes (accuracy, completeness, clarity, actionability, conciseness), each scored independently with evidence. Evidence rule: every sub-5 score names the exact gap ("show the gap, don't just name it"). Any axis ≤3 fixable in <30s → fix in place; larger gaps → flag explicitly with the fix that would raise the score. Output the scorecard + overall (1-decimal avg) + top gap. Inside a `Iterate`, write the score to `.agent-state.md` instead of printing the full card.

### 2.E — Orchestrate (Tier D, `context: fork`) — `category: workflow`, `effort: high`

- **Decompose** — read a spec (run `Spec` first if criteria are thin) → produce `WorkUnit`s `{id, name, deps, acceptance, tier}`. Rules: fewer cohesive units; minimize cross-unit file overlap; keep tests WITH implementation; deps only where real code dependency exists. Group into dependency layers. Assign pipeline depth + model by tier (trivial→implement+test/Haiku … large→+final-review/Opus). Write the plan to state.
- **RunLayer** — run a layer's independent units in parallel by **delegating to the existing `Agy`/`OpenCode`/`Pi` skills** (not a new mechanism). Each worker gets its unit's acceptance + tier depth + an isolated branch/worktree. On finish, gate each unit with **Verify**; NOT READY → capture context to state, send back (no blind-retry). For small+ tiers, review each unit in a **separate context that did not write the code** (author-bias elimination). Mark Verify-passing, reviewed units ready.
- **MergeQueue** — land ready units one safe step at a time. Land non-overlapping units first; overlapping ones one-by-one with a rebase between. Per unit: rebase onto main (conflict → EVICT) → Verify (fail → EVICT) → fast-forward + push + delete branch. On eviction, capture full context (conflicting files, diff, failing output) to state so the unit re-enters the next pass and restructures around the conflict.

### 2.F — IterativeDepth (Tier C auto) — `category: workflow`, `effort: high`

- **Explore** — run 2-8 passes through the same problem, each from a different lens (functional, failure, stakeholder, temporal, constraint-inversion, experiential, security, integration). Pick depth by importance (Fast=2, Standard=3-4, Deep=5-8). Each pass records only genuinely NEW findings; stop when passes repeat. Synthesize a deduplicated, lens-grouped set of acceptance criteria and hand it to the `Spec` skill or to `Orchestrate/Decompose`.

### 2.G — SkillForge (Tier C auto, meta) — `category: meta`, `effort: medium`

**Scope: the whole library, not a single skill.** SkillForge audits and instruments the *fleet*. Authoring/scaffolding a single skill is `CreateSkill`'s job — the upgraded CreateSkill (§1) already makes new skills loop-ready, so SkillForge deliberately has **no scaffold workflow** (the earlier `ForgeSkill` was removed to eliminate overlap with CreateSkill). The `description` carries a `NOT FOR creating a single skill (use CreateSkill)` negative trigger to keep routing clean. Two workflows only:

- **AuditAgentic** — score every skill on a 5-axis readiness rubric (Iteration / Verification / Reflection / State / Telemetry), 0/1/2 each. Tier-A reference skills are "reference, exempt", not failed. Classify: loop-ready (8-10) / partial (4-7) / single-shot (1-3) / exempt. Output a ranked table + top fixes ranked by how many skills each unblocks.
- **AddTelemetry** — append the canonical `execution.jsonl` line (§4.B) to every action workflow that lacks it; skip Tier-A reference skills; never double-instrument.

---

## 3. BUILD — Research (new skill, delegation-based)

Create a new `Research/` skill. **Do NOT port LifeOS's Research** — its 7-explorer/2-verifier PAI machinery and hardcoded Claude/Gemini/Grok/Perplexity wiring is exactly the bloat to avoid. Get multi-provider coverage by **delegating to the skills already in the repo**.

- Frontmatter: `name: research`, `category: workflow`, `effort: medium`, `argument-hint: [query]`, Tier C (auto) or B (`/research`) — your call, default B.
- **Workflow `RunResearch`** with three depth modes:
  - **Quick** — a single `web_search` pass + synthesis.
  - **Standard** — `web_search` + one delegated worker (e.g. `Agy` for a Gemini second opinion), cross-checked.
  - **Deep** — fan the query out across `Agy` + `OpenCode` + `Pi` in parallel as independent researchers, plus `web_search`, then synthesize and cross-check, citing sources.
- Synthesis is authored via the `Prompting` skill. Add the telemetry line.

---


---

## 4. UPDATE — existing library

### 4.A — Frontmatter backfill (mechanical, do in one pass)

Add `category` + `effort` (flat top-level strings, under `description`) to every existing skill, and document both keys in `CreateSkill/Frontmatter.md` (allowed values + a checklist row). Apply this classification:

| Skill | category | effort | | Skill | category | effort |
|---|---|---|---|---|---|---|
| Agy | delegation | medium | | Simplify | quality | low |
| OpenCode | delegation | medium | | Hygiene | quality | medium |
| Pi | delegation | medium | | SecurityReview | quality | high |
| Art | visual | high | | DataReportBuilder | workflow | medium |
| BackendDesign | reference | low | | CreateSkill | meta | low |
| DockerPatterns | reference | low | | Iterate | workflow | medium |
| FrontendDesign | reference | low | | Verify | quality | medium |
| CodingStandards | reference | low | | Reflect | quality | low |
| StrategicCompact | reference | low | | Orchestrate | workflow | high |
| Prompting | prompting | low | | IterativeDepth | workflow | high |
| Build | workflow | medium | | SkillForge | meta | medium |
| Test | workflow | medium | | Research | workflow | medium |
| Spec | workflow | medium | | | | |
| TddWorkflow | workflow | medium | | | | |

`category` values: `workflow · reference · delegation · meta · visual · prompting · quality`. `effort`: `low · medium · high` (pairs with the A/B/C/D tier to hint model routing).

**Verify:** `grep -rL "^category:" ~/.claude/skills/*/SKILL.md` returns nothing; `effort` only ever low/medium/high.

### 4.B — Telemetry line + location

Create `_state/ExecutionLog.md` documenting `~/.claude/state/execution.jsonl`. Add this line to the end of every action workflow (and to the `CreateSkill` templates so future skills are born instrumented):

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"NAME","workflow":"WF","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

Schema (keep fixed): `ts, skill, workflow, status, duration_s` (+ optional `input` = ≤8-word summary). Use `status:"error"` on failure.

### 4.C — Wire existing skills to the new primitives

| Skill | Change |
|---|---|
| `Build` | At each commit gate, call **Verify** and gate the commit on READY. Make the workflow idempotent (re-running on a clean tree is a no-op) so `/iterate` can drive it. |
| `Test` | After a test run, call **Reflect** on the test additions; surface the score. |
| `Spec` | Add a `--deep` mode that runs **IterativeDepth/Explore** first, then writes criteria. Keep single-pass as the default. |
| `Agy`/`OpenCode`/`Pi` | On non-zero worker exit, capture failure context (command, exit code, last output, relevant diff) into `.agent-state.md` under the current iteration, so a `/iterate` pass replans instead of repeating. |
| `Hygiene` | Leave as-is (repo hygiene ≠ build gating); cross-link to `Verify`. |

### 4.D — System rules: `rules/system.md` + thin loaders (static rules, NOT skills)

The repo carries a canonical, tool-agnostic description of how the skill system works at **`rules/system.md`** — tier model, composition graph, frontmatter contract, state + telemetry conventions, prompt-authoring rule, porting rule. This is the single source of truth. Keep it current as the library evolves.

`CLAUDE.md` (auto-loaded by Claude Code) and `AGENTS.md` (other tools) are **thin loaders**: they point to `rules/system.md` and carry only the always-on essentials + the ~15-line composition map. Do not duplicate the full spec into them — point to it. (A dynamically-loaded "explainer skill" would be circular: the model would need to already know the map to know to load it, so this stays a static rule.)

All three files (`rules/system.md`, `CLAUDE.md`, `AGENTS.md`) ship in this package — keep them in sync when skills are added or composition edges change.

**Add a short "Skill disambiguation" subsection to `rules/system.md`** (and a one-liner in the CLAUDE.md/AGENTS.md maps) covering pairs that share a topic, so routing is explicit on every session:
```
Frontend:  code/logic/hooks/performance → FrontendDesign
           look/feel/typography/color/anti-slop → FrontendAesthetics
           both (e.g. "polished hero component") → FrontendAesthetics first (direction), then FrontendDesign (build)
Meta:      build/scaffold ONE skill → CreateSkill ; audit/instrument the WHOLE library → SkillForge
CLI:       generate a standalone TS CLI → CreateCLI ; author a PAI skill → CreateSkill
```
This backs up the per-skill `NOT FOR` descriptions (which do the actual auto-routing) with an explicit fallback for the both-apply case.

### 4.E — Prompting: targeted refactor (NOT a replacement — yours is already ahead)

**Do NOT replace your `Prompting` skill with LifeOS's.** Yours is more complete: you have every template LifeOS has (Briefing, Gate, Roster, Structure, Voice, Judge, Rubric, TestCase, Comparison, Report) **plus** files LifeOS dropped — `Core.md`, `Frameworks.md` (COSTAR/RISEN/RTF), `Reasoning.md`, `Templates.md`, and the whole `vendors/` directory (Claude/OpenAI/Gemini). LifeOS is markdown-only and anti-XML; you correctly use XML steering for Claude. A wholesale swap would be a downgrade.

Apply only these targeted improvements:

**1. Reorganize templates into subfolders (clarity).** Your `Tools/` mixes engine code, templates, and data in one flat dir. Adopt LifeOS's split:
```
Prompting/Templates/Primitives/   ← Briefing.hbs, Gate.hbs, Roster.hbs, Structure.hbs, Voice.hbs
Prompting/Templates/Evals/        ← Judge.hbs, Rubric.hbs, TestCase.hbs, Comparison.hbs, Report.hbs
Prompting/Templates/Data/         ← Agents.yaml, VoicePresets.yaml, ValidationGates.yaml
Prompting/Tools/                  ← RenderTemplate.ts, ValidateTemplate.ts, index.ts (engine only)
```
Update `RenderTemplate.ts` template paths and `TemplatingSystem.md` references accordingly.

**2. Fold five content blocks from LifeOS's `Standards.md` (read `Releases/v5.0.0/.claude/skills/Prompting/Standards.md` in `danielmiessler/LifeOS`) into your files — these are the only parts you're missing** (everything else in LifeOS Standards you already cover in `Core.md`/`vendors/`):

| Block to pull | Put it in | Why it matters to you |
|---|---|---|
| **Claude 4.x Behavioral Characteristics** (tool overtriggering → dial back aggressive language; extended-thinking word choice — use "consider/evaluate/assess" not "think" when thinking is off; more-direct reporting) | `vendors/Claude.md` | You have imperative calibration but not these specific 4.x behavioral notes. Directly relevant to keeping eager models from overtriggering. |
| **Multi-Context Window Workflows** (state tracking across windows, verification without human feedback, compaction, starting-fresh vs compacting) | a new `Agentic.md` context file (or `Core.md`) | Maps straight onto your `.agent-state.md` + `Iterate` + `StrategicCompact`. |
| **Parallel Tool Calling** (when to maximize vs reduce parallel execution) | `Agentic.md` | Directly informs `Orchestrate/RunLayer`. |
| **Agentic Coding + Subagent Orchestration** (read-before-edit, prevent overengineering, minimize file creation, subagent context design) | `Agentic.md` | Informs `Orchestrate` + the delegation skills. |
| **Frontend "AI Slop" notes** (typography, color, animation, atmosphere) | reference from `FrontendDesign` or a short `vendors/` note | Complements your `FrontendDesign` skill. |

**3. Keep everything else of yours unchanged** — the eight principles, tell-don't-forbid, signal-to-noise, the frameworks, the vendor addenda, the templating engine. Re-confirm `category: prompting`, `effort: low` (Tier A, `user-invocable: false`) after the refactor.

> Net: this is a folder reorg + five content transplants, not a rewrite. Be explicit in the work that yours is the base and LifeOS is the donor for these five blocks only.

### 4.F — Art: cleanup + selective pull (yours is near-identical to LifeOS — do NOT replace)

Your `Art` skill is almost the same as LifeOS v5 (same workflows minus four, some Tools they don't have). The real problem is not staleness — it's **~50MB of foreign PNG assets** that came with the fork. Two actions: clean, then pull a few items.

**1. DELETE the foreign image assets (the actual fix).** `Art/Tools/` contains ~50MB of Daniel Miessler's personal images dragged in with the fork — his headshots (`headshot-*.png`), `Main1-7.png`, `Sponsored1-3.png`, `RegularVideo1-5.png`, `human-linear-*.png`, `setting-line-*.png`, the dated screenshot, `Audio*.png`. **Delete all of them.** They are not yours, bloat the repo, and aren't referenced by any logic you own. Keep only the `.ts` tools and the `.md` workflows.
```bash
# from Art/Tools/ — remove all raster assets, keep code
find Art/Tools -maxdepth 1 -name '*.png' -delete
```
After deletion, grep the workflows for any hardcoded references to those filenames and remove/replace them.

**2. PULL these from LifeOS v5 (all verified useful, general-purpose).** Donor base: `Releases/v5.0.0/.claude/skills/Art/` in `danielmiessler/LifeOS`. Exact files: `Tools/FillFrame.ts`, `Workflows/RemoveBackground.md`, `Workflows/YouTubeThumbnailChecklist.md`, `Workflows/LogoWallpaper.md`, `Workflows/EmbossedLogoWallpaper.md`. The `Lib/` split donor files are `Lib/discord-bot.ts` + `Lib/midjourney-client.ts`. Read each before porting.

| Item | Type | What it does / why |
|---|---|---|
| **FillFrame.ts** | Tool | Deterministic full-frame enforcement — detects the subject bbox, crops to it + a safety inset, resizes so the subject fills edge-to-edge. Turns the Essay workflow's manual "MARGIN CHECK" into an automatic post-process. Genuinely useful, no PAI coupling in the logic. |
| **RemoveBackground.md** | Workflow | Removes backgrounds via local `rembg` (no external API). Useful general-purpose. |
| **YouTubeThumbnailChecklist.md** | Workflow | Two-phase (pre/post-generation) thumbnail validation. Likely supersedes your `YoutubeThumbailSpecifications.md` — compare and keep the better one (probably fold your specs into the checklist). |
| **LogoWallpaper.md** + **EmbossedLogoWallpaper.md** | Workflows | Logo-wallpaper generation. Niche but harmless; pull if you want them. |

**3. Adopt the `Lib/` split (optional, minor).** LifeOS separates engine code into `Art/Lib/` (`discord-bot.ts`, `midjourney-client.ts`) apart from `Art/Tools/`. Your equivalents (`DiscordBot.ts`, `MidjourneyClient.ts`) sit in `Tools/`. Moving them to `Lib/` matches their convention and separates reusable engine code from invokable tools — do it only if you want the tidiness.

**STRIP while porting** (the pulled workflows carry it): the voice-notification block + `curl localhost:31337` at the top of `RemoveBackground.md` and `YouTubeThumbnailChecklist.md`, and any `~/.claude/PAI/...` path. Add `category: visual`, `effort: high` stays. Run through `CreateSkill/ValidateSkill`.

> Net: Art is a cleanup job, not an upgrade. The 50MB asset deletion is the high-value change; the four pulls are nice-to-haves. Do not replace your Art with LifeOS's — you'd lose the Tools you have that they renamed/moved.

### 4.G — Frontend: split into TWO skills — `FrontendDesign` (keep) + `FrontendAesthetics` (new)

Your `FrontendDesign` is **engineering-only** (`Patterns.md` = composition, hooks, memoization, virtualization; workflows `GenerateComponent`/`OptimizePerformance`). It has **zero visual-aesthetic guidance** — nothing on typography, color, hierarchy, motion-direction, or avoiding generic "AI slop". That gap is why generated UI reads as templated.

**Decision: two skills, not one merged file.** They load at different moments — fixing re-renders shouldn't pull a lecture on fonts, and breaking slop shouldn't pull memoization rules. Single-responsibility, matches the tier system.

- **`FrontendDesign` (existing)** — how to build UI that *works* (engineering). **Keep as-is.** Only edits: add `category: reference`/`effort: low` frontmatter, a `## Gotchas` section, and one routing line cross-linking to `FrontendAesthetics` for visual work.
- **`FrontendAesthetics` (new)** — how to build UI that *looks intentional, not generic* (anti-slop). Tier C auto. `category: reference`, `effort: low`. Built from three NON-overlapping layers below.

**Routing between the two (this is how the agent picks the right one).** The two skills share the "frontend" topic, so their `description` fields must disambiguate via mutual `NOT FOR` negative triggers — in Claude Code the description *is* the router:
- `FrontendDesign` description ends with: `... building React components, hooks, state, and performance. NOT FOR visual styling, typography, color, or making UI look less generic (use FrontendAesthetics).`
- `FrontendAesthetics` description ends with: `... typography, color, hierarchy, motion direction, and avoiding generic AI-slop output. NOT FOR component logic, hooks, or performance (use FrontendDesign).`
- **When a request is BOTH** (e.g. "build me a polished hero component"): run **FrontendAesthetics first** (decide the visual direction), **then FrontendDesign** (build the component to that direction). This ordering is mirrored as a static rule in §4.D so it's known every session.

Why these donors and not others: the three prose sources (Anthropic, ECC, LifeOS) largely say the same thing ("ban Inter, ban purple gradient"). Don't triple it. Take only each source's unique contribution. LifeOS's anti-slop block (`Prompting/Standards.md`) is a strict subset of Anthropic's — **skip it** (it's already being folded into Prompting via §4.E anyway).

**Layer 1 — the brain (CORE): Anthropic `frontend-design` (canonical).**
- Source: repo `anthropics/skills`, file `frontend-design/SKILL.md`. **Read the real file.** Strongest anti-slop guidance in existence: it names the three default AI looks to avoid (cream+serif+terracotta; near-black+acid-green; broadsheet hairline-rule), and the negative-constraint principle — naming the failure mode ("avoid AI slop", "NEVER Inter / purple-on-white") is what pushes output off the training-data median. Adapt into `FrontendAesthetics/DesignDirection.md`: the named default-looks-to-avoid, two-pass process (brainstorm token system → critique against brief → build), hero-as-thesis, deliberate type pairing, structure-as-information, motion restraint, "spend your boldness in one place", copywriting-as-design. **This is the core because it's prose that exercises judgment — anti-fragile under a strong model (BPE-positive).**

**Layer 2 — the gate: ECC `frontend-design-direction`.**
- Source: `skills/frontend-design-direction/SKILL.md` in `affaan-m/ECC`. **Read it.** Compact checklist skill. Fold its **Anti-Patterns** (no purple gradients / decorative blobs / oversized cards / cards-inside-cards / hero hiding the actual tool) and **Review Checklist** into `FrontendAesthetics/Checklist.md` as the fast pre-ship gate. Its domain-fit judgment ("a SaaS ops tool should be dense, quiet, scannable; don't force a landing-page composition onto a daily-use tool") is exactly what makes output appropriate vs templated. Note ECC explicitly does NOT rebundle the Anthropic skill and points to `anthropics/skills` — consistent with Layer 1.

**Layer 3 — optional override: taste-skill dials.**
- Source: repo `Leonxlnx/taste-skill`, file `skills/taste-skill/SKILL.md` (v2; v1 at `skills/taste-skill-v1/SKILL.md`). **Read it.** Its UNIQUE contribution (nobody else has this): three tunable dials — `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY` (1–10, baseline 8/6/4), set conversationally, gating every layout/motion/density decision. Put this in a separate `FrontendAesthetics/Dials.md` loaded only when explicit control is wanted — **NOT in the core** (dials are a guardrail a strong model often won't need; BPE-fragile). Also worth lifting: its concrete hero discipline (max 4 text elements, top-padding cap, "4-line headline = font-size error") and its banned-tells list (em-dashes, section-number eyebrows, fake screenshots-from-divs). taste self-scopes to "landing pages, portfolios, redesigns — NOT dashboards/data-tables/product UI", which dovetails with keeping `FrontendDesign` for app/engineering work.

**`FrontendAesthetics` structure:**
```
FrontendAesthetics/
├── SKILL.md            # routing + Gotchas (seed: the "would they say AI made this?" test + 3 default-looks)
├── DesignDirection.md  # Layer 1 — Anthropic canonical (the brain)
├── Checklist.md        # Layer 2 — ECC review gate + anti-patterns
└── Dials.md            # Layer 3 — taste dials (optional, loaded on request)
```
SKILL.md routing triggers: "make it less generic", "polish the UI", "looks templated/AI-made", "design direction", "set the variance/density". Seed Gotchas with the test: *"If you showed this UI and said 'AI made this', would they instantly believe you? If yes, that's the problem."*

> Net: `FrontendDesign` stays the engineering skill; `FrontendAesthetics` is the new anti-slop skill = Anthropic prose (core/judgment) + ECC checklist (gate) + taste dials (optional control). Each layer is the part only that source provides; no triple-coverage. The highest-value piece is Anthropic's named-defaults-to-avoid — that single move turns "generic" into "intentional".

---

## 5. ADD — developer quality-of-life skills (port from ECC, in priority order)

These reduce daily dev friction. All are general-purpose (not stack-locked). Port each through your (upgraded) `CreateSkill`, add `category`/`effort` frontmatter, strip ECC-specific bits, run ValidateSkill. **Donor base: `skills/<name>/` in `affaan-m/ECC` — read each `SKILL.md` (and its workflows) before porting.** All eight paths below are verified to exist.

| Skill (ECC path) | category | Why / what it does |
|---|---|---|
| `skills/codebase-onboarding/` | workflow | Unfamiliar repo → architecture map, entry points, conventions, starter `CLAUDE.md`. Instant context on new projects. |
| `skills/context-budget/` | meta | Audits what consumes the Claude Code context window (skills, MCP servers, rules) → prioritized token-savings. Complements `SkillForge`. |
| `skills/git-workflow/` | reference | Branching, commit conventions, merge-vs-rebase, conflict resolution. Pairs with `Verify`. |
| `skills/documentation-lookup/` | reference | Up-to-date library/framework docs via Context7 MCP instead of stale training data. (Keep only if Context7 MCP is connected.) |
| `skills/cost-tracking/` | meta | Token spend/budgets across providers. Repoint it from ECC's metrics log to your own. |
| `skills/mcp-server-patterns/` | reference | Patterns for building MCP servers (Node/TS SDK, tools/resources/prompts, Zod, stdio vs HTTP). On your path. |
| `skills/error-handling/` | reference | Robust error patterns across TS/Python/Go (typed errors, retries, circuit breakers, boundaries). |
| `skills/skill-scout/` | meta | Search local/marketplace/GitHub/web for an existing skill before building one. Pairs with `CreateSkill`/`SkillForge`. |

**Suggested starting set:** `codebase-onboarding` + `context-budget` + `git-workflow` + `documentation-lookup`, then `cost-tracking` + `mcp-server-patterns`.

> Excluded deliberately: the ~260 ECC domain skills (Laravel, Quarkus, Spring, Django, healthcare, logistics, homelab-networking, prediction-markets, etc.). Well-built but irrelevant to your stack — adding them is pure context-window pollution.

### 5.A — CreateCLI (new skill, port from LifeOS, PAI-stripped)

Add the `CreateCLI` skill — generates production-ready TypeScript CLIs. **Source:** `Releases/v5.0.0/.claude/skills/CreateCLI/` in `danielmiessler/LifeOS` (SKILL.md; context files `FrameworkComparison.md`, `Patterns.md`, `TypescriptPatterns.md`; workflows `Workflows/CreateCli.md`, `Workflows/AddCommand.md`, `Workflows/UpgradeTier.md`). Read every file before porting. Same PAI-stripping treatment as CreateSkill. It pairs naturally with your stack (Bun, TypeScript, the delegation skills) and your `CreateSkill` (CreateSkill = PAI skills; CreateCLI = standalone CLI tools).

**Frontmatter:** `name: CreateCLI`, `category: meta`, `effort: medium`, Tier C (auto) or B. Description states WHAT + WHEN + the `NOT FOR PAI skill scaffolding (use CreateSkill)` / `NOT FOR Python` negative triggers.

**Port these files:**
- `SKILL.md` — the 3-tier template system + activation patterns + quality gates + `## Gotchas`.
- Context files: `FrameworkComparison.md` (manual vs Commander vs oclif), `Patterns.md` (llcli patterns), `TypescriptPatterns.md` (type-safety patterns).
- Workflows: `CreateCli` (from scratch, decision tree + 10-step process), `AddCommand` (extend existing), `UpgradeTier` (Tier 1→2 migration).

**The 3-tier system (keep as-is):**
- **Tier 1 — llcli-style** (default, ~80%): manual `process.argv` parsing, zero deps, Bun + TS, ~300-400 lines. For API clients, data transformers, simple automation (2-10 commands, JSON output).
- **Tier 2 — Commander.js** (~15%): subcommands, nested options, auto-help. For 10+ commands or plugin architecture.
- **Tier 3 — oclif** (~5%): reference/docs only, enterprise scale.

Every generated CLI: full TS implementation (strict mode, no stray `any`), `package.json` (Bun), `tsconfig.json`, `.env.example`, `README.md` + `QUICKSTART.md`, exit codes 0/1, JSON output that pipes to jq/grep.

**STRIP while porting** (same as everywhere): the voice-notification block + `curl localhost:31337`, the `SKILLCUSTOMIZATIONS` block, `~/.claude/PAI/...` paths, PAI-specific "related skills" references, and repoint the execution log to `~/.claude/state/execution.jsonl`.

**Output location — leave generic and ASK the user.** LifeOS hardcodes `~/.claude/Bin/` and `~/Projects/`. Do NOT bake in a path; the `CreateCli` workflow should ask the user where to place the generated CLI (default suggestion: the current project dir or a path they specify). Wire `Verify` as the quality gate before declaring a CLI done, and add the telemetry line.

**Keep:** Bun-only (never npm/npx), TypeScript-only, "start at the simplest tier that fits" (don't over-engineer), CLI-First principles (deterministic, composable, documented).

> Note the `NOT FOR` boundary with CreateSkill — they share "create" vocabulary, so the negative trigger in the description is load-bearing to prevent mis-routing.

### 5.B — Additional ideas (optional — read the source before deciding)

Further candidates that fit your profile (multi-agent, automation, browser-driven tooling, API work). These are **suggestions, not instructions** — read each source file and decide. All paths verified to exist on their default branch.

**From `danielmiessler/LifeOS` (base `Releases/v5.0.0/.claude/skills/`):**

| Path | Fit |
|---|---|
| `Optimize/` | Autonomous hill-climb loop with LLM-as-judge. The unattended sibling of your `Iterate` — `Iterate` is supervised, `Optimize` runs toward a metric on its own. Strongest pick. |
| `Delegation/` | Six parallelization patterns (built-in agents, worktree-isolated, background, custom). Formalizes your ad-hoc Agy/OpenCode/Pi delegation; feeds `Orchestrate`. |
| `Browser/` | Headless browser automation via a Rust CLI daemon with persistent auth profiles. For scripted web tasks / scraping. |
| `Interceptor/` | Drives a real Chrome browser from inside via an extension (zero-CDP). Alternative to `Browser/` when you need the actual logged-in browser. |
| `ContextSearch/` | Cold-start session recovery — scan past sessions/work dirs to resume instantly. Useful given how many parallel projects you run. |
| `Migrate/` | Intakes external content and classifies it against a destination taxonomy. Relevant if you ever bulk-import notes into a knowledge store. |

**From `affaan-m/ECC` (base `skills/`):**

| Path | Fit |
|---|---|
| `api-design/` | REST design patterns (resource naming, status codes, pagination, versioning, error shapes). Reference-grade; you build APIs/integrations. Verified to exist. |

> For any other ECC skill you discover by browsing `skills/`, apply the same test used throughout: is it general-purpose and on your stack, or domain-locked noise? When unsure, read the `SKILL.md` first. Do not port on the strength of a name alone — ~260 ECC skills are domain-specific and irrelevant to you.

---

## 6. Build Order — updated

> CreateSkill goes first by design (see §1) — the upgraded factory then validates everything built afterward.

1. **Replace CreateSkill with LifeOS's, PAI-stripped** (§1) — highest-value update; do this before building or touching anything else so all later work uses the new canon (Gotchas, BPE, `category`/`effort` templates).
2. `_state/StateFileSchema.md` + `_state/ExecutionLog.md` (§2.A, §4.B) — foundation, no behavior change.
3. **Verify** workflow (§2.C) — the gate everything else calls.
4. **Iterate** workflows (§2.B) — uses Verify + state.
5. **Reflect** workflow (§2.D) — wired into Iterate.
6. Frontmatter + telemetry sweep across all skills (§4.A, §4.B) — one mechanical pass.
7. Wire Build/Test/Spec/delegation to the primitives (§4.C).
8. **Research** (§3), **IterativeDepth** (§2.F), **Orchestrate** (§2.E), **SkillForge** (§2.G).
9. **Prompting targeted refactor** (§4.E) — folder reorg + five content transplants (validated by the already-upgraded CreateSkill).
10. **Art cleanup** (§4.F) — delete the ~50MB foreign PNGs; pull FillFrame.ts + RemoveBackground (+ optional workflows/Lib split).
11. **Frontend split** (§4.G) — keep `FrontendDesign` (engineering); add new `FrontendAesthetics` skill (Anthropic core + ECC gate + taste dials).
12. System rules in sync: `rules/system.md` + `CLAUDE.md` + `AGENTS.md` (§4.D).
13. Add dev-QoL skills (§5), starting set first.
14. **CreateCLI** (§5.A) — port, PAI-stripped, output path left generic.

## 7. Definition of Done

- All six skeleton skills + Research have complete, canon-compliant workflows; all pass `CreateSkill/ValidateSkill`.
- Every skill carries `category` + `effort`; `Frontmatter.md` documents them.
- Every action workflow emits the telemetry line.
- `Iterate` can drive `Build`/`Test` end-to-end with state in `.agent-state.md`.
- `CreateSkill` is fully replaced by the LifeOS canon (7 workflows, 9-type taxonomy, Gotchas, BPE), PAI-stripped (no 31337 / PAI/ / SKILLCUSTOMIZATIONS), telemetry repointed to ~/.claude/state/.
- `rules/system.md` is current; `CLAUDE.md` + `AGENTS.md` point to it and carry the composition map.
- README has rows for every new skill.
- `Prompting` refactored (templates in Primitives/Evals/Data subfolders; five LifeOS content blocks folded into vendors/Claude.md + a new Agentic.md) — yours stays the base, not replaced.
- `CreateCLI` added (3-tier, PAI-stripped, output path asks the user, gated by Verify).
- `Art` cleaned: ~50MB foreign PNGs deleted; FillFrame.ts + RemoveBackground (+ optional pulls) added; not replaced.
- Frontend split into two skills: `FrontendDesign` (engineering, kept) + new `FrontendAesthetics` (anti-slop: Anthropic `DesignDirection.md` core + ECC `Checklist.md` gate + optional taste `Dials.md`); Gotchas seeded with the "AI made this?" test.
- Frontend split into two skills: `FrontendDesign` (engineering, kept) + new `FrontendAesthetics` (anti-slop: Anthropic `DesignDirection.md` core + ECC `Checklist.md` gate + optional taste `Dials.md`); Gotchas seeded with the "AI made this?" test.
