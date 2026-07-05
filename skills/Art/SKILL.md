---
name: Art
description: "Generates images, diagrams, and visual output. USE WHEN producing any visual artifact — illustration, diagram, chart, thumbnail, card. NOT FOR in-app chart components (use the dataviz skill)."
category: visual
effort: high
---

# Art

Visual content system: illustrations, diagrams, charts, cards, thumbnails. Model setup, output pipeline, and tools live in `Generation.md` — read it before generating anything.

**Hard gate:** ALL generated images go to `~/Downloads/` first for user preview. Never write directly into a project directory.

## Workflow Routing

| Request | Workflow |
|---------|----------|
| Blog header / editorial illustration | `Workflows/Essay.md` |
| D3.js interactive chart or dashboard | `Workflows/D3Dashboards.md` |
| Visualization, or unsure which format | `Workflows/Visualize.md` |
| Mermaid flowchart / sequence diagram | `Workflows/Mermaid.md` |
| Technical / architecture diagram | `Workflows/TechnicalDiagrams.md` |
| Taxonomy or classification grid | `Workflows/Taxonomies.md` |
| Timeline / chronological progression | `Workflows/Timelines.md` |
| Framework / 2x2 matrix | `Workflows/Frameworks.md` |
| Comparison / X vs Y | `Workflows/Comparisons.md` |
| Annotated screenshot | `Workflows/AnnotatedScreenshots.md` |
| Recipe card / step-by-step | `Workflows/RecipeCards.md` |
| Aphorism / quote card | `Workflows/Aphorisms.md` |
| Conceptual map or territory | `Workflows/Maps.md` |
| Stat card / big-number visual | `Workflows/Stats.md` |
| Comic / sequential panels | `Workflows/Comics.md` |
| YouTube thumbnail | `Workflows/AdHocYouTubeThumbnail.md` |
| Thumbnail pre/post validation | `Workflows/YouTubeThumbnailChecklist.md` |
| Remove image background (local rembg) | `Workflows/RemoveBackground.md` |

## Gotchas

- Pick the workflow by artifact type — the generic path loses format-specific quality.
- `agy` (Nano Banana over cached Google OAuth) is the default generator, zero API cost; API fallbacks need `.env` keys and only win for transparency/reference-image features (`Generation.md`).
- Charts/dashboards for a real app UI belong to the dataviz skill and the project's design tokens; D3Dashboards here is for standalone visual deliverables.
- Color: derive palettes per brief (OKLCH method in `FrontendAesthetics/Craft.md`) — no default purple.

## Examples

**Example 1:** "create a header for my AI agents post" → Essay → charcoal-sketch prompt → `Generation.md` pipeline → `~/Downloads/` → approved → copy to project.

**Example 2:** "make a diagram of the request flow" → TechnicalDiagrams → structured architecture visual, consistent styling.

**Example 3:** "visualize humans vs AI decision-making" → Comparisons → side-by-side labeled visual.
