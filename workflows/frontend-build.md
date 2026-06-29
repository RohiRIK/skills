# Workflow: frontend-build

Full frontend feature — from spec through visual direction, component architecture, assets, testing, to ship. The heavyweight counterpart to `ui-feature` (which is a quick polish pass).

```
/spec → FrontendAesthetics(direction) → FrontendDesign(architecture) → Art(assets) → /plan → /build → /test → /simplify → Reflect → /verify → /commit-push-pr
```

## Steps

1. **/spec** — explore codebase + recall LTM → acceptance criteria covering UX behaviour, responsive breakpoints, accessibility, and visual expectations. Use `--deep` (IterativeDepth) for multi-page features.
2. **FrontendAesthetics** — set visual direction *before* touching code: typography, color palette, hierarchy, motion intensity, density. Outputs a design-direction brief (token system, signature element, anti-slop checklist). Load `DesignDirection.md` + `Dials.md` when explicit control is needed.
3. **FrontendDesign** — component architecture: composition tree, props contracts, state placement, data-flow, hook inventory. Outputs a component plan that satisfies the spec *and* honours the aesthetics brief.
4. **Art** *(if the feature needs generated visuals)* — hero images, illustrations, icons. Generate to `~/Downloads/` → user previews → copy to project on approval.
5. **/plan** — each task maps to one acceptance criterion from step 1. Tasks ordered: design tokens / CSS → layout components → interactive components → integration.
6. **/build** — implement task-by-task. Gate each task: `bun test` + `bun lint`.
7. **/test** — component tests (render + interaction) + visual regression if available. Gate: suite green.
8. **/simplify** — flatten nesting, remove dead abstraction, trim unused CSS.
9. **Reflect** — self-rate ≥ 4 on all axes; pay extra attention to *accessibility* and *visual intentionality* (does it look templated?). Fix any ≤ 3.
10. **/verify** — full gate (tsc → lint → tests → build → security → diff).
11. **/commit-push-pr** — ship.

## Order matters

```
Aesthetics → Design → Build
```

Aesthetics sets the visual contract. Design engineers to it. Build implements. Reversing or skipping Aesthetics produces the generic AI-slop the skill exists to prevent.

## Command → skill

| `/command` | Skill | `/command` | Skill |
|-----------|-------|-----------|-------|
| `/spec` | Spec | `/test` | Test |
| `/plan` | plan | `/simplify` | Simplify |
| `/build` | Build | `/verify` | Verify |
| FrontendAesthetics | FrontendAesthetics | `/commit-push-pr` | GitHubOps:PullRequest |
| FrontendDesign | FrontendDesign | Art | Art |

## Shortcuts

| Scope | Path |
|-------|------|
| Small visual tweak | `FrontendAesthetics → /build → /simplify → /verify → /commit-push-pr` (use **ui-feature** instead) |
| Component with no new visuals | skip step 4 (Art) |
| Greenfield app (new project) | full chain; add `CodebaseOnboarding` at step 0 if joining an existing repo |

## When to use

- New page, multi-component feature, or design-system addition.
- Anything where you need spec + plan + visual direction before building.
- "Build the frontend for X end-to-end."

## When NOT to use

- Quick polish / single component fix → **ui-feature**.
- Backend-only → **api-feature**.
- Scope already built, just needs a look pass → run **FrontendAesthetics** standalone.
