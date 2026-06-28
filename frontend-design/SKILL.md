---
name: frontend-design
description: "Use when working with frontend-design. Reference for building React/Next.js components, hooks, state, and performance. NOT FOR visual styling, typography, color, or making UI look less generic (use FrontendAesthetics)."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='frontend-design', file_path='references/optimize-performance.md') before taking any action."
---

# FrontendDesign

React/Next.js component design patterns and performance optimisation.

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **GenerateComponent** | "create component", "scaffold component", "new React component" |
| **OptimizePerformance** | "optimise performance", "too many re-renders", "memoize this", "virtualise list", "slow component" |

## Gotchas
- This skill is engineering-only — for typography, color, hierarchy, motion direction, or "make it look less generic", use `FrontendAesthetics`.
- When a request is BOTH look and build (e.g. "polished hero component"): run `FrontendAesthetics` first, then `FrontendDesign` to build to it.
- `useMemo`/`useCallback` pre-emptively is a common mistake — only add when profiling shows a real problem.

## Examples
**Example 1: Build a component**
```
User: "create a sortable data table component"
→ GenerateComponent → typed Props, composition, co-located state
```
**Example 2: Fix re-renders**
```
User: "this list re-renders on every keystroke"
→ OptimizePerformance → profile → memo/callback where it pays, virtualize if >100 rows
```
