# PullRequest Workflow

Open a pull request with `gh`, with a summary drawn from the full commit range.

## Step 1: Preconditions

```bash
gh auth status
git rev-parse --abbrev-ref HEAD     # not main; push the branch first if needed
```

The branch must be pushed (`git push -u origin HEAD`) before a PR can reference it.

## Step 2: Build the Summary from the Full Range

Analyze every commit on the branch, not just the latest:

```bash
base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>/dev/null || echo main)
git log --oneline "origin/$base..HEAD"
git diff "origin/$base...HEAD" --stat
```

## Step 3: Draft the PR Body

```markdown
## Summary
- <what changed and why, derived from the whole range>

## Test plan
- [ ] <how to verify each significant change>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Step 4: Create the PR (confirm — outward action)

```bash
gh pr create --base "$base" --title "<type>: <summary>" --body "<body>"
# add --draft for work-in-progress; --fill to seed from commits
```

Confirm before creating. Report the PR URL `gh` returns.

## Gotchas

- A PR summary built from only the last commit misrepresents a multi-commit branch — always use `base...HEAD`.
- If the repo has no remote / no GitHub origin, there's nothing to PR against — say so rather than failing obscurely.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"GitHubOps","workflow":"PullRequest","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
