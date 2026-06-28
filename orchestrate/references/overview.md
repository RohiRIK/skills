# Orchestrate Overview

## Detailed Description

Decompose into work units with a dependency DAG, run each independent layer in parallel through the delegation skills (`Agy` / `OpenCode` / `Pi`), and review every unit in a **separate context from the one that wrote it** — the single rule that eliminates author bias.

Runs forked (Tier D) so the heavy multi-unit coordination doesn't consume the parent context. Start simple: decompose → parallel-implement → separate-review. Add merge-queue/eviction only once the basic DAG runs cleanly.

## Quick Reference

- Decompose → `WorkUnit`s (id, deps, acceptance, tier); layers run in dependency order, units within a layer in parallel
- Reviewer never wrote the code it reviews (author-bias elimination); each unit gated by `Verify` before landing
- Tier drives pipeline depth + model (trivial→Haiku, large→Opus); acceptance reuses `Spec` output
