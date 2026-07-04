---
name: Test
description: "Runs TDD for features and bug fixes. USE WHEN testing a new feature or fixing a bug with tests."
category: workflow
effort: medium
---

# Test

Two modes: new feature TDD and bug fix with the Prove-It pattern.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **FeatureTdd** | "new feature", "add function", "implement", "write tests" | `Workflows/FeatureTdd.md` |
| **ProveIt** | "fix bug", "reproduce bug", "bug fix", "failing test" | `Workflows/ProveIt.md` |

## Examples

**Example 1: New feature**
```
User: "/test I need a rate limiter"
→ Invokes FeatureTdd workflow
→ RED → GREEN → REFACTOR → coverage check
```

**Example 2: Bug fix**
```
User: "/test the auth token expires too early"
→ Invokes ProveIt workflow
→ Write failing test → confirm failure → fix → confirm pass → regression sweep
```

## Gotchas

- Prove-It first: write the failing test that reproduces the bug before any fix — a fix with no failing test proves nothing.
- After the run, Reflect scores the test additions; a low Completeness score usually means an untested edge case worth adding before stopping.
