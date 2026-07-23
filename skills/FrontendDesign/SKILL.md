---
name: FrontendDesign
description: "Reference for building React/Next.js components, hooks, state, and performance. USE WHEN building components, hooks, state, or optimizing renders. NOT FOR visual styling, typography, or color (use FrontendAesthetics)."
category: reference
effort: low
domain: dev
user-invocable: true
---

# FrontendDesign

React/Next.js component design patterns and performance optimisation.

## Quick Reference

| Need | Load |
|------|------|
| Component patterns, composition, hooks, performance | `Patterns.md` |
| Generate a component | Run `GenerateComponent` workflow |
| Scaffold files directly | `bun skills/FrontendDesign/Tools/GenerateComponent.ts <Name> --path <dir>` |
| Optimise performance | Run `OptimizePerformance` workflow |

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **GenerateComponent** | "create component", "scaffold component", "new React component" |
| **OptimizePerformance** | "optimise performance", "too many re-renders", "memoize this", "virtualize list", "slow component" |

## Gotchas

- Engineering-only — no visual-aesthetic guidance here. Typography, color, hierarchy, motion, "make it look less generic" → `FrontendAesthetics`.
- Request is BOTH look and build ("polished hero component"): run `FrontendAesthetics` → DesignBrief first; build derives every visual value from the `design-brief.md` tokens — inline hex/font names are defects. Gate with FrontendAesthetics → SlopAudit after.
- `useMemo`/`useCallback` pre-emptively is a common mistake — only add when profiling shows a real problem.
- Data fetching: prefer TanStack Query/SWR or Server Components + `use()`; manual `useEffect` fetch hooks are a legacy fallback (see note in `Patterns.md`).

## Integration

- `FrontendAesthetics` — the look half of this topic
- `CodingStandards/TypeScript.md` for TS rules · `code-reviewer` agent after building · `SecurityReview` for XSS/input sanitisation in forms

## Examples

**Example 1:** "create a sortable data table component" → GenerateComponent → typed Props, composition, co-located state.

**Example 2:** "this list re-renders on every keystroke" → OptimizePerformance → profile first → memo/callback where it pays, virtualize if >100 rows.
