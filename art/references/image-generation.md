# Image Generation

**Default model: `agy`** — the Antigravity CLI sub-agent drives Nano Banana
(Gemini image models) over the machine's cached Google OAuth. No API key in
`.env`, no per-image Replicate/OpenAI cost. This is the default in generate.ts.

**API fallbacks** (need keys in `.env`): `nano-banana-pro` (GOOGLE_API_KEY),
`gpt-image-1` (OPENAI_API_KEY), `flux` / `nano-banana` (REPLICATE_API_TOKEN). Use a
fallback when agy is unavailable, or when you need transparency / reference-image
features the API path supports.

> Preflight once: `agy --version` and confirm the agy CLI is signed in (its OAuth is
> cached). agy is an agent, not a deterministic API — generate.ts tells it the exact
> output path and verifies the file landed (recovering the newest image if it saved
> elsewhere). Note: Nano Banana returns JPEG bytes even when the output ends in `.png`.

## Output to Downloads First

**ALL generated images MUST go to `~/Downloads/` first for preview and selection.**
Never output directly to a project's `public/images/` directory.

**Workflow:**
1. Generate to `~/Downloads/[descriptive-name].png`
2. User reviews in Preview
3. If approved, THEN copy to final destination (e.g., `cms/public/images/`)
4. Create WebP and thumbnail versions at final destination

```bash
# CORRECT - Output to Downloads for preview (default model: agy, no API key)
bun run ~/.claude/skills/Art/scripts/generate.ts \
  --prompt "[PROMPT]" \
  --aspect-ratio 1:1 \
  --output ~/Downloads/blog-header-concept.png

# API fallback (needs key in .env): nano-banana-pro with transparency + thumbnail
bun run ~/.claude/skills/Art/scripts/generate.ts \
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

## Multiple Reference Images (Character/Style Consistency)

For improved character or style consistency, use multiple `--reference-image` flags:

```bash
# Multiple reference images for better likeness
bun run ~/.claude/skills/Art/scripts/generate.ts \
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
