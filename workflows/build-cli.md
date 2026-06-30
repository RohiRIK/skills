---
type: Workflow
title: Build a CLI
description: Ship a TypeScript command-line tool, tier-picked and Verify-gated.
tags: [build-ship]
chain: "[Research(API, if wrapping)] → CreateCLI → Test → Verify → GitHubOps:PullRequest"
---

# Workflow: build-cli

Ship a TypeScript command-line tool.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
[Research(API, if wrapping)] → CreateCLI → Test → Verify → GitHubOps:PullRequest
```

1. **Research** *(only if wrapping a service/API)* — learn the endpoints/auth before generating commands.
2. **CreateCLI** — 3-tier TS generator (manual argv / Commander / oclif), Bun-only, born Verify-gated.
3. **Test** — happy path **and** error/edge paths for each command.
4. **Verify → PR**.

## Pick the tier

| Tier | When |
|------|------|
| manual argv | 1–2 commands, no deps |
| Commander | several commands, flags, subcommands |
| oclif | plugin system, large surface, distribution |

## When to use

Build a command-line tool, wrap an API as a CLI, add a command to an existing CLI.

## NOT for

- Agent-skill scaffolding → use **new-skill**.
- Python CLIs → CreateCLI is TS-only.
