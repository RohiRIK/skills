---
name: art
description: "Generates images, diagrams, and visual output. Use when producing any visual artifact."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [visual]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='art', file_path='references/ad-hoc-you-tube-thumbnail.md') before taking any action."
---
# Art Skill
Complete visual content system for creating illustrations, diagrams, and visual content.

## Workflow Routing
| Workflow | Reference |
|----------|-----------|
| Customization / preferences | `references/customization.md` |
| Core aesthetic / style rules | `references/core-aesthetic.md` |
| Image generation / agy / API fallbacks | `references/image-generation.md` |
| Blog header or editorial illustration | `references/essay.md` |
| D3.js chart or dashboard | `references/d3dashboards.md` |
| Visualization or unsure format | `references/visualize.md` |
| Mermaid flowchart or sequence diagram | `references/mermaid.md` |
| Technical or architecture diagram | `references/technical-diagrams.md` |
| Taxonomy / classification grid | `references/taxonomies.md` |
| Timeline or chronological progression | `references/timelines.md` |
| Framework or 2x2 matrix | `references/frameworks.md` |
| Comparison or X vs Y | `references/comparisons.md` |
| Annotated screenshot | `references/annotated-screenshots.md` |
| Recipe card / step-by-step | `references/recipe-cards.md` |
| Aphorism / quote / stat / conceptual map | `references/aphorisms.md` |
| Comic or sequential panels / annotated screenshot | `references/comics.md` |
| YouTube thumbnail (existing / ad-hoc / checklist) | `references/you-tube-thumbnail-checklist.md` |
| Remove image background (rembg) | `references/remove-background.md` |

## Gotchas

- **Output to ~/Downloads/ first** — never write directly to project dirs; user must preview.
- **Route by artifact type** — generic path loses format-specific quality.
- **agy is the default** — no API key (cached Google OAuth); fallbacks need keys in `.env`.
- **Nano Banana returns JPEG** even when output ends in `.png`.
- **Gemini limits** — max 5 human refs, 6 object refs, 14 total per request.
## Examples

- "create a header for my AI agents post" → `essay.md` → charcoal sketch → ~/Downloads/
- "make a diagram showing the SPQA pattern" → `technical-diagrams.md` → architecture visual → PNG
- "visualize humans vs AI decision-making" → `comparisons.md` → side-by-side charcoal sketch
