# RunCompact

Execute the strategic compacting process to summarize sessions.

## Step 1: Execute Tool

Run the compaction script located in `../Tools/suggest-compact.sh`.

```bash
bash ../Tools/suggest-compact.sh [FLAGS]
```

## Step 2: Verify

Ensure the compact summary is accurate and saved.
## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"StrategicCompact","workflow":"RunCompact","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
