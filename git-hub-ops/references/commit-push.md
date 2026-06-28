# CommitPush Workflow

Stage, commit with a conventional message, and push — branch-first, sanitized, gated.

## Step 1: Review What's Staged

```bash
git status --short
git diff --staged   # or git diff if nothing staged yet
```

Stage only what belongs in this change. Do not blanket `git add -A` if unrelated untracked files exist (e.g. local scratch, files with personal paths) — stage by path.

## Step 2: Branch First (non-trivial work)

If on `main` and the change is non-trivial, create a branch before committing:

```bash
git checkout -b <type>/<short-topic>
```

Trivial doc/typo fixes on `main` are fine to commit directly.

## Step 3: Write a Conventional Message

```
<type>: <imperative summary ≤72 chars>

<why, if not obvious from the diff>
```

Types: `feat fix docs refactor chore perf ci test`. End the commit body with the repo's required footer if one is configured (this repo uses a `Co-Authored-By:` trailer).

## Step 4: Commit (pre-commit gate runs)

```bash
git commit -m "<message>"
```

The pre-commit hook scans for secrets and hardcoded home paths and blocks committed symlinks. **If it blocks, fix the flagged file** — never bypass with `--no-verify`.

## Step 5: Push (confirm — outward action)

```bash
git push -u origin HEAD            # new branch
git push                           # existing tracked branch
git push --force-with-lease        # only after an intentional rebase; never --force
```

Confirm before pushing. Report the pushed ref and offer to open a PR (→ `PullRequest`).

## Gotchas

- `git add -A` on this kind of repo can sweep in untracked files carrying personal paths — stage by path.
- `--force` clobbers teammates' commits; `--force-with-lease` refuses if the remote moved.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"GitHubOps","workflow":"CommitPush","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
