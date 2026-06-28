# Publishing a Skill

Pre-publish checklist and distribution methods for Hermes skills.

## Pre-Publish Checklist

Run through every item before publishing. Each one has caused real publish failures.

### 1. Hardcoded Paths
```bash
grep -rn '/home/<user>' <skill_dir>/ --include='*.md' --include='*.ts' --include='*.sh' | grep -v '.git/'
```
- Replace `/home/<user>/...` with `~/...` in all examples and scripts
- Project-specific reference files (with real IPs, paths) → rename to `example-*.md` and add a disclaimer at the top

### 2. Version Consistency
- SKILL.md frontmatter `version:` must match the latest CHANGELOG entry
- Bump version before publishing, not after

### 3. Author Field
- SKILL.md `author:` should be the actual author, not "Hermes Agent"

### 4. Required Files
- `SKILL.md` — mandatory (the skill itself)
- `README.md` — strongly recommended for GitHub discoverability
- `CHANGELOG.md` — recommended for versioned skills

### 5. Project-Specific Content
- Files describing YOUR deployment (IPs, paths, configs) should be clearly marked as examples
- Rename `my-project.md` → `example-my-project.md`
- Add disclaimer: `> Note: This is a real deployment example. Replace paths and IPs with your own.`

### 6. Sensitive Data
- No API keys, tokens, passwords
- No internal IPs in non-example files
- No personal data

## Publishing Methods

### GitHub Direct Install (works immediately)
```bash
hermes skills install https://raw.githubusercontent.com/<owner>/<repo>/main/SKILL.md
```
No registry needed. Anyone with the URL can install.

### Tap a Repo (auto-updates)
```bash
hermes skills tap add <owner>/<repo>
```
Shows up in `hermes skills list`, gets updates when repo changes.

### GitHub PR Method
```bash
hermes skills publish <skill_path> --to github --repo <owner>/<repo>
```
Opens a PR on the repo. Merge it to complete.

### ClawHub Registry
```bash
hermes skills publish <skill_path> --to clawhub
```
**Status (as of May 2026):** CLI flag exists but is not implemented. Prints redirect to https://clawhub.ai/publish-skill — must submit via web UI with GitHub sign-in.

## Post-Publish Verification
```bash
# Test install from GitHub
hermes skills install https://raw.githubusercontent.com/<owner>/<repo>/main/SKILL.md --name test-install
# Verify it loaded
hermes skills list | grep <name>
# Clean up
hermes skills uninstall test-install
```
