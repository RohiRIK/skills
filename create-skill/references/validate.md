# Validate Skill Workflow

Audit an existing Hermes skill for production readiness. Combines structural validation with content quality checks.

## Prerequisites

- Skill name known
- `skill_view(name='...')` accessible

## Steps

### Step 1: Load the skill

```python
skill_view(name='skill-name')
```

If this errors — the skill has a structural problem. Check frontmatter YAML syntax first.

### Step 2: Frontmatter Checklist

- [ ] Starts at byte 0 with `---`, no leading whitespace or blank lines
- [ ] Closes with `\n---\n`
- [ ] `name` present — lowercase-hyphens, ≤64 chars
- [ ] `description` present — starts with `"Use when ..."`, ≤30 words, ≤1024 chars
- [ ] `version` present — semver format
- [ ] `author` present
- [ ] `license` present
- [ ] `metadata.hermes.tags` present — array of strings
- [ ] `metadata.hermes.related_skills` present — array of skill names
- [ ] `usage_hint` present (if skill has reference files) — points to correct primary file

### Step 3: Description Quality

- [ ] States WHAT + WHEN, ≤30 words
- [ ] Correct format: `"[WHAT]. Use when [trigger]."` (auto-trigger)
- [ ] Has `NOT FOR` clause if skill has confusable neighbours
- [ ] No keyword lists: `"skill, create, validate"` ✗
- [ ] No `SkillSearch()` or `skill_view()` calls in description ✗
- [ ] No separate `triggers:` or `workflows:` arrays (old format)

### Step 4: SKILL.md Body Checklist

- [ ] Total file ≤ 50 lines (if longer — content should be in references/)
- [ ] Has `## Workflow Routing` table (if skill has multiple procedures)
- [ ] Routing table workflow names match actual files in `references/`
- [ ] Has `## Gotchas` section (accumulates failure knowledge — every skill needs one)
- [ ] Has `## Examples` with 2-3 concrete usage patterns
- [ ] Does NOT contain full step-by-step execution instructions (those belong in references/)
- [ ] Quick Reference section links to context files

### Step 5: Structure Checklist

Check the skill directory:
```python
skill_view(name='skill-name')  # check linked_files in output
```

- [ ] Reference files exist for every entry in the routing table
- [ ] No forbidden subdirectories: `Workflows/`, `Tools/`, `docs/`, `context/`, `resources/`
- [ ] Only allowed subdirs: `references/`, `scripts/`, `templates/`, `assets/`
- [ ] Script files exist in `scripts/` (if skill declares scripts)
- [ ] No `backups/` inside skill directory
- [ ] SKILL.md ≤ 50 lines (dynamic loading applied if needed)

### Step 6: Script Checklist (if scripts/ exists)

For each script file:
```bash
bun ~/.hermes/skills/<category>/<name>/scripts/<script>.ts --help
```

- [ ] Runs without errors
- [ ] Has usage comment at top
- [ ] Accepts `--help` flag
- [ ] Exit 0 on success, exit 1 on failure
- [ ] No hardcoded absolute paths

### Step 7: Reference File Checklist

For each reference file in `references/`:
- [ ] Has Prerequisites section
- [ ] Has numbered Steps with exact commands in code blocks
- [ ] Has Exit Criteria section
- [ ] Is self-contained — readable and executable without SKILL.md
- [ ] Referenced correctly in SKILL.md routing table

### Step 8: Naming Convention

- [ ] Skill directory uses lowercase-hyphens
- [ ] All reference files use lowercase-hyphens
- [ ] All script files use lowercase-hyphens
- [ ] Routing table names match file names exactly

### Step 9: Report

Report results grouped by section:

```
FRONTMATTER: X/10 pass
DESCRIPTION: X/6 pass
SKILL.md BODY: X/7 pass
STRUCTURE: X/7 pass
SCRIPTS: X/5 pass (or N/A)
REFERENCES: X/4 pass per file
NAMING: X/4 pass

ISSUES:
- [FAIL] description doesn't start with "Use when"
- [WARN] SKILL.md is 87 lines — move instructions to references/

VERDICT: PRODUCTION-READY / NEEDS FIXES
```

## Exit Criteria

- All checklist items pass
- Verdict: PRODUCTION-READY
- If non-compliant: recommend `references/canonicalize.md` workflow
