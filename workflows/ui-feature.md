---
type: Workflow
title: UI feature
description: A frontend change that looks intentional, not AI-slop — direction before components.
tags: [build-ship, quick]
chain: "FrontendAesthetics(direction) → FrontendDesign(build) → /simplify → Verify → GitHubOps:CommitPush"
---

# Workflow: ui-feature

A frontend change that looks intentional, not AI-slop.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
FrontendAesthetics(direction) → FrontendDesign(build) → /simplify → Verify → GitHubOps:CommitPush
```

1. **FrontendAesthetics** — *first*. Visual direction: typography, color, hierarchy, motion. Decide the look before writing components.
2. **FrontendDesign** — build it: React/Next components, hooks, state, performance.
3. **/simplify → Verify → ship**.

## Order matters

Aesthetics **before** Design. Skip the direction step and you get generic, templated output — the exact thing FrontendAesthetics exists to prevent.

## When to use

Build or polish UI, "it looks templated / AI-made," need design direction.

## Split

- Visual styling, typography, color, "less generic" → **FrontendAesthetics**.
- Component logic, hooks, state, perf → **FrontendDesign**.
