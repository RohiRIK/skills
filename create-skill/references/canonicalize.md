# Canonicalize Skill Workflow

Restructure an existing skill to match the canonical Hermes format with proper naming conventions and structure.

## Prerequisites

- Target skill exists and loads via `skill_view`
- User has approved restructuring

## Steps

### Step 1: Read the Current Skill

```python
skill_view(name='skill-name')
```

Identify what's wrong:
- Description doesn't start with "Use when"?
- Description >30 words?
- Missing `## Gotchas` section?
- SKILL.md >50 lines (should use dynamic loading)?
- Wrong subdirectory names (`Workflows/` instead of `references/`, `Tools/` instead of `scripts/`)?
- Missing frontmatter fields (`version`, `author`, `license`, `metadata`)?
- Workflow routing missing from markdown body?
- Workflow files not referenced in routing table?

### Step 2: Backup

```bash
cp -r ~/.hermes/skills/<category>/<skill-name>/ ~/.hermes/skills/<category>/<skill-name>-backup-$(date +%Y%m%d)/
```

**Note:** Backups go outside the skill directory, NEVER inside it.

### Step 3: Enforce lowercase-hyphens Naming

Hermes uses lowercase-hyphens everywhere:

```bash
cd ~/.hermes/skills/<category>/<skill-name>/
# Rename any TitleCase or underscore files
mv Create.md create.md
mv UpdateInfo.md update-info.md
mv Sync_Repo.md sync-repo.md
```

### Step 4: Enforce Correct Folder Structure

```bash
# Find any forbidden subdirectories
find ~/.hermes/skills/<category>/<skill-name>/ -type d | grep -v -E '(references|scripts|templates|assets)$'
```

Common violations and fixes:
- `Workflows/` → rename to `references/`
- `Tools/` → rename to `scripts/`
- `Context/` → move files to `references/`, delete `Context/`
- `docs/` → move files to `references/`, delete `docs/`
- Nested dirs 3+ levels deep → flatten

### Step 5: Fix YAML Frontmatter

Ensure all required fields are present and correct:

```yaml
---
name: skill-name          # lowercase-hyphens, ≤64 chars
description: "Use when <trigger>. <one-line behavior>."  # starts with "Use when", ≤30 words
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [tag1, tag2]
    related_skills: [other-skill]
---
```

Check:
- Description states WHAT + WHEN, ≤30 words, correct format
- No separate `triggers:` or `workflows:` arrays (old format)
- No multi-line description using `|`
- No `SkillSearch()` calls in description

### Step 6: Add Workflow Routing to Body

```markdown
## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **workflow-name** | "trigger phrase" | `references/workflow-name.md` |
```

### Step 7: Ensure All Workflows Are Routed

```bash
ls ~/.hermes/skills/<category>/<skill-name>/references/
```

For each file:
1. Verify lowercase-hyphens naming (rename if needed)
2. Ensure there's a routing entry
3. Verify routing entry matches exact file name

### Step 8: Add Gotchas Section

**REQUIRED:** Every skill needs `## Gotchas` with accumulated failure knowledge.

```markdown
## Gotchas
- Known failure mode 1
- API quirk discovered during testing
- Non-obvious ordering requirement
```

### Step 9: Add Examples Section

**REQUIRED:** Every skill needs `## Examples` with 2-3 concrete patterns.

```markdown
## Examples

**Example 1: Common use case**
```
User: "[Typical user request]"
→ loads references/workflow-name.md
→ [what happens]
```
```

### Step 10: Apply Dynamic Loading (if SKILL.md > 50 lines)

If SKILL.md is over 50 lines:
1. Move detailed content to `references/<topic>.md`
2. Slim SKILL.md to 30-50 lines with routing table + pointers
3. See `references/conventions.md` for the dynamic loading pattern

### Step 11: Verify

Run through the full validation checklist from `references/validate.md`.

## Exit Criteria

- All files use lowercase-hyphens naming
- Correct folder structure (references/, scripts/, templates/, assets/)
- Frontmatter complete with all required fields
- Description starts with "Use when", ≤30 words
- `## Gotchas` and `## Examples` sections present
- SKILL.md ≤ 50 lines
- Validation checklist passes
