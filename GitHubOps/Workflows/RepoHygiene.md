# RepoHygiene Workflow

Audit repository health and fix the safe issues; confirm before anything destructive.

## Step 1: Preconditions

```bash
gh auth status      # must be logged in
git status --short  # note dirty state — don't act on a messy tree without saying so
```

## Step 2: Audit (read-only first)

Run the checks, collect findings — don't change anything yet.

| Check | Command | Flag when |
|-------|---------|-----------|
| Merged-but-unmerged branches | `git branch --merged main \| grep -vE '^\*\|main'` | stale local branches linger |
| Remote stale branches | `git remote prune origin --dry-run` | gone-on-remote branches tracked locally |
| Hardcoded home paths | `git ls-files \| xargs grep -nE '/(Users\|home)/[a-z]+/' 2>/dev/null` | any tracked file (except settings.json) |
| Secrets | `bunx varlock scan` (or `gh secret`/`gitleaks detect` if present) | any hit |
| Committed symlinks | `git ls-files -s \| awk '$1==120000{print $4}'` | any symlink tracked |
| Large files | `git ls-files \| xargs -I{} du -k {} 2>/dev/null \| sort -rn \| head` | unexpectedly large blobs |
| `.gitignore` gaps | check runtime/cache/`.env`/`*.db` are ignored | a runtime artifact is tracked |
| Dangling tags / releases | `git tag` vs `gh release list` | tags with no release or vice versa |

## Step 3: Report + Fix

Present findings grouped by severity. Apply **safe, non-destructive** fixes directly (add `.gitignore` rules, `git rm --cached` a runtime file, fix a path). For **destructive** actions (delete branches/tags), list the exact targets and **confirm before running**:

```bash
git branch -d <branch>                 # safe (merged only); -D only after confirm
git push origin --delete <branch>      # confirm: removes remote branch
git remote prune origin                # drop tracking refs for gone remotes
```

Never `--no-verify` past the pre-commit sanitizer — fix the flagged content instead.

## Step 4: Summarize

Report what was fixed, what needs the user's decision, and anything left clean.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"GitHubOps","workflow":"RepoHygiene","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
