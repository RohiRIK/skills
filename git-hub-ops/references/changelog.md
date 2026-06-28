# Changelog Workflow

Update `CHANGELOG.md` from the commits since the last release, in keep-a-changelog form.

## Step 1: Find the Range

```bash
last=$(git describe --tags --abbrev=0 2>/dev/null || echo "")   # last tag, or empty
range=${last:+$last..HEAD}; range=${range:-HEAD}
git log --oneline "$range"
```

If there are no tags yet, summarize the whole history (or since the last `## ` dated section already in `CHANGELOG.md`).

## Step 2: Group by Conventional-Commit Type

Bucket commits by their `type:` prefix into changelog sections:

| Commit type | Changelog section |
|-------------|-------------------|
| `feat` | Added |
| `fix` | Fixed |
| `refactor`, `perf` | Changed |
| `docs`, `chore`, `ci`, `test` | (usually omit, or a short Maintenance note) |
| a removal | Removed |

Read the actual diff for anything ambiguous — `git diff "$range" --stat` — don't trust the subject line alone.

## Step 3: Write the Entry

Prepend a new section to `CHANGELOG.md` (newest on top). Use a dated heading (or a version heading when cutting a release):

```markdown
## <YYYY-MM-DD> — <short title>

### Added
- <user-facing change, not the commit subject verbatim>

### Changed
- ...

### Fixed
- ...
```

Write entries from the reader's side — what changed for someone using the repo, not the internal commit wording. If `CHANGELOG.md` doesn't exist, create it with a one-line header first.

## Step 4: Hand Off

If this was called as part of a release, return the new section's bullets to the `Release` workflow for the GitHub release notes.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"GitHubOps","workflow":"Changelog","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
