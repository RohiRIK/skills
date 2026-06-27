---
name: TddWorkflow
description: "Test-first development workflow. USE WHEN writing a feature test-first or fixing a bug with TDD."
category: workflow
effort: medium
---

# TddWorkflow

Orchestrate the Red-Green-Refactor cycle.

## Workflow Routing

| Workflow | Description | Trigger | 
| :--- | :--- | :--- |
| **RedGreenRefactor** | Execute TDD cycle. | `Start TDD`, `Implement feature`, `Fix bug` |

Run a workflow by name:
`Run the RedGreenRefactor workflow`

*(See `Context-TDD.md` for principles)*
## Gotchas

- RED must fail for the right reason — a test that errors on a typo, not the missing behaviour, gives a false RED.
- Refactor only while green; changing behaviour and structure in the same step hides which one broke a test.

## Examples

**Example 1: New feature TDD**
```
User: "add slug generation, test-first"
→ RedGreenRefactor → failing test → minimal impl → refactor green
```

**Example 2: Bug fix**
```
User: "fix this off-by-one, TDD"
→ failing test reproduces it → fix → green → refactor
```
