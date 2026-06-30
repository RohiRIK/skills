---
type: Workflow
title: Context diet
description: Cut context-window bloat across agents, skills, MCP, and rules — no feature change.
tags: [build-ship]
chain: "ContextBudget → trim agents / skills / MCP / rules → Verify"
---

# Workflow: context-diet

Cut context-window bloat. No feature change.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
ContextBudget → trim agents / skills / MCP / rules → Verify
```

## Steps

1. **ContextBudget** — audit token consumption across agents, skills, MCP servers, and rules; produces prioritized savings.
2. **Trim** — apply the high-ROI cuts (drop unused MCP servers, slim verbose rules, gate rarely-used skills).
3. **Verify** — confirm nothing essential was removed.

## When to use

Session feels bloated, slow, or context fills too fast. Periodic hygiene on a config repo.
