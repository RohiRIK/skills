---
description: Mandatory pre-code pass — read the brief, set direction, write the design-brief artifact the build derives every visual value from.
---

# Workflow: DesignBrief

Run BEFORE any UI code on a new page/feature. Output is a `design-brief.md` artifact; the build (FrontendDesign) treats its tokens as the single source of visual truth.

## Steps

### 1. Read the room

Collect from the request: page kind (landing / portfolio / product tool / editorial / redesign), vibe words used, reference URLs or screenshots, audience (the audience picks the aesthetic, not your taste), existing brand assets, and quiet constraints (accessibility-first, regulated, public-sector — these OVERRIDE aesthetic preference). If the site already exists, switch to `Workflows/Redesign.md` for mode detection first.

### 2. Declare the Design Read

One line, stated to the user before anything else:
> "Reading this as: **\<page kind>** for **\<audience>**, with a **\<vibe>** language, leaning toward **\<aesthetic family or design system>**."

If the read genuinely diverges (e.g. Linear-clean vs Awwwards-experimental), ask exactly **one** clarifying question. If you can infer confidently, declare and proceed — don't ask.

### 3. Set the dials

Start from the use-case preset in `Dials.md`, adjust from the design read, and record the three values with one line of reasoning. Never silently use the baseline.

### 4. Draft the token system from Craft.md

- Typography: pick a pairing from `Craft.md` by tone (or justify a deviation). Record display/body + fallback stacks.
- Color: run the OKLCH formula — name the subject material, derive base hue, ladder, primary, one accent. 4-6 named values.
- Scale: type scale ratio + spacing rhythm; radius/shadow stance (exactly one).
- Signature: the single element this page is remembered by — name it using `Vocabulary.md` pattern names where one fits.
- Motion: intensity band from the dials; what animates, per `Craft.md` motion spec.

### 5. Critique against the brief (the anti-default gate)

Mentally run a *similar generic prompt* — if any part of the draft lands where that generic prompt would land (the three default looks in `DesignDirection.md`, or any `Tells.md` default), revise it and record what changed and why. Write this as the brief's **critique note** — a brief without one is incomplete.

### 6. Write the artifact

Ask the user where it lives (default `docs/design-brief.md` in the target project). Template:

```markdown
# Design Brief — <project/page>

**Design read:** <the one-liner from step 2>
**Dials:** VARIANCE <n> · MOTION <n> · DENSITY <n> — <one-line reasoning>

## Subject
<subject, audience, the page's single job>

## Tokens
:root {
  --font-display: "<Display>", <fallbacks>;
  --font-body: "<Body>", <fallbacks>;
  --surface: oklch(…);  --raised: oklch(…);  --border: oklch(…);
  --text: oklch(…);     --text-muted: oklch(…);
  --primary: oklch(…);  --accent: oklch(…);   /* accent ≤5% of painted area */
  --radius: <px>;  --shadow: <stance>;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);  --dur-fast: <ms>;  --dur-base: <ms>;
}
Type scale: <ratio> from <base>px · Spacing: 4px grid, section rhythm <value>

## Signature element
<name + one-paragraph description of the one memorable thing>

## Motion
<intensity band; the orchestrated moment if any; everything honors prefers-reduced-motion>

## Critique note
<a generic prompt would land at X; this brief diverges by Y because Z>
```

### 7. Hand off

Tell the user the brief is ready and the build (FrontendDesign / GenerateComponent) will derive every visual value from it. Any hex or font name typed inline during the build, outside these tokens, is a defect.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"FrontendAesthetics","workflow":"DesignBrief","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
