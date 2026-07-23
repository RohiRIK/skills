---
name: GitHubOps
description: "Manage a GitHub repo via the gh CLI — hygiene, changelog, commit/push, PRs, releases, branch cleanup. USE WHEN clean up the repo, update the changelog, commit/push, open a PR, or cut a release. NOT FOR git branching/merge theory (use GitWorkflow)."
category: workflow
effort: medium
domain: ops
---

# GitHubOps

The action layer for managing a GitHub repository with the `gh` CLI. Where `GitWorkflow` explains *how* git works (branching, merge vs rebase, conflicts), GitHubOps *does* the operations: audits repo health, maintains the changelog, commits and pushes, opens PRs, cuts releases, and prunes branches.

Outward and irreversible actions (push, PR, release, branch/tag delete) are confirmed before running. Conventional Commits + the repo's pre-commit sanitization (no secrets, no hardcoded home paths, no committed symlinks) are honored throughout.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RepoHygiene** | "clean up the repo", "repo health", "stale branches", "audit the repo" | `Workflows/RepoHygiene.md` |
| **Changelog** | "update the changelog", "what changed since last release" | `Workflows/Changelog.md` |
| **CommitPush** | "commit and push", "commit this" | `Workflows/CommitPush.md` |
| **PullRequest** | "open a PR", "create pull request" | `Workflows/PullRequest.md` |
| **Release** | "cut a release", "tag a version", "publish release" | `Workflows/Release.md` |

## Quick Reference

- Requires `gh` authenticated (`gh auth status`); all GitHub actions go through `gh`, not raw API tokens.
- Conventional Commits (`feat/fix/docs/refactor/chore/perf/ci`); changelog follows keep-a-changelog.
- Confirm before any push, PR, release, or delete — these are outward/irreversible.
- Branch-first: never commit straight to `main` for non-trivial work; open a PR.

## Gotchas

- `gh` not authenticated → every GitHub call fails silently-ish; check `gh auth status` first.
- Pre-commit sanitize blocks commits with hardcoded home paths (a leading slash then `Users/<name>` or `home/<name>`), secrets, or staged symlinks — fix the flagged file, don't bypass with `--no-verify`.
- `git push` after a rebase of a shared branch needs `--force-with-lease`, never `--force` (it clobbers others' commits).
- Deleting a branch/tag and creating a release are irreversible from the user's view — confirm the exact name first.
- Generate PR/release notes from the **full** commit range (`git diff base...HEAD`), not just the latest commit.

## Examples

**Example 1: Repo hygiene sweep**
```
User: "clean up the repo"
→ RepoHygiene → stale merged branches, secret/path scan, .gitignore gaps, large files → fix list, confirm before deletes
```

**Example 2: Changelog + release**
```
User: "cut a 1.2.0 release"
→ Changelog (commits since last tag) → Release (gh release create v1.2.0 with notes), after confirmation
```

**Example 3: Commit and PR**
```
User: "commit this and open a PR"
→ CommitPush (conventional message, sanitized, pushed) → PullRequest (gh pr create with summary + test plan)
```
