# Safety and Scope

This is an operations runbook with deterministic verification and accumulated binary-analysis findings. Its value is the exact-build fingerprinting, architecture-aware checks, and failure lessons—not orchestration of generic reasoning.

## Authorization boundaries

- Use only for the user's explicitly requested local-model modification. Explain that modified licensing behavior may conflict with the vendor's terms.
- Start read-only. Reuse a clear existing authorization for a separate test copy; otherwise confirm the selected models, destination, and local-signing tradeoff.
- Preserve the source bundle and license/account state. Do not modify servers, cloud-model access, purchase receipts, trial counters, or the global eligibility helper.
- Create a fresh `.app` at a user-approved writable destination outside the source bundle. An existing destination is a stop condition, not permission to overwrite it.
- App updates never authorize automatically modifying the new version. A new executable fingerprint requires reviewed rediscovery before adding a profile.
- Quit a running test copy only with permission. Prefer the user quitting it or a normal quit targeting its exact executable/PID. Do not force-quit, use stale PIDs, or relaunch automatically.
- Do not install hooks, modify updater configuration, replace `/Applications/superwhisper.app`, or disable SIP/Gatekeeper as part of this skill.

## Signing and shared data

The recorded approach re-signs the new copy ad hoc with `--options 0`. It preserves the source's entitlements but does not preserve Developer ID trust, notarization validity, or hardened-runtime signing. Disclose that tradeoff before using `apply --confirm-local-signing`.

The bundle identifier stays the same. Consequently the copy may share preferences, history, models, and other application data with the original. A separate bundle does **not** isolate all runtime data. Do not run both simultaneously. New permission prompts or macOS launch refusal are possible; ask about the exact error rather than weakening system protections.

## Recovery

The tool retains an audit directory beside the new copy with the source executable and signature-resource backup, source fingerprint, selected models, signing entitlements, and result. If a signing/verification step fails, leave artifacts intact and report the incomplete state. Do not advertise an unverified copy as working.

The simplest rollback is to quit the test copy and launch the unchanged original explicitly. Do not remove the copy or backups without permission. App-level settings changed while testing may persist because data is shared.
