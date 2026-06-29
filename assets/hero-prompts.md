# Hero image generation recipe

How the per-skill hero images in this folder are made, so the set can be completed/regenerated consistently.

- **Tool:** `bun run ~/.claude/skills/Art/Tools/Generate.ts` (default model `agy` — Nano Banana over cached Google OAuth, no API key).
- **Spec:** 16:9, `1376×768` to match the existing set. Output to `~/Downloads/skill-heroes/` first for preview, then copy approved files into `assets/<kebab>-hero.jpg`.
- **Filename:** skill name in kebab-case (e.g. `SecurityReview` → `security-review-hero.jpg`; `DataReportBuilder` → `data-report-hero.jpg`).

## Shared style prefix

```
Retro-futuristic 1960s mission-control command room, cinematic photorealistic 3D render, ultra-detailed, 16:9. Curved banks of vintage CRT monitors showing charts and readouts, brass-and-dark-wood control consoles covered in illuminated buttons and dials, operators in period attire and headsets at the stations, warm amber ambient light with cool neon accent glow, volumetric light, atmospheric depth. Centerpiece: a large softly glowing teal-and-magenta hologram floating above the central console depicting
```

Append a per-skill centerpiece clause (below) to that prefix.

## Pending heroes (17) — centerpiece clauses

| Skill | File | Centerpiece clause |
|-------|------|--------------------|
| Hygiene | `hygiene-hero.jpg` | a sparkling cleaning/maintenance emblem — a broom and a glowing checklist sweeping a control panel spotless, symbolizing config hygiene. |
| Iterate | `iterate-hero.jpg` | a glowing circular loop of arrows tightening toward a bullseye, symbolizing bounded iterative refinement toward a goal. |
| IterativeDepth | `iterative-depth-hero.jpg` | nested concentric lenses / stacked translucent layers receding into depth, symbolizing multi-lens analysis passes. |
| OpenCode | `open-code-hero.jpg` | an open-source terminal emblem with code brackets and a delegation arrow, symbolizing an autonomous coding worker. |
| Orchestrate | `orchestrate-hero.jpg` | a conductor's podium over a glowing node-graph DAG with parallel streams converging, symbolizing parallel orchestration. |
| Pi | `pi-hero.jpg` | a glowing π symbol with delegation streams branching out, symbolizing the Pi CLI worker. |
| Prompting | `prompting-hero.jpg` | a quill writing glowing words that assemble into a structured prompt template, symbolizing prompt engineering. |
| Reflect | `reflect-hero.jpg` | a mirror reflecting a five-axis radar scorecard, symbolizing self-evaluation. |
| Research | `research-hero.jpg` | a magnifying glass over a branching web of inquiry threads with citation markers, symbolizing multi-depth research. |
| SecurityReview | `security-review-hero.jpg` | a shield-and-lock emblem with a red scanning beam over code, symbolizing a security audit. |
| Simplify | `simplify-hero.jpg` | a tangled knot unraveling into a clean straight line, symbolizing post-implementation simplification. |
| SkillForge | `skill-forge-hero.jpg` | an anvil and forge with glowing tools being hammered into shape, symbolizing building and instrumenting skills. |
| Spec | `spec-hero.jpg` | a glowing blueprint with a checklist of acceptance criteria, symbolizing spec-writing. |
| StrategicCompact | `strategic-compact-hero.jpg` | folding/compressing panels of text into a dense glowing core, symbolizing context compaction. |
| TddWorkflow | `tdd-workflow-hero.jpg` | a red-to-green test cycle ring (RED → GREEN → REFACTOR), symbolizing test-first development. |
| Test | `test-hero.jpg` | a row of pass/fail gauges with green checkmarks, symbolizing automated test runs. |
| Verify | `verify-hero.jpg` | a six-segment shield with a checkmark and a glowing READY stamp, symbolizing an automated verification gate. |

## Batch command (when agy quota is available)

```bash
mkdir -p ~/Downloads/skill-heroes
PREFIX="Retro-futuristic 1960s mission-control command room, cinematic photorealistic 3D render, ultra-detailed, 16:9. Curved banks of vintage CRT monitors showing charts and readouts, brass-and-dark-wood control consoles covered in illuminated buttons and dials, operators in period attire and headsets at the stations, warm amber ambient light with cool neon accent glow, volumetric light, atmospheric depth. Centerpiece: a large softly glowing teal-and-magenta hologram floating above the central console depicting"
# one line per pending skill, e.g.:
bun run ~/.claude/skills/Art/Tools/Generate.ts --prompt "$PREFIX a shield-and-lock emblem with a red scanning beam over code, symbolizing a security audit." --aspect-ratio 16:9 --output ~/Downloads/skill-heroes/security-review-hero.jpg
# ...repeat for the other 16 clauses above, then preview and copy into assets/.
```
