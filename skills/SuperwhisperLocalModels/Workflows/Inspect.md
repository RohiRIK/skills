# Inspect

You are maintaining a narrowly scoped local-model test copy. Read `Safety.md`; inspect without changing the app.

1. Establish the source bundle and requested models from the conversation. Default source: `/Applications/superwhisper.app`. Screenshots can distinguish a selection-time lock from an inference-time failure; do not ask again if already clear.
2. Run `uv run --no-project "$SKILL/Tools/ModelTools.py" inspect --source "$SOURCE"`.
3. Run `plan` with the selected models when the user wants to rebuild. It validates the full pristine hash and reviewed instructions without creating output.
4. If unknown, read `ReverseEngineering.md` and rediscover; do not execute the historical patch. A modified test executable is not a pristine vendor build.
5. Report the fingerprint, known/unknown status, selected model scope, and next boundary. Ask about local signing only if creating a copy is not already clearly authorized.

| Intent | Command / flags |
|--------|-----------------|
| Inspect an update | `inspect --source "$SOURCE"` |
| Inspect a different installation | `inspect --source "/path/to/App.app"` |
| Preview Cohere only | `plan --source "$SOURCE" --models cohere` |
| Preview all four models | `plan --source "$SOURCE" --models cohere parakeet parakeet-multilanguage s1-mini` |

Set `SKILL` to this skill's actual base directory. Read `Guide.md` for prerequisites and the Python fallback. If shell tools are unavailable, provide commands for the user and mark execution unverified.

## Execution Log

Record the real result, not success when inspection is blocked. No recordings, credentials, or binary data belong in telemetry.

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SuperwhisperLocalModels","workflow":"Inspect","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
