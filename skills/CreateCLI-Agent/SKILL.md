---
name: CreateCLI-Agent
description: "Generate a production-ready TypeScript CLI for autonomous agents (JSON contract, non-interactive, semantic exits). USE WHEN create an agent CLI, tool for LLM/automation, or wrap an API for agents. NOT FOR human-first interactive CLIs (use CreateCLI-Human), agent skills (use CreateSkill), or Python."
category: reference
effort: medium
domain: dev
tuned-for: claude-5.5
tuned-on: 2026-10-16
---

# CreateCLI-Agent

Generate a **TypeScript** CLI whose **primary caller is an autonomous agent** (LLM tool loop, CI, script). It runs the shared `CreateCLI` base (tiers, `Workflows/CreateCli.md`, `AddCommand.md`, `UpgradeTier.md`, and its pattern files) with the machine contract in `Contract.md` replacing the base's human-leaning defaults. Sibling: `CreateCLI-Human` when a person drives it at a terminal.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateCli** | "create an agent CLI", "CLI for automation/LLM tools" | `../CreateCLI/Workflows/CreateCli.md` + `Contract.md` |
| **AddCommand** | add a command, preserving the agent contract | `../CreateCLI/Workflows/AddCommand.md` + `Contract.md` |
| **UpgradeTier** | only if the command graph forces it | `../CreateCLI/Workflows/UpgradeTier.md` |

Read `Contract.md` before generating any code. Ask for the output directory; never hardcode it.

## Quick Reference

- Bun, strict TS, Tier 1 bias (~85% of agent CLIs): fewer moving parts.
- stdout = versioned JSON / NDJSON envelope (`{"ok":true,"data":…}`); stderr = diagnostics only; no ANSI on non-TTY.
- Mutations: `--dry-run` (exit 10) and `--yes`/`--confirm`; refuse without confirm when non-interactive.
- Semantic exits (0, 2, 3, 4, 5, 10, 20, 30); fail open on unknown errors, never invent a deny.
- `--help-json` for discovery; secrets from env only, never on stdout.
- Verify gate: typecheck, `--help-json` parses, sample read, dry-run mutation, refusal without `--yes`, stdout through `jq`.

## Gotchas

- Do not default to tables, ANSI, prompts, or pagers: that is CreateCLI-Human.
- Do not silent-yes on a missing TTY, and do not retry mutating calls inside the CLI.
- A subcommand that is also a **harness hook** speaks the harness's protocol, not the envelope. Claude Code reads exit 2 as *block*, so hook mode exits 1 on usage errors, including flag-parse errors raised before the handler runs, or one mistyped flag in `settings.json` refuses every tool call.
- Test the contract on the spawned process, not only the library: parse errors, `--version`, and `--help` on a stdin-reading command fail before any handler.

## Examples

**Example 1:** "CLI so an agent can manage DNS records" → Tier 1 → JSON envelopes, `--help-json`, delete requires `--yes`, `--dry-run` exits 10.

**Example 2:** "wrap our internal API for Grok Bot tools" → flags-only inputs, semantic exits, no spinners, secrets from env only.
