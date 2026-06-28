---
name: data-report-builder
description: "Turn a raw Excel/CSV dataset into a two-layer report — plain-language summary plus untouched raw data. Use when someone shares a spreadsheet wanting a report, analysis, summary, or breakdown."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='data-report-builder', file_path='references/build-report.md') before taking any action."
---
# Data Report Builder

Turns a raw dataset into a two-layer Excel deliverable: a plain-language **Summary** tab and the untouched **Raw Data** tab.
For engine API details and quick reference see `references/engine-guide.md`.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **BuildReport** | "report", "analysis", "summary", "breakdown", "present this to…" | `references/build-report.md` |

Always run BuildReport end to end — it scopes the audience first, then builds and validates.

## Examples

**Example 1: Compliance review**
```
User: "Here's the device export — can you summarise where we stand for management?"
→ BuildReport: asks audience + decision → green/amber/red cards by readiness
→ Action List sorted "Action needed" first → Raw Data verbatim → recalc → hand off
```

**Example 2: Status tracking**
```
User: "Turn this ticket dump into something I can present to the team."
→ BuildReport: breakdown by owner → number cards + breakdown table → filterable tabs
```

## Gotchas

- Never mutate the source data — the report is two layers: a plain-language summary plus the untouched raw data. Altering raw values destroys the audit trail.
- Validate column types before aggregating; a numeric column read as text silently produces wrong totals.
