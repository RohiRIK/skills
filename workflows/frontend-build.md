---
type: Workflow
title: Frontend build
description: Full frontend feature from spec through visual direction, components, assets, tests, to ship.
tags: [build-ship, heavy]
chain: "Spec → FrontendAesthetics:DesignBrief → FrontendDesign → Art → Spec → Build → Test → FrontendAesthetics:SlopAudit → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest"
---

# Workflow: frontend-build

Full frontend feature — from spec through visual direction, component architecture, assets, testing, to ship. The heavyweight counterpart to `ui-feature` (which is a quick polish pass).

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill to invoke** (load it with the Skill tool), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Spec → FrontendAesthetics:DesignBrief → FrontendDesign(architecture) → Art(assets) → Spec → Build → Test → FrontendAesthetics:SlopAudit → Simplify → Reflect → Verify → GitHubOps:CommitPush → GitHubOps:PullRequest
```

## Steps

1. **Spec** — explore codebase + recall LTM → acceptance criteria covering UX behaviour, responsive breakpoints, accessibility, and visual expectations. Use `--deep` (Iterate:RunLenses) for multi-page features.
2. **FrontendAesthetics:DesignBrief** — set visual direction *before* touching code: design read, dials, token system from `Craft.md`, signature element, similar-prompt critique. Writes `design-brief.md` — the build's single source of visual truth.
3. **FrontendDesign** — component architecture: composition tree, props contracts, state placement, data-flow, hook inventory. Outputs a component plan that satisfies the spec *and* derives all visual values from the brief's tokens.
4. **Art** *(if the feature needs generated visuals)* — hero images, illustrations, icons. Generate to `~/Downloads/` → user previews → copy to project on approval.
5. **Build** — implement task-by-task, in the order DesignBrief → design tokens / CSS → layout components → interactive components → integration. Each task maps to one acceptance criterion from step 1. Gate each task: `bun test` + `bun lint`.
7. **Test** — component tests (render + interaction) + visual regression if available. Gate: suite green.
8. **FrontendAesthetics:SlopAudit** — the anti-slop gate: 11 mechanical checks (em-dash, eyebrow ratio, hero stack, contrast, token fidelity, tells sweep) + 7-axis rubric scored against the brief; one revision loop on fail.
9. **Simplify** — flatten nesting, remove dead abstraction, trim unused CSS.
10. **Reflect** — self-rate ≥ 4 on all axes; pay extra attention to *accessibility* and *visual intentionality*. Fix any ≤ 3.
11. **Verify** — full gate (tsc → lint → tests → build → security → diff).
12. **GitHubOps:CommitPush** then **GitHubOps:PullRequest** — ship.

## Order matters

```
Brief → Design → Build → Audit
```

The brief sets the visual contract. Design engineers to it. Build implements from its tokens. SlopAudit gates the result. Skipping the brief produces generic AI-slop; skipping the audit ships it.

## If you came from the command version

| Old command | Portable skill |
|-------------|----------------|
| `/spec`, `/plan` | `Spec` |
| `/build` | `Build` |
| `/test` | `Test` |
| `/simplify` | `Simplify` |
| `/verify` | `Verify` |
| `/commit-push-pr` | `GitHubOps:CommitPush` + `GitHubOps:PullRequest` |

## Shortcuts

| Scope | Path |
|-------|------|
| Small visual tweak | `FrontendAesthetics:DesignBrief → Build → Simplify → Verify → GitHubOps:CommitPush` (use **ui-feature** instead) |
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
