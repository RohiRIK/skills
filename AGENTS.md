# Skills — personal Agent Skills library

Personal library of reusable Agent Skills. Each subfolder under `skills/` is one skill.

## Your role

Help add and maintain skills correctly. Apply the rules below on every skill-creation or review task.

## How the system works → rules/system.md

**[rules/system.md](rules/system.md) is the source of truth** — skill structure, the tier model, frontmatter, composition, state, and telemetry. Read it before creating or wiring skills.

## Rules (essentials)

- Each skill is a folder under `skills/` with a `SKILL.md` carrying `name`, `description` (WHAT + WHEN, ≤30 words), `category` (`workflow·reference·delegation·meta·visual·prompting·quality`), and `effort` (`low·medium·high`).
- Folder + file names are TitleCase (mirror `~/.claude/skills`); the `name:` field drives activation.
- Flat structure, 2 levels max; only `Workflows/` and `Tools/` subdirs; context files in the skill root; `SKILL.md` ≤ 50 lines.
- Word skills via the `Prompting` skill. Reserve `CRITICAL`/`MUST`/`NEVER` for genuine safety gates.
- Every skill needs a row in [README.md](README.md).

## Skill composition (always-on map)

```
Primitives:  Verify (quality gate) · Reflect (self-eval)
Drivers:     Iterate → Verify + Reflect each pass
             Orchestrate → Decompose→RunLayer→MergeQueue; delegates to Agy/OpenCode/Pi; gates with Verify
             IterativeDepth → feeds Spec / Orchestrate
             Research → fans out to Agy/OpenCode/Pi
Meta:        SkillForge (audit + instrument the fleet) · CreateSkill (build one skill)
State:       .agent-state.md  ·  Telemetry: ~/.claude/state/execution.jsonl
```

## Where to go

- **Full system spec** → [rules/system.md](rules/system.md)
- **Repo layout + Claude Code specifics** → [CLAUDE.md](CLAUDE.md)
- **Install a skill into an AI tool** → [INSTALL-AI.md](INSTALL-AI.md)
