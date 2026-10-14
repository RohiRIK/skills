# Verify

Read `Safety.md`. Static validity and functional success are separate outcomes.

1. Read `Guide.md` for prerequisites and the Python fallback. Set `SKILL` to the skill base directory, `SOURCE` to the pristine vendor bundle, and `OUTPUT` to the test copy. Run `uv run --no-project "$SKILL/Tools/ModelTools.py" verify --source "$SOURCE" --app "$OUTPUT" --models <selected keys>`.
2. Expect exactly the reviewed differences in the ARM64 code section and no executable-code differences in any other architecture or code section. Verify the original pristine fingerprint and both code signatures.
3. If the source was updated since the copy was created, the pristine fingerprint may be unknown or no longer match the copy. Do not compare incompatible builds or auto-repair them; inspect the new source instead. Retain the old copy and audit record.
4. Check the adjacent audit report when available. Signed-output hashing detects changes beyond executable code for copies produced by this tool. An older manually created copy may have no audit report; disclose that limitation.
5. Request permission before any launch. The user should quit the active app, open the exact copy, check selected model locks, and make a short recording for each requested speech model. Test S1-mini as post-processing. Do not record or upload audio without permission.
6. Report static checks, user-reported behavior, untested features, scope, original-app preservation, and recovery path separately. Keep the claim “works” tied to actual functional evidence.
7. Gate the result with the library's Verify skill if available; otherwise review the static checks, source preservation, and audit consistency inline. Use Reflect if available, or briefly self-check evidence and limitations inline. Neither replaces functional testing or authorizes additional mutations.

| Intent | Command / flags |
|--------|-----------------|
| Verify one-model copy | `verify --source "$SOURCE" --app "$OUTPUT" --models cohere` |
| Verify expanded copy | `verify --source "$SOURCE" --app "$OUTPUT" --models cohere parakeet parakeet-multilanguage s1-mini` |
| Run bundled guardrail tests | `uv run --no-project "$SKILL/Tools/TestModelTools.py"` |

## Execution Log

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SuperwhisperLocalModels","workflow":"Verify","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
