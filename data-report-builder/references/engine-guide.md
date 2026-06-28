# Data Report Builder Engine

## Overview

Turns a raw dataset into a two-layer Excel deliverable with a **bun + TypeScript**
engine (`scripts/report-kit.ts`, ExcelJS): a plain-language **Summary** tab a
non-technical reader gets in 30 seconds, optional filterable **Action** tabs, and
the untouched **Raw Data** tab so a technical reviewer can trust it.

## Quick Reference

- One-time setup: `cd Tools && bun install`
- Engine API (`intro`/`cards`/`table`/`steps`/`actionList`/`rawData`/`save`): read the header docstring of `scripts/report-kit.ts`
- Runnable template to copy: `scripts/example.ts`
- Validate output: `bun scripts/recalc.ts <file.xlsx>`
