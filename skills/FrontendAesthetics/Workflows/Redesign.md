---
description: Redesign an existing UI — detect the mode, audit before touching, modernize by priority levers with preservation rules.
---

# Workflow: Redesign

Adapted from taste-skill's redesign protocol. Misclassifying the mode is the biggest source of bad redesign output — detect it first.

## Step 1 — Detect the mode

- **Greenfield** — no existing site, or full overhaul approved → run `DesignBrief` normally.
- **Preserve** — modernize without breaking the brand → audit first, extract brand tokens, evolve gradually.
- **Overhaul** — new visual language over existing content → greenfield for visuals; preserve content and IA.

If ambiguous, ask once: *"Should this redesign preserve the existing brand, or start visually from scratch?"*

## Step 2 — Audit before touching

Document the current state:
- **Brand tokens** — colors, type stack, logo treatment, radii (extract before drafting new ones; an already-purple brand stays purple).
- **Information architecture** — page tree, primary nav, key conversion paths.
- **Patterns to preserve** — signature interactions, recognizable hero, copy voice.
- **Patterns to retire** — `Tells.md` hits, broken layouts, generic stock imagery, perf traps.
- **Dial reading of the existing site** — infer current VARIANCE/MOTION/DENSITY; that's the starting point (`Dials.md` presets: preserve = match, overhaul = +2/+2/match).
- **SEO baseline** — slugs, meta, structured data. SEO migration is the #1 redesign risk.

## Step 3 — Write the brief

Run `DesignBrief` steps 2-6 with the audit as input; the brief's Subject section records mode + preserved tokens.

## Step 4 — Modernization levers (apply in order, stop when the brief is satisfied)

1. **Typography refresh** — biggest visual lift per unit of risk (`Craft.md` pairings).
2. **Spacing & rhythm** — section padding, vertical rhythm.
3. **Color recalibration** — desaturate, unify neutrals on the OKLCH ladder, keep the brand accent.
4. **Motion layer** — intensity-appropriate micro-interactions on existing components.
5. **Hero & key-section recomposition** — `Vocabulary.md` patterns.
6. **Full block replacement** — only when a block is unsalvageable.

Decision rule: IA/content/SEO sound → levers 1-4 only (~70% of the value at ~40% of the risk). Structural visual debt → full redesign with strict content preservation.

## Step 5 — Never change silently

URL slugs · primary nav labels · form field names/order (analytics + autofill) · logo/wordmark · legal/consent copy · existing accessibility wins (focus states, alt text, contrast). Each needs explicit user approval.

## Step 6 — Gate

Run `SlopAudit` on the result; in Preserve mode add one rubric line: *brand continuity* — a returning user recognizes the site.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"FrontendAesthetics","workflow":"Redesign","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
