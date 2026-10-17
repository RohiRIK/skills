---
name: CreateCLI-Human
description: "Generate a production-ready TypeScript CLI for human operators (TTY UX, prose help, optional JSON). USE WHEN create a CLI for people, interactive command-line tool, or wrap an API for humans. NOT FOR agent-first CLIs (use CreateCLI-Agent), agent skills (use CreateSkill), or Python."
category: reference
effort: medium
domain: dev
tuned-for: claude-5.5
tuned-on: 2026-10-16
---

# CreateCLI-Human

Generate a **TypeScript** CLI whose **primary user is a person at a terminal**. It runs the shared `CreateCLI` base (tiers, `Workflows/CreateCli.md`, `AddCommand.md`, `UpgradeTier.md`, and its pattern files) with the human UX rules in `UX.md`: readable output and interactive flow first, JSON on request. Sibling: `CreateCLI-Agent` when an LLM or script drives the binary.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateCli** | "create a CLI" for people, "build a command-line tool" | `../CreateCLI/Workflows/CreateCli.md` + `UX.md` |
| **AddCommand** | "add a command" | `../CreateCLI/Workflows/AddCommand.md` + `UX.md` |
| **UpgradeTier** | outgrew parseArgs | `../CreateCLI/Workflows/UpgradeTier.md` |

Read `UX.md` before generating any code. Ask for the output directory (default: current project); never hardcode it.

## Quick Reference

- Bun, never npm/npx. TypeScript strict, no stray `any`. Start at Tier 1; climb only when nesting demands it.
- Default output is human-readable (tables, pretty JSON, color on a TTY); `--json` / `--format json` always available for `jq`.
- stdout = result; stderr = progress, warnings, hints. Spinners only on stderr.
- Confirm destructive actions on a TTY; `--yes` / `--force` skips; without a TTY, fail with the flag to pass, never hang.
- Exit 0 / 1 baseline (2 = usage optional); actionable prose errors with a hint.
- Verify gate: typecheck, `--help`, a sample command, `--json` through `jq`.

## Gotchas

- Do not make agent-contract exits, `--help-json`, or forced NDJSON the defaults: that is CreateCLI-Agent.
- Do not hang without a TTY when a prompt would be required.
- Shares "create" vocabulary with CreateSkill and CreateCLI-Agent; the `NOT FOR` triggers are load-bearing.

## Examples

**Example 1:** "CLI for GitHub so I can list my repos" → Tier 1 → table or pretty JSON by default, `--json` flag, prose help, README.

**Example 2:** "add an interactive delete with confirm" → AddCommand → TTY confirm plus a `--yes` escape hatch.
