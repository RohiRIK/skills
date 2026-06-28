---
name: frontend-aesthetics
description: "Visual direction — typography, color, hierarchy, motion — so UI isn't generic AI-slop. Use when make it less generic, polish the UI, looks templated/AI-made, or design direction. NOT FOR component"
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='frontend-aesthetics', file_path='references/design-direction.md') before taking any action."
---
# FrontendAesthetics
How to make UI look *intentional*, not templated. The engineering counterpart is `FrontendDesign` (hooks, state, performance) — this is the visual-direction half. For design layers and quick reference see `references/design-layers.md`.

## Workflow Routing

| Trigger | Load |
|---------|------|
| "make it less generic", "polish the UI", "looks AI-made", "design direction" | design-direction.md |
| "review the design", "is this slop?", pre-ship check | checklist.md |
| "set the variance/density/motion", explicit dial control | dials.md |

## Gotchas

- The test: *"If you showed this UI and said 'AI made this', would they instantly believe you? If yes, that's the problem."*
- Serif-by-default is the single most-tested AI tell — don't reach for it without a justified reason.
- An eyebrow above every section, purple gradients, decorative blobs, cards-inside-cards, and div-based fake screenshots all read as slop.
- Two-pass discipline: brainstorm a token system, critique it against the brief, revise, then build.

## Examples

**Example 1: De-slop a page**
```
User: "this landing page looks templated, make it intentional"
→ DesignDirection.md → name the default it fell into → pick brief-specific palette/type/signature → rebuild
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
