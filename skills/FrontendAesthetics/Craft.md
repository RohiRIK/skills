# Craft — the material

Concrete recipes to build a token system from. `DesignDirection.md` is judgment; this file is supply. Pick by **tone** (from `Checklist.md` step 3), then adapt to the subject — never ship a recipe unmodified without checking it against the brief.

## Typography pairings (pick by tone)

Every pairing lists: display / body, full fallback stack, when it fits, and the pitfall that makes it slop. All fonts are free (Google Fonts or Fontshare). Emphasis inside a headline = weight or italic of the *same* family.

| # | Tone | Display | Body | When | Pitfall |
|---|------|---------|------|------|---------|
| 1 | Utilitarian, dense | **Inter** (600-700, tight tracking) | **Inter** 400 + **JetBrains Mono** for data | Ops tools, admin, dashboards used daily | One-family systems live or die on weight contrast — keep ≥300 units between display and body weights |
| 2 | Technical, confident | **Geist** | **Geist Mono** (code/data), Geist 400 body | Dev tools, APIs, infra products | Reads Vercel-adjacent; earn distinction through color + layout, not type |
| 3 | Editorial, serious | **Source Serif 4** (display sizes) | **IBM Plex Sans** | Longform, research, journalism | Serif here is *justified by longform reading* — using it on a SaaS tool is the classic tell |
| 4 | Editorial, modern | **Newsreader** (italic display cuts) | **Inter** | Essays, blogs, personal sites | Italic display everywhere = costume; reserve for pull-quotes and the hero |
| 5 | Refined, premium | **Zodiak** (Fontshare) | **Satoshi** (Fontshare) | Premium goods, studios, fashion | Pair with a *non-cream* palette or you've rebuilt default look #1 |
| 6 | Industrial, loud | **Archivo** Black / Expanded | **Archivo** 400 | Logistics, hardware, manufacturing, sports | Expanded caps at huge sizes only in the hero — repeated per-section it flattens |
| 7 | Brutalist, statement | **Space Grotesk** | **Space Mono** (captions/labels), Space Grotesk body | Portfolios, events, edge brands | The mono accent is the seasoning, not the meal — body stays grotesk |
| 8 | Playful, warm | **Bricolage Grotesque** | **Schibsted Grotesk** | Consumer apps, education, community | Bricolage's quirk at display sizes only; at body sizes it gets noisy |
| 9 | Geometric, punchy | **Clash Display** (Fontshare) | **General Sans** (Fontshare) | Startups, launch pages wanting force | Clash above 64px + short headlines (≤5 words) or it wraps ugly |
| 10 | Humanist, calm | **Sentient** (Fontshare) | **Satoshi** (Fontshare) | Wellness, health, coaching — *without* the cream-serif cliché | Keep chroma low and spacing generous; a loud palette breaks the register |
| 11 | Data-first, terminal | **IBM Plex Mono** (sparingly, display) | **IBM Plex Sans** | Fintech, analytics, monitoring | Mono display > 2 places = gimmick; body is always the sans |
| 12 | Condensed, energetic | **Big Shoulders** | **Inter** | Sports, music, events, campaigns | Condensed needs vertical rhythm discipline — increase line-height on body to compensate |

Fallback stack pattern: `"<Display>", <generic class>` and `"<Body>", system-ui, sans-serif` (serifs: `Georgia, serif`; monos: `ui-monospace, monospace`).

## Color: OKLCH construction formula

Work in OKLCH (`oklch(L C H)`) — perceptually uniform, so a lightness ladder actually looks even. Method:

1. **Base hue from the subject's world.** Name the material first, then the hue: clay → 40°, steel → 240°, moss → 140°, wheat → 90°. A hue chosen from the subject is defensible; a hue chosen from habit is a default.
2. **Neutrals are the base hue at whisper chroma** (C 0.005-0.02), never pure gray. Ladder, WCAG-AA-verified against a L 0.96-0.98 surface at this chroma range: surface L 0.98 → raised 0.95 → border 0.88 → muted text **L 0.32** → body text **L 0.26** → display text L 0.20.
3. **Primary = base hue at working chroma** (C 0.10-0.15). **L ≈ 0.30-0.35 for fills with white/near-white text** (verified ≥4.5:1 at C 0.13); **L ≈ 0.30-0.34 for text-on-light use** (primary used as a colored label or link on the surface color, not as a button fill) — these are two different roles at similar L, not the same value reused, so check which one you're rendering.
4. **One deliberate accent**: analogous (base ± 30-40°) for harmony, near-complement (base + 150-180°) for tension. Cap accent at ~5% of painted area — it marks *the* action or *the* signature, nothing else. **If the accent draws a UI boundary** (focus ring, active border, hover outline — anything WCAG 1.4.11 covers), it needs ≥3:1 against its surround: target **L ≈ 0.35-0.40 on a light surface**, L ≈ 0.60-0.66 on a dark one. A lighter/desaturated accent used purely as a decorative fill or swatch color (no boundary or focus role) is exempt from this floor.
5. **Dark mode**: flip the L ladder (surface 0.16 → raised 0.20 → muted text 0.72 → text 0.80 → display-text 0.92), raise chroma slightly (+0.02) to survive dark surrounds; primary L ≈ 0.60-0.65 against a near-black `--on-primary` (~L 0.14) clears 4.5:1 comfortably at this range.

