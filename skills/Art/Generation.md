# Generation — models, pipeline, tools

How every Art workflow actually produces an image.

## Output pipeline (applies to ALL workflows)

All generated images go to `~/Downloads/` first — never directly into a project directory. The user previews in Finder/Preview; only after approval copy to the final destination (then create WebP/thumbnail versions there).

```bash
# 1. Generate to Downloads (default model: agy, no API key)
bun run ~/.claude/skills/Art/Tools/Generate.ts \
  --prompt "[PROMPT]" --aspect-ratio 1:1 \
  --output ~/Downloads/blog-header-concept.png
# 2. User reviews → 3. copy approved file to project → 4. WebP + thumb at destination
```

## Models

**Default: `agy`** — the Antigravity CLI sub-agent drives Nano Banana (Gemini image models) over the machine's cached Google OAuth. No API key, no per-image cost. Preflight once: `agy --version` and confirm sign-in. agy is an agent, not a deterministic API — `Generate.ts` passes the exact output path and verifies the file landed (recovering the newest image if it saved elsewhere). Nano Banana returns JPEG bytes even when the filename ends `.png`.

**API fallbacks** (keys in `.env`): `nano-banana-pro` (GOOGLE_API_KEY), `gpt-image-1` (OPENAI_API_KEY), `flux` / `nano-banana` (REPLICATE_API_TOKEN). Reach for a fallback when agy is unavailable or you need transparency / reference-image features.

```bash
# nano-banana-pro with transparency + thumbnail
bun run ~/.claude/skills/Art/Tools/Generate.ts \
  --model nano-banana-pro --prompt "[PROMPT]" \
  --size 2K --aspect-ratio 1:1 --thumbnail \
  --output ~/Downloads/blog-header-concept.png
```

## Reference images (character/style consistency)

Repeat `--reference-image` per file (nano-banana-pro path). Gemini limits: ≤5 human refs, ≤6 object refs, ≤14 total.

```bash
bun run ~/.claude/skills/Art/Tools/Generate.ts \
  --model nano-banana-pro \
  --prompt "Person from references at a party..." \
  --reference-image face1.jpg --reference-image face2.jpg \
  --size 2K --aspect-ratio 16:9 --output ~/Downloads/character-scene.png
```

## Other tools

| Tool | Job |
|------|-----|
| `Tools/ComposeThumbnail.ts` | Composite thumbnail layers (used by AdHocYouTubeThumbnail) |
| `Tools/FillFrame.ts` | Crop/scale an image so subjects fill the frame (Essay margin rule) |
| `Tools/GeneratePrompt.ts` | Expand a short idea into a full generation prompt |
