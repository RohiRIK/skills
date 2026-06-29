# Workflow: context-diet

Cut context-window bloat. No feature change.

```
ContextBudget → trim agents / skills / MCP / rules → Verify
```

## Steps

1. **ContextBudget** — audit token consumption across agents, skills, MCP servers, and rules; produces prioritized savings.
2. **Trim** — apply the high-ROI cuts (drop unused MCP servers, slim verbose rules, gate rarely-used skills).
3. **Verify** — confirm nothing essential was removed.

## When to use

Session feels bloated, slow, or context fills too fast. Periodic hygiene on a config repo.
