# Scope and Safety

Robinhood is an operations runbook for understanding local software and testing narrowly scoped local-feature changes. Its value is reproducible evidence, platform-specific failure lessons, exact-build plans, and verification—not a promise that every paid feature can or should be enabled.

## Authorization

- Establish that the user owns or is authorized to inspect the target copy. Explain that modifying paid-feature behavior may conflict with vendor terms or applicable law; do not claim legality or entitlement from hardware ownership.
- An explanation request permits read-only analysis, not mutation or execution. Reuse explicit authorization when clear; otherwise confirm the target feature, new destination, signing implications, and test boundaries before proceeding.
- Preserve the vendor-installed app and unrelated features. Work on a fresh destination outside the source; existing outputs and audit paths are stop conditions, not overwrite permission.
- Treat app updates as new builds. A fingerprint mismatch, ambiguous target, unsupported architecture, or unexplained gate stops modification.
- Do not fabricate purchase receipts, activation tokens, account eligibility, or global Pro identity; do not alter trial counters or vendor servers/cloud authorization. If the local feature depends on those, explain the boundary and offer an independent local runner where feasible.
- Do not disable SIP, Gatekeeper, antivirus, sandboxing, or other system protections to make an experiment run. Do not install persistence, update hooks, or automatic patch-on-update behavior.

## Data and Runtime

Read application binaries and resources, not keychains, license databases, user histories, recordings, or private documents. Keep extracted strings bounded and redact incidental private paths from reports.

Dynamic analysis, debugger attachment, launching, downloads, network observation, and app termination require explicit scope and permission. Use synthetic input for tests; do not upload recordings or enable a paid remote service as a test. A static “local” classification is provisional until runtime evidence supports it.

A new app bundle may retain the original bundle identifier and share preferences, caches, model storage, credentials, permission grants, or updater state. Disclose this before runtime testing. Prefer an isolated test account or a vendor-supported data directory where practical; do not invent an isolation guarantee. Do not run original and copy concurrently unless their data isolation is established.

## Signing and Recovery

Assess the source's signature, entitlements, and notarization before selecting a signing approach. Ad-hoc signing is an explicit tradeoff, not a harmless repair. Some entitlements require vendor provisioning; do not assume copying them makes them usable. Signature verification does not prove vendor trust, notarization, sandbox equivalence, or functional correctness.

Retain the original file hashes, a full source manifest, exact edits, signing changes, and audit results beside the copy. On failure, retain artifacts and report the incomplete state; do not auto-delete or advertise success. Recovery means quitting the test copy with permission and returning to the unchanged original. Shared settings changed during tests may persist; backups and cleanup require a separately approved scope.

## Workflow Reporting

Each workflow logs one JSONL event using the library schema. Templates show `ok`; use `error` for a blocked or failed run, and measure actual workflow duration rather than a new logging shell's lifetime. Do not include app data, credentials, binary content, or private findings in telemetry. If local filesystem tools are unavailable, provide user-runnable commands and disclose that execution and logging were not performed.
