---
name: build
description: "Implements plan tasks one at a time with compile and commit gates. Use when building from a plan."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='build', file_path='references/incremental-build.md') before taking any action."
---


# Build

Implement plan tasks one at a time: TDD per task, compile gate, commit, repeat.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **IncrementalBuild** | "implement plan", "next task", "build", "work through tasks" | `references/incremental-build.md` |

## Examples

**Example 1: Working through a plan**
```
User: "/build"
→ Invokes IncrementalBuild workflow
→ Picks first pending task from plan
→ TDD → compile → commit → next task
```

**Example 2: Single task from plan**
```
User: "/build implement the auth middleware task"
→ Invokes IncrementalBuild workflow
→ Targets the named task
→ TDD → compile gate → commit
```

*(Invokes TddWorkflow:RedGreenRefactor per task — does not duplicate TDD logic)*

## Gotchas

- Each task commits only on a Verify `READY` verdict — never commit through a failing gate.
- The workflow is idempotent: re-running on a clean tree with all tasks done is a no-op, so `/iterate` can drive it safely.
- One task per commit; bundling tasks makes a failed gate ambiguous about which change broke it.
