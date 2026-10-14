# Recorded Investigation

## Exact known build

- Product: Superwhisper, bundle identifier `com.superduper.superwhisper`.
- Version: `2.19.2`; original executable SHA-256: `0e70c211e0c7a65e09af5d3565e6d5827b62a5247721fa61f8ec981c9e94fd5a`.
- Universal Mach-O with ARM64 and x86_64 slices. Reviewed modifications are ARM64-only.
- Original signing: Developer ID, notarized, hardened runtime. Locally modified copies were ad-hoc signed without hardened runtime.

## Relevant components

Swift reflection identified `Model.licenseType`, the `ModelLicenseType` cases `free`/`pro`, `LicenseManager`, and `SuperModelPickerPanelRow`.

The picker click path at ARM64 VA `0x1002dab50` calls eligibility helper `0x1001144e4`, then tests the model byte at offset `0x188`. An ineligible Pro model displays “This model requires a Pro license. Upgrade to access all Pro models.” Eligible or non-Pro models proceed to the selection callback.

The shared eligibility helper reads usage state. `LocalProUsageState` contains `serverUsedWords`, `pendingUsedWords`, and `wordLimit`. Another processing path references trial-expiration and Pro-model dialogs. These findings explain why changing the popup or globally returning true is not a suitably narrow modification.

## Model-specific stores

Each reviewed initializer writes `1` to model offset `0x188`. Replacing `strb w11, [x8, #0x188]` (`0b210639`, little-endian bytes) with `strb wzr, [x8, #0x188]` (`1f210639`) changes only that model's classification.

| Model | Model ID / identifying resource | ARM64 store VA |
|-------|--------------------------------|----------------|
| Cohere Transcribe | `cohere-transcribe-q4` | `0x100199abc` |
| Parakeet | `nvidia_parakeet-v2_476MB` | `0x100199868` |
| Parakeet Multilanguage | `nvidia_parakeet-v3_494MB` | `0x100199d08` |
| S1-mini | `s1-mini`, resource `s1-mini-v080-iq4_xs.gguf` | `0x10019bfb4` |

The first three are speech-to-text models. S1-mini is an English transcript-cleanup/reformatting model.

## Evidence and limitations

- The source app's executable hash and signature remained unchanged.
- Before and after signing, only the selected model-store bytes changed in ARM64 executable code; x86_64 executable code was unchanged.
- The test copy passed `codesign --verify --deep --strict`.
- Historical Cohere feedback was positive, but no documented full inference benchmark was recorded.
- The expanded four-model copy was verified statically and re-signed. Independent functional testing of all four was not recorded.
- No source `.swift` files were available; original source filenames came from embedded references. Do not present reconstructed pseudocode as original source.
