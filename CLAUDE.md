# Skills — personal Agent Skills library

A personal library of reusable Agent Skills. Each subfolder at the repo root is one self-contained skill (its own `SKILL.md` plus any supporting files). [README.md](README.md) is the skill index.

## Repo layout

```
<SkillName>/         ← one folder per skill (TitleCase, matches ~/.claude/skills)
  SKILL.md           ← required: frontmatter (name, description) + instructions
  *.md               ← optional: workflow / reference files
  scripts, assets    ← optional supporting files
README.md            ← skill index — the canonical skill list
CLAUDE.md            ← this file — auto-loaded by Claude Code
AGENTS.md            ← brief for non-Claude-Code tools
INSTALL-AI.md        ← install guide (all tools, Mac + Windows)
install.sh           ← onboarding script — symlinks all skills into ~/.claude/skills
assets/              ← repo images (cover, diagrams)
```

## Conventions

- **Folder naming:** TitleCase to mirror the live `~/.claude/skills` layout. The `name:` field inside each `SKILL.md` drives activation (it may be kebab-case).
- **README:** every skill needs a row in the "Skills in this repo" table. Adding a skill without a README row is incomplete.
- **Source of truth:** this repo is the canonical copy. Skills are symlinked into `~/.claude/skills` by `install.sh` — edits flow through the symlink back to here.

## Onboarding to a new machine

Run `install.sh` after cloning — it symlinks each skill folder into `~/.claude/skills/` (and opencode's path if present), skipping any that already exist.
