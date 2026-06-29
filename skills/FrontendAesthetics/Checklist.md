# Checklist — the gate

Adapted from ECC's `frontend-design-direction`. The fast pre-ship gate: pick a direction, avoid the anti-patterns, run the review.

## Pick a direction before coding

1. **Purpose** — what job does the interface do?
2. **Audience** — who repeats this workflow, and what do they scan first?
3. **Tone** — utilitarian / editorial / playful / industrial / refined / technical / maximal / minimal / dense / calm (pick explicitly).
4. **Memorable detail** — one idea that makes it feel intentional.
5. **Constraints** — framework, accessibility, performance, responsiveness, existing design system.

**Match the direction to the domain.** A SaaS operations tool should usually be dense, quiet, scannable. A portfolio, launch page, or editorial piece can be expressive. Don't force a landing-page composition onto a tool that's used daily.

## Implementation guidance

- Build the actual usable experience as the first screen unless marketing copy is explicitly requested.
- Reuse existing project components, tokens, icon libraries, and routing before introducing a new visual system.
- Use real or generated assets when the interface depends on images/products/charts/inspectable media.
- Prefer contextual typography and spacing over generic oversized hero text.
- Keep palettes multi-dimensional — avoid a UI dominated by one hue family.
- Use CSS variables / design tokens so the direction stays coherent across states.
- Design responsive constraints explicitly: grids, aspect ratios, min/max sizes, stable toolbars — controls shouldn't shift when labels or hover states appear.
- Motion sparingly and deliberately — high-signal transitions that clarify state over decoration.
- Verify text fit on mobile and desktop; long labels wrap or resize cleanly, never overflow.

## Anti-patterns

- No common generated patterns: purple gradients, decorative blobs, oversized cards, vague hero copy, stock-like atmospheric media.
- No UI cards inside other cards.
- No single decorative style everywhere when the domain calls for restraint.
- Don't hide the primary product/tool/workflow behind generic marketing sections.
- No new dependency for a design flourish unless it clearly pays for itself.
- Don't describe the UI's features inside the UI when the controls can speak for themselves.

## Review checklist (pre-ship)

- [ ] First viewport immediately communicates the product, workflow, or object.
- [ ] Visual hierarchy supports scanning and repeated use.
- [ ] Typography fits the container; no overlap with adjacent content.
- [ ] Color has contrast and doesn't collapse into a one-note palette.
- [ ] Icons used for familiar tool actions where available.
- [ ] Responsive layout has stable dimensions for boards, grids, toolbars, controls, tiles, counters.
- [ ] Assets render and carry the subject matter instead of acting as filler.
- [ ] Motion improves orientation and doesn't mask sluggishness.
- [ ] Result matches the repo's existing frontend conventions unless there's a clear reason to depart.
