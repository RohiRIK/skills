---
name: IterativeDepth
description: "Run 2-8 sequential passes through the same problem, each from a different lens, to surface requirements and edge cases invisible from a single angle. USE WHEN exploring deeper, multi-angle analysis, or surfacing hidden requirements before building."
category: workflow
effort: high
---

# IterativeDepth

Instead of analyzing a problem once, run several structured passes through it, each from a systematically different **lens**. Each pass surfaces requirements and edge cases the others miss; the combination yields criteria no single-pass analysis produces. A handful of lenses routinely uncovers materially more than direct analysis.

Best used in the exploration/planning phase before committing to an approach. It upgrades the `Spec` skill's single pass — when depth matters, run this and feed the criteria into `Spec`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Explore** | "iterative depth", "explore deeper", "multi-angle", "what am I missing?", "quick depth" (Fast: 2 lenses) | `Workflows/Explore.md` |

## Quick Reference

- 2-8 lens passes, scaled to how much the task warrants (Fast mode = 2)
- Each pass must surface genuinely NEW findings; stop when passes start repeating
- Output is new/refined acceptance criteria per pass — hand to `Spec` or `Orchestrate/Decompose`
- Diminishing returns past ~5 passes for most problems

## Examples

**Example 1: Surface hidden requirements on a redesign**
```
User: "use iterative depth on this API redesign"
→ Invokes Explore
→ Pass 1 functional · 2 failure-modes · 3 security · 4 backward-compat
→ Each pass adds criteria the previous missed; results feed Spec
```

**Example 2: Quick blind-spot check**
```
User: "quick depth on this before I build"
→ Explore in Fast mode (2 lenses: failure + stakeholder)
→ Fast list of overlooked requirements
```

**Example 3: Feed a decomposition**
```
User: "explore deeper, then break it into units"
→ Explore surfaces criteria → Orchestrate/Decompose consumes them as acceptance
```
