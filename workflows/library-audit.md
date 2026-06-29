# Workflow: library-audit

Whole-library health sweep. Periodic.

```
SkillForge(audit agentic + telemetry) → CreateSkill:CanonicalizeSkill ×offenders → GitHubOps:RepoHygiene → GitHubOps:CommitPush
```

## Steps

1. **SkillForge** — audit the whole library for agentic readiness; instrument telemetry in bulk. Flags skills missing `## Gotchas`, telemetry lines, or with autonomy gaps.
2. **CanonicalizeSkill** — fix each flagged skill (→ **canonicalize-skill**).
3. **GitHubOps:RepoHygiene** — repo sweep (stale branches, secret/path scan, `.gitignore` gaps, manifest drift).
4. **CommitPush**.

## Cadence

Monthly, or after landing 3+ new skills. Cutting a version afterward → **release**.
