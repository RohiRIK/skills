# TestSkill Workflow

Test a skill's effectiveness by running it against real prompts and comparing with a no-skill baseline. The only way to know if a skill works is to run it on real prompts and compare outputs with and without it (Anthropic skill-creator methodology).

## Step 1: Identify the Skill Under Test

Read the target `SKILL.md`. Note its name, description, key workflows, and the expected behaviour change.

## Step 2: Create Test Prompts

Generate 2-4 realistic test prompts — the kind a real user would type that should invoke this skill. Share them with the user before running.

Good prompts are **realistic** (something a user would actually type), **substantive** (complex enough that a skill helps — trivial one-liners may not trigger), **diverse** (cover different aspects), and **specific** (concrete paths, names, context).

- Bad: `"Format this data"`
- Good: `"I have a CSV in ~/Downloads/q4-sales.csv with revenue in column C and costs in D — add a profit-margin % column and flag margins below 15%"`

## Step 3: Run Test Prompts (With-Skill + Baseline)

Workspace: `~/.claude/state/skill-test-<skillname>/iteration-<N>/`

For each test prompt, spawn TWO Agent subagents in the same turn so they run in parallel:

**With-Skill agent:**
```
Read this skill file FIRST, then use its instructions to do the task.
Skill file: <absolute path to SKILL.md>
Task: <test prompt>
Save final output to: <workspace>/test-<N>/with-skill/output.md
Save a brief transcript (steps, tools, decisions) to: <workspace>/test-<N>/with-skill/transcript.md
```

**Baseline agent (no skill):**
```
Accomplish this task using your general capabilities. Do NOT read any skill files.
Task: <test prompt>
Save final output to: <workspace>/test-<N>/baseline/output.md
Save a brief transcript to: <workspace>/test-<N>/baseline/transcript.md
```

Use `run_in_background: true`; launch all with-skill + baseline pairs at once.

## Step 4: Compare Results

For each prompt, read both outputs + both transcripts and assess the delta:

```
### Test <N>: "<prompt summary>"
With Skill:    approach + quality
Baseline:      approach + quality
Verdict:       helped significantly / helped marginally / no difference / baseline better
Why:           specific reasons
```

## Step 5: Collect Feedback

Ask the user: which output they preferred and why, what the skill got wrong, what it should do differently. Empty feedback = it was fine.

## Step 6: Iterate or Complete

- **Improvements needed** → run `Workflows/ImproveSkill.md` with the feedback, then rerun into `iteration-<N+1>/` and compare.
- **Skill looks good** → report results, suggest `Workflows/OptimizeDescription.md` for reliable triggering.
- **No improvement over baseline** → the skill may not be needed or needs fundamental rethinking; discuss with the user (BPE signal).

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateSkill","workflow":"TestSkill","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
