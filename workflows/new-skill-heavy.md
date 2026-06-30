---
type: Workflow
title: New skill — heavy
description: Author a complex, multi-workflow skill whose shape isn't obvious yet.
tags: [maintain-library, heavy]
chain: "IterativeDepth → Spec → CreateSkill → CreateSkill:TestSkill → Verify → GitHubOps:PullRequest"
---

# Workflow: new-skill-heavy

Author a complex, multi-workflow skill where the shape isn't obvious yet.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
IterativeDepth → Spec → CreateSkill → CreateSkill:TestSkill → Verify → GitHubOps:PullRequest
```

## Steps

1. **IterativeDepth** — 2–8 lens passes to surface hidden requirements / edge cases before committing a structure.
2. **Spec** — turn those into acceptance criteria.
3. **CreateSkill** — scaffold to canon.
4. **CreateSkill:TestSkill** — routing + value, incl. no false triggers vs. confusable siblings.
5. **Verify → PullRequest**.

## When to use

The skill spans many workflows, has tricky routing vs. siblings, or you're unsure of the shape. Simple skill → **new-skill-quick**.
