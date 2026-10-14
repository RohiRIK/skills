# Rediscovering an Updated Build

An old address is a historical clue, not permission to patch a new executable. The bundled tool deliberately refuses mutation for unknown full-executable fingerprints.

1. Read `Contents/Info.plist`, verify the expected bundle identifier, fingerprint the pristine executable, inspect architectures, and record the vendor signature. Do not read user credentials, history, recordings, or license storage.
2. Identify the model IDs and download resources through binary strings. Find the Pro-warning strings; use Swift type/field reflection to locate `Model`, `ModelLicenseType`, and model-picker/processor types. Symbol stripping can remove callable names while reflection metadata remains.
3. Trace string references to their enclosing functions using `LC_FUNCTION_STARTS`. ARM64 `ADRP` + `ADD` pairs are candidate cross-references only: register overwrites, tagged Swift strings, indirect calls, and tail branches limit this approach.
4. Follow callers or function-pointer references. Initializer functions referenced by `swift_once` may merely populate a popup configuration. Verify the actual row-click branch and runtime-processing checks; removing a lock icon alone does not enable inference.
5. Locate each requested model's initializer through its ID/resource. Confirm the field layout and the instruction that writes its classification. In the recorded build, `licenseType` was at `0x188`; do not assume that layout survives updates.
6. Favor changing individual local-model classification stores over global eligibility, receipts, trial state, or cloud authorization. Review nearby stores so the change cannot overwrite provider, engine, language, or unrelated flags.
7. Record a new profile only after validating the exact instruction, target field, model identity, architecture, and full pristine fingerprint. Keep historical profiles. Add a test for the new profile and tell the user which checks are static versus functional.

## Disassembly without runaway output

In the original session, `llvm-objdump --macho --arch=arm64 --disassemble --start-address=... --stop-address=...` emitted the entire executable despite the bounds. Instead, extract an ARM64 slice to an approved work directory:

```sh
lipo -thin arm64 "$SOURCE/Contents/MacOS/superwhisper" -output "$WORK/SuperwhisperArm64"
xcrun llvm-objdump --disassemble --start-address="$START" --stop-address="$STOP" "$WORK/SuperwhisperArm64"
```

The generic parser respects disassembly address ranges. Verify output size and addresses. Disassembly and extracted slices are work artifacts, not additions to the source app or skill directory.

## Tool interpretation

`inspect` returns identity, fingerprint, architecture/code-section layout, selected Swift field names, and available candidate string cross-references. A missing reference is not evidence that no gate exists; it means this limited static search did not find one. The tool does not infer new patch locations or add profiles automatically.
