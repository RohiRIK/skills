---
name: FrontendAesthetics
description: "Visual direction and anti-slop gate — typography, color, motion. USE WHEN building any page/dashboard/UI, redesigning, design direction, or looks templated/AI-made. NOT FOR component logic or performance (use FrontendDesign)."
category: reference
effort: medium
user-invocable: true
---

# FrontendAesthetics

Make UI look *intentional*, not templated. Runs BEFORE code (DesignBrief), AFTER code (SlopAudit), and on existing sites (Redesign). Engineering counterpart is `FrontendDesign` — direction first, then build, then gate.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **DesignBrief** | "build a page/dashboard/UI", "landing page", "design direction", any new UI | `Workflows/DesignBrief.md` |
| **SlopAudit** | "is this slop?", "review the design", pre-ship gate, after any UI build | `Workflows/SlopAudit.md` |
| **Redesign** | "redesign", "modernize this site", "refresh the UI" | `Workflows/Redesign.md` |

## Context files (read when the topic is relevant)

| File | Carries |
|------|---------|
| `DesignDirection.md` | The judgment layer — brief-specific choices, the three default looks, two-pass discipline |
| `Craft.md` | The material — 12 tone-tagged font pairings, OKLCH palette formula, scales, radius/shadow stances, motion spec |
| `Tells.md` | Banned patterns catalog — hero/label/copy tells, em-dash ban, asset rules |
| `Vocabulary.md` | Pattern names — hero paradigms, grids, scroll animations, animation stack rules |
| `Dials.md` | VARIANCE / MOTION / DENSITY dials + use-case presets |
| `Checklist.md` | Fast pre-ship review (executed by SlopAudit) |

## Gotchas

- The test: *"If you said 'AI made this', would they instantly believe you? If yes, that's the problem."*
- The design-brief artifact is the contract — a hex or font name typed inline during the build, outside its tokens, is a defect.
- Quiet constraints (accessibility-first, regulated, public-sector) override aesthetic preference.
- Request is BOTH look and build: DesignBrief first, FrontendDesign builds to it, SlopAudit gates it.
- Audience picks the aesthetic, not your taste; where the brief pins a direction, follow it exactly.

## Examples

**Example 1:** "build a landing page for my pottery studio" → DesignBrief → design read + dials + tokens from Craft.md → `design-brief.md` → hand to FrontendDesign.

**Example 2:** "this dashboard looks AI-made" → SlopAudit → 11 mechanical checks + 7-axis rubric → fix list → one revision loop.

**Example 3:** "modernize our marketing site, keep the brand" → Redesign (Preserve) → audit → levers 1-4 → SlopAudit with brand-continuity line.
