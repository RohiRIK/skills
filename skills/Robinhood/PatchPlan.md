# Exact-Build Experiment Plan

Create this plan in the approved work directory. All fields need concrete evidence or an explicit unknown. Any unknown affecting target identity, scope, address mapping, original bytes, authorization, or recovery blocks application.

```text
Target: product, vendor, version/build, bundle/package identifier
Source: original app path; pristine status and signature result
Identity: target file relative paths and SHA-256 values; full source manifest
Platform: OS, architectures, binary/container format
Goal: one explicitly requested local feature
Authorization: inspection, modification, signing, and runtime-test scope
Locality: engine/assets present; local vs remote evidence; remaining unknowns
Gate chain: selection → execution → eligibility source
Evidence: feature IDs, field meaning, callers, bounded disassembly excerpts
Edits: architecture, section, virtual address, mapped offset or resource key
Preconditions: exact original instruction/bytes or resource value
Replacement: exact new bytes/value and their decoded meaning
Scope: why only this feature changes; affected consumers and exclusions
Destination: fresh copy and adjacent fresh audit directory
Integrity: allowed content differences and separate signing/layout differences
Signing: proposed trust/entitlement/runtime changes and acknowledgement
Verification: deterministic static checks, negative tests, functional test
Recovery: unchanged original, shared-data caveats, retained artifacts
Outcome: planned / failed / verified-static / tested-functional
```

## Preconditions and Negative Tests

A repeatable helper, if needed, should default to inspection or planning. Before writes, test that it rejects an unknown hash, wrong architecture, unexpected original bytes/value, ambiguous/multiple target matches, existing destination/audit directory, a destination inside the source, and missing mutation/signing acknowledgement. Use synthetic fixtures, not proprietary binaries, as committed tests.

Record exact edits; substring replacement and “first match wins” are not safe selectors. Application validates the complete target identity again immediately before copying/editing and confirms the source did not change during the operation. A plan for one build is not reusable authorization for another.

## Evidence Retention

Artifacts belong beside the copy, outside the repository/skill unless the user explicitly requests sanitized documentation or a reusable helper. Keep proprietary executables, extracted assets, credentials, and recordings out of the published skill. A generalized helper may be added only when repeated work justifies it; its build profiles remain explicit and its verification covers the relevant file format.
