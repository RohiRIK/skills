# ValidateSkill Workflow

**Purpose:** Check if an existing skill follows the canonical structure.

---

## Step 1: Load Reference Docs

Read these context files with the Read tool before validating:
- `Conventions.md` (structure rules)
- `Frontmatter.md` (tier system + fields)

---

## Step 2: Read the Target Skill

```
~/.claude/skills/[SkillName]/SKILL.md
```

---

## Step 3: Check TitleCase Naming

### Skill Directory
```bash
ls ~/.claude/skills/ | grep -i [skillname]
```
- ✓ `Blogging`, `Daemon`, `CreateSkill`
- ✗ `createskill`, `create-skill`, `CREATE_SKILL`

### Workflow Files
```bash
ls ~/.claude/skills/[SkillName]/Workflows/
```
- ✓ `Create.md`, `UpdateDaemonInfo.md`
- ✗ `create.md`, `update-daemon-info.md`

---

## Step 4: Check YAML Frontmatter

### Description
- ✓ States WHAT + WHEN, ≤30 words
- ✓ Correct format for tier: `"[WHAT]. USE WHEN [trigger]."` (Tier C/D), imperative (Tier B), noun phrase (Tier A)
- ✗ Bare `"USE WHEN..."` with no WHAT clause (Tier C/D) — wrong
- ✗ Keyword list: `"skill, create, validate"` — wrong
- ✗ Tool-call syntax (e.g. `SomeFunction(...)`) in description — wrong
- ✗ Multi-line using `|` — wrong
- ✗ Separate `triggers:` or `workflows:` arrays — old format, wrong

### category + effort (required)
- ✓ `category` present and ∈ {`workflow`, `reference`, `delegation`, `meta`, `visual`, `prompting`, `quality`}
- ✓ `effort` present and ∈ {`low`, `medium`, `high`}
- ✗ Either key missing, or a value outside the allowed set — wrong

### Tier Classification
- Tier A: has `user-invocable: false`
- Tier B: has `disable-model-invocation: true`
- Tier C: no extra flags (correct default)
- Tier D: has `context: fork` + `agent: <type>`

Check: does the tier match the skill's actual use case?

### Argument hint
- If skill takes user arguments (e.g. `/recall [query]`), must have `argument-hint` field

---

## Step 5: Check Markdown Body

### Workflow Routing Section
```markdown
## Workflow Routing

| Workflow | Trigger | File |
|---------|---------|------|
| **WorkflowOne** | "trigger phrase" | `Workflows/WorkflowOne.md` |
```
- ✗ Missing `## Workflow Routing` section
- ✗ Workflow names not in TitleCase
- ✗ File paths not matching actual file names

### Examples Section
- ✓ `## Examples` section with 2-3 concrete patterns required

### Gotchas Section
- ✓ `## Gotchas` section present (every skill needs one — accumulates failure knowledge)
- ✗ Missing `## Gotchas` — non-compliant (Tier A reference skills may carry a short one or be exempt)

### Telemetry (action workflows)
- ✓ Each action workflow ends with the `~/.claude/state/execution.jsonl` line
- ✗ Action workflow with no telemetry line — non-compliant (Tier A reference skills exempt)

---

## Step 6: Check File Structure

```bash
ls -la ~/.claude/skills/[SkillName]/
```
- ✓ Context files (.md) at skill root, not in subdirectories
- ✓ No `Context/`, `Docs/`, `Resources/` subdirectory
- ✓ SKILL.md ≤ 50 lines (if longer, dynamic loading should be used)
- ✗ `backups/` inside skill — wrong

---

## Step 7: Check CLI-First Integration (if skill has tools)

```bash
bun ~/.claude/skills/[SkillName]/Tools/[ToolName].ts --help
grep -l "Intent-to-Flag" ~/.claude/skills/[SkillName]/Workflows/*.md
```

- [ ] CLI tools expose behavioral configuration via flags
- [ ] Workflows that call CLI tools have intent-to-flag mapping tables

---

## Step 8: Report Results

**COMPLIANT** checklist:

### Naming (TitleCase)
- [ ] Skill directory uses TitleCase
- [ ] All workflow files use TitleCase
- [ ] All reference docs use TitleCase
- [ ] Routing table names match file names exactly

### YAML Frontmatter
- [ ] `name:` uses TitleCase
- [ ] `description:` states WHAT + WHEN, ≤30 words, correct format for tier
- [ ] `category` present and in the allowed set
- [ ] `effort` present and ∈ {low, medium, high}
- [ ] Tier correctly classified (user-invocable / disable-model-invocation / fork)
- [ ] `argument-hint` present if skill takes arguments
- [ ] No separate `triggers:` or `workflows:` arrays

### Markdown Body
- [ ] `## Workflow Routing` section present with table format
- [ ] `## Gotchas` section present
- [ ] `## Examples` section with 2-3 patterns

### Structure
- [ ] Context files in skill root (not subdirectories)
- [ ] SKILL.md ≤ 50 lines
- [ ] No `backups/` inside skill
- [ ] Action workflows emit the telemetry line (Tier A reference skills exempt)

**NON-COMPLIANT** if any check fails. Recommend using CanonicalizeSkill workflow.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateSkill","workflow":"ValidateSkill","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
