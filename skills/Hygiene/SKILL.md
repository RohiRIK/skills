---
name: Hygiene
description: "Audit ~/.claude for git, skill, code, and rules hygiene issues. USE WHEN auditing the Claude config, checking harness health, or cleaning up skills/hooks/rules."
category: quality
effort: medium
disable-model-invocation: true
argument-hint: [--fix]
allowed-tools: Bash(bun:*), Bash(git:*), Read, Edit
---

# Hygiene

Audits `~/.claude` across 5 dimensions and auto-fixes safe problems.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **RunHygiene** | `/hygiene` | `Workflows/RunHygiene.md` |
| **AutoFix** | `/hygiene --fix` | `Workflows/AutoFix.md` |

## What It Checks

| Domain | Tool | Key Detections |
|--------|------|----------------|
| Git | `Tools/CheckGit.ts` | Uncommitted files, tracked symlinks/runtime dirs, hardcoded paths |
| Skills | `Tools/CheckSkills.ts` | Broken links, missing SKILL.md, orphaned skills, bad frontmatter |
| Code | `Tools/CheckCode.ts` | `console.log`, `npm`/`pip`, `: any`, file size violations |
| Rules | `Tools/CheckRules.ts` | CLAUDE.md ↔ rules/ drift, orphaned rules, broken refs |

## Examples

**Example 1: Run the full audit**
```
User: "/hygiene"
→ Runs all 4 checks in parallel
→ Prints grouped [ERROR]/[WARN]/[INFO] report
→ Prompts to auto-fix if safe fixes available
```

**Example 2: Auto-fix safe issues**
```
User: "/hygiene --fix"
→ Runs report, applies gitignore + rm-cached fixes
→ Commits result as "chore: hygiene auto-fix"
```

## Reference

Issue taxonomy: read `Reference/Rules.md` with the Read tool when classifying issues

## Gotchas

- Repo hygiene is not a build gate — for build/type/test correctness use `Verify`; this skill audits git/skill/code/rules hygiene of `~/.claude`.
- Report before auto-fixing; some "issues" are intentional local config.

## Examples

**Example 1: Health check**
```
User: "check my ~/.claude hygiene"
→ RunHygiene → flags stale symlinks, malformed skills, rule drift
```

**Example 2: Auto-fix**
```
User: "fix the safe ones"
→ AutoFix → applies low-risk fixes, lists the rest
```
