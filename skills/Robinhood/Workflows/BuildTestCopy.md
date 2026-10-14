# BuildTestCopy

Read `Safety.md` and the reviewed exact-build PatchPlan. A skill invocation or an app update is not authorization to modify an app.

1. Confirm authorization covers the identified local feature, fresh destination, signing/trust tradeoffs, and shared-data caveats. Runtime launch/testing requires its own clear scope. Stop if the plan's safety-relevant evidence is incomplete.
2. Revalidate source identity, every target hash, architecture, mapped location, and expected original bytes/value. Reject mismatches before creating the output. Check that the fresh destination and audit path are outside the source and do not exist, including symlinks.
3. Save the plan and pristine manifest beside the new copy. Copy with a platform-appropriate method preserving required bundle/resource structure; verify the copied target hashes before editing. Never write into the installed app.
4. Apply only the planned per-feature changes. If a helper is warranted, follow PatchPlan's fail-closed and negative-test requirements; otherwise use explicit reviewed edits and record their exact diffs. Do not add speculative changes when the first attempt fails.
5. Compare all content before signing against the plan's allowed edits. Select a platform-specific signing approach only after reviewing entitlements, runtime flags, and user acknowledgement. Record signature-generated changes separately from feature edits.
6. Run this skill's VerifyCopy workflow independently. On failure, retain the incomplete copy and audit files, state the error, and stop. Do not launch automatically or weaken system protections.
7. Return the exact copy/audit paths, static outcome, approved manual testing steps, untested claims, and recovery instructions.

## Execution Log

Apply the real-status and elapsed-time rules in `Safety.md`.

```sh
mkdir -p ~/.claude/state
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Robinhood","workflow":"BuildTestCopy","status":"ok","duration_s":'$SECONDS'}' >> ~/.claude/state/execution.jsonl
```
