# Workflow: canonicalize-skill

Fix a skill's structure to conform to canon.

```
CreateSkill:ValidateSkill → CreateSkill:CanonicalizeSkill → GitHubOps:CommitPush
```

## Steps

1. **ValidateSkill** — report violations: naming, missing frontmatter, no `## Gotchas`, SKILL.md >50 lines, dangling/orphaned workflow refs.
2. **CanonicalizeSkill** — fix them: relocate over-budget detail into context files, wire orphaned files into routing, re-sync the manifest.
3. **CommitPush**.

## Example

CreateMcp SKILL.md was 74 lines → relocated dupe Pipeline/Decide sections + examples → 48 lines, canon-compliant.

## When to use

Skill is structurally broken or drifted from canon. Skill that won't *trigger* → **fix-trigger** instead.
