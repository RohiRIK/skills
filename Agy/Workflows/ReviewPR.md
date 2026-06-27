# Workflow: ReviewPR

Use Agy to review a GitHub PR or a local diff and report findings. Review is
read-only — Agy should not edit code here. Check the branch out with `gh`, then run
a read-only review prompt (the prompt enforces read-only; do not pass
`--dangerously-skip-permissions`).

## Option A — GitHub PR by number (preferred)

```bash
# 1. Checkout the PR branch (run in the target repo)
gh pr checkout 1234

# 2. Review the diff vs the base branch, read-only
timeout 360 agy -p 'Review the changes on this branch vs origin/main. Report, by \
severity: correctness bugs, security risks, missing tests, and API/style \
inconsistencies. Do not modify any files.' --add-dir /path/to/repo
```

## Option B — Throwaway clone (review without touching local repo)

```bash
REVIEW=$(mktemp -d)
git clone <repo-url> "$REVIEW"
git -C "$REVIEW" fetch origin pull/1234/head && git -C "$REVIEW" checkout FETCH_HEAD
timeout 360 agy -p 'Review this PR vs main. Report bugs, security risks, test gaps, \
and style issues. Read-only — do not modify files.' --add-dir "$REVIEW"
rm -rf "$REVIEW"     # clean up after
```

## Option C — Local diff already in tree

```bash
timeout 360 agy -p 'Review the staged and unstaged changes. Report correctness \
bugs, security risks, and missing tests by severity. Read-only — do not modify \
files.' --add-dir /path/to/repo
```

## Reporting

- The prompt enforces read-only; do not add write-encouraging instructions.
- Relay Agy's findings grouped by severity (critical / high / medium / low).
- Add your own read of anything Agy missed; do not auto-apply fixes — that is a
  separate `Delegate` task the user approves.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Agy","workflow":"ReviewPR","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

## Wiring: capture failure to state

On a non-zero worker exit, append the failure context — command, exit code, last output, and the relevant diff — to `.agent-state.md` under the current iteration (schema: `_state/StateFileSchema.md`). A `/loop` or `Orchestrate` pass then replans around the failure instead of blind-retrying.
