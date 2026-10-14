---
name: ModelUpgrade
description: "Re-tune skills for a new model generation: judge relevance and fit, then reprompt, replan, or retire. USE WHEN a new model ships or skills feel dated. NOT FOR agentic-readiness audits (use SkillForge)."
category: meta
effort: high
domain: meta
tuned-for: claude-5.5
tuned-on: 2026-10-14
---

# ModelUpgrade

Skills are per-model artifacts: a line that was load-bearing on one generation is dead weight on the next. ModelUpgrade keeps the library tuned to the current frontier model. Each skill records the generation it was last tuned for (`tuned-for` / `tuned-on` frontmatter); `Generations.md` records what changed between generations and what that means for skill text.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Watch** | "is there a new model?", scheduled check-in | `Workflows/Watch.md` |
| **Assess** | "a new model shipped", "which skills are outdated?", "audit for <model>" | `Workflows/Assess.md` |
| **Apply** | "apply the upgrade report", "reprompt these skills" | `Workflows/Apply.md` |

## Quick Reference

- `bun Tools/ModelUpgrade.ts baseline` — every skill's `tuned-for` vs the newest ledger entry; `--check` exits 1 if any are behind.
- `bun Tools/ModelUpgrade.ts scan` — dated-prompt leads per skill from `Signals.md`, with `file:line`.
- `bun Tools/ModelUpgrade.ts stamp <Skill>...` — write `tuned-for` / `tuned-on` after a skill passes.
- `Rubric.md` — relevance + fit questions, the keep list, verdicts `keep · reprompt · replan · retire`.
- Reports land in `reports/ModelUpgrade/<date>-<generation>.md`.

## Gotchas

- A scan hit is a lead. Gates (`Verify`, "never send"), house rules, and quoted bad examples stay; judge each hit in context.
- Cruft is relative to a model, not to length. A clean skill gets no edits, only a stamp.
- Retiring or renaming a skill is the owner's decision; Assess proposes it, Apply never deletes on its own.
- Stamp only after the skill was actually judged (and, for replans, A/B tested). A stamp is the claim that it fits.
- Ledger entries come from the vendor's own release notes or migration guide, dated and cited; never from memory.

## Examples

```
User: "a new Claude model shipped, update the skills"
→ Watch confirms it → Assess adds the ledger entry, scans, judges every skill → report
→ Apply reprompts the flagged skills, A/B tests replans, stamps passes → PR
```
```
User: "which of my skills are still relevant?"
→ Assess against the current ledger head → keep / reprompt / replan / retire table
```
