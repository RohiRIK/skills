---
name: Verify
description: "Run a structured build, type, lint, test, secret, and diff gate, ending in a READY / NOT READY verdict. USE WHEN verifying changes, before commit or PR, or as a quality gate."
category: quality
effort: medium
disable-model-invocation: true
---

# Verify

The reusable quality gate. Runs six phases — build → type-check → lint → test → secret-scan → diff-review — and ends with a single READY / NOT READY verdict plus an issue list. Other skills (`Iterate`, `Build`, `Test`) call this instead of reimplementing their own checks.

A FAIL in an early phase stops the gate: fix it before continuing, because later phases are unreliable on a broken build.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunVerify** | "verify", "check this", "ready to commit?", "quality gate" | `Workflows/RunVerify.md` |

## Quick Reference

- Six phases, ordered: build → type → lint → test → secret → diff
- Early-phase failure halts the gate (don't test on a broken build)
- Output is a fixed report ending in `READY` or `NOT READY` for commit/PR
- Designed to be called by `Iterate` (as the per-pass gate) and by `Build`/`Test`

## Gotchas

- A green test suite on a failing build is meaningless — build halts the gate first.
- `SKIP` (missing tooling) never blocks; only `FAIL` does. Don't fail a phase the project simply doesn't have.
- Report, don't auto-fix, inside the gate — auto-fixing hides the signal a loop needs.

## Examples

**Example 1: Pre-commit gate**
```
User: "/verify"
→ Invokes RunVerify workflow
→ Runs all six phases, prints the report
→ Ends with READY (commit) or NOT READY (with the blocking issues)
```

**Example 2: Called inside a loop**
```
Iterate pass reaches its quality gate
→ Invokes Verify → RunVerify
→ NOT READY: failure context captured into .agent-state.md for the next pass
```

**Example 3: Verify after a refactor**
```
User: "check this is still good before I push"
→ RunVerify → build/type/lint/test pass, diff reviewed
→ Reports READY with the changed-file summary
```
