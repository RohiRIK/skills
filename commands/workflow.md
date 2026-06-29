---
description: "Run a composed skill-chain workflow (ship-fast, spec-to-ship, research-to-buy, build-mcp, new-skill, release…). Lists the chains, or runs one by name."
argument-hint: "[workflow-name]"
disable-model-invocation: false
---

# Workflow Command

Run a composed skill **chain** from this library. A workflow is an ordered sequence of skills, not a single skill.

Argument: `$ARGUMENTS` — a workflow name, or empty.

## Behavior

**No argument** → load the `Workflows` skill (read its `Chains.md`) and present the full index grouped by family — **build & ship** and **maintain the library** — then ask which to run.

**Name given** (e.g. `ship-fast`, `spec-to-ship`, `research-to-buy`, `build-mcp`, `new-skill-quick`, `release`):
1. Read the steps from `workflows/<name>.md` at the repo root if present; otherwise use the chain from the `Workflows` skill's `Chains.md`.
2. State the chain (the ordered skills) up front.
3. Drive it step by step — invoke each skill in sequence, pausing at decision points.
4. Honor every gate (e.g. `Verify` before shipping) and, for any loop, its **exit condition**. Never run an unbounded loop.

## Notes

- Fuzzy-match the name; if ambiguous, show the closest matches and ask.
- If the named workflow doesn't exist, list the available ones instead of guessing.
