---
name: FrontendAesthetics
description: "Give UI an intentional visual direction — typography, color, hierarchy, motion — so it doesn't read as generic AI-slop. USE WHEN make it less generic, polish the UI, looks templated/AI-made, design direction, or set the variance/density. NOT FOR component logic, hooks, or performance (use FrontendDesign)."
category: reference
effort: low
---

# FrontendAesthetics

How to make UI look *intentional*, not templated. The engineering counterpart is `FrontendDesign` (hooks, state, performance) — this skill is the visual-direction half. When a request is both ("build me a polished hero component"), do FrontendAesthetics first to set direction, then FrontendDesign to build it.

Three layers, each from a different source, loaded on demand:
- `DesignDirection.md` — the brain: how to make deliberate, brief-specific choices (Anthropic canonical).
- `Checklist.md` — the gate: anti-patterns + a fast pre-ship review (ECC).
- `Dials.md` — optional control: `DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY` + hero discipline + banned tells (taste-skill). Load only when explicit control is wanted.

## Workflow Routing

| Trigger | Load |
|---------|------|
| "make it less generic", "polish the UI", "looks AI-made", "design direction" | `DesignDirection.md` |
| "review the design", "is this slop?", pre-ship check | `Checklist.md` |
| "set the variance/density/motion", explicit dial control | `Dials.md` |

## Quick Reference

- Name the three default AI looks and avoid them unless the brief asks: (1) warm cream + high-contrast serif + terracotta; (2) near-black + one acid-green/vermilion accent; (3) broadsheet hairline-rules + zero radius + dense columns.
- The hero is a thesis; spend boldness in one place; structure must encode information, not decorate.
- Where the brief pins a direction, follow it exactly. Where it leaves an axis free, don't spend that freedom on a default.

## Gotchas

- The test: *"If you showed this UI and said 'AI made this', would they instantly believe you? If yes, that's the problem."*
- Serif-by-default ("creative brief = serif") is the single most-tested AI tell — don't reach for it without a justified reason.
- An eyebrow above every section, purple gradients, decorative blobs, cards-inside-cards, and div-based fake screenshots all read as slop.
- Two-pass discipline: brainstorm a token system, critique it against the brief (would any similar prompt land here?), revise, then build.

## Examples

**Example 1: De-slop a page**
```
User: "this landing page looks templated, make it intentional"
→ DesignDirection.md → name the default it fell into → pick a brief-specific palette/type/signature → rebuild
```

**Example 2: Pre-ship review**
```
User: "is this dashboard slop?"
→ Checklist.md → run anti-patterns + review checklist → list concrete fixes
```

**Example 3: Explicit control**
```
User: "build it dense and mostly static"
→ Dials.md → VISUAL_DENSITY high, MOTION_INTENSITY low → constraints feed the build
```
