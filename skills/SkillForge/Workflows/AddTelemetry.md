# AddTelemetry Workflow

Append the canonical execution-log line to every action workflow that lacks it, in bulk, across the whole library. The companion to `AuditAgentic` (which finds the gaps).

## Step 1: Find Uninstrumented Action Workflows

```bash
# action workflows missing the telemetry line
for f in */Workflows/*.md; do
  grep -q "execution.jsonl" "$f" || echo "$f"
done
```

Exclude **Tier-A reference skills** (passive knowledge — they have no action workflows to instrument). A reference skill with a `Workflows/` dir is rare; if its "workflow" only describes lookups, skip it.

## Step 2: Append the Line

For each file found, add this at the very end (schema: `_state/ExecutionLog.md`), substituting the real skill and workflow names:

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"NAME","workflow":"WF","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

Place it under a `## Execution Log` heading so it's consistent with the rest of the library.

## Step 3: Never Double-Instrument

A workflow that already contains `execution.jsonl` is skipped (Step 1 already filters these). Don't add a second line — one line per workflow run.

## Step 4: Report

List what was instrumented and what was skipped (already-instrumented / reference-exempt), with a count.

## Gotchas

- Substitute the real `skill`/`workflow` names — a copy-paste with `NAME`/`WF` left in produces useless telemetry.
- Reference skills are exempt by design; instrumenting them adds noise, not signal.
- Idempotent: re-running this workflow on an already-instrumented library is a no-op.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SkillForge","workflow":"AddTelemetry","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
