---
name: data-report-builder
description: "Turn a raw Excel/CSV dataset into a two-layer stakeholder report — plain-language summary plus untouched raw data. USE WHEN someone shares a spreadsheet and wants a report, analysis, summary, or breakdown."
category: workflow
effort: medium
---

# Data Report Builder

Turns a raw dataset into a two-layer Excel deliverable with a **bun + TypeScript**
engine (`Tools/ReportKit.ts`, ExcelJS): a plain-language **Summary** tab a
non-technical reader gets in 30 seconds, optional filterable **Action** tabs, and
the untouched **Raw Data** tab so a technical reviewer can trust it.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **BuildReport** | "report", "analysis", "summary", "breakdown", "present this to…" | `Workflows/BuildReport.md` |

Always run BuildReport end to end — it scopes the audience first, then builds and validates.

## Quick Reference

- One-time setup: `cd Tools && bun install`
- Engine API (`intro`/`cards`/`table`/`steps`/`actionList`/`rawData`/`save`): read the header docstring of `Tools/ReportKit.ts`
- Runnable template to copy: `Tools/Example.ts`
- Validate output: `bun Tools/Recalc.ts <file.xlsx>`

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

**Example 3: Plain understanding**
```
User: "Just help me understand this spreadsheet."
→ BuildReport: defaults (mixed audience, diplomatic) stated in one line → Summary + Raw Data
```

## Gotchas

- Never mutate the source data — the report is two layers: a plain-language summary plus the untouched raw data. Altering raw values destroys the audit trail.
- Validate column types before aggregating; a numeric column read as text silently produces wrong totals.
