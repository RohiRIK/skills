# Workflow: build-cli

Ship a TypeScript command-line tool.

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
