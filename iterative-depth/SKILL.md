---
name: iterative-depth
description: "Run 2-8 lens passes over the same problem to surface requirements and edge cases a single angle misses. Use when exploring deeper, multi-angle analysis, or surfacing hidden requirements before building."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='iterative-depth', file_path='references/explore.md') before taking any action."
---

# IterativeDepth

Run several structured passes through a problem, each from a systematically different **lens**, to surface requirements and edge cases a single-pass analysis misses.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Explore** | "iterative depth", "explore deeper", "multi-angle", "what am I missing?", "quick depth" (Fast: 2 lenses) | `references/explore.md` |

## Gotchas
- Convergence (a pass with no new findings) is the stop signal — don't pad to hit the pass count.
- The value is *different* lenses; repeating the functional pass louder adds nothing.
- This produces criteria, not code — hand off to `Spec` or `Orchestrate/Decompose`.

## Examples
**Example 1: Surface hidden requirements on a redesign**
```
User: "use iterative depth on this API redesign"
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
