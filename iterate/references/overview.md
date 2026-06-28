# Iterate Overview

## Detailed Description

This is the autonomous-iteration primitive. Unlike a single workflow run, `/iterate` carries failure context forward, refuses to retry rejected approaches (dead-ends ledger), and self-rates each pass before deciding whether to continue.

## Quick Reference

- State-file schema (`.agent-state.md`): goal, progress, dead-ends, per-iteration log
- Exit conditions are mandatory — never loop unbounded
- Each pass calls the `Verify` skill as its quality gate and the `Reflect` skill as its self-evaluation step
- On failure, capture full context into state and change approach — do not blind-retry
