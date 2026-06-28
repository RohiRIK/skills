---
name: create-cli
description: "Generate a production-ready TypeScript CLI (3-tier: manual argv / Commander / oclif). Use when create CLI, build a command-line tool, wrap an API as a CLI, or add a command."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [meta, skills]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='create-cli', file_path='references/create-cli.md') before taking any action."
---
# CreateCLI
Generate production-ready **TypeScript** CLI tools, Bun-only. Start at the simplest tier that fits. For tier details see `references/tier-system.md`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateCli** | "create a CLI", "build a command-line tool", "wrap this API" | `references/create-cli.md` |
| **AddCommand** | "add a command", "extend the CLI" | `references/add-command.md` |
| **UpgradeTier** | "outgrew manual parsing", "migrate to Commander" | `references/upgrade-tier.md` |

## Gotchas

- Pick the tier by command count + option nesting, not by ambition — most tools are Tier 1; reaching for Commander/oclif early is over-engineering.
- Shares "create" vocabulary with `CreateSkill` — this is for standalone TS CLIs; `CreateSkill` is for agent skills. The `NOT FOR` trigger is load-bearing.
- JSON output that doesn't pipe cleanly to `jq` defeats composability — keep machine output on stdout, logs on stderr.
- Don't hardcode an output path; ask the user (default: current project dir).

## Examples

**Example 1: Wrap an API**
```
User: "make a CLI for the GitHub API"
→ CreateCli → Tier 1 (zero-dep argv) → asks output dir → full TS + docs → Verify gate
```

**Example 2: Extend a CLI**
```
User: "add an `export` command to my data-cli"
→ AddCommand → adds command + help + JSON output, matching existing tier
```

**Example 3: Outgrew manual parsing**
```
User: "this CLI has 12 commands now and the argv parsing is a mess"
→ UpgradeTier → migrate Tier 1 → Tier 2 (Commander)
```
