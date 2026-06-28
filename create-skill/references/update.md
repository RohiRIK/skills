# Update Skill Workflow

Update an existing Hermes skill — patch content, add workflows, add scripts, or restructure.

## Prerequisites

- Skill exists and loads via `skill_view`
- Change needed identified (wrong content, missing workflow, new script, restructure)

## Steps

### Step 1: Load the current skill

```python
skill_view(name='skill-name')
```

Read the full content and note `linked_files` to understand what files already exist.

### Step 2: Identify the change type

| Change type | Action |
|---|---|
| Fix wrong/outdated content in SKILL.md | `skill_manage(action='patch', ...)` |
| Add a new workflow | `skill_manage(action='write_file', file_path='references/new-workflow.md', ...)` then patch SKILL.md routing table |
| Add a new script | `skill_manage(action='write_file', file_path='scripts/new-script.ts', ...)` |
| Add reference material | `skill_manage(action='write_file', file_path='references/context.md', ...)` |
| Update description | Modify `description` in YAML frontmatter |
| Major overhaul (rewrite) | `skill_manage(action='edit', ...)` — rewrites full SKILL.md |

### Step 3: Patch (targeted fix)

For small targeted fixes to SKILL.md:

```python
skill_manage(
  action='patch',
  name='skill-name',
  old_string='[exact text to replace — include enough context for uniqueness]',
  new_string='[replacement text]'
)
```

Pitfall: `old_string` must be unique in the file. Include surrounding lines if needed.

### Step 4: Add a workflow file

```python
skill_manage(
  action='write_file',
  name='skill-name',
  file_path='references/new-workflow.md',
  file_content='[workflow content — see new-skill.md for format]'
)
```

Then patch SKILL.md to add the new workflow to the routing table:

```python
skill_manage(
  action='patch',
  name='skill-name',
  old_string='| **last-workflow** | "trigger" | `references/last-workflow.md` |',
  new_string='| **last-workflow** | "trigger" | `references/last-workflow.md` |\n| **new-workflow** | "new trigger" | `references/new-workflow.md` |'
)
```

### Step 5: Add a script file

```python
skill_manage(
  action='write_file',
  name='skill-name',
  file_path='scripts/script-name.ts',
  file_content='[bun TS script — see conventions for format]'
)
```

### Step 6: Update description

Modify the single-line `description` in YAML frontmatter. State WHAT + WHEN, ≤30 words:

```python
skill_manage(
  action='patch',
  name='skill-name',
  old_string='description: "old description"',
  new_string='description: "Use when <new trigger>. <one-line behavior>."'
)
```

### Step 7: Add reference material

For context docs, guides, or SOPs:

```python
skill_manage(
  action='write_file',
  name='skill-name',
  file_path='references/context-doc.md',
  file_content='[reference content]'
)
```

Add a Quick Reference entry in SKILL.md pointing to it.

### Step 8: Full rewrite (major overhaul)

Only for major restructuring — rewrites the entire SKILL.md:

```python
skill_manage(
  action='edit',
  name='skill-name',
  content='[complete new SKILL.md content with frontmatter]'
)
```

Use sparingly. Prefer `patch` for targeted fixes.

### Step 9: Validate after update

Always run validate after any update:

```python
skill_view(name='skill-name')  # confirm loads cleanly
```

Then run `references/validate.md` checklist.

### Step 10: Update Gotchas

After every meaningful change, check if the `## Gotchas` section needs updating:
- Add any new failure modes discovered
- Document any API quirks found
- Record workarounds that proved necessary

## Final Checklist

### Naming
- [ ] New workflow files use lowercase-hyphens
- [ ] New script files use lowercase-hyphens
- [ ] Routing table names match file names exactly

### Structure
- [ ] YAML still has single-line description (WHAT + WHEN, ≤30 words)
- [ ] All required frontmatter fields present and valid
- [ ] All routes point to existing files
- [ ] `## Gotchas` section present (add one if missing)

## Exit Criteria

- `skill_view` loads without errors after update
- Changed content is correct
- Validation checklist passes
- If new workflow added: routing table updated in SKILL.md
- If new script added: script runs via `bun ... --help`
