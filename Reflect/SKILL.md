---
name: Reflect
description: "Self-rate the just-completed output on five axes with evidence per axis, then fix any gap scored 3 or below. USE WHEN a non-trivial task finishes — 3+ files, a multi-step workflow, or 3+ debug attempts."
category: quality
effort: low
---

# Reflect

After a non-trivial task, pause and rate your own output on five axes — accuracy, completeness, clarity, actionability, conciseness — with concrete evidence per axis. This is a reflection step, not a pass/fail gate: it catches omissions and overconfidence before the user has to.

The discipline that makes it work: every score below 5 cites the specific gap, and anything fixable in under 30 seconds gets fixed immediately.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunReflect** | "reflect", "rate yourself", "how good was that?", end of a non-trivial task | `Workflows/RunReflect.md` |

## Quick Reference

- Five axes, scored 1-5 independently (no average-then-backfill)
- Evidence rule: every sub-5 score names the exact gap — "show the gap, don't just name it"
- Fix-now rule: any axis ≤3 fixable in <30s is fixed in place; larger gaps are flagged
- Composes with `Iterate` (each pass's Reflect score steers the next) and `Test` (scores the test additions)

## Gotchas

- Score each axis independently; don't pick an overall feeling and backfill the parts.
- Every sub-5 score must cite the exact gap — "show the gap, don't just name it".
- The bias is to over-score your own output; if you can't cite evidence for a 5, it isn't a 5.

## Examples

**Example 1: After a multi-file change**
```
User finishes a feature spanning 4 files
→ Invokes RunReflect
→ Scorecard with evidence; Completeness=4 flags a missing timeout case → fixed inline
```

**Example 2: Explicit request**
```
User: "rate yourself on that"
→ RunReflect → 5-axis scorecard + overall + top gap with fix
```

**Example 3: Inside a loop**
```
Iterate pass completes ACT + VERIFY
→ Reflect runs → score recorded in .agent-state.md; ≥4.5 contributes to the exit check
```
