---
name: research
description: "Research a question at three depths (quick / standard / deep multi-agent fan-out), then synthesize cited findings. Use when researching a topic, gathering sources, comparing options, or getting a cross-provider"
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='research', file_path='references/run-research.md') before taking any action."
---


# Research

Answer a question with real sources at a depth that matches the stakes. Gets multi-provider coverage by delegating to `Agy`, `OpenCode`, `Pi` alongside web search, then cross-checks and synthesizes. See `references/overview.md` for depth modes and synthesis details.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunResearch** | "research", "look into", "second opinion", "compare options", "find sources" | `references/run-research.md` |

## Gotchas

- Don't deep-research a trivial question — the fan-out cost isn't free; match depth to stakes.
- Cross-check means *reconcile*, not concatenate — when two sources disagree, surface the disagreement and which is better-grounded.
- Workers can return stale or hallucinated cites; verify a claim against its source before including it.

## Examples

**Example 1: Quick fact**
```
User: "/research what's the current stable Bun version"
→ RunResearch Quick → one web search → answer with the source
```

**Example 2: Cross-checked comparison**
```
User: "/research compare Drizzle vs Prisma for edge runtimes"
→ RunResearch Standard → web search + Agy second opinion → reconciled, cited writeup
```

**Example 3: Deep dive**
```
User: "/research everything on prompt-caching pitfalls across providers"
→ RunResearch Deep → Agy + OpenCode + Pi + web search in parallel → synthesized, cited report
```
