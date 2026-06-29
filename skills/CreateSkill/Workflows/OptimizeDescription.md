# OptimizeDescription Workflow

Optimize a skill's YAML `description` for accurate triggering — it fires when it should and stays quiet when it shouldn't. The description is the primary mechanism that determines whether a skill gets invoked; a brilliant skill that never triggers is useless.

## Step 1: Read the Current Skill

Read the target `SKILL.md`. Note the current `description`, what the skill actually does, its workflows, and which adjacent skills compete for the same triggers.

## Step 2: Generate Trigger Eval Queries

Create 20 realistic queries — 10 should-trigger, 10 should-not-trigger.

**Should-trigger (10):** different phrasings of the intent (formal + casual), cases where the user needs the skill without naming it, uncommon use cases, and cases where this skill competes with another but should win.

**Should-not-trigger (10):** the valuable ones are **near-misses** — queries sharing keywords/concepts but actually needing something else (adjacent domains, ambiguous phrasing where naive keyword matching would fire). Avoid obviously irrelevant queries — they test nothing.

Queries must be realistic (file paths, personal context, mixed lengths/formality, some typos). Save as JSON:
```json
[{"query": "realistic user prompt", "should_trigger": true},
 {"query": "near-miss prompt", "should_trigger": false}]
```

## Step 3: Review Queries with User

Present the eval set; ask the user to remove unrealistic queries, add edge cases, and flip any labels they disagree with. Bad eval queries → bad descriptions.

## Step 4: Test the Current Description

Collect all skill names + descriptions:
```bash
rg '^(name|description):' */SKILL.md --no-filename 2>/dev/null | head -200
```

Spawn a **single** Agent subagent that evaluates ALL queries at once (batching avoids 20+ spawns):
```
You have these skills (name + description only): <pasted pairs>
For each user message, decide if you would invoke a skill. Reply ONLY with a JSON array:
[{"query":"...","verdict":"TRIGGER: SkillName"}, {"query":"...","verdict":"NO_TRIGGER"}]
Queries: 1. ... 2. ...
```
Run the batch **twice** in parallel for reliability; flag queries where the two runs disagree (inconsistent triggering).

**Score:** correct verdicts / total. Should-trigger = correct skill fired; should-not-trigger = NO_TRIGGER or a different skill.

## Step 5: Analyze Failures

- **False negatives** (should fire, didn't) → description missing key phrases/concepts.
- **False positives** (shouldn't fire, did) → description too broad or shares vocabulary with the wrong domain.
- **Confusion with another skill** → description competes with its territory; add a mutual `NOT FOR`.

## Step 6: Improve the Description

Add missing intent phrases for false negatives; add specificity / `NOT FOR` for false positives. Keep `USE WHEN` comprehensive but precise. Slightly pushy beats conservative (undertriggering is the bigger problem). Stay ≤ 30 words / 1024 chars.

## Step 7: Re-Test and Compare

Rerun Step 4 against the new description. Present before/after accuracy with false-negative/false-positive counts and the delta.

## Step 8: Iterate or Apply

- Improved but not satisfactory → repeat Steps 5-7 (max 3 iterations, avoid overfitting).
- Accuracy > 85% → apply the new description to SKILL.md (show the user first).
- Degraded → revert and try a different approach.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateSkill","workflow":"OptimizeDescription","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
