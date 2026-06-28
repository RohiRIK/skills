# Dials — optional explicit control

Adapted from `taste-skill`. Load this only when the user wants explicit control over the visual register, or when you need a concrete tell-list to audit against. A strong model often won't need the dials — they're a guardrail, not a default.

## The three dials (1–10)

| Dial | 1 | 10 | Baseline |
|------|---|----|----------|
| `DESIGN_VARIANCE` | perfect symmetry | artsy chaos | **8** |
| `MOTION_INTENSITY` | static | cinematic / physics | **6** |
| `VISUAL_DENSITY` | art gallery / airy | cockpit / packed data | **4** |

Baseline `8 / 6 / 4`. Use these unless the design read overrides them. Set overrides **conversationally** — don't ask the user to edit a file.

Dial-gated rules:
- `DESIGN_VARIANCE > 4` → avoid centered hero/H1; force split-screen, left-content/right-asset, asymmetric whitespace, or scroll-pinned structure.
- `VISUAL_DENSITY > 7` → generic card containers banned; metrics breathe in plain layout.
- `MOTION_INTENSITY > 4` → the page must actually move (entry transitions, scroll-reveal, hover physics) — a static page claiming high motion is broken. Can't ship working motion in scope? Drop the dial to 3 and ship clean static.
- Any motion `> 3` must honor `prefers-reduced-motion` (non-negotiable). "Motion must be motivated" — each animation communicates hierarchy, storytelling, feedback, or state; "looked cool" is not a reason.

## Hero discipline

- Hero **fits the initial viewport** — headline ≤ 2 lines desktop, subtext ≤ 20 words and ≤ 3-4 lines, CTAs visible without scroll.
- **Max 4 text elements** in the hero: (0-1) eyebrow OR brand strip; headline; subtext; CTA group. Banned in hero: tiny tagline under CTAs, trust micro-strip, pricing teaser, feature bullets, social-proof avatar row — those move to sections below.
- A 4-line hero headline is a **font-size error**, never a copy-length error. Plan font and asset size together; default `text-4xl md:text-5xl lg:text-6xl`, reserve `text-6xl md:text-7xl` for 3-5 word headlines.

## Banned tells (audit before ship)

- **Serif by default.** "Creative/premium/editorial → serif" is the most-tested AI tell. `Fraunces` and `Instrument_Serif` banned as defaults. Emphasis within a headline = italic/bold of the *same* family, never a random serif word injected into a sans headline.
- **Premium-consumer palette** (warm beige/cream + brass/clay/oxblood/ochre + espresso text) banned as the default reach for cookware/wellness/artisan/luxury briefs — acceptable only when the brand brief names those colors.
- **Eyebrow restraint** — max 1 eyebrow per 3 sections (hero counts as 1). Mechanical check: count `uppercase tracking` small-caps labels above headlines; if `> ceil(sections/3)`, it fails. Often the headline alone is enough.
- **Split-header ban** — "left big headline + right small explainer paragraph" as a section header is banned as default; stack vertically unless the right column carries a real visual/interactive element.
- **Div-based fake screenshots** banned — fake task lists/dashboards/terminals built from `<div>`s are a tell. Use a real screenshot, generate a real asset, or leave a clearly-labeled placeholder slot and tell the user what images are needed.
- **Em-dashes as design flourish** in quote/display text — banned.
- **Contrast (a11y, mandatory):** every button and form input passes WCAG AA (4.5:1 body, 3:1 large text). White-on-white CTAs, light placeholders on near-white forms, ghost buttons over photos with no scrim — all banned; audit every CTA and form before shipping.
- **Copy self-audit before ship:** re-read every visible string; flag invented spec aesthetics and generic filler.
