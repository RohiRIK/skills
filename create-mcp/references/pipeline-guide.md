# MCP Pipeline & Design Guide

## Pipeline (the whole job)

```
PLAN → ARCHITECT → DESIGN PRIMITIVES → BUILD → SECURE → TEST/DEBUG → CONNECT → ITERATE
```

Read pipeline.md for the stage-by-stage runbook. For a single build pass, jump to the `BuildServer` workflow.

## Decide First

1. **Primitives needed?** Actions the model triggers → **tools**. Read-only context the app pulls → **resources**. User-invoked templates → **prompts**. Need the host LLM / user input / file scope → **sampling / elicitation / roots** (client features, optional).
2. **Transport?** Runs on the user's machine → **stdio** (default, simplest). Hosted/shared over network → **Streamable HTTP** (needs OAuth — see security.md).
3. **Language?** TypeScript or Python are Tier-1 SDKs. Default TypeScript run via `bun`.

## Quick Reference

Built from the full modelcontextprotocol.io docs. Load the layer you need:

- **Full pipeline** (plan → architect → build → secure → test → connect): `SkillSearch('createmcp pipeline')` → pipeline.md
- Mental model (layers, lifecycle, all primitives): `SkillSearch('createmcp architecture')` → architecture.md
- Primitive specs (tools/resources/prompts + sampling/elicitation/roots + SDK code): `SkillSearch('createmcp primitives')` → primitives.md
- Security + authorization checklist: `SkillSearch('createmcp security')` → security.md
- Test + debug (Inspector, logging, failures): `SkillSearch('createmcp debug')` → debug-test.md
