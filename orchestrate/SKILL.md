---
name: orchestrate
description: "Decompose a spec into a dependency DAG, build units in parallel via delegation, review each in a separate context. Use when orchestrating multi-unit or parallel work, or landing a large"
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='orchestrate', file_path='references/decompose.md') before taking any action."
---

# Orchestrate

Turn a spec or RFC into parallel, coordinated work. Decompose into work units with a dependency DAG, run each independent layer in parallel, and review every unit in a **separate context from the one that wrote it**.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Decompose** | "decompose this spec", "break into work units", "plan the DAG" | `references/decompose.md` |
| **RunLayer** | "run the layer", "execute units in parallel" | `references/run-layer.md` |
| **MergeQueue** | "land the units", "merge with conflict recovery" | `references/merge-queue.md` |

## Gotchas
- Overlapping unit file-sets are the #1 cause of merge evictions — draw boundaries to keep them disjoint.
- The reviewer must not be the unit's author — reusing the writing context defeats author-bias elimination.
- Eviction is the recovery mechanism, not failure; the captured context is what lets a unit restructure.

## Examples
**Example 1: Land a multi-unit feature**
```
User: "/orchestrate decompose docs/auth-rfc.md"
→ Decompose → work units + dependency DAG (layers 0..N)
→ RunLayer per layer → MergeQueue lands each Verify-passing unit
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
