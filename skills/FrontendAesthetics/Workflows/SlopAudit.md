---
description: Post-build gate — mechanical checks + scored rubric against the design brief; one revision loop on failure.
---

# Workflow: SlopAudit

Run AFTER the build, BEFORE Verify/ship. Input: the built UI (component source + rendered output/screenshot when available) and the project's `design-brief.md` if one exists.

## Step 1 — Mechanical checks (each is inspect + pass/fail)

| # | Check | How |
|---|-------|-----|
| M1 | Em-dash ban | Grep user-visible strings for `—` and `–`-as-separator. Zero tolerance. |
| M2 | Eyebrow ratio | Count `uppercase tracking` micro-labels above headlines. Pass: ≤ ceil(sections/3), hero counts as 1. |
| M3 | Hero stack | ≤4 text elements; headline ≤2 lines desktop; subtext ≤20 words; CTAs in first viewport; top padding ≤6rem. |
| M4 | Banned default fonts | Fraunces / Instrument Serif present without explicit brand justification in the brief → fail. |
| M5 | Contrast (WCAG AA) | Every CTA and form input: 4.5:1 body / 3:1 large against its actual background. White-on-white CTAs fail. |
| M6 | Reduced motion | Anything animated beyond hover-opacity is gated by `prefers-reduced-motion` (Motion `useReducedMotion()` or CSS media block). |
| M7 | Theme lock | One theme for the whole page; no section flips light↔dark mid-page; if dark mode shipped, both modes checked. |
| M8 | Layout repetition | No layout family twice (≥4 families per 8 sections); no 3+ consecutive image/text zigzags; no three-equal-cards row. |
| M9 | Scroll mechanics | No `window.addEventListener("scroll")`, no `scrollY` in React state; only transform/opacity animated. |
| M10 | Token fidelity | When a `design-brief.md` exists: every color/font in the build traces to its tokens — inline hex/font names fail. |
| M11 | Tells sweep | Read `Tells.md`; scan for hero tells, label/separator tells, copy tells, div-based fake screenshots, Jane-Doe data. List each hit. |

## Step 2 — Judgment rubric (score 1-5, one line of evidence each)

1. **Distinctiveness** — would a similar generic prompt land here? (5 = clearly not; cite what diverges)
2. **Subject grounding** — do palette/type/signature come from the subject's world, per the brief's critique note?
3. **Hierarchy** — first viewport communicates the product/job; scanning order is deliberate.
4. **Type craft** — pairing executed (weights, scale, line length 60-75ch), not just chosen.
5. **Color craft** — ladder is even, neutrals carry the base hue, accent ≤5% and marks one thing.
6. **Motion restraint** — every animation names what it communicates; claimed intensity = shown intensity.
7. **Copy quality** — strings read like the product, not like filler ("Elevate/Seamless/Unleash" = 2 max).

Also run the `Checklist.md` pre-ship review as supporting evidence.

## Step 3 — Verdict

**PASS** = all mechanical checks green AND no rubric axis < 3. Otherwise **FAIL** with a concrete fix list: per failed item, the file/element, what's wrong, and the specific change (pull replacement material from `Craft.md` / `Vocabulary.md` — not "make it better").

## Step 4 — One revision loop

On FAIL: apply the fix list, then re-run Steps 1-3 **once**. Report final state either way — a second consecutive FAIL goes to the user with the remaining items and a recommendation (usually: the direction is wrong, rerun `DesignBrief`), not another silent loop.

## Output shape

```
SlopAudit — <page>
Mechanical: M1 ✓ … M11 ✗ (2 hits: <what/where>)
Rubric: distinctiveness 4 — <evidence> · … · copy 2 — <evidence>
Verdict: FAIL → fixes: 1) <file/element: change> 2) …
[after loop] Verdict: PASS
```

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"FrontendAesthetics","workflow":"SlopAudit","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
