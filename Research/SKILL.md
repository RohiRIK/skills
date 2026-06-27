---
name: Research
description: "Research a question at one of three depths — quick single-search, standard cross-check, or deep multi-agent fan-out — then synthesize cited findings. USE WHEN researching a topic, gathering sources, comparing options, or asking for a second opinion across providers."
category: workflow
effort: medium
disable-model-invocation: true
argument-hint: [query]
---

# Research

Answer a question with real sources at a depth that matches the stakes. Rather than wiring in one fixed set of providers, Research gets multi-provider coverage by **delegating to the skills already in the repo** (`Agy`, `OpenCode`, `Pi`) alongside web search, then cross-checks and synthesizes.

Three depth modes — pick the cheapest that fits. Synthesis is authored via the `Prompting` skill so the output is structured and cited, not a link dump.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunResearch** | "research", "look into", "second opinion", "compare options", "find sources" | `Workflows/RunResearch.md` |

## Quick Reference

- **Quick** — one web search + synthesis. **Standard** — web search + one delegated worker, cross-checked. **Deep** — fan out across `Agy` + `OpenCode` + `Pi` in parallel plus web search, then synthesize.
- Always cite sources; flag disagreement between providers rather than silently picking one.
- Default Tier B (`/research`); promote to auto only if undertriggering shows up.

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
