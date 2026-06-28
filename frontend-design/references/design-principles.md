# Design Principles & Integration

## Key Principles (from Patterns.md)

- Composition over inheritance — build with small focused components
- Explicit `Props` types (no `any`, no implicit props spreading)
- `useMemo`/`useCallback` only when profiling shows a problem — not pre-emptively
- Virtualise lists >100 items (use `@tanstack/virtual`)
- Co-locate state as close to where it's used as possible

## Quick Reference

| Need | Load |
|------|------|
| Component patterns, composition | patterns.md |
| Context overview | `Context-Overview.md` |
| Generate a component | Run `GenerateComponent` workflow |
| Optimise performance | Run `OptimizePerformance` workflow |

## Integration

- Visual direction / anti-slop → `FrontendAesthetics` (the look half of this topic)
- Pairs with `CodingStandards/TypeScript.md` for TS rules in components
- Pairs with `code-reviewer` agent after building new components
- Pairs with `SecurityReview` for XSS/input sanitisation in forms
