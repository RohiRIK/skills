# rules/system.md — How the Skill System Works

Canonical, tool-agnostic description of how this skill library is structured and used. This is the single source of truth; `CLAUDE.md` (Claude Code) and `AGENTS.md` (other tools) are thin loaders that point here. When anything about skill structure, composition, or conventions is unclear, this file decides.

Authored per the `Prompting` skill. Prompt-authoring rule for everything in this repo: start from `Prompting/Core.md`, pick a frame from `Prompting/Frameworks.md` (RISEN for agentic/workflow skills, COSTAR for content), and apply `Prompting/vendors/Claude.md` for Claude targets — including XML steering tags and imperative calibration. (Note: we use XML steering tags for Claude; this is deliberate and differs from markdown-only houses.)

---

## 1. What a skill is

A skill is a self-contained folder at the library root. Minimum shape:

```
SkillName/
  SKILL.md            # required: frontmatter + routing table + examples (≤50 lines)
  Workflows/          # optional: one execution procedure per file
  Tools/              # optional: executable scripts only
  *.md                # optional: context files (in the skill root — never Context/)
```

Rules (full detail in `CreateSkill/Conventions.md`):
- **TitleCase** for the directory and every file; the `name:` field drives activation.
- **Flat, 2 levels max.** Only `Workflows/` and `Tools/` subdirectories. Context files live in the skill root.
- **SKILL.md ≤ 50 lines** — frontmatter, a `## Workflow Routing` table, and a `## Examples` section. Move detail to context files loaded on demand.

## 2. Frontmatter contract

Every skill's frontmatter carries:

| Key | Required | Purpose |
|-----|----------|---------|
| `name` | yes | Activation identifier (TitleCase) |
| `description` | yes | WHAT it does + WHEN to use it (≤30 words). The routing signal. |
| `category` | yes | Purpose class: `workflow · reference · delegation · meta · visual · prompting · quality` |
| `effort` | yes | `low · medium · high` — cost/latency hint, pairs with tier for model routing |
| tier flags | as needed | `disable-model-invocation` (B), `user-invocable: false` (A), `context: fork` + `agent` (D) |

`category` and `effort` are tooling annotations (the loader ignores unknown keys). They make the library groupable by purpose and sortable by cost, and they feed `SkillForge/AuditAgentic`.

## 3. The tier model

| Tier | Meaning | Frontmatter |
|------|---------|-------------|
| **A** | Auto-knowledge — passive reference, never user-invoked | `user-invocable: false` |
| **B** | User-command — fires only on `/name` | `disable-model-invocation: true` |
| **C** | Auto-trigger — Claude decides when to load (default) | *(none)* |
| **D** | Fork — heavy work in an isolated subagent | `context: fork` + `agent:` |

## 4. Skill composition (who calls whom)

The library is not a flat bag of skills; the agentic skills compose along fixed edges.

```
Primitives (called by others):
  Verify   — quality gate (build→type→lint→test→secret→diff → READY/NOT READY)
  Reflect  — 5-axis self-evaluation scorecard

Drivers (call the primitives):
  Iterate         — bounded PLAN→ACT→VERIFY→REFLECT passes; calls Verify + Reflect each pass
  Orchestrate  — Decompose→RunLayer→MergeQueue; delegates to Agy/OpenCode/Pi; gates units with Verify
  IterativeDepth — multi-lens exploration; feeds criteria to Spec / Orchestrate
  Research     — multi-depth; fans out to Agy/OpenCode/Pi, synthesizes

Meta:
  SkillForge   — audits + instruments the whole library (CreateSkill builds individual skills)
  CreateSkill  — creates / validates / tests / improves skills (the skill factory)

Existing skills wired in:
  Build  → calls Verify at each commit gate; idempotent so Iterate can drive it
  Test   → calls Reflect on its test additions
  Spec   → --deep mode runs IterativeDepth first
  Agy/OpenCode/Pi → on worker failure, write context to .agent-state.md (no blind retry)
```

The composition map also lives (in short form) in `CLAUDE.md` so it is always-on context. This is a **static rule, not a skill** — composition must be known before any skill fires, at zero discovery cost.

## 4a. Skill disambiguation (topic-overlapping pairs)

Some skills share a topic; their `description` fields carry mutual `NOT FOR` triggers that do the auto-routing. This table is the explicit fallback, especially for the both-apply case:

```
Frontend:  code / logic / hooks / performance      → FrontendDesign
           look / feel / typography / color / slop  → FrontendAesthetics
           both ("polished hero component")         → FrontendAesthetics first (direction), then FrontendDesign (build)
Meta:      build/scaffold ONE skill                 → CreateSkill
           audit/instrument the WHOLE library       → SkillForge
CLI:       generate a standalone TypeScript CLI     → CreateCLI
           author a PAI/agent skill                 → CreateSkill
```

## 5. Shared state

Iterate and multi-pass skills persist progress in a repo-local `.agent-state.md`. Fixed sections: `## Goal`, `## Progress`, `## Dead Ends` (never retry these), `## Iterations`, `## Result`. This bridges context between independent passes/agents. Full schema: `_state/StateFileSchema.md`.

## 6. Telemetry

Every action workflow appends one line to `~/.claude/state/execution.jsonl`:

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"NAME","workflow":"WF","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

Fixed schema (`ts, skill, workflow, status, duration_s`, optional `input`). Tier-A reference skills are exempt. Full detail: `_state/ExecutionLog.md`.

## 7. Authoring & maintenance flow

- **Create / change a skill** → use the `CreateSkill` skill (structure track: Create/Validate/Update/Canonicalize; effectiveness track: TestSkill/ImproveSkill/OptimizeDescription). Every skill must have a `## Gotchas` section and pass the BPE check ("would a smarter model make this unnecessary?").
- **Make a skill loop-ready** → `CreateSkill` already does this for new skills (it wires Verify/Reflect + telemetry). For an existing skill, add the wiring per its workflow and re-validate.
- **Audit the library** → `SkillForge/AuditAgentic`.
- **Word any prompt/skill/workflow** → the `Prompting` skill. Reserve `CRITICAL`/`MUST`/`NEVER` for genuine safety/irreversibility gates; plain declarative everywhere else.

## 8. Porting rule (skills from ECC / LifeOS)

When adopting an external skill, strip environment coupling: LifeOS's voice-notification block (`curl localhost:31337/notify`), `SKILLCUSTOMIZATIONS` indirection, and hardcoded `~/.claude/PAI/...` paths (repoint logs to `~/.claude/state/`); ECC's references to its own metrics log or Context7 MCP unless that service is connected. Add `category`/`effort` frontmatter and run through `CreateSkill/ValidateSkill`. Keep skills portable.

---

*This file is the spec. `CLAUDE.md` and `AGENTS.md` reference it rather than duplicating it.*
