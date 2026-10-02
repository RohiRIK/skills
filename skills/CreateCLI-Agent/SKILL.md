---
name: CreateCLI-Agent
description: "Generate a production-ready TypeScript CLI for autonomous agents (JSON contract, non-interactive, semantic exits). USE WHEN create an agent CLI, tool for LLM/automation, or wrap an API for agents. NOT FOR human-first interactive CLIs (use CreateCLI-Human), agent skills (use CreateSkill), or Python."
category: reference
effort: medium
domain: dev
---

# CreateCLI-Agent

Generate production-ready **TypeScript** CLIs whose **primary caller is an autonomous agent** (LLM tool loop, CI, script). Bun-only. Same 3-tier stack as CreateCLI-Human, but **defaults and safety rails are machine-contract first**.

Sibling: **CreateCLI-Human**. If a person is the primary operator and wants TTY UX, use that skill instead.

Detail: reuse CreateCLI `FrameworkComparison.md`, `Patterns.md`, `TypescriptPatterns.md` where applicable; agent envelopes below override human defaults.

## Audience

- Agent or automation that must parse stdout, branch on `$?`, and never answer a prompt.
- Token-budget aware: compact structured output, discoverable schema.
- Must not log secrets or suffer hidden retries on mutations.

## The 3-Tier System

| Tier | Stack | Share | When |
|------|-------|-------|------|
| **1 — minimal** | `node:util` `parseArgs`, zero deps | ~85% | Prefer for agents — fewer moving parts |
| **2 — Commander.js** | many commands / nesting | ~15% | Only if command graph demands it |
| **3 — oclif** | reference only | rare | Avoid unless required |

## Agent-first rules (load-bearing)

### Input
- Prefer **named flags** over positionals (`--id` not bare positional) so agents do not guess order.
- **Never** read interactive prompts. If a required value is missing → exit with usage/validation code + structured error.
- **Mutations** (create/update/delete/apply): require explicit `--yes` or `--confirm`. If no TTY **and** flag absent → **refuse** (non-zero exit, structured error). **Never silent-yes.**
- Validate inputs strictly (paths, IDs, enums). Reject traversal / control characters where relevant.

### Output
- Default stdout: **JSON** (or **NDJSON** for streams/lists). Treat stdout as a **versioned API**.
- Envelope success shape (minimum):
  ```json
  {"ok":true,"data":{}}
  ```
- Failure shape (stdout or documented dual — prefer one consistent choice; recommended: still emit JSON object on stdout when `--json`/default agent mode, details mirrored):
  ```json
  {"ok":false,"error":{"code":82,"type":"validation","message":"...","recoverable":false,"suggestions":["..."]}}
  ```
- **stderr** = logs/progress only; never the sole carrier of result data an agent must parse.
- No ANSI on non-TTY stdout. Respect `NO_COLOR`.
- Bound output: `--limit`, optional `--fields`. Compact (no pretty indent) by default; `--pretty` for debug.

### Interactivity
- Non-interactive always. No pagers. No confirm prompts.
- Optional human escape: `--format table` only as explicit opt-in — never default.

### Errors & exits (semantic)
Document and implement a stable table (adjust codes only with care — changing codes is a breaking change):

| Exit | Meaning |
|------|---------|
| 0 | Success (side effect applied, or read OK) |
| 2 | Usage / invalid arguments |
| 3 | Not found |
| 4 | Permission / auth |
| 5 | Conflict / already exists |
| 10 | Dry-run success (preview only; no mutation) |
| 20 | External/API failure |
| 30 | Internal/unknown |

- Map `error.code` in JSON to the exit code when possible.
- **Fail open on unknown errors:** use internal/unknown (e.g. 30), `recoverable:false` or omit inventing a policy deny. Do **not** invent a "deny" outcome for ambiguous failures.
- `suggestions` should be concrete next flags/commands, not essays.

### State
- Prefer **idempotent** writes (or return conflict exit 5 with clear JSON).
- Every mutating command supports **`--dry-run`**: no side effects; stdout shows structured would-be result; exit **10** on successful preview.
- No ambient session state required to complete a command.

### Execution guarantees
- **No hidden retries** on side-effecting commands. Report failure; let the agent retry.
- Read-only GETs may document a single bounded retry only if essential — default is none.
- Timeouts must be explicit (flag or config), not infinite hangs.
- Spinners forbidden on stdout; if progress exists, stderr only and disable when not a TTY.

### Efficiency
- NDJSON for large lists.
- `--limit` default finite (document it).
- `--quiet` suppresses stderr noise.

### Docs / discovery
- Prose `--help` still required (humans maintain the tool).
- **`--help-json`** (or `help --json`) required: machine-readable command/flag/schema list agents can introspect without scraping.
- README documents exit table, envelopes, dry-run, confirm flags.

### Secrets (security)
- Secrets only via env / file paths — never CLI flags that end up in shell history if avoidable; if a flag must exist, never echo it back in JSON.
- **Never** place tokens, passwords, or private keys in stdout JSON (agents log stdout).
- Redact sensitive fields in error payloads.

## Confirmation envelope (mutations)

```
if command.isMutation && !args.yes && !args.confirm:
  emit error type=confirmation_required
  exit 2
if command.isMutation && args.dryRun:
  emit ok preview
  exit 10
# else perform mutation
```

## Workflow routing

| Workflow | Trigger |
|----------|---------|
| **CreateCli** | "create an agent CLI", "CLI for automation/LLM tools" |
| **AddCommand** | add command — preserve agent contract |
| **UpgradeTier** | only if command graph forces it |

Ask for **output directory**. Do not hardcode.

## Quick reference

- Bun, strict TS, Tier 1 bias.
- stdout = JSON contract; stderr = diagnostics.
- Mutations: `--dry-run` + `--yes`/`--confirm`; refuse without confirm when non-interactive.
- Semantic exits; fail open on unknown (no invented deny).
- `--help-json` for discovery.
- Verify gate: typecheck, `--help-json` parses, sample read, dry-run mutation, confirm refuse without `--yes`, `| jq` on stdout.

## Gotchas

- Do not default to tables/ANSI/prompts — that is CreateCLI-Human.
- Do not silent-yes on missing TTY.
- Do not retry mutating calls inside the CLI.
- Do not put secrets on stdout.
- `NOT FOR` human-first interactive tools — cross-link CreateCLI-Human.
- A subcommand that is also a **harness hook** speaks the harness's protocol, not the envelope. Claude Code reads exit 2 as *block*, so hook mode must exit 1 on usage errors — including flag-parse errors raised before the handler runs — or one mistyped flag in `settings.json` refuses every tool call.
- Test the contract on the spawned process, not only the library: parse errors, `--version`, and `--help` on a stdin-reading command fail before any handler.

## Examples

**Example 1:** "CLI so an agent can manage DNS records" → CreateCLI-Agent → Tier 1 → JSON envelopes, `--help-json`, delete requires `--yes`, `--dry-run` exits 10.

**Example 2:** "wrap our internal API for Grok Bot tools" → CreateCLI-Agent → flags-only inputs, semantic exits, no spinners, secrets from env only.
