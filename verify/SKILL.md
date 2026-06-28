---
name: verify
description: "Run a build/type/lint/test/secret/diff gate ending in a READY / NOT READY verdict. Use when verifying changes, before commit or PR, or as a quality gate."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [quality]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='verify', file_path='references/run-verify.md') before taking any action."
---


# Verify

Reusable quality gate. Runs six phases — build → type-check → lint → test → secret-scan → diff-review — ending in a single READY / NOT READY verdict. A FAIL in an early phase stops the gate. See `references/overview.md` for quick reference details.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunVerify** | "verify", "check this", "ready to commit?", "quality gate" | `references/run-verify.md` |

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

