# Workflow: new-skill-quick

Author a new skill, clear scope, single capability. Daily path.

```
Prompting → CreateSkill(scaffold) → CreateSkill:TestSkill → /simplify → GitHubOps:CommitPush
```

## Steps

1. **Prompting** — word the description (WHAT + USE WHEN ≤30 words) and gotchas first. The description is the router.
2. **CreateSkill** — classify against the 9 types (`Taxonomy.md`), scaffold TitleCase dir + `SKILL.md` + `Workflows/`, born with `category`/`effort`, `## Gotchas`, telemetry line.
3. **CreateSkill:TestSkill** — prove it routes and helps.
4. **/simplify** — keep SKILL.md ≤50 lines.
5. **GitHubOps:CommitPush** — ship.

## Done when

- [ ] ValidateSkill passes
- [ ] README row added + `gen-manifest.sh` re-run (skills.json + llms.txt synced)

## When to use

One clear capability, 1–2 workflows. Complex/multi-workflow skill → **new-skill-heavy**.
