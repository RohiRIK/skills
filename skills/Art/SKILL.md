---
name: Art
description: "Generates images, diagrams, and visual output. USE WHEN producing any visual artifact."
category: visual
effort: high
---

# Art Skill

Complete visual content system for creating illustrations, diagrams, and visual content.

## Customization


If this directory exists, load and apply:
- `PREFERENCES.md` - Aesthetic preferences, default model, output location
- `CharacterSpecs.md` - Character design specifications
- `SceneConstruction.md` - Scene composition guidelines

These override default behavior. If the directory does not exist, proceed with skill defaults.

## 🚨🚨🚨 MANDATORY: Output to Downloads First 🚨🚨🚨

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ALL GENERATED IMAGES GO TO ~/Downloads/ FIRST                   ⚠️
⚠️  NEVER output directly to project directories                    ⚠️
⚠️  User MUST preview in Finder/Preview before use                  ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**This applies to ALL workflows in this skill.**


## Workflow Routing

Route to the appropriate workflow based on the request.

  - Blog header or editorial illustration → `Workflows/Essay.md`
  - D3.js interactive chart or dashboard → `Workflows/D3Dashboards.md`
  - Visualization or unsure which format → `Workflows/Visualize.md`
  - Mermaid flowchart or sequence diagram → `Workflows/Mermaid.md`
  - Technical or architecture diagram → `Workflows/TechnicalDiagrams.md`
  - Taxonomy or classification grid → `Workflows/Taxonomies.md`
  - Timeline or chronological progression → `Workflows/Timelines.md`
  - Framework or 2x2 matrix → `Workflows/Frameworks.md`
  - Comparison or X vs Y → `Workflows/Comparisons.md`
  - Annotated screenshot → `Workflows/AnnotatedScreenshots.md`
  - Recipe card or step-by-step → `Workflows/RecipeCards.md`
  - Aphorism or quote card → `Workflows/Aphorisms.md`
  - Conceptual map or territory → `Workflows/Maps.md`
  - Stat card or big number visual → `Workflows/Stats.md`
  - Comic or sequential panels → `Workflows/Comics.md`
  - YouTube thumbnail (with or without existing assets) → `Workflows/AdHocYouTubeThumbnail.md`
  - YouTube thumbnail pre/post-generation validation → `Workflows/YouTubeThumbnailChecklist.md`
  - Remove an image background (local rembg) → `Workflows/RemoveBackground.md`

---

## Core Aesthetic

**Default:** Production-quality concept art style appropriate for editorial and technical content.

**User customization** defines specific aesthetic preferences including:
- Visual style and influences
- Line treatment and rendering approach
- Color palette and wash technique
- Character design specifications
- Scene composition rules

---



## Image Generation

**Default model: `agy`** — the Antigravity CLI sub-agent drives Nano Banana
(Gemini image models) over the machine's cached Google OAuth. No API key in
`.env`, no per-image Replicate/OpenAI cost. This is the default in `Generate.ts`.

**API fallbacks** (need keys in `.env`): `nano-banana-pro` (GOOGLE_API_KEY),
`gpt-image-1` (OPENAI_API_KEY), `flux` / `nano-banana` (REPLICATE_API_TOKEN). Use a
fallback when agy is unavailable, or when you need transparency / reference-image
features the API path supports.

> Preflight once: `agy --version` and confirm the agy CLI is signed in (its OAuth is
> cached). agy is an agent, not a deterministic API — `Generate.ts` tells it the exact
> output path and verifies the file landed (recovering the newest image if it saved
> elsewhere). Note: Nano Banana returns JPEG bytes even when the output ends in `.png`.

### 🚨 CRITICAL: Always Output to Downloads First

**ALL generated images MUST go to `~/Downloads/` first for preview and selection.**

Never output directly to a project's `public/images/` directory. User needs to review images in Preview before they're used.

**Workflow:**
1. Generate to `~/Downloads/[descriptive-name].png`
2. User reviews in Preview
3. If approved, THEN copy to final destination (e.g., `cms/public/images/`)
4. Create WebP and thumbnail versions at final destination

```bash
# CORRECT - Output to Downloads for preview (default model: agy, no API key)
bun run ~/.claude/skills/Art/Tools/Generate.ts \
  --prompt "[PROMPT]" \
  --aspect-ratio 1:1 \
  --output ~/Downloads/blog-header-concept.png

# API fallback (needs key in .env): nano-banana-pro with transparency + thumbnail
bun run ~/.claude/skills/Art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "[PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --thumbnail \
  --output ~/Downloads/blog-header-concept.png

# After approval, copy to final location
cp ~/Downloads/blog-header-concept.png ~/Projects/Website/cms/public/images/
cp ~/Downloads/blog-header-concept-thumb.png ~/Projects/Website/cms/public/images/
```

### Multiple Reference Images (Character/Style Consistency)

For improved character or style consistency, use multiple `--reference-image` flags:

```bash
# Multiple reference images for better likeness
bun run ~/.claude/skills/Art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "Person from references at a party..." \
  --reference-image face1.jpg \
  --reference-image face2.jpg \
  --reference-image face3.jpg \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ~/Downloads/character-scene.png
```

**API Limits (Gemini):**
- Up to 5 human reference images
- Up to 6 object reference images
- Maximum 14 total reference images per request

**API keys in:** `.env`

## Examples

**Example 1: Blog header image**
```
User: "create a header for my AI agents post"
→ Invokes ESSAY workflow
→ Generates charcoal sketch prompt
→ Creates image with architectural aesthetic
→ Saves to ~/Downloads/ for preview
→ After approval, copies to public/images/
```

**Example 2: Technical architecture diagram**
```
User: "make a diagram showing the SPQA pattern"
→ Invokes TECHNICALDIAGRAMS workflow
→ Creates structured architecture visual
→ Outputs PNG with consistent styling
```

**Example 3: Comparison visualization**
```
User: "visualize humans vs AI decision-making"
→ Invokes COMPARISONS workflow
→ Creates side-by-side visual
→ Charcoal sketch with labeled elements
```

## Gotchas

- Pick the workflow by artifact type (diagram vs chart vs thumbnail) — the routing list maps intent to the right one; using the generic path loses format-specific quality.
- `agy` (Nano Banana over cached Google OAuth) is the default generator with no API key; API fallbacks need keys in `.env` and only beat agy for transparency/reference-image features.
