---
name: CreateCLI-Human
description: "Generate a production-ready TypeScript CLI for human operators (TTY UX, prose help, optional JSON). USE WHEN create a CLI for people, interactive command-line tool, or wrap an API for humans. NOT FOR agent-first CLIs (use CreateCLI-Agent), agent skills (use CreateSkill), or Python."
category: reference
effort: medium
domain: dev
---

# CreateCLI-Human

Generate production-ready **TypeScript** CLIs whose **primary user is a human at a terminal**. Bun-only. Start at the simplest tier that fits. Deterministic, composable, documented — but defaults optimize for readability and interactive flow, not agent automation.

Sibling: **CreateCLI-Agent** (machine-contract defaults). If the caller is an LLM/agent driving the binary non-interactively, use that skill instead.

Detail: reuse CreateCLI context files when present — `FrameworkComparison.md`, `Patterns.md`, `TypescriptPatterns.md` — and apply the human deltas below.

## Audience

- Developer or operator running commands by hand.
- Wants clear prose `--help`, examples, colored/TTY tables, optional prompts.
- May pipe to `jq` sometimes → support `--json` / `--format json`, but **do not** make compact JSON the only UX.

## The 3-Tier System

| Tier | Stack | Share | When |
|------|-------|-------|------|
| **1 — minimal** | `node:util` `parseArgs`, zero deps | ~80% | 2–10 commands, API client, transformers |
| **2 — Commander.js** | subcommands, nested options, auto-help | ~15% | 10+ commands or plugins |
| **3 — oclif** | reference only | ~5% | enterprise scale |

## Human-first rules (load-bearing)

### Input
- Positionals are fine when names are obvious (`cli fetch <id>`).
- Interactive prompts **allowed** for missing optional polish (confirm delete, choose from list) when stdin is a TTY.
- If stdin is not a TTY and a prompt would be required, fail with a clear stderr message telling the human which flag to pass (`--yes`, `--name`, etc.) — never hang forever.

### Output
- Default: human-readable (table, pretty-printed JSON with indent, ANSI colors when stdout is a TTY).
- Always offer `--json` or `--format json` for scripting.
- **stdout** = primary result; **stderr** = progress, warnings, hints.
- Spinners / progress on stderr are OK for long work (Tier 2+ may use a spinner dep; Tier 1 keeps zero deps and simple stderr progress).

### Interactivity
- Confirm destructive actions by default on TTY (`Are you sure?`).
- Honor `--yes` / `--force` to skip confirms (document them).
- Pagers OK for long human output when TTY.

### Errors
- Actionable prose on stderr: what failed + how to fix.
- Exit **0** success, **1** failure is the baseline. Optional light codes (2 = usage) if useful — keep the table in `--help`.
- Custom `CLIError` with `code` + `hint` encouraged (see Patterns).

### State & execution
- Session-y UX OK (multi-step wizard) if documented.
- Soft retries for read-only flaky network **may** exist if logged to stderr and capped — prefer documenting them. Do not silently retry destructive writes.

### Efficiency
- Pretty dumps by default; `--limit` still recommended on list commands.
- `--quiet` suppresses progress for pipe-friendly humans.

### Docs / discovery
- Rich prose `--help` with EXAMPLES.
- `README.md` + `QUICKSTART.md` required.
- No requirement for `--help-json` (nice-to-have only).

### Secrets
- Load from `./.env` / env vars; never echo secrets to stdout.
- Error messages must not print token values.

## Workflow routing

| Workflow | Trigger |
|----------|---------|
| **CreateCli** | "create a CLI", "build a command-line tool" for humans |
| **AddCommand** | "add a command" |
| **UpgradeTier** | outgrew parseArgs |

Ask the user for **output directory** (default: current project). Do not hardcode a path.

## Quick reference

- Bun, never npm/npx. TypeScript strict; no stray `any`.
- Start Tier 1; climb only when command/option nesting demands it.
- JSON that pipes to `jq` must stay available via flag even when default is table/pretty.
- Run **Verify** before declaring done: typecheck, `--help`, sample command, `| jq` on `--json` path.

## Gotchas

- Do not build agent-contract exits / `--help-json` / forced NDJSON as defaults here — that is CreateCLI-Agent.
- Do not hang without TTY when a prompt is required.
- Shares "create" vocabulary with CreateSkill / CreateCLI-Agent — `NOT FOR` triggers are load-bearing.
- Don't hardcode output path; ask.

## Examples

**Example 1:** "CLI for GitHub so I can list my repos" → CreateCLI-Human → Tier 1 → table or pretty JSON default, `--json` flag, prose help, README.

**Example 2:** "add an interactive delete with confirm" → AddCommand → TTY confirm + `--yes` escape hatch.
