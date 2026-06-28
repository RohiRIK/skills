# Research — Overview

Answer a question with real sources at a depth that matches the stakes. Rather than wiring in one fixed set of providers, Research gets multi-provider coverage by **delegating to the skills already in the repo** (`Agy`, `OpenCode`, `Pi`) alongside web search, then cross-checks and synthesizes.

Three depth modes — pick the cheapest that fits. Synthesis is authored via the `Prompting` skill so the output is structured and cited, not a link dump.

## Quick Reference

- **Quick** — one web search + synthesis. **Standard** — web search + one delegated worker, cross-checked. **Deep** — fan out across `Agy` + `OpenCode` + `Pi` in parallel plus web search, then synthesize.
- Always cite sources; flag disagreement between providers rather than silently picking one.
- Default Tier B (`/research`); promote to auto only if undertriggering shows up.
