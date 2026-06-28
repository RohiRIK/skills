# GitHubOps Overview

## Detailed Description

Where `GitWorkflow` explains *how* git works (branching, merge vs rebase, conflicts), GitHubOps *does* the operations: audits repo health, maintains the changelog, commits and pushes, opens PRs, cuts releases, and prunes branches.

Outward and irreversible actions (push, PR, release, branch/tag delete) are confirmed before running. Conventional Commits + the repo's pre-commit sanitization (no secrets, no hardcoded home paths, no committed symlinks) are honored throughout.

## Quick Reference

- Requires `gh` authenticated (`gh auth status`); all GitHub actions go through `gh`, not raw API tokens.
- Conventional Commits (`feat/fix/docs/refactor/chore/perf/ci`); changelog follows keep-a-changelog.
- Confirm before any push, PR, release, or delete — these are outward/irreversible.
- Branch-first: never commit straight to `main` for non-trivial work; open a PR.
