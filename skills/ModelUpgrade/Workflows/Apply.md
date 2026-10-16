# Apply Workflow

Carry out an upgrade report: fix the `reprompt` skills, rework the `replan` skills with an A/B check, stamp what passes, and open one PR.

## Step 1: Load the report

Read the newest `reports/ModelUpgrade/*.md` (or the one named). Work only on rows whose verdict is `reprompt` or `replan` at high or medium confidence. `retire` rows wait for the owner's yes; low-confidence rows stay in the report.

## Step 2: Reprompt

For each finding, one edit, using the target's entry in `Generations.md` and `Prompting/vendors/<vendor>.md`, and checked against `Rubric.md` §3 so it does not regress another family the skill is stamped for:

- Pressure language → the plain instruction with its reason.
- Replaced scaffold → delete it, or move depth to the `effort` field.
- Stale fact → the current fact, checked against the repo (the command, path, or skill exists).

Finish the removal: grep for other mentions of a removed command or name. Stale-fact fixes need no A/B; wording changes to behaviour get one when the skill is high-traffic.

## Step 3: Replan

Write a short plan per skill: what the job is now, what to cut, what the target generation needs added. Then run `CreateSkill:ImproveSkill` against the plan, and `CreateSkill:TestSkill` in comparison mode: the baseline agent runs the **previous version** of the skill (from `git show HEAD:<path>`) instead of no skill. Keep the new version only if it wins or ties on every prompt; otherwise restore it and record why in the report.

## Step 4: Validate and stamp

```bash
bun Tools/ModelUpgrade.ts stamp <Skill>... --target <id>   # each skill that passed
./gen-manifest.sh                            # skills.json + llms.txt + chain check
```

Run `CreateSkill:ValidateSkill` on every touched skill. Update the report rows with what was applied.

## Step 5: Ship

One PR for the run via `GitHubOps:PullRequest`: the report linked, one commit per skill or per kind of fix, the retire/rename questions repeated for the owner.

## Gotchas

- Never delete or rename a skill here without the owner's explicit yes.
- One finding per edit, so a reviewer can take hunks selectively.
- If an edit regresses in A/B, re-add the instruction in its simplest form and re-test; don't restore the verbose original.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"ModelUpgrade","workflow":"Apply","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
