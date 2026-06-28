---
name: git-hub-ops
description: "Manage a GitHub repo via the gh CLI — hygiene, changelog, commit/push, PRs, releases, branch cleanup. Use when running gh repo operations."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [workflow]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='git-hub-ops', file_path='references/release.md') before taking any action."
---

# GitHubOps

The action layer for managing a GitHub repository with the `gh` CLI.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RepoHygiene** | "clean up the repo", "repo health", "stale branches" | `references/repo-hygiene.md` |
| **Changelog** | "update the changelog", "what changed since last release" | `references/changelog.md` |
| **CommitPush** | "commit and push", "commit this" | `references/commit-push.md` |
| **PullRequest** | "open a PR", "create pull request" | `references/pull-request.md` |
| **Release** | "cut a release", "tag a version", "publish release" | `references/release.md` |

## Gotchas
- `gh` not authenticated → every GitHub call fails; check `gh auth status` first.
- Pre-commit sanitize blocks hardcoded home paths, secrets, or staged symlinks — fix, don't bypass with `--no-verify`.
- Shared-branch push after rebase needs `--force-with-lease`, never `--force`.
- Branch/tag delete and release are irreversible — confirm the exact name first.

## Examples
**Example 1: Repo hygiene sweep**
```
User: "clean up the repo"
→ RepoHygiene → stale branches, secret/path scan → confirm before deletes
```
**Example 2: Changelog + release**
```
User: "cut a 1.2.0 release"
→ Changelog → Release (gh release create v1.2.0), after confirmation
```
**Example 3: Commit and PR**
```
User: "commit this and open a PR"
→ CommitPush → PullRequest (gh pr create with summary + test plan)
```
