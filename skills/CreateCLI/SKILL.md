---
name: CreateCLI
description: "Generate a production-ready TypeScript CLI; shared base that routes to CreateCLI-Agent or CreateCLI-Human. USE WHEN create a CLI, command-line tool, or wrap an API. NOT FOR agent skills (use CreateSkill) or Python."
category: reference
effort: medium
domain: dev
tuned-for: claude-5.5
tuned-on: 2026-10-16
---

# CreateCLI

The shared base for **TypeScript** CLI generation, Bun-only: the tier system, the three workflows, and the pattern files. Two siblings add a caller contract on top: `CreateCLI-Agent` (`Contract.md`: JSON envelope, non-interactive, semantic exits) and `CreateCLI-Human` (`UX.md`: TTY output, prompts, prose help). Every CLI ships strict TS, `package.json`, `tsconfig.json`, `.env.example`, `README.md` + `QUICKSTART.md`, and JSON that pipes to `jq`.

## Pick the caller first

| Who runs it? | Use |
|--------------|-----|
| An LLM, agent, CI job, or script | `CreateCLI-Agent` |
| A person at a terminal | `CreateCLI-Human` |
| Both, or unclear | Ask once. If still unclear, default to `CreateCLI-Human` with `--json` on every command |

## The 3-Tier System

| Tier | Stack | When |
|------|-------|------|
| **1 — minimal** | `node:util` `parseArgs`, zero deps | default (~80%): 2-10 commands, API clients, transformers |
| **2 — Commander.js** | subcommands, nested options, auto-help (v15+, ESM-only, Node ≥22.12) | 10+ commands or plugins |
| **3 — oclif** | reference only | enterprise scale |

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateCli** | "create a CLI", "build a command-line tool", "wrap this API" | `Workflows/CreateCli.md` |
| **AddCommand** | "add a command", "extend the CLI" | `Workflows/AddCommand.md` |
| **UpgradeTier** | "outgrew manual parsing", "migrate to Commander" | `Workflows/UpgradeTier.md` |

Detail: `FrameworkComparison.md` (tiers), `Patterns.md`, `TypescriptPatterns.md`. `Verify` is the gate before calling a CLI done.

## Gotchas

- Pick the tier by command count and option nesting, not ambition; reaching for Commander or oclif early is the usual over-engineering.
- Machine output on stdout, logs on stderr, or `jq` composability breaks. Ask for the output path; never hardcode it.
- Edits to the workflows or pattern files change both siblings; check the change against `Contract.md` and `UX.md`.

## Examples

**Example 1:** "make a CLI for the GitHub API" → who runs it? "me" → CreateCLI-Human → Tier 1 → asks output dir → TS + docs → Verify.

**Example 2:** "a CLI my agent can call to manage tickets" → CreateCLI-Agent → Contract.md envelope, `--help-json`, `--dry-run`.
