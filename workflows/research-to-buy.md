---
type: Workflow
title: Research to buy
description: Compare options before a purchase or adoption decision, then score a pick.
tags: [build-ship, research]
chain: "Research(deep) → comparison matrix → scored recommendation"
---

# Workflow: research-to-buy

Compare options before a purchase or adoption decision — tech stack, SaaS, tools, hardware, vendors. Reuses the **Research** skill; no dedicated skill needed.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Research(deep) → comparison matrix → scored recommendation
```

## Steps

1. **Frame** — list the candidates and the criteria that decide it (price / TCO, features, support, lock-in, performance, ecosystem, learning curve). **Weight** each criterion before researching.
2. **Research(deep)** — fan out per candidate (Agy / OpenCode / Pi + web). Pull specs, current prices, independent reviews. Keep the source ledger; run the adversarial pass — **vendor claims vs. independent evidence**.
3. **Comparison matrix** — candidates × weighted criteria. Fill each cell from research, cite the source.
4. **Score + recommend** — weighted total → **buy / hold / skip** verdict, with the *why*, the runner-up, and what would flip the call.

## When to use

Choosing between products / vendors / tools / hardware to buy or adopt.

## Related

- Decided already, now building → **research-to-build**.
- Investigation with no purchase decision → **research-to-report**.

## Gotchas

- **Verify vendor claims against independent sources** (the adversarial step) — marketing spec sheets overstate.
- **Date the prices** — they move; a matrix without dates rots fast.
- Weight criteria *before* seeing results, or the scoring rationalizes a pre-picked favorite.
