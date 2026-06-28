# IterativeDepth Overview

## Detailed Description

Instead of analyzing a problem once, run several structured passes through it, each from a systematically different **lens**. Each pass surfaces requirements and edge cases the others miss; the combination yields criteria no single-pass analysis produces. A handful of lenses routinely uncovers materially more than direct analysis.

Best used in the exploration/planning phase before committing to an approach. It upgrades the `Spec` skill's single pass — when depth matters, run this and feed the criteria into `Spec`.

## Quick Reference

- 2-8 lens passes, scaled to how much the task warrants (Fast mode = 2)
- Each pass must surface genuinely NEW findings; stop when passes start repeating
- Output is new/refined acceptance criteria per pass — hand to `Spec` or `Orchestrate/Decompose`
- Diminishing returns past ~5 passes for most problems
