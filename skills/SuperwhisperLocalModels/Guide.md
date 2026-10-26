# Superwhisper Local Models

Load the SuperwhisperLocalModels skill or ask to inspect, rebuild, or verify a Superwhisper local-model test copy after an update. This package is host-independent: a host needs file-reading and shell capabilities; without them, provide the commands for the user to run and report execution as unverified. Supporting tools use the Python standard library and run with `uv run --no-project`; if uv is unavailable, use Python 3.10+ directly. No packages or background hooks are installed.

| Skill | Purpose | Supported mutation |
|-------|---------|--------------------|
| SuperwhisperLocalModels | Inspect, rebuild, and verify model-specific local test copies | Exact fingerprint of Superwhisper 2.19.2, ARM64 only |

The skill handles unknown updates by stopping patching and guiding fresh analysis. It does not promise that arbitrary future versions can be patched, auto-patch updates, replace the installed app, or enable cloud features.

See `Safety.md` for signing and shared-data tradeoffs. See `KnownBuilds.json` for supported model keys. All mutation commands require a fresh output path and explicit local-signing acknowledgement.

## Execution reporting

Each workflow ends with an execution-log template. Record `status: ok` only when its requested checks completed; use `status: error` when blocked or failed. Measure the workflow's elapsed time rather than a fresh logging shell's lifetime. If the host cannot write local telemetry, disclose that limitation rather than claiming it was logged. Keep recordings, credentials, and binary data out of the log.
