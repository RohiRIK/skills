# Local Feature-Gate Analysis

## Classify Before Editing

Separate these questions:

1. **Capability:** Is the model/engine shipped, downloaded, or absent? Are the device architecture, memory, runtime, and model format supported?
2. **Selection:** Which field, branch, or policy disables a control or triggers the upgrade message?
3. **Execution:** Does the actual inference/export/processing path independently check eligibility?
4. **Authority:** Is the decision local configuration, per-feature classification, global account state, cryptographic entitlement, or a remote response?
5. **Dependency:** Can the requested feature operate locally without remote APIs, paid downloads, or unsupported assets? What is still unproven?

A missing model or unavailable backend is not necessarily a license lock. A popup may be only a symptom. Report mixed local/remote paths rather than treating all Pro features alike.

## Tool Discovery and Fallbacks

Capability-check tools before proposing commands. No MCP server or particular agent host is required; use connected file and shell tools. Without shell access, give commands and analyze returned results. Do not automatically install toolchains or upload binaries to online analysis services.

| Target | Read-only starting tools | Deeper analysis / fallback |
|--------|-------------------------|----------------------------|
| macOS Mach-O | `file`, `plutil`, `shasum -a 256`, `codesign -d`, `codesign --verify`, `lipo -info`, `otool -l` | Available LLVM tools, Ghidra, or a reviewed Mach-O parser; otherwise stop at the evidence available |
| Linux ELF | `file`, `sha256sum`, `readelf`, `objdump` | Available Ghidra/LLVM; do not transplant Mach-O layouts or signing steps |
| Windows PE | PowerShell `Get-FileHash`, `Get-AuthenticodeSignature`, installed PE tools | Available Ghidra/LLVM; describe unavailable capabilities rather than installing silently |
| Electron/managed code | Package metadata, readable resources, source maps, installed archive/runtime tools | Inspect a copied archive; do not assume a renderer flag is the authoritative gate |

macOS is the primary worked example. PE/ELF experiments need their own reviewed layout and integrity checks; the Superwhisper tool does not support them.

## Trace an Enforcement Chain

Search bounded strings/resources for the feature identifier, model path, upgrade message, and relevant type names. Use references and caller relationships to connect UI selection to the actual execution path. Record addresses and short disassembly excerpts with their architecture and image base.

For Swift, reflection metadata may retain `Model`, feature/license enums, and field names after function symbols are stripped. `swift_once` initializers may only create UI configuration. ARM64 `ADRP` + `ADD` candidates are not definitive references: register overwrites, indirect calls, tagged strings, and tail branches can mislead. Trace the value through the caller and the consuming field; do not infer policy from a message alone.

Distinguish a per-feature classification store from a global eligibility helper. A candidate modification needs evidence tying it to exactly the requested local feature and showing what other paths consume it. If scope cannot be bounded, keep the result analysis-only.

## Address and Disassembly Discipline

Map virtual addresses through the containing segment/section to the correct architecture slice and file offset. Validate instruction boundaries and expected original bytes. Re-parse the signed candidate: universal layouts may shift. Inspect all architectures, not just the one being changed.

Some `llvm-objdump --macho` versions ignore disassembly address bounds. For a Mach-O universal executable, extract the required thin slice into the approved work directory and use the generic parser with a bounded range:

```sh
lipo -thin arm64 "$EXECUTABLE" -output "$WORK/Arm64Slice"
xcrun llvm-objdump --disassemble --start-address="$START" --stop-address="$STOP" "$WORK/Arm64Slice"
```

Set the variables from verified findings and check the result's range and size. This writes a work artifact, not a modified source. Never use a historic Superwhisper field offset or instruction as a generic app patch.

## Independent Local Route

When practical, identify the model's license, format, supported runtime, and legitimate asset source. A compatible independent runner may achieve local inference without changing the vendor app. Report tradeoffs such as missing app integrations, cleanup pipelines, latency, memory requirements, or model availability. Do not promise compatibility from a filename alone.
