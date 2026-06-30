---
type: Workflow
title: Repo hygiene
description: Periodic cleanup of config and project repo — git, skills, rules, manifest drift.
tags: [build-ship]
chain: "Hygiene → fix → GitHubOps:RepoHygiene"
---

# Workflow: repo-hygiene

Periodic cleanup of config + project repo.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Hygiene → fix → GitHubOps:RepoHygiene
```

## Steps

1. **Hygiene** — audit `~/.claude` for git, skill, code, and rules issues.
2. **Fix** — apply safe corrections.
3. **GitHubOps:RepoHygiene** — sweep the project repo: stale branches, secret/path scan, `.gitignore` gaps, large files, manifest drift. Confirm before any destructive delete.

## When to use

Periodic maintenance, or before a release. The `doc/` staging removal + gitignore consolidation in this repo was a RepoHygiene sweep.
