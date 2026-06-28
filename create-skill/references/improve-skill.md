# Improve Skill Workflow

Improve an existing skill based on test feedback, user observations, or quality concerns. The revision half of the test-iterate loop.

## Prerequisites

- Target skill exists and loads via `skill_view`
- Feedback available (from TestSkill, user observations, or quality audit)

## Steps

### Step 1: Gather Context

Read:
- The target `SKILL.md` + relevant reference files
- Test results (if from TestSkill)
- The user's specific feedback
- Transcripts (how the agent actually used the skill — where it wasted time or went wrong)

### Step 2: Diagnose the Problem

Classify each piece of feedback:

| Feedback | Root cause | Fix |
|----------|-----------|-----|
| "Output was wrong" | Unclear instructions | Rewrite for clarity |
| "Took too long" | Unproductive steps | Remove/simplify steps |
| "Missed edge case" | Coverage gap | Add handling |
| "Too rigid" | Over-specified | Explain the why instead |
| "Agents all wrote the same helper" | Missing bundled tool | Add script to `scripts/` |
| "Didn't trigger" | Description too narrow | Run optimize-description |

### Step 3: Apply the Writing Philosophy

From `references/writing-guidance.md`:
- **Explain the why, not just the what** — replace rigid rules with reasoning so the model adapts intelligently.
- **Keep it lean** — cut instructions that produce the same result whether followed or ignored, and defensive bloat that never triggers.
- **Generalize, don't overfit** — fix the underlying pattern, not the specific test prompt.
- **Bundle repeated work** — if test agents all wrote the same helper, add it to `scripts/`.

### Step 4: Make the Changes

Edit SKILL.md (instructions, description, routing) and reference files. Add `scripts/` scripts for identified repeated work. Keep lowercase-hyphens naming, correct structure, correct frontmatter, and routing-matches-files.

#### Step 4a: Update Gotchas

After every failure or improvement, update the `## Gotchas` section — the highest-value section in any skill. Capture:
- The specific failure that prompted this change
- API quirks found in testing
- Common mistakes
- Silent-failure edge cases

#### Step 4b: BPE Audit

For each instruction ask "would a smarter model make this unnecessary?" — YES means it compensates for a model limitation (consider removing); NO means it provides knowledge the model can't derive (keep). Focus on gotchas, tool wrappers, and consistency — not on telling the model how to think.

### Step 5: Verify and Next Steps

- From a TestSkill loop → return to TestSkill Step 3, rerun into `iteration-<N+1>/`.
- Standalone → suggest TestSkill to confirm the improvement helps.
- Description changed → suggest optimize-description.

## Anti-Patterns to Avoid

- Adding more MUSTs (reframe with reasoning instead)
- Overfitting to test cases
- Defensive bloat
- Reorganising files when the content is the problem
- Stating the obvious
- Model-limitation workarounds that become dead weight as models improve

## Exit Criteria

- Changes applied to SKILL.md and/or reference files
- Gotchas section updated with new lessons
- BPE audit passed for all instructions
- Next steps determined (re-test, optimize, or done)