**Verification is not optional.** These L values are computed via OKLCH→linear-sRGB→WCAG relative luminance at the stated chroma/hue ranges, not eyeballed — the previous version of this formula (L 0.55 for muted text, L 0.55 for primary-with-white-text, L 0.62-0.78 for accents) measured 1.3:1-2.4:1 against its own worked examples' surfaces and failed AA on every one. `Workflows/SlopAudit.md` M5 re-verifies the actual build; treat these numbers as a validated starting point, not a substitute for that check — a hue/chroma combination far from the ones tested here can still fail.

**Worked example A — freight ops dashboard** (subject: steel, containers, night shifts):
`--surface: oklch(0.97 0.008 240)` · `--raised: oklch(0.94 0.01 240)` · `--border: oklch(0.87 0.012 240)` · `--text: oklch(0.28 0.02 240)` · `--primary: oklch(0.32 0.12 240)` · `--on-primary: oklch(1 0 0)` · `--accent (signal orange, containers): oklch(0.38 0.17 55)` — accent only on active-alert states, darkened from a first-draft L 0.68 (2.6:1) to clear the 3:1 UI-boundary floor.

**Worked example B — pottery studio landing** (subject: iron-oxide clay, glaze, kiln):
`--surface: oklch(0.96 0.012 65)` · `--display-text: oklch(0.24 0.03 40)` · `--primary (fired clay): oklch(0.30 0.13 40)` · `--on-primary: oklch(1 0 0)` · `--accent (celadon glaze): oklch(0.40 0.07 160)` — accent on the single CTA and the glaze-swatch signature element, darkened from a first-draft L 0.78 (1.3:1) to clear 3:1. Note: this is *derived from kiln materials*, which is what separates it from banned-default cream+terracotta — the critique note in the brief must say so.

## Scale recipes

- **Type scale**: dense product 1.2 · balanced 1.25 · editorial 1.333. Set `--step-0` at 16px (product) or 18px (editorial); derive up/down. Display sizes come from the scale, not from vibes.
- **Spacing**: 4px base grid. Component spacing uses steps 1-6 (4-24px); section rhythm uses 8-24 steps (32-96px). Sections breathe by *one consistent* rhythm value, not per-section improvisation.
- **Line length**: body 60-75ch; anything wider gets columns or a max-width.

## Radius, border, shadow — pick ONE stance

| Stance | Radius | Depth | Fits |
|--------|--------|-------|------|
| Sharp | 0-2px | 1px borders, no shadow | industrial, editorial, brutalist |
| Soft | 8-12px | one soft single-source shadow (`0 1px 3px` + `0 8px 24px`, low alpha) | consumer, humanist, playful |
| Hard-offset | 0-4px | solid offset shadow (`4px 4px 0`) | statement, playful-brutalist |

Max two radius values per project (e.g. 8px controls / 12px cards). Mixing stances is a top slop signal.

## Motion spec (keyed to `MOTION_INTENSITY` from Dials.md)

| Intensity | What moves | Duration / easing |
|-----------|-----------|-------------------|
| 1-3 | Opacity/color on hover-focus only | 120-160ms, `ease-out` |
| 4-6 | + entrance stagger (hero then sections, once), hover lift ≤4px, scroll-reveal fires once | entrances 200-350ms `cubic-bezier(0.22, 1, 0.36, 1)`; hovers 120-150ms |
| 7-10 | + one orchestrated hero sequence, ambient/physics touches | hero sequence 400-800ms total, staggered 60-90ms; ambient loops ≥20s and subtle |

Rules at any intensity: every animation names what it communicates (hierarchy, feedback, state, story); `prefers-reduced-motion` collapses all of it to opacity ≤150ms; nothing animates on scroll *repeatedly*.

## Output convention

Emit the chosen system as CSS custom properties in the design brief (see `Workflows/DesignBrief.md` template) — `--font-display`, `--font-body`, the OKLCH ladder, `--on-primary`, `--radius`, `--shadow`, `--ease`, `--dur-*`. Always define `--on-primary` explicitly (text/icons rendered on a `--primary` fill) rather than reusing `--surface` — the page background and "readable text on a colored button" are different jobs with different contrast requirements, and conflating them is how a button ships unreadable. The build derives every visual value from these tokens; a hex or font name typed inline during the build is a defect.
