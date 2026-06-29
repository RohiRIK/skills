# Workflow: new-skill-heavy

Author a complex, multi-workflow skill where the shape isn't obvious yet.

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
