# Test Skill Workflow

Test a skill's effectiveness by running it against real prompts and comparing with a no-skill baseline. The only way to know if a skill works is to run it on real prompts and compare outputs with and without it (Anthropic skill-creator methodology).

## Prerequisites

- Target skill exists and loads via `skill_view`
- User has approved testing

## Steps

### Step 1: Identify the Skill Under Test

Read the target `SKILL.md`. Note its name, description, key workflows, and the expected behaviour change.

### Step 2: Create Test Prompts

Generate 2-4 realistic test prompts — the kind a real user would type that should invoke this skill. Share them with the user before running.

Good prompts are **realistic** (something a user would actually type), **substantive** (complex enough that a skill helps — trivial one-liners may not trigger), **diverse** (cover different aspects), and **specific** (concrete paths, names, context).

- Bad: `"Format this data"`
- Good: `"I have a CSV in ~/Downloads/q4-sales.csv with revenue in column C and costs in D — add a profit-margin % column and flag margins below 15%"`

### Step 3: Run Test Prompts (With-Skill + Baseline)

For each test prompt, spawn TWO subagents in the same batch so they run in parallel:

**With-Skill subagent:**
```
Read this skill file FIRST, then use its instructions to do the task.
Skill file: <absolute path to SKILL.md>
Task: <test prompt>
Save final output to: <workspace>/test-<N>/with-skill/output.md
Save a brief transcript (steps, tools, decisions) to: <workspace>/test-<N>/with-skill/transcript.md
```

**Baseline subagent (no skill):**
```
Accomplish this task using your general capabilities. Do NOT read any skill files.
Task: <test prompt>
Save final output to: <workspace>/test-<N>/baseline/output.md
Save a brief transcript to: <workspace>/test-<N>/baseline/transcript.md
```

Use `delegate_task` to spawn both subagents. Launch all with-skill + baseline pairs at once.

### Step 4: Compare Results

For each prompt, read both outputs + both transcripts and assess the delta:

```
### Test <N>: "<prompt summary>"
With Skill:    approach + quality
Baseline:      approach + quality
Verdict:       helped significantly / helped marginally / no difference / baseline better
Why:           specific reasons
```

### Step 5: Collect Feedback

Ask the user: which output they preferred and why, what the skill got wrong, what it should do differently. Empty feedback = it was fine.

### Step 6: Iterate or Complete

- **Improvements needed** → run `references/improve-skill.md` with the feedback, then rerun into `iteration-<N+1>/` and compare.
- **Skill looks good** → report results, suggest `references/optimize-description.md` for reliable triggering.
- **No improvement over baseline** → the skill may not be needed or needs fundamental rethinking; discuss with the user (BPE signal).

## Exit Criteria

- All test prompts executed with both with-skill and baseline variants
- Results compared with clear verdicts per prompt
- User feedback collected
- Next steps determined (iterate, optimize, or retire)
