# CreateCLI-Human — Human UX rules

The load-bearing rules this sibling applies on top of the shared `CreateCLI` base (tiers, workflows, `Patterns.md`, `TypescriptPatterns.md`). Where they differ from the base defaults, these win.

## Audience

- Developer or operator running commands by hand.
- Wants clear prose `--help`, examples, colored/TTY tables, optional prompts.
- May pipe to `jq` sometimes → support `--json` / `--format json`, but **do not** make compact JSON the only UX.


## Human-first rules (load-bearing)

### Input
- Positionals are fine when names are obvious (`cli fetch <id>`).
- Interactive prompts **allowed** for missing optional polish (confirm delete, choose from list) when stdin is a TTY.
- If stdin is not a TTY and a prompt would be required, fail with a clear stderr message telling the human which flag to pass (`--yes`, `--name`, etc.) — never hang forever.

### Output
- Default: human-readable (table, pretty-printed JSON with indent, ANSI colors when stdout is a TTY).
- Always offer `--json` or `--format json` for scripting.
- **stdout** = primary result; **stderr** = progress, warnings, hints.
- Spinners / progress on stderr are OK for long work (Tier 2+ may use a spinner dep; Tier 1 keeps zero deps and simple stderr progress).

### Interactivity
- Confirm destructive actions by default on TTY (`Are you sure?`).
- Honor `--yes` / `--force` to skip confirms (document them).
- Pagers OK for long human output when TTY.

### Errors
- Actionable prose on stderr: what failed + how to fix.
- Exit **0** success, **1** failure is the baseline. Optional light codes (2 = usage) if useful — keep the table in `--help`.
- Custom `CLIError` with `code` + `hint` encouraged (see Patterns).

### State & execution
- Session-y UX OK (multi-step wizard) if documented.
- Soft retries for read-only flaky network **may** exist if logged to stderr and capped — prefer documenting them. Do not silently retry destructive writes.

### Efficiency
- Pretty dumps by default; `--limit` still recommended on list commands.
- `--quiet` suppresses progress for pipe-friendly humans.

### Docs / discovery
- Rich prose `--help` with EXAMPLES.
- `README.md` + `QUICKSTART.md` required.
- No requirement for `--help-json` (nice-to-have only).

### Secrets
- Load from `./.env` / env vars; never echo secrets to stdout.
- Error messages must not print token values.
