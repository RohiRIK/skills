# RemoveBackground Workflow

Remove backgrounds from existing images using local `rembg` (no external API, no keys, runs offline).

## Purpose

Turn an image into a transparent PNG. Useful for: converting diagrams to transparent backgrounds, preparing images that composite cleanly over a page background, creating transparent icons, cleaning up screenshots.

## Tooling

Local `rembg` (Python, ONNX-based, offline). Default binary `~/.local/bin/rembg` (override with `REMBG_BIN`).

Install if missing:
```bash
uv tool install rembg      # preferred (uv)
# or
pipx install rembg
```

## Steps

### 1. Verify the input
```bash
ls -lh /path/to/image.png
```

### 2. Remove the background
```bash
# in place (rembg always emits PNG)
~/.local/bin/rembg i input-image.png output-image.png
```

### 3. Verify transparency
```bash
file output-image.png          # MUST report "PNG image data, ... RGBA"
magick identify -format "%[channels]" output-image.png
# "srgba" (contains "a") = alpha present · "srgb" = NO alpha, transparency failed
```

### 4. Place the result
```bash
mv output-image.png input-image.png            # replace original after verifying
# or
cp output-image.png /destination/transparent-image.png
```

## Troubleshooting

- **`rembg not found`** → `uv tool install rembg` (or set `REMBG_BIN`).
- **First run slow** → expected; the default `u2net` model (~176MB) is fetched once into `~/.u2net/`, then cached.
- **Output identical to input** → no clear subject detected; try a different model:
  ```bash
  ~/.local/bin/rembg i -m isnet-general-use input.png output.png   # better edges, general
  ~/.local/bin/rembg i -m birefnet-general input.png output.png    # higher quality, slower
  ```
- **Jagged edges / lost hair detail** → use `birefnet-general` (or `birefnet-portrait` for people).

## Gotchas

- rembg always outputs PNG even from a `.jpg` input — name the output `.png` or you'll get a mislabeled file.
- Verify alpha with `file`/`magick` before shipping; a "successful" run with no detected subject silently returns an opaque image.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Art","workflow":"RemoveBackground","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
