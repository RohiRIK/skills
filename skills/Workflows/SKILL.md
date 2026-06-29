---
name: Workflows
description: "Index of composed skill chains — which skills to run, in what order, for a full job (ship a feature, research, build a CLI/MCP, author a skill, release). USE WHEN deciding how to combine skills, asked 'what's the workflow for X', or chaining skills into one job."
category: workflow
effort: low
---

# Workflows

The library's skills compose into repeatable **chains**. A single skill does one thing; a workflow runs several in order. This skill is the router: given a task, name the workflow and run its chain.

Two families: **build & ship** (work on a project) and **maintain the library** (meta).

## Routing

Pick by task. Load `Chains.md` for all 22 chains with their exact skill sequences. Full step-by-step per chain lives in the repo at `workflows/<name>.md` (index: `workflows/README.md`).

| Task | Workflow |
|------|----------|
| Ship a feature — exploring | ship-fast |
| Ship a feature — spec-driven / bug fix | spec-to-ship |
| Understand a domain before building | research-to-build |
| Compare options before buying/adopting | research-to-buy |
| Deliver findings, not code | research-to-report |
| Join an unfamiliar repo | onboard |
| Build a CLI / MCP server | build-cli / build-mcp |
| UI / backend feature | ui-feature / api-feature |
| Create / fix a skill | new-skill-quick / canonicalize-skill / fix-trigger |
| Audit or release the library | library-audit / release |

→ Load **`Chains.md`** for the complete list (22) with chain arrows and when-to-use.

## Gotchas

- A workflow is an **ordered chain of skills**, not one skill — pick the chain, then run its skills in sequence.
- Every autonomous loop names its **exit condition** first; no unbounded loops.
- Auto-composition is already wired: `Iterate` calls Verify+Reflect, `Orchestrate` gates with Verify — don't re-chain those by hand.
