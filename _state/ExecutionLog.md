# Execution Log — `~/.claude/state/execution.jsonl`

Every **action** workflow appends one JSONL line to `~/.claude/state/execution.jsonl` when it finishes. This is the library's telemetry trail — what ran, when, and whether it succeeded. Tier-A reference skills (passive knowledge, never invoked) are exempt.

## The Line

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"NAME","workflow":"WF","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

Place it at the very end of the workflow, after the work is done. Use `"status":"error"` if the workflow failed.

## Schema (fixed)

| Field | Type | Meaning |
|-------|------|---------|
| `ts` | string | UTC ISO-8601 timestamp (`date -u +%Y-%m-%dT%H:%M:%SZ`) |
| `skill` | string | The skill name |
| `workflow` | string | The workflow that ran |
| `status` | string | `ok` or `error` |
| `duration_s` | number | Wall-clock seconds (`$SECONDS` since shell start) |
| `input` | string (optional) | ≤ 8-word summary of the request |

Keep the schema fixed so the log stays machine-readable. `SkillForge/AddTelemetry` instruments any action workflow missing this line; `SkillForge/AuditAgentic` scores the Telemetry axis on its presence.

## Setup

The directory is created on first write if needed:

```bash
mkdir -p ~/.claude/state
```

## Querying

```bash
# every run today
jq -c 'select(.ts | startswith("'$(date -u +%Y-%m-%d)'"))' ~/.claude/state/execution.jsonl

# error runs, grouped by skill
jq -r 'select(.status=="error") | .skill' ~/.claude/state/execution.jsonl | sort | uniq -c
```
