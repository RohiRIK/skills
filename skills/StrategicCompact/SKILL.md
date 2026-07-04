---
name: StrategicCompact
description: "Reference for context compaction strategy and timing guidance. USE WHEN deciding when or how to compact a long session, or planning context strategy."
category: reference
effort: low
user-invocable: false
---

# StrategicCompact

Manage context window usage via strategic compaction.

## Workflow Routing

| Workflow | Description | Trigger |
| :--- | :--- | :--- |
| **RunCompact** | Execute strategic context compaction. | `Compact memory`, `Summarize session` |

Run a workflow by name:
`Run the RunCompact workflow`
## Gotchas

- Compact at a natural boundary (after a task lands), not mid-task — compacting mid-edit loses the working state you still need.
- A fresh context that rediscovers state from the filesystem often beats an aggressively-compacted degraded one.

## Examples

**Example 1: Long session**
```
User: "context is getting full"
→ RunCompact → summarize completed work, preserve open threads + decisions
```

**Example 2: Before a new phase**
```
User: "done with auth, starting billing"
→ RunCompact at the boundary → clean slate carrying only what billing needs
```
