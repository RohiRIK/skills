# Watch Workflow

Find out whether a model generation newer than the ledger head has shipped, and start `Assess` if one has. Cheap by design: most runs end with "nothing new".

## Step 1: Read the ledger head

`bun Tools/ModelUpgrade.ts baseline` prints the current generation (the first `## <id>` heading in `Generations.md`) and how many skills are behind it. Note the head's id and date.

## Step 2: Check the vendor's current lineup

Use the most authoritative source the host offers, in this order:

1. The vendor's models listing: for Claude, the Models API (`GET /v1/models`) or the `claude-api` skill's models table, which states its cache date.
2. The vendor's release notes or model overview page, fetched live.
3. `Research` at quick depth, restricted to the vendor's own domain.

A name you recognize is not proof of its current state: model lineups change within months, so check the live source even when the answer seems known.

## Step 3: Decide

- **No newer generation** → report "ledger head <id> is current" plus the `baseline` count of skills still behind it (they are leftover work from the last upgrade). Stop.
- **Newer generation** (a new family, or a new default/flagship model whose migration guide lists prompt-behaviour changes) → run `Assess` with that target. A point release with no prompt-behaviour notes gets a one-line ledger note, not a full assessment.

## Step 4: Schedule the next check (optional)

If the host has a scheduler (a routine or cron trigger, a `/loop`-style wake primitive), schedule this workflow monthly. Without one, say when it should next run and stop; the result of this run is the same either way.

## Gotchas

- An unattended run that finds a new model should open a PR for review, never merge or delete anything.
- Don't treat a preview or access-restricted model as the target unless the owner uses it; record it as a note.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"ModelUpgrade","workflow":"Watch","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
