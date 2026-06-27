---
name: FrontendDesign
description: "Reference for building React/Next.js components, hooks, state, and performance. NOT FOR visual styling, typography, color, or making UI look less generic (use FrontendAesthetics)."
category: reference
effort: low
user-invocable: false
---

# FrontendDesign

React/Next.js component design patterns and performance optimisation.

## Quick Reference

| Need | Load |
|------|------|
| Component patterns, composition | `Patterns.md` |
| Context overview | `Context-Overview.md` |
| Generate a component | Run `GenerateComponent` workflow |
| Optimise performance | Run `OptimizePerformance` workflow |

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **GenerateComponent** | "create component", "scaffold component", "new React component" |
| **OptimizePerformance** | "optimise performance", "too many re-renders", "memoize this", "virtualize list", "slow component" |

Run a workflow:
`Run the GenerateComponent workflow`
`Run the OptimizePerformance workflow`

## Key Principles (from Patterns.md)

- Composition over inheritance — build with small focused components
- Explicit `Props` types (no `any`, no implicit props spreading)
- `useMemo`/`useCallback` only when profiling shows a problem — not pre-emptively
- Virtualise lists >100 items (use `@tanstack/virtual`)
- Co-locate state as close to where it's used as possible

## Gotchas

- This skill is engineering-only — it has no visual-aesthetic guidance. For typography, color, hierarchy, motion direction, or "make it look less generic", use `FrontendAesthetics`.
- When a request is BOTH look and build (e.g. "polished hero component"): run `FrontendAesthetics` first to set the visual direction, then `FrontendDesign` to build to it.
- `useMemo`/`useCallback` pre-emptively is a common mistake — only add when profiling shows a real problem.

## Integration

- Visual direction / anti-slop → `FrontendAesthetics` (the look half of this topic)
- Pairs with `CodingStandards/TypeScript.md` for TS rules in components
- Pairs with `code-reviewer` agent after building new components
- Pairs with `SecurityReview` for XSS/input sanitisation in forms
