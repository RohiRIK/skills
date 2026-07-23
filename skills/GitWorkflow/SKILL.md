---
name: GitWorkflow
description: "Reference for git branching strategies, commit conventions, merge vs rebase, and conflict resolution. USE WHEN choosing a branching model, resolving conflicts, or setting commit conventions. NOT FOR running gh repo operations like push/PR/release (use GitHubOps)."
category: reference
effort: low
domain: dev
---

# Git Workflow Patterns

Best practices for Git version control, branching strategies, and collaborative development. Load only the reference file the task needs.

## Reference Map

| Topic | Load when you need… | File |
|-------|--------------------|------|
| Branching | GitHub Flow vs trunk-based vs GitFlow, branch naming, cleanup, stash | `References/Branching.md` |
| Commits | Conventional Commits types, good/bad examples, `.gitmessage` template | `References/Commits.md` |
| Merge vs Rebase | When to merge vs rebase, rebase workflow, conflict resolution | `References/MergeRebase.md` |
| Pull Requests | PR title/description templates, review checklists | `References/PullRequests.md` |
| Releases | SemVer, tags, changelog generation | `References/Releases.md` |
| Config & Workflows | Git config, aliases, gitignore patterns, git hooks, common workflows, undoing mistakes, anti-patterns | `References/ConfigAndWorkflows.md` |

## Choosing a Branching Strategy

| Strategy | Team Size | Release Cadence | Best For |
|----------|-----------|-----------------|----------|
| GitHub Flow | Any | Continuous | SaaS, web apps, startups |
| Trunk-Based | 5+ experienced | Multiple/day | High-velocity teams, feature flags |
| GitFlow | 10+ | Scheduled | Enterprise, regulated industries |

## Quick Reference

| Task | Command |
|------|---------|
| Create branch | `git checkout -b feature/name` |
| Rebase branch | `git rebase main` |
| View history | `git log --oneline --graph` |
| Stash | `git stash push -m "message"` |
| Undo last commit | `git reset --soft HEAD~1` |
| Revert commit | `git revert HEAD` |

## Gotchas

- Rebase rewrites history — never rebase a branch others have already pulled; merge instead.
- A conflict resolution that just picks one side without reading both usually drops real work — read both hunks before resolving.

## Examples

**Example 1: Pick a branching model**
```
User: "what branching strategy for a small team?"
→ References/Branching.md → trunk-based vs GitHub-flow tradeoffs
```

**Example 2: Resolve a conflict**
```
User: "rebase conflict on a shared branch"
→ References/MergeRebase.md → read both hunks, resolve, merge not rebase shared history
```
