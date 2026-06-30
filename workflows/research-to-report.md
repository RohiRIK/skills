---
type: Workflow
title: Research to report
description: Deliverable is cited findings plus visuals, not code.
tags: [build-ship, research]
chain: "Research(deep) → DataReportBuilder → Art(diagrams)"
---

# Workflow: research-to-report

Deliverable is cited findings + visuals, not code.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Research(deep) → DataReportBuilder → Art(diagrams)
```

## Steps

1. **Research(deep)** — multi-worker fan-out + adversarial verification; on-disk source ledger.
2. **DataReportBuilder** — structure the findings into a two-layer report (plain-language summary + raw data). Or synthesize inline if there's no dataset.
3. **Art** — diagrams / visuals for the report.

## When to use

Due diligence, competitive analysis, literature review, OSINT, "find everything about X."

## Related

- Findings that feed a build instead → **research-to-build**.
