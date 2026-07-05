# Tells — banned patterns

Adapted from taste-skill (Leonxlnx/taste-skill). These are the signatures LLM design output defaults to when it tries to "look designed." Each is banned **as a default** — a brief that explicitly asks for one overrides the ban. `Workflows/SlopAudit.md` audits against this file.

## Visual & CSS

- Pure black `#000000` — use off-black/charcoal (`oklch(0.20 …)`).
- Neon/outer glows — use inner borders or subtle tinted shadows.
- Oversaturated accents floating over neutral UI — desaturate to blend.
- Gradient text on large headers; AI-purple gradients anywhere.
- Custom mouse cursors (accessibility- and perf-hostile).
- Glassmorphism on everything; grain/noise on scrolling containers (GPU repaint).

## Typography

- Inter + slate-900 as the unexamined default (fine when *chosen* for utilitarian tone — see `Craft.md` #1).
- Serif by default for "creative/premium" briefs; **Fraunces and Instrument Serif banned as defaults** outright.
- Oversized H1s that just scream — control hierarchy with weight + color, not raw scale.
- `<br>`-broken-and-italicized headlines as a design move; vertical rotated text; a random serif word injected into a sans headline.

## Layout

- Three equal feature cards in a row — use asymmetric grid, 2-col zigzag, or scroll-pinned instead.
- Cards inside cards; a bento grid of all-white text-only cells (≥2-3 cells need real visual variation).
- Bento with empty filler cells — N items means exactly N cells.
- Same layout family twice on one page (8 sections need ≥4 distinct families); 3+ consecutive image/text zigzag splits.
- Split-header (big left headline + small floating right paragraph) as section header — stack vertically.
- Two-line desktop nav; nav taller than 80px.
- `border-t` + `border-b` hairlines on every row of a long list.

## Hero

- Hero overflowing the initial viewport; headline > 2 lines desktop; subtext > 20 words; top padding > 6rem.
- More than 4 text elements (eyebrow OR brand strip · headline · subtext · CTA group).
- Banned inside hero: tagline under CTAs, trust micro-strip, pricing teaser, feature bullets, avatar row, logo wall (logos go in their own section below).
- Version labels as eyebrows (`V0.6`, `BETA`, `EARLY ACCESS`) unless the brief is a launch.
- Decoration text strip at hero bottom (`DESIGN · BUILD · SHIP`); scroll cues (`↓ Scroll to explore`).

## Labels, separators, meta

- Eyebrow above every section — **max 1 eyebrow per 3 sections** (hero counts). Mechanical check: count `uppercase tracking` micro-labels.
- Section-number eyebrows (`001 · Capabilities`, `00 / INDEX`); `01 / 4` pagination on tiles.
- Middle-dot `·` as universal separator — max 1 per metadata line.
- Decorative colored status dots on nav/lists/badges — only for real semantic state, max one section.
- Pills/labels overlaid on images (`Plate · Brand`); photo-credit captions as decoration (`Field study no. 12 · …`).
- Version footers on marketing pages (`v1.4.2`, `Build 0048`); locale/weather strips (`LIS 14:23 · 18°C`) unless the brief is genuinely place-based.

## Copy & data ("Jane Doe" effect)

- Generic names ("John Doe", "Sarah Chan") — use locale-appropriate, believable names.
- Fake-perfect numbers (`99.99%`, `50%`, `1234567`) — use organic data (`47.2%`).
- Startup-slop brand names ("Acme", "Nexus", "SmartFlow") — invent contextual names that sound real.
- Filler verbs: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize".
- Performative-craftsman labels ("From the field", "On our desks", "Quietly trusted by") — plain functional labels win.
- Micro-meta-sentences under eyebrows; generic step labels ("Stage 1/2/3") — the verb-noun IS the label ("Install", "Configure", "Ship").
- Duplicate CTA intent ("Get in touch" + "Let's talk" on one page).

## Em-dash ban (shipped UI copy)

Zero em-dashes (`—`) in any user-visible string: headlines, eyebrows, body, quotes, attribution, captions, buttons, alt text. En-dash as separator also banned. Use period, comma, colon, parentheses, or hyphen. Binary rule — "sparingly" historically fails.

## Assets & components

- Div-based fake screenshots/terminals/dashboards — the #1 tell. Real screenshot, generated asset, or a labeled placeholder slot.
- Hand-rolled SVG icon paths — use Phosphor / Radix / Tabler (Lucide on explicit request).
- Broken Unsplash hotlinks — `https://picsum.photos/seed/<descriptive>/<w>/<h>` or generated assets.
- shadcn/ui in default state — always retheme radii, colors, shadows, type to the brief.
- Fake version footers inside fake screenshots.
