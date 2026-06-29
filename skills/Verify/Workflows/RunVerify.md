# RunVerify Workflow

The reusable quality gate. Detect the stack, run six phases in order, and end with a single `READY` / `NOT READY` verdict plus a concrete blocking-issue list. `Iterate`, `Build`, and `Test` call this instead of reimplementing their own checks.

## Step 1: Detect the Stack

Look for the markers that tell you which toolchain is in play, then map each phase to that stack's command. Missing tooling is a `SKIP`, not a `FAIL` — only run what the project actually has.

| Marker | Stack | build | type-check | lint | test |
|--------|-------|-------|-----------|------|------|
| `package.json` (bun.lock) | Bun/TS | `bun run build` | `bunx tsc --noEmit` | `bunx biome check .` / `bun run lint` | `bun test` |
| `pyproject.toml` / `setup.py` | Python | `uv build` (if packaged) | `uvx mypy .` / `uvx pyright` | `uvx ruff check .` | `uv run pytest` |
| `Cargo.toml` | Rust | `cargo build` | `cargo check` | `cargo clippy` | `cargo test` |
| `go.mod` | Go | `go build ./...` | (build covers it) | `go vet ./...` | `go test ./...` |

Read the relevant manifest's scripts before guessing a command — prefer a defined script (`bun run <name>`) over an assumed one. If no manifest is found, report the gate as `NOT READY` with "stack not detected" and stop.

## Step 2: Run the Six Phases, in Order

1. **build** — compile/bundle. **If build FAILs, halt the gate here** — later phases are unreliable on a broken build. Report the build error and jump to the verdict (NOT READY).
2. **type-check** — static types.
3. **lint** — linter/formatter check (check mode, don't auto-fix inside the gate).
4. **test** — the test suite.
5. **secret-scan** — scan the working tree / staged diff for secrets. Prefer the repo's tool (e.g. `bunx varlock scan --staged`, `gitleaks detect`); if none, grep the diff for high-signal patterns (`api[_-]?key`, `secret`, `token`, `BEGIN .* PRIVATE KEY`).
6. **diff-review** — read `git diff` and review the change for correctness, leftover debug code, `console.log`, blocking TODOs, and obvious regressions.

Each phase is one of `PASS` / `FAIL` / `SKIP` (tooling absent). Capture the first failing file + line where the tool reports it.

## Step 3: Output the Fixed Report

```
## Verify Report — <repo/target>
Stack: <detected stack>

| Phase        | Result | Detail |
|--------------|--------|--------|
| build        | PASS / FAIL / SKIP | <command, error head if FAIL> |
| type-check   | …      | … |
| lint         | …      | … |
| test         | …      | <N passed / M failed> |
| secret-scan  | …      | <tool used> |
| diff-review  | …      | <files reviewed> |

### Blocking issues
- <file>:<line> — <what's wrong> → <fix>

### Verdict
READY        # all run phases PASS (SKIPs allowed)
# or
NOT READY    # one or more phases FAIL — list above is the fix list
```

## Verdict Rule

- **READY** — every phase that ran is `PASS`. `SKIP` (missing tooling) does not block.
- **NOT READY** — any phase is `FAIL`. The blocking-issues list is the concrete fix list, with file + line wherever the tool gave one.

When called from `Iterate` or `Orchestrate`, a NOT READY verdict means the caller appends this report's blocking issues to `.agent-state.md` under the current iteration (no blind retry — see `_state/StateFileSchema.md`).

## Gotchas

- A green test suite on a failing build is meaningless — that's why build halts the gate first.
- Don't auto-fix in the lint phase; the gate reports, the caller decides. Auto-fixing hides the signal a loop needs.
- `$SECONDS` resets per shell; the telemetry duration is wall-clock since the workflow's shell started, which is fine for relative trends.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Verify","workflow":"RunVerify","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
