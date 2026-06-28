# CreateCLI Tier System

## The 3-Tier System

| Tier | Stack | Share | When |
|------|-------|-------|------|
| **1 — llcli-style** | manual `process.argv`, zero deps, ~300-400 lines | ~80% | API clients, data transformers, simple automation (2-10 commands, JSON out) |
| **2 — Commander.js** | subcommands, nested options, auto-help | ~15% | 10+ commands or plugin architecture |
| **3 — oclif** | reference/docs only | ~5% | enterprise scale (Heroku/Salesforce) |

## Quick Reference

- Bun, never npm/npx. TypeScript strict, no stray `any`.
- Start at Tier 1; only climb when the command/option count demands it.
- Output location is **not** baked in — the CreateCli workflow asks the user where to place the CLI.
- `Verify` is the quality gate before declaring a CLI done.

## Detail Files

- framework-comparison.md — manual vs Commander vs oclif
- patterns.md — llcli patterns
- typescript-patterns.md — type-safety patterns
