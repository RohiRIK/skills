---
type: Workflow
title: Library-wide audit
description: Whole-library health sweep — agentic readiness, telemetry, canon, repo hygiene.
tags: [maintain-library]
chain: "SkillForge → CreateSkill:CanonicalizeSkill ×offenders → GitHubOps:RepoHygiene → GitHubOps:CommitPush"
---

# Workflow: library-audit

Whole-library health sweep. Periodic.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

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
