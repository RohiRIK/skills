# Skills — personal Agent Skills library

A personal library of reusable Agent Skills. Each subfolder under `skills/` is one self-contained skill (its own `SKILL.md` plus any supporting files). [README.md](README.md) is the skill index.

## Repo layout

```
skills/<SkillName>/   ← one folder per skill (TitleCase, matches ~/.claude/skills)
  SKILL.md           ← required: frontmatter (name, description, category, effort) + instructions
  Workflows/*.md     ← optional: execution procedures
  Tools/*            ← optional: executable scripts
  *.md               ← optional: context files (in skill root)
workflows/           ← composed skill chains, OKF bundle (one concept per workflow) — see workflows/index.md
rules/system.md      ← canonical spec for how the skill system works (READ THIS)
_state/              ← state-file + execution-log conventions
README.md            ← skill index
CLAUDE.md            ← this file — auto-loaded by Claude Code
AGENTS.md            ← brief for non-Claude-Code tools
INSTALL-AI.md        ← install guide
install.sh           ← symlinks skills/* into ~/.claude/skills
```

## How the system works → rules/system.md

**[rules/system.md](rules/system.md) is the source of truth** for skill structure, the tier model (A/B/C/D), frontmatter, composition, state, and telemetry. Read it before creating or wiring skills. This file only carries the always-on essentials below.

## Conventions (essentials)

- **Folder + file naming:** TitleCase. The `name:` field drives activation.
- **Frontmatter:** every skill has `name`, `description` (WHAT + WHEN, ≤30 words), `category` (`workflow·reference·delegation·meta·visual·prompting·quality`), and `effort` (`low·medium·high`). Tier flags as needed.
- **Structure:** flat, 2 levels max; only `Workflows/` and `Tools/` subdirs; context files in the skill root; `SKILL.md` ≤ 50 lines.
- **Authoring:** word every skill via the `Prompting` skill. Reserve `CRITICAL`/`MUST`/`NEVER` for real gates.
- **README:** every skill needs a row in the index. Adding a skill without one is incomplete.

## Skill composition (always-on map)

```
Primitives:  Verify (quality gate) · Reflect (self-eval)
Drivers:     Iterate → calls Verify + Reflect each pass
             Orchestrate → Decompose→RunLayer→MergeQueue; delegates to Agy/OpenCode/Pi; gates with Verify
             IterativeDepth → feeds criteria to Spec / Orchestrate
             Research → fans out to Agy/OpenCode/Pi
Meta:        SkillForge → audits + instruments the whole library;  CreateSkill → builds one skill
Wired in:    Build→Verify · Test→Reflect · Spec --deep→IterativeDepth · Agy/OpenCode/Pi→.agent-state.md on failure
State:       loop/multi-pass skills share .agent-state.md
Telemetry:   action workflows append to ~/.claude/state/execution.jsonl
```

Composed chains live in **[workflows/](workflows)** — an **OKF bundle**, one markdown concept per workflow (YAML frontmatter: `type: Workflow`, `chain`, `tags`), two families: **build & ship** (ship-fast, spec-to-ship, research to build/report/buy, onboard, build-cli/mcp, ui/api-feature, security/context/hygiene passes) and **maintain the library** (new-skill, canonicalize, fix-trigger, autonomous-loop, batch-build, library-audit, release). See `workflows/index.md` for the index.

## Source of truth

This repo is canonical. Skills are symlinked into `~/.claude/skills` by `install.sh`; edits flow through the symlink back here. Run `install.sh` after cloning to onboard a new machine.
