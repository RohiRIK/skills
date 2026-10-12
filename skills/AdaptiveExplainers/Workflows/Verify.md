# Verify the chosen format

Use the host’s equivalent image/browser/media inspection tools when Hermes tool names below are unavailable. Do not claim an unavailable check ran.

## Prerequisites

The actual artifact, supporting evidence, and relevant viewing tools.

## Steps

1. Check the answer against the requested question. Compare counts, chronology, labels, arrows, causal relationships, and status with evidence. Distinguish hypotheses from observations.
2. For text, inspect readability, defined jargon, preserved identifiers, and grounding. Do not claim controlled-language certification without validation.
3. For images, inspect the actual file with `vision_analyze(image_url=actual_file, question='Check readable labels, overlap, clipping, and connector meaning')`. Check the intended display size, not just the original canvas.
4. For HTML, use `browser_exec`: `new_tab('file:///absolute/path/to/artifact.html'); wait_for_load(); print(capture_screenshot())`. Inspect desktop and phone screenshots. Use `cdp('Emulation.setDeviceMetricsOverride', width=390, height=844, deviceScaleFactor=1, mobile=True)` and check `js('document.documentElement.scrollWidth > innerWidth')`. Unexpected whole-page overflow fails; label deliberate diagram scrolling.
5. For grouped cards, test a singleton group as well as populated groups on desktop and phone. Measure card and portrait bounds, not just image-file dimensions: `repeat(auto-fit, minmax(..., 1fr))` expands a lone card across its row, and a square full-width portrait grows with it. Require consistent visual prominence unless emphasis is intentional; choose bounded tracks or retained empty columns when equal sizing is intended. Inspect the grid's computed columns after changing entry counts; a fixed five-column grid with three entries leaves unused space rather than distributing the entries across the container. Confirm responsive breakpoints still work. Source inspection proves the sizing rule, not the rendered appearance; report unperformed visual verification explicitly.
6. Exercise sections/controls, normal/edge/invalid calculations, keyboard navigation, readable fallback, and unexpected remote requests. Test offline behavior before claiming it.
7. For video, inspect real playback and representative frames, timing, audio if present, and captions/transcript agreement with facts. Render success alone is insufficient.
8. Skill maintenance: load router and workflow/context files, parse YAML, verify router <=50 lines and linked paths. Keep structural checks distinct from behavioral/effectiveness tests. Explicitly label unexercised image/video paths and unavailable checks.

## Exit Criteria

The delivered artifact is the tested artifact. Every reported check ran. Evidence is grounded; missing verification is explicit.
