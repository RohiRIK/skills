# ExploreAndSpec

Ground the spec in existing code and prior decisions before writing a single requirement.

## Explore (interleaved)

Interleave lookups with reasoning rather than gathering everything first: let each result shape the next question, so the constraints come out grounded.

- **Prior decisions and gotchas** — the project's memory, if the host has one (a memory tool such as the LTM plugin's `ltm_recall`, `CLAUDE.md`, ADRs, `.agent-state.md`). No memory source is fine; say so in the spec.
- **Code the feature must fit** — existing files, types, and patterns, found with the host's search tools (a context-saving batch search tool, when installed, keeps large results out of context).

Record:
- Prior architecture decisions and known gotchas (from project memory)
- Existing files and modules the feature must integrate with
- Types and interfaces that constrain implementation
- Patterns used nearby (naming, error handling, data flow)

## Write the Spec

Write the spec to `specs/<feature-slug>.md`. Include:

### What
One paragraph — what is being built and why.

### Existing context
- Relevant files found during exploration
- Prior decisions or constraints from project memory

### Acceptance criteria
Numbered list. Each criterion must be testable — it becomes a task and a test case in `Build`.

```
1. Given X, when Y, then Z
2. Edge case: when A is empty, return B
3. Existing behaviour C is unchanged
```

### Out of scope
Anything explicitly NOT being built in this iteration.

## Hand off

- Feature work → `Build` against the spec
- Bug fix → `Test:ProveIt` using the acceptance criteria as the failing test target

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Spec","workflow":"ExploreAndSpec","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

## Wiring: --deep mode

With `--deep`, run **Iterate/RunLenses** first (multi-lens analysis passes over the problem), then write the acceptance criteria from the deduplicated lens findings. Without `--deep`, the single-pass exploration below is the default — keep it as the fast path.
