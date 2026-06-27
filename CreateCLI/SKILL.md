---
name: CreateCLI
description: "Generate a production-ready TypeScript CLI (3-tier: manual argv / Commander / oclif). USE WHEN create CLI, build a command-line tool, wrap an API as a CLI, or add a command. NOT FOR agent skill scaffolding (use CreateSkill). NOT FOR Python."
category: meta
effort: medium
---

# CreateCLI

Generate production-ready **TypeScript** command-line tools, Bun-only. Start at the simplest tier that fits — don't over-engineer. Every CLI is born deterministic, composable, and documented: full strict-TS implementation, `package.json` (Bun), `tsconfig.json`, `.env.example`, `README.md` + `QUICKSTART.md`, exit codes 0/1, and JSON output that pipes to `jq`/`grep`.

Detail in context files: `FrameworkComparison.md` (manual vs Commander vs oclif), `Patterns.md` (llcli patterns), `TypescriptPatterns.md` (type-safety patterns).

## The 3-Tier System

| Tier | Stack | Share | When |
|------|-------|-------|------|
| **1 — llcli-style** | manual `process.argv`, zero deps, ~300-400 lines | ~80% | API clients, data transformers, simple automation (2-10 commands, JSON out) |
| **2 — Commander.js** | subcommands, nested options, auto-help | ~15% | 10+ commands or plugin architecture |
| **3 — oclif** | reference/docs only | ~5% | enterprise scale (Heroku/Salesforce) |

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateCli** | "create a CLI", "build a command-line tool", "wrap this API" | `Workflows/CreateCli.md` |
| **AddCommand** | "add a command", "extend the CLI" | `Workflows/AddCommand.md` |
| **UpgradeTier** | "outgrew manual parsing", "migrate to Commander" | `Workflows/UpgradeTier.md` |

## Quick Reference

- Bun, never npm/npx. TypeScript strict, no stray `any`.
- Start at Tier 1; only climb when the command/option count demands it.
- Output location is **not** baked in — the CreateCli workflow asks the user where to place the CLI.
- `Verify` is the quality gate before declaring a CLI done.

## Gotchas

- Pick the tier by command count + option nesting, not by ambition — most tools are Tier 1; reaching for Commander/oclif early is the common over-engineering mistake.
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
