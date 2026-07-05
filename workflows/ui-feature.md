---
type: Workflow
title: UI feature
description: A frontend change that looks intentional, not AI-slop — direction before components.
tags: [build-ship, quick]
chain: "FrontendAesthetics:DesignBrief → FrontendDesign(build) → FrontendAesthetics:SlopAudit → /simplify → Verify → GitHubOps:CommitPush"
---

# Workflow: ui-feature

A frontend change that looks intentional, not AI-slop.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
FrontendAesthetics:DesignBrief → FrontendDesign(build) → FrontendAesthetics:SlopAudit → /simplify → Verify → GitHubOps:CommitPush
```

1. **FrontendAesthetics:DesignBrief** — *first*. Design read, dials, token system → writes `design-brief.md`. The build derives every visual value from it.
2. **FrontendDesign** — build it: React/Next components, hooks, state, performance — from the brief's tokens.
3. **FrontendAesthetics:SlopAudit** — the gate: 11 mechanical checks + 7-axis rubric; one revision loop on fail.
4. **/simplify → Verify → ship**.

## Order matters

Brief **before** build, audit **after**. Skip the brief and you get generic, templated output; skip the audit and slop ships.

## When to use

Build or polish UI, "it looks templated / AI-made," need design direction.

## Split

- Visual styling, typography, color, "less generic" → **FrontendAesthetics**.
- Component logic, hooks, state, perf → **FrontendDesign**.
