# TraceGate

Read `Safety.md`, `AnalysisGuide.md`, and `PatchPlan.md`. Investigate why the feature is restricted; this workflow does not authorize a modification.

1. Use Inspect's fingerprinted source and a bounded search/disassembly scope. Locate the feature/model identity and trace upgrade-message references to their callers; distinguish initialization code from enforcement.
2. Trace selection and execution separately. Identify the eligibility value's source, consumers, field layout, and any remote or cryptographic dependency. Keep candidate references and confirmed control flow labeled differently.
3. Explain the gate in plain language: what is locally present, what the app checks, where the check runs, and whether removing a UI restriction alone would leave execution blocked.
4. Evaluate a documented setting or compatible independent runner first. If an explicitly requested local experiment is feasible, write an exact-build PatchPlan for the narrowest evidenced change. Do not replace a global licensing helper or invent an activation record.
5. Stop at analysis if the local scope is ambiguous, a required backend/asset is absent, or the feature requires remote authorization. Dynamic tracing is a separate permission boundary, not an automatic fallback.
6. Return evidence, confidence, alternatives, risks, and a plan or specific blocker. The user can then choose whether to authorize a separate test copy.

## Execution Log

Apply the real-status and elapsed-time rules in `Safety.md`.

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Robinhood","workflow":"TraceGate","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
