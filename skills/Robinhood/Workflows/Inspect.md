# Inspect

You are identifying the app and the requested local feature without changing or running it. Read `Safety.md` and the tool-discovery section of `AnalysisGuide.md`.

1. Establish the target app, source path, feature/model, symptom, and OS. Reuse clear conversational context; ask only for missing inputs that block inspection.
2. Inventory app metadata, relevant executable/resource hashes, architectures, signature state, and engine/model presence. Read app files, not user/license storage. Record a source manifest in an approved work directory if one is needed.
3. Locate bounded evidence for the feature identifier and upgrade message. Separate a UI restriction from missing assets, incompatible hardware, or execution failure. Do not launch the app to answer a static question.
4. Check for an existing exact-build runbook. Supported Superwhisper operations go to SuperwhisperLocalModels; an unknown fingerprint goes to fresh TraceGate analysis, not historical patch instructions.
5. Report identity, observed symptom, likely gate category, local/remote evidence, unknowns, and the next read-only step. Explain what “Pro” appears to control without asserting an entitlement or a working bypass.

## Execution Log

Apply the real-status and elapsed-time rules in `Safety.md`.

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Robinhood","workflow":"Inspect","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
