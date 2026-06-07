![Skills](assets/cover.png)

# Skills

[![Skills](https://img.shields.io/badge/skills-18-blue?style=flat-square)](https://github.com/RohiRIK/skills)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> _Powered by caffeine and life's questionable coffee-cup choices._ ☕️

My everyday [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) — a personal library for Claude Code, opencode, and other AI coding tools. Each top-level folder is a self-contained skill package with its own `SKILL.md` and any supporting workflows, references, or scripts.

## Skills in this repo

| Skill | What it does |
|---|---|
| [`Agy/`](Agy) | Delegate a coding, refactor, PR-review, or image task to the Antigravity CLI (`agy`) as an autonomous worker, then monitor and report. |
| [`Art/`](Art) | Generate images, diagrams, and visual output. Use for any visual artifact. |
| [`BackendDesign/`](BackendDesign) | Reference for API design, database schema, and server architecture. |
| [`Build/`](Build) | Implement plan tasks one at a time with compile and commit gates. |
| [`CodingStandards/`](CodingStandards) | Language coding standards — TS, Python, Bash, PowerShell, Swift, Rust. |
| [`CreateSkill/`](CreateSkill) | Build and maintain skills in canonical structure. |
| [`DockerPatterns/`](DockerPatterns) | Reference for Docker and Docker Compose local-dev patterns. |
| [`FrontendDesign/`](FrontendDesign) | Reference for React and Next.js component design patterns. |
| [`Hygiene/`](Hygiene) | Audit `~/.claude` for git, skill, code, and rules hygiene issues. |
| [`OpenCode/`](OpenCode) | Delegate a coding/refactor/PR-review task to the OpenCode CLI as an autonomous worker. |
| [`Pi/`](Pi) | Delegate a coding/refactor/PR-review task to the Pi (pi.dev) CLI as an autonomous worker. |
| [`Prompting/`](Prompting) | Vendor-agnostic prompt-engineering standard library for authoring prompts, skills, agents, rules. |
| [`SecurityReview/`](SecurityReview) | Audit code for vulnerabilities and secrets. |
| [`Simplify/`](Simplify) | Post-implementation dead-code cleanup (`/simplify`). |
| [`Spec/`](Spec) | Explore code + memory, then write acceptance criteria before planning. |
| [`StrategicCompact/`](StrategicCompact) | Reference for context-compaction strategy and timing. |
| [`TddWorkflow/`](TddWorkflow) | Test-first development workflow. |
| [`Test/`](Test) | Run TDD for features and bug fixes. |

## Install

### 🪄 Let your AI do it (recommended)

Paste this to any coding AI (Claude Code, Cursor, Copilot, opencode…) and let it drive the wizard:

```text
☕️ Be my Skills install wizard. Pour a coffee, then:
1. Fetch the install guide —
   curl -fsSL https://raw.githubusercontent.com/RohiRIK/skills/main/INSTALL-AI.md
   (or: gh api --header "Accept: application/vnd.github.raw+json" repos/RohiRIK/skills/contents/INSTALL-AI.md)
2. Ask me which tool I'm on and which skills I want — don't install all by default.
3. Run ONLY the commands for my picks, then verify. Go. 🚀
```

### Quick (Mac / Linux)

```bash
git clone https://github.com/RohiRIK/skills.git ~/rohi-skills
cd ~/rohi-skills && ./install.sh
```

`install.sh` symlinks every skill into `~/.claude/skills/` (and the opencode path if present), idempotently.

### Manual / other tools

See [INSTALL-AI.md](INSTALL-AI.md) — covers Claude Code, opencode, Cursor, VS Code + Copilot, and Windsurf on Mac and Windows.

## Docs

- **[CLAUDE.md](CLAUDE.md)** — auto-loaded by Claude Code; repo layout + conventions.
- **[AGENTS.md](AGENTS.md)** — brief for non-Claude-Code AI tools.
- **[INSTALL-AI.md](INSTALL-AI.md)** — full install guide for all supported tools.

## Adding a skill

1. Create a folder at the repo root named after the skill.
2. Add a `SKILL.md` with `name` + `description` frontmatter.
3. Add a row to the table above.

Folders here use TitleCase to match the live `~/.claude/skills` layout; the `name:` field inside each `SKILL.md` is what drives activation.
