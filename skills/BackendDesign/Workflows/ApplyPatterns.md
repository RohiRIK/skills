# ApplyPatterns

Apply backend design patterns to the codebase.

## Step 1: Identify Context

Analyze the current codebase: framework (Hono / Bun.serve / App Router / Workers), existing error envelope, validation layer, and DB access pattern. Pick the matching section — API shapes from `../API.md`, architecture/DB/caching/auth/queues from `../Patterns.md`, analytics from `../ClickhouseIo.md`.

## Step 2: Implementation

Apply the pattern, adapted to the project's existing conventions (don't introduce a second error envelope or validation style). Validate at the boundary with Zod; keep the `{ ok: false, error }` error shape; verify with the project's tests before reporting done.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"BackendDesign","workflow":"ApplyPatterns","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
