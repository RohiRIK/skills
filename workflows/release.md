---
type: Workflow
title: Release
description: Cut a tagged version of the library — hygiene, changelog, GitHub release.
tags: [maintain-library]
chain: "GitHubOps:RepoHygiene → GitHubOps:Changelog → GitHubOps:Release"
---

# Workflow: release

Cut a tagged version of the library.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
GitHubOps:RepoHygiene → GitHubOps:Changelog → GitHubOps:Release
```

## Steps

1. **GitHubOps:RepoHygiene** — clean tree, no secrets/path leaks, manifest synced.
2. **GitHubOps:Changelog** — collect commits since the last tag (keep-a-changelog format).
3. **GitHubOps:Release** — `gh release create vX.Y.Z` with generated notes, **after confirmation**.

## Pre-release checklist

- [ ] `gen-manifest.sh` re-run → `skills.json` + `llms.txt` match frontmatter
- [ ] README skill-count badge correct
- [ ] No tracked secrets / hardcoded home paths
- [ ] Every skill has a README row

## When to use

The changelog has user-visible changes worth tagging. Run **library-audit** first if the library has drifted.
