# VerifyCopy

Read `Safety.md` and the recorded PatchPlan. Static integrity and functional behavior are separate outcomes.

1. Independently verify the source against its pristine manifest; reparse the candidate's architectures and file layout after signing. Compare content and all executable sections against the plan, accounting for mapped addresses rather than assuming stable file offsets.
2. Require exactly the selected feature edits plus explained signing/layout changes. Check untouched architectures, unrelated resources/features, source preservation, and the adjacent audit record. An unexplained difference blocks a verified-static verdict.
3. Verify platform integrity/signatures with available tools. Report ad-hoc vs vendor trust, entitlement changes, and missing checks explicitly. A valid local signature is not proof of notarization or preserved sandbox/security behavior.
4. Run the helper's synthetic negative tests if a helper was created. Invoke the library's Verify skill for helper/repository changes when available; otherwise perform its applicable checks inline. This does not replace application-specific verification.
5. With explicit runtime-test permission, test the exact copy using synthetic input and an isolated data setup where feasible. Verify selection and actual execution separately; include a control feature to check scope. Locality/network behavior needs observed evidence; do not label an unobserved path offline. Record user-reported results as such.
6. Report `verified-static`, `tested-functional`, `failed`, or `unverified` with evidence for each claim. List original preservation, selected feature outcome, unrelated-feature checks, locality, signing limits, and recovery. Use Reflect if available, or self-check evidence and limitations inline.

## Execution Log

Apply the real-status and elapsed-time rules in `Safety.md`.

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Robinhood","workflow":"VerifyCopy","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
