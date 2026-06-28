# Verify — Overview

The reusable quality gate. Runs six phases — build → type-check → lint → test → secret-scan → diff-review — and ends with a single READY / NOT READY verdict plus an issue list. Other skills (`Iterate`, `Build`, `Test`) call this instead of reimplementing their own checks.

A FAIL in an early phase stops the gate: fix it before continuing, because later phases are unreliable on a broken build.

## Quick Reference

- Six phases, ordered: build → type → lint → test → secret → diff
- Early-phase failure halts the gate (don't test on a broken build)
- Output is a fixed report ending in `READY` or `NOT READY` for commit/PR
- Designed to be called by `Iterate` (as the per-pass gate) and by `Build`/`Test`
