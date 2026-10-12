---
name: AdaptiveExplainers
description: "Choose and verify text, diagrams, interactive HTML, or video when explaining a topic, system, investigation, or decision."
category: workflow
effort: medium
domain: docs
version: 1.0.0
author: Rohi Rikman and Bob
license: MIT
---

# Adaptive Explainers

Choose the simplest format that makes the subject understandable. Presentation supplements the requested work; it does not replace it.

## Workflow Routing

| Workflow | When | File |
|---|---|---|
| Choose and deliver | Explain a topic, system, investigation, or decision | [Deliver](Workflows/Deliver.md) |
| Explore or animate | Changing inputs, motion, or temporal behavior | [Explore](Workflows/Explore.md) |
| Verify | Before delivering an artifact | [Verify](Workflows/Verify.md) |

## Output

Generated HTML defaults to the current user's `~/Downloads`, unless the user explicitly supplies another destination. Resolve the absolute path, use unique descriptive filenames, and keep generated output outside this skill package.

## Context

- [Editorial guidance](Editorial.md)
- [Source and interpretation](Source.md)

## Gotchas

- Simple answers stay concise text; elaborate output is not automatically better.
- Missing evidence remains unknown; simulated values are not measurements.
- Respect explicit formats and approval boundaries; do not force HTML or video.
- A successful render is not visual or behavioral verification.

## Examples

- Explain a branching deployment workflow → verified HTML flowchart in `~/Downloads`.
- Answer a direct factual question → concise grounded text, no file required.
- Show an evolving algorithm → rendered video with captions or transcript when motion helps.
