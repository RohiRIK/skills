# CanonicalizeSkill Workflow

**Purpose:** Restructure an existing skill to match the canonical format with proper naming conventions.

---

## Step 1: Load Reference Docs

Read these context files with the Read tool before restructuring:
- `Conventions.md` (structure rules)
- `Frontmatter.md` (tier system + fields)

---

## Step 2: Read the Current Skill

```
~/.claude/skills/[skill-name]/SKILL.md
```

Identify what's wrong:
- Multi-line description using `|`?
- Separate `triggers:` or `workflows:` arrays in YAML? (OLD FORMAT)
- Missing `USE WHEN` trigger or missing WHAT clause in description (when Tier C/D)?
- Description >30 words?
- Tier not correctly classified?
- Workflow routing missing from markdown body?
- Workflow files not using TitleCase?
- Context files inside `Context/` subdirectory?
- SKILL.md >100 lines (should use dynamic loading)?

---

## Step 3: Safety Check (git, not a copy)

The library is git-tracked, so git is the backup — no side-copy needed.

```bash
git status --short ~/.claude/skills/[skill-name]/
```

- If there are uncommitted changes, commit them first (or `git stash push -- ~/.claude/skills/[skill-name]/`) so the restructure has a clean rollback point.
- If the tree is already clean, proceed — `git diff`/`git checkout` can always recover the pre-restructure state.

---

## Step 4: Enforce TitleCase Naming

See Conventions.md for full table. Key renames:

```bash
cd ~/.claude/skills/[SkillName]/Workflows/
mv create.md Create.md
mv update-info.md UpdateInfo.md
mv sync_repo.md SyncRepo.md
```

---

## Step 5: Enforce Flat Folder Structure

```bash
# Find any folders 3+ levels deep (FORBIDDEN)
find ~/.claude/skills/[SkillName]/ -type d -mindepth 2 -maxdepth 3
```

Common violations:
- `Workflows/Company/DueDiligence.md` → flatten to `Workflows/CompanyDueDiligence.md`
- `Context/` subdirectory → move files to skill root, delete `Context/`
- `Tools/Utils/Helper.ts` → flatten to `Tools/Helper.ts`

---

## Step 6: Convert YAML Frontmatter

**From old format:**
```yaml
---
name: skill-name
description: |
  What the skill does.
triggers:
  - USE WHEN user mentions X
workflows:
  - USE WHEN user wants to A: Workflows/a.md
---
```

**To new format:**
```yaml
---
name: SkillName
description: "USE WHEN user mentions X OR user wants A."
# Add tier-specific fields if needed
---
```

Check description: states WHAT + WHEN, ≤30 words, correct format for tier (see Frontmatter.md).

---

## Step 7: Add Workflow Routing to Body

```markdown
## Workflow Routing

| Workflow | Trigger | File |
|---------|---------|------|
| **WorkflowOne** | "trigger phrase one" | `Workflows/WorkflowOne.md` |
```

---

## Step 8: Ensure All Workflows Are Routed

```bash
ls ~/.claude/skills/[SkillName]/Workflows/
```

For each file:
1. Verify TitleCase naming (rename if needed)
2. Ensure there's a routing entry
3. Verify routing entry matches exact file name

---

## Step 9: Add Examples Section

**REQUIRED:** Every skill needs `## Examples` with 2-3 concrete patterns.

```markdown
## Examples

**Example 1: [Common use case]**
```
User: "[Typical user request]"
→ Invokes WorkflowName workflow
→ [What skill does]
```
```

---

## Step 10: Apply Dynamic Loading (if SKILL.md > 100 lines)

If SKILL.md is over 100 lines after canonicalization:
1. Move detailed content to named context files in skill root (e.g., `Conventions.md`, `Examples.md`)
2. Slim SKILL.md to 30-50 lines with routing table + pointers to the context files (read on demand with the Read tool)
3. See Conventions.md dynamic loading pattern

---

## Step 11: Verify

### Naming (TitleCase)
- [ ] Skill directory uses TitleCase
- [ ] All workflow files use TitleCase
- [ ] Routing table names match file names exactly

### YAML Frontmatter
- [ ] `name:` uses TitleCase
- [ ] `description:` states WHAT + WHEN, ≤30 words, correct format for tier
- [ ] `category` + `effort` present and valid (add them if the skill predates the convention)
- [ ] Tier correctly classified
- [ ] No separate `triggers:` or `workflows:` arrays

### Markdown Body
- [ ] `## Workflow Routing` section with table format
- [ ] `## Gotchas` section present (add one if missing)
- [ ] `## Examples` section with 2-3 patterns

### Structure
- [ ] Context files at skill root (no `Context/` subdirectory)
- [ ] SKILL.md ≤ 50 lines (dynamic loading applied if needed)
- [ ] No `backups/` inside skill
- [ ] Action workflows emit the telemetry line

---

## Done

Skill now matches canonical structure with proper TitleCase naming throughout.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateSkill","workflow":"CanonicalizeSkill","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
