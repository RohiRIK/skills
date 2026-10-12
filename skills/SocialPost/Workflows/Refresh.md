---
description: Re-verify stale or unconfirmed platform facts in Platforms.md, refresh the Israeli calendar, and keep the tests in step.
---

# Workflow: Refresh

Platforms change limits, folds, and policies without notice. This keeps `Platforms.md` honest. Run it when `--check-facts` fails, when a user reports a limit that doesn't match, or once a quarter.

## Step 1: Find what needs checking

```bash
bun Tools/LintPost.ts --check-facts
```

That lists rows older than 180 days. Also consider every row whose status is `reported` or `observed`: a primary source may now be reachable.

## Step 2: Verify each row

- Use the `Research` skill at quick depth when it's available; otherwise search and fetch directly. Prefer the platform's own help center, developer docs, or open-source code; a third-party tool is `reported` at best.
- No research tools on this host: list the rows for the user with what to check and where, and stop.
- For each row record: the limit, fold, tag cap, and link rule as found, the new status, today's date in `As of`, and the source. Never upgrade a status without a primary source.
- Facts that changed also change their prose: the platform guide (`LinkedIn.md`, `ShortForm.md`, `Meta.md`, `Channels.md`) and `Folklore.md` if a claim moved in or out of folklore.

## Step 3: Refresh the calendar yearly

Recompute the holiday and memorial dates and the Israel and US clock-change gaps in `Hebrew.md` for the next twelve months, with `@hebcal/core` (Israel schedule) and a time-zone library, in a scratch directory. Never type dates from memory.

## Step 4: Keep the tests in step

```bash
bun Tools/LintPost.ts --check-facts && bun Tools/LintPost.ts --check-templates && bun test Tools
```

`Tools/Count.test.ts` pins some platform values, such as X's 280 and LinkedIn's 3,000; update a test only when the platform's change is confirmed. `LintPost.test.ts` checks freshness against the research date, so move that date with the refresh.

## Step 5: Report

List what changed, with old and new values and sources, and what couldn't be verified.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SocialPost","workflow":"Refresh","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
