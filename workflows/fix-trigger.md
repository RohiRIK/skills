# Workflow: fix-trigger

A skill won't activate (or mis-fires). Repair its routing.

```
CreateSkill:OptimizeDescription → CreateSkill:TestSkill → GitHubOps:CommitPush
```

## Steps

1. **OptimizeDescription** — run ~20 should/shouldn't queries, then rewrite the `description` (WHAT + USE WHEN; add `NOT FOR` against confusable siblings).
2. **TestSkill** — confirm it routes on every should-query and none of the shouldn't-queries.
3. **CommitPush** — re-run `gen-manifest.sh` if frontmatter changed.

## When to use

Skill exists and is structurally fine but doesn't trigger when expected, or triggers on the wrong prompts. Structure broken → **canonicalize-skill**.
