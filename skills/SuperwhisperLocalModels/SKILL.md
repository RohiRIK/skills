---
name: SuperwhisperLocalModels
description: "Inspect and rebuild Superwhisper local-model test copies. USE WHEN restoring Cohere, Parakeet, or S1-mini after updates. NOT FOR general reverse engineering (use Robinhood), cloud access, or license activation."
category: workflow
effort: high
domain: ops
---

# SuperwhisperLocalModels

Superwhisper local operations: maintain an explicitly requested, model-specific test copy on Apple Silicon. Preserve the vendor-installed app, license records, and unrelated features.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Inspect** | locks, Pro popup, unknown or updated build | `Workflows/Inspect.md` |
| **Rebuild** | rebuild the local-model copy, reapply a supported patch | `Workflows/Rebuild.md` |
| **Verify** | validate a copy or investigate failed transcription | `Workflows/Verify.md` |

## Quick Reference

- Read `Safety.md` before mutations. An inspection request is not permission to patch, quit, launch, or replace an app.
- Read `Guide.md` for prerequisites, host capability checks, and telemetry reporting.
- Use Robinhood for general feature-gate analysis or unknown-build investigation; this skill supplies the Superwhisper-specific findings and exact-build tooling.
- `Tools/ModelTools.py` provides read-only `inspect`/`plan`, opt-in `apply`, and read-only `verify` commands; run with `uv run --no-project`, or `python3` (3.10+) if uv is unavailable.
- `KnownBuilds.json` contains exact pristine-executable fingerprints and reviewed model-specific instructions, not portable offsets.
- `ReverseEngineering.md` explains rediscovery after updates; `SessionFindings.md` records the original investigation and its limitations.
- Choose models explicitly: `cohere`, `parakeet`, `parakeet-multilanguage`, `s1-mini`. Never globally impersonate a Pro license.

## Gotchas

- A downloaded model can still be classified Pro. S1-mini rewrites text; the other three transcribe audio.
- Matching a version string is insufficient: a different executable SHA-256 requires fresh analysis. Unknown builds are inspection-only.
- Warning functions can just initialize UI strings. Trace their callers and the model's classification store before patching.
- Mach-O universal offsets differ from virtual addresses and can shift after signing. Parse each architecture again.
- The Mach-O-specific `llvm-objdump` parser may ignore disassembly range limits; extract a thin slice and use the generic parser.
- Ad-hoc signing does not retain vendor trust or hardened-runtime protection. Copies share settings under the same bundle identifier.
- Do not modify a running copy, auto-launch it, disable macOS protections, or auto-patch on updates.
- Signature validity and code-diff checks do not prove transcription works. Report functional tests separately.

## Examples

**Update:** “Superwhisper updated; restore my four local models.” → Inspect → supported fingerprint: Rebuild; unknown fingerprint: rediscover, do not patch blindly.

**Scope:** “Only unlock Cohere in a test copy.” → Plan `--models cohere` → confirm local-signing tradeoff → fresh copy → verify → user tests it.
