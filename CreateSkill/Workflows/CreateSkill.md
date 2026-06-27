# CreateSkill Workflow

Create a new skill in canonical form: TitleCase naming, flat structure, `category`/`effort` frontmatter, a `## Gotchas` section, and the telemetry line.

## Step 1: Read the Canon

Read these context files before building:
- `Conventions.md` — structure rules (TitleCase, flat 2-level, no `Context/`).
- `Frontmatter.md` — tier system + field reference (including `category`/`effort`).
- `WritingGuidance.md` — principles, BPE, public/private boundary.
- `Taxonomy.md` — the 9 skill types.

Then study one canonical example already in the repo (e.g. `Verify/SKILL.md` or `Iterate/SKILL.md`).

## Step 2: Understand the Request

Ask the user: What does the skill do? What should trigger it? What workflows does it need?

## Step 2a: Classify the Skill Type

Classify against the 9 types in `Taxonomy.md`. The type shapes structure — Type 1 is mostly gotchas; Type 7 needs safety gates; Type 5 ships templates.

## Step 2b: BPE Check

Apply the bitter-lesson test: **"Would a smarter model make this skill unnecessary?"** Proceed if the skill provides knowledge the model can't derive (API quirks, org decisions) or tools it can't replicate (API calls, automation). Question it if it only orchestrates the model's reasoning. See `WritingGuidance.md`.

## Step 2c: Public vs Private

Decide `TitleCase` (public, generic) vs `_ALLCAPS` (private, identity-bound). See the decision rule in `WritingGuidance.md`. When in doubt, private first.

## Step 3: Determine TitleCase Names

All names use TitleCase: skill dir (`Blogging`), workflows (`Create.md`), context docs (`ApiReference.md`), tools (`ManageServer.ts`). Never `create-skill`, `create.md`, `SYNC_REPO.md`.

## Step 4: Create the Directory

```bash
mkdir -p <SkillName>/Workflows <SkillName>/Tools
```

## Step 5: Create SKILL.md (≤ 50 lines)

Use this template — note the required `category`/`effort` keys and the `## Gotchas` section:

```markdown
---
name: SkillName
description: "[What it does]. USE WHEN [intent triggers, OR-joined]. NOT FOR [confusable alternative]."
category: workflow   # workflow · reference · delegation · meta · visual · prompting · quality
effort: medium       # low · medium · high
---

# SkillName

[Brief description — one or two sentences.]

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **WorkflowOne** | "trigger phrase" | `Workflows/WorkflowOne.md` |

## Quick Reference

- [3-5 high-signal bullets; pointers to context files loaded on demand]

## Gotchas

- [Known failure modes, API quirks, non-obvious ordering — accumulate after every failure]

## Examples

**Example 1: [Common use case]**
\`\`\`
User: "[Typical request]"
→ Invokes WorkflowOne → [what it does] → [what the user gets]
\`\`\`
```

If SKILL.md would exceed 50 lines, move detail to context files in the skill root (progressive disclosure).

## Step 5b: Public Release Readiness

For `TitleCase` skills, run the pre-flight grep from `WritingGuidance.md`:

```bash
rg -i "/(Users|home)/[a-z]+/|<your-name>|<your-org>|<your-domain>" <SkillName>/
```

Zero matches = ready. Any match = scrub or rename to `_ALLCAPS`.

## Step 6: Create Workflow Files

For each routed workflow, create `Workflows/<WorkflowName>.md`. If a workflow drives a CLI tool, include an **intent-to-flag mapping** table (natural language → flags) so the workflow exposes the tool's configuration instead of hardcoding one pattern.

End every **action** workflow with the telemetry line (Step 8). Reference skills (Tier A) are exempt.

## Step 7: Verify TitleCase + Structure

```bash
ls <SkillName>/ <SkillName>/Workflows/
```

`SKILL.md` (always uppercase) plus TitleCase workflow/tool/doc files; no `Context/`/`Docs/`/`Resources/` subdir; no `backups/` inside the skill.

## Step 8: Wire Telemetry (action workflows)

Every action workflow ends with:

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SkillName","workflow":"WorkflowName","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```

See `_state/ExecutionLog.md` for the schema.

## Step 9: Final Checklist

### Naming
- [ ] Skill dir, workflow files, tool files, doc files all TitleCase
- [ ] Routing-table names match file names exactly

### Frontmatter
- [ ] `name`, `description` (WHAT + WHEN, ≤30 words), `category`, `effort` all present
- [ ] `category` ∈ {workflow, reference, delegation, meta, visual, prompting, quality}; `effort` ∈ {low, medium, high}
- [ ] `NOT FOR` clause present if the skill has confusable neighbours
- [ ] Tier flags correct (A: `user-invocable: false` · B: `disable-model-invocation: true` · D: `context: fork` + `agent`)

### Body
- [ ] `## Workflow Routing`, `## Gotchas`, and `## Examples` sections present
- [ ] SKILL.md ≤ 50 lines

### Structure & BPE
- [ ] Flat, 2 levels max; context files in root; no `backups/`
- [ ] Skill type identified; BPE check passed
- [ ] Action workflows emit the telemetry line

### Public Release
- [ ] Pre-flight grep returns zero matches (public skills)

## Step 10: Suggest Effectiveness Testing

Offer to run `Workflows/TestSkill.md` (does the skill help vs baseline?) and `Workflows/OptimizeDescription.md` (does it route reliably?).

## Step 11: README Row

Add a row for the new skill in `README.md` — a skill without a README row is incomplete.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateSkill","workflow":"CreateSkill","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
