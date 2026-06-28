---
name: git-workflow
description: "Reference for git branching strategies, commit conventions, merge vs rebase, and conflict resolution. Use when choosing a branching model, resolving conflicts, or setting commit conventions. NOT FOR running gh repo"
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
---
# Git Workflow Patterns
Best practices for Git version control, branching strategies, and collaborative development.

## Workflow Routing

| Topic | Reference |
|-------|-----------|
| Branching strategies | [branching-strategies.md](references/branching-strategies.md) |
| Commit messages | [commit-messages.md](references/commit-messages.md) |
| Merge vs rebase | [merge-vs-rebase.md](references/merge-vs-rebase.md) |
| Pull request workflow | [pull-request-workflow.md](references/pull-request-workflow.md) |
| Conflict resolution | [conflict-resolution.md](references/conflict-resolution.md) |
| Branch management | [branch-management.md](references/branch-management.md) |
| Release management | [release-management.md](references/release-management.md) |
| Git configuration | [git-configuration.md](references/git-configuration.md) |
| Common workflows | [common-workflows.md](references/common-workflows.md) |
| Git hooks | [git-hooks.md](references/git-hooks.md) |
| Anti-patterns | [anti-patterns.md](references/anti-patterns.md) |
| Quick reference | [quick-reference.md](references/quick-reference.md) |

## Gotchas

- Rebase rewrites history — never rebase a branch others have already pulled; merge instead.
- A conflict resolution that just picks one side without reading both usually drops real work — read both hunks before resolving.

## Examples

**Example 1: Pick a branching model**
```
User: "what branching strategy for a small team?"
→ trunk-based vs GitHub-flow tradeoffs, commit conventions
```

**Example 2: Resolve a conflict**
```
User: "rebase conflict on a shared branch"
→ read both hunks, resolve, and why to merge not rebase shared history
```
