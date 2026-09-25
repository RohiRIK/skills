---
name: Workflows
description: "Index of composed skill chains: which skills to run in what order for a full job. USE WHEN combining skills or asked 'what's the workflow for X'."
category: workflow
effort: low
domain: meta
---

# Workflows

Skills compose into repeatable **chains** — one skill does one thing; a workflow runs several in order. The router for any developer or researcher: match the job to a chain, state it, run it. `Chains.md` carries every exact skill sequence; in this repo the chains are also an **OKF bundle** (`workflows/index.md`). **Invoked without a named workflow** → present both tables below and ask which to run; **with one named** → state its chain and run it.

## All workflows

| Family | Job | Workflow |
|--------|-----|----------|
| ship | Ship fast, scope clear enough, explore mid-flight | ship-fast |
| ship | Spec-driven build, or a bug fix | spec-to-ship |
| ship | Learn a domain / library / API before building | research-to-build |
| ship | Deliver cited findings + visuals, not code | research-to-report |
| ship | Compare options before buying or adopting | research-to-buy |
| ship | Get productive in an unfamiliar repo | onboard |
| ship | Build a TypeScript CLI | build-cli |
| ship | Build an MCP server | build-mcp |
| ship | Quick UI polish (anti-slop) | ui-feature |
| ship | Full frontend feature end-to-end | frontend-build |
| ship | Backend / API change, security-gated | api-feature |
| ship | Harden existing code before release | security-pass |
| ship | Cut context-window bloat | context-diet |
| ship | Clean up config / project repo | repo-hygiene |
| library | New skill, clear single capability | new-skill-quick |
| library | New skill, complex / shape unclear | new-skill-heavy |
| library | Fix a skill's broken structure | canonicalize-skill |
| library | Skill won't trigger or mis-fires | fix-trigger |
| library | Improve a target hands-off (loop) | autonomous-loop |
| library | Whole-library health audit | library-audit |
| library | Build / refactor many skills at once | batch-build |
| library | Cut a tagged release | release |

**Running a chain:** state the chain to the user, then **invoke each step — they are skills, not prose**: load each named skill with the Skill tool (or `Skill:Workflow` for one step of a skill) and let it do the work, in order. Honor gates (e.g. `Verify` before shipping) and any loop's named exit condition.

## Gotchas

- Every chain step names a **skill**, never a host slash command — that is what keeps a chain runnable on pi, opencode, and Claude Code alike. Old command equivalents: `/plan`→`Spec`, `/build`→`Build`, `/test`→`Test`, `/capture`→`Reflect`, `/verify`→`Verify`, `/commit-push-pr`→`GitHubOps:CommitPush`+`GitHubOps:PullRequest`.
- Every autonomous loop names its **exit condition** first; no unbounded loops. `Iterate` already calls Verify+Reflect and `Orchestrate` gates with Verify — don't re-chain those by hand.

## Examples

- "ship a small feature fast" → ship-fast → state chain → `Spec` → `Build` → … → `GitHubOps:CommitPush` → `GitHubOps:PullRequest`.
- "my skill won't trigger" → fix-trigger → OptimizeDescription → TestSkill.
