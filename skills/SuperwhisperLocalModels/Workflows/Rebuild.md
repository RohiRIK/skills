# Rebuild

Read `Safety.md`. Work from a pristine, supported vendor bundle and produce a **new** copy; do not overwrite the installed app or an existing test copy.

1. Run this skill's Inspect workflow and `plan` for the requested model list. Read `Guide.md` for prerequisites and the Python fallback. Stop on an unknown fingerprint, malformed binary, unexpected instruction, or unreviewed architecture.
2. Confirm the user's authorization covers a test copy and explain ad-hoc signing, loss of vendor/hardened-runtime trust, and shared settings. The creation tool needs `--confirm-local-signing` as an explicit acknowledgement.
3. Choose an approved writable work directory. Prefer a persistent user data directory for copies meant to survive temporary-file cleanup. Use a new `.app` name per build/run; backups and reports go beside it, never inside the skill or original bundle.
4. Do not close a running app unless authorized. For the fresh-copy creation itself, the source may remain running; it is not edited. The user must quit the current Superwhisper before later launching the new copy.
5. Run `apply` with `--source`, `--output`, `--models`, and `--confirm-local-signing`. It fingerprints, backs up, copies, patches reviewed stores, extracts entitlements, signs, compares every executable code section, and verifies the source and copy signatures. It does not launch an app.
6. Run this skill's Verify workflow independently. On failure, retain the incomplete copy and audit artifacts; return the error without deleting user work or claiming the copy works.
7. Give the exact output path and manual launch command. Ask the user to test selection and a short recording, with S1-mini tested as text post-processing.

| Intent | Flags |
|--------|-------|
| Cohere only | `--models cohere` |
| Parakeet plus multilingual | `--models parakeet parakeet-multilanguage` |
| Four local models | `--models cohere parakeet parakeet-multilanguage s1-mini` |
| Fresh destination | `--output "$WORK/Superwhisper-Local-Test.app"` |
| Acknowledge signing tradeoff | `--confirm-local-signing` |

```sh
uv run --no-project "$SKILL/Tools/ModelTools.py" apply --source "$SOURCE" --output "$OUTPUT" --models cohere parakeet parakeet-multilanguage s1-mini --confirm-local-signing
```

Loading the skill, inspecting, or receiving an update notification does not itself authorize `apply`.

## Execution Log

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SuperwhisperLocalModels","workflow":"Rebuild","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
