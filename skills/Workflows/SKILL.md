---
name: Workflows
description: "Index of composed skill chains — which skills to run, in what order, for a full job (ship a feature, research, build a CLI/MCP, author a skill, secure, release). USE WHEN deciding how to combine skills, asked 'what's the workflow for X', or chaining skills into one job."
category: workflow
effort: low
---

# Workflows

Skills compose into repeatable **chains** — one skill does one thing; a workflow runs several in order. The router for any developer or researcher: match the job to a chain, state it, run it. `Chains.md` carries every exact skill sequence; repo-side the chains are an **OKF bundle** (`workflows/index.md`). **Invoked without a named workflow** → present both tables below and ask which to run; **with one named** → open its doc and run its chain.

## Build & ship

| Job | Workflow |
|-----|----------|
| Ship fast, scope clear enough, explore mid-flight | ship-fast |
| Spec-driven build, or a bug fix | spec-to-ship |
| Learn a domain / library / API before building | research-to-build |
| Deliver cited findings + visuals, not code | research-to-report |
| Compare options before buying or adopting | research-to-buy |
| Get productive in an unfamiliar repo | onboard |
| Build a TypeScript CLI | build-cli |
| Build an MCP server | build-mcp |
| Quick UI polish (anti-slop) | ui-feature |
| Full frontend feature end-to-end | frontend-build |
| Backend / API change, security-gated | api-feature |
| Harden existing code before release | security-pass |
| Cut context-window bloat | context-diet |
| Clean up config / project repo | repo-hygiene |

## Maintain the library

| Job | Workflow |
|-----|----------|
| New skill, clear single capability | new-skill-quick |
| New skill, complex / shape unclear | new-skill-heavy |
| Fix a skill's broken structure | canonicalize-skill |
| Skill won't trigger or mis-fires | fix-trigger |
| Improve a target hands-off (loop) | autonomous-loop |
| Whole-library health audit | library-audit |
| Build / refactor many skills at once | batch-build |
| Cut a tagged release | release |

**Running a chain:** open the workflow doc and state its `chain` to the user. Then **invoke each step — they are skills and slash-commands, not prose**: load each named skill with the Skill tool (or run the `/command`) and let it do the work, in order. Honor gates (e.g. `Verify` before shipping) and any loop's named exit condition.

## Gotchas

- Every autonomous loop names its **exit condition** first; no unbounded loops.
- `Iterate` already calls Verify+Reflect and `Orchestrate` gates with Verify — don't re-chain those by hand.

## Examples

- "ship a small feature fast" → ship-fast → state chain → `/plan` → IMPLEMENT → … → `/commit-push-pr`.
- "my skill won't trigger" → fix-trigger → OptimizeDescription → TestSkill.
