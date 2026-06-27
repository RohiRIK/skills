# Release Workflow

Tag a version and publish a GitHub release with notes from the changelog.

## Step 1: Preconditions

```bash
gh auth status
git switch main && git pull --ff-only      # release from an up-to-date main
git status --short                          # clean tree
```

Confirm the working tree is clean and `main` is current before tagging.

## Step 2: Decide the Version

Pick the next semver from the change scope (breaking → major, feature → minor, fix → patch). Show the user the proposed version and the last tag (`git describe --tags --abbrev=0`) and confirm.

## Step 3: Update the Changelog

Run the `Changelog` workflow to produce the section for this version (heading `## vX.Y.Z — <date>`). Commit it:

```bash
git add CHANGELOG.md && git commit -m "docs: changelog for vX.Y.Z"
git push
```

## Step 4: Tag + Release (confirm — irreversible)

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --title "vX.Y.Z" --notes "<changelog section bullets>"
# --notes-file CHANGELOG-section.md for long notes; --latest to mark newest
```

Confirm the exact tag name before pushing it — a pushed tag and a published release are visible immediately and awkward to retract.

## Step 5: Verify

```bash
gh release view vX.Y.Z
```

Report the release URL.

## Gotchas

- Tag the right commit — tag after the changelog commit lands, or the release won't include it.
- Deleting a published release/tag is disruptive (breaks anyone who fetched it); get the version right before pushing.
- `gh release create` needs the tag to exist on the remote (push the tag first, or let `gh` create it with `--target`).

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"GitHubOps","workflow":"Release","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
