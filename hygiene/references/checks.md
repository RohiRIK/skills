# Hygiene Checks

## What It Checks

| Domain | Tool | Key Detections |
|--------|------|----------------|
| Git | `scripts/check-git.ts` | Uncommitted files, tracked symlinks/runtime dirs, hardcoded paths |
| Skills | `scripts/check-skills.ts` | Broken links, missing SKILL.md, orphaned skills, bad frontmatter |
| Code | `scripts/check-code.ts` | `console.log`, `npm`/`pip`, `: any`, file size violations |
| Rules | `scripts/check-rules.ts` | CLAUDE.md ↔ rules/ drift, orphaned rules, broken refs |

## Reference

Issue taxonomy: `SkillSearch('hygiene rules')` → loads `references/rules.md`

## Detailed Examples

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
