# Workflow: release

Cut a tagged version of the library.

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
