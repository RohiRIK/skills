---
name: Orchestrate
description: "Decompose a spec into a dependency DAG, build units in parallel via delegation, review each in a separate context. USE WHEN orchestrating multi-unit or parallel work, or landing a spec."
category: workflow
effort: high
domain: agents
context: fork
agent: general-purpose
---

# Orchestrate

Turn a spec or RFC into parallel, coordinated work. Decompose it into work units with a dependency DAG, run each independent layer in parallel through the delegation skills (`Agy` / `OpenCode` / `Pi`), and review every unit in a **separate context from the one that wrote it** — the single rule that eliminates author bias.

Runs forked (Tier D) so the heavy multi-unit coordination doesn't consume the parent context. Start simple: decompose → parallel-implement → separate-review. Add merge-queue/eviction only once the basic DAG runs cleanly.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Decompose** | "decompose this spec", "break into work units", "plan the DAG" | `Workflows/Decompose.md` |
| **RunLayer** | "run the layer", "execute units in parallel" | `Workflows/RunLayer.md` |
| **MergeQueue** | "land the units", "merge with conflict recovery" | `Workflows/MergeQueue.md` |

## Quick Reference

- Decompose → `WorkUnit`s (id, deps, acceptance, tier); layers run in dependency order, units within a layer in parallel
- Reviewer never wrote the code it reviews (author-bias elimination); each unit gated by `Verify` before landing
- Tier drives pipeline depth + model (trivial→Haiku, large→Opus); acceptance reuses `Spec` output

## Gotchas

- Overlapping unit file-sets are the #1 cause of merge evictions — draw boundaries to keep them disjoint.
- The reviewer must not be the unit's author — reusing the writing context defeats author-bias elimination.
- Eviction is the recovery mechanism, not failure; the captured context is what lets a unit restructure.

## Examples

**Example 1: Land a multi-unit feature**
```
User: "/orchestrate decompose docs/auth-rfc.md"
→ Decompose → work units + dependency DAG (layers 0..N)
→ RunLayer per layer (parallel within a layer via delegation skills)
→ MergeQueue lands each Verify-passing unit
```

**Example 2: Parallel implementation of independent modules**
```
User: "run these three independent units in parallel"
→ RunLayer → delegates each to a worker, separate reviewer per unit
```

**Example 3: Recover from a merge conflict**
```
A unit conflicts on rebase
→ MergeQueue evicts it, captures conflict context into .agent-state.md
→ Unit re-enters the next pass with the conflict diff as input (no blind retry)
```
