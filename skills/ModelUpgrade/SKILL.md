---
name: ModelUpgrade
description: "Re-tune skills for any model, current or named: judge relevance and fit, then reprompt, replan, or retire. USE WHEN switching models, a model ships, or skills feel dated."
category: meta
effort: high
domain: meta
tuned-for: claude-5.5
tuned-on: 2026-10-16
---

# ModelUpgrade

Skills are per-model artifacts: a line that helps one model can be dead weight, or harmful, on another. ModelUpgrade tunes the library to whichever model you work with, of any vendor. Each skill records the models it was judged against (`tuned-for: claude-5.5, gpt-5.5`, one id per family); `Generations.md` records what each generation changed for skill text. NOT FOR agentic-readiness audits (use `SkillForge`).

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Adapt** | "tune my skills for the model I'm using", "adapt the skills to <model>", switching models | `Workflows/Adapt.md` |
| **Watch** | "is there a new model?", scheduled check-in | `Workflows/Watch.md` |
| **Assess** | "a new model shipped", "which skills are outdated?", "audit for <model>" | `Workflows/Assess.md` |
| **Apply** | "apply the upgrade report", "reprompt these skills" | `Workflows/Apply.md` |

## Quick Reference

- `bun Tools/ModelUpgrade.ts resolve <model>`: host model name → ledger id; exit 1 means add a ledger entry first.
- `bun Tools/ModelUpgrade.ts baseline --target <id|model>`: who is tuned for that model; `--check` exits 1 if any are behind.
- `bun Tools/ModelUpgrade.ts scan`: dated-prompt leads per skill from `Signals.md`, with `file:line`.
- `bun Tools/ModelUpgrade.ts stamp <Skill>... --target <id>`: record a pass, keeping other families' stamps.
- `Rubric.md`: relevance, fit, the multi-model rule, verdicts `keep · reprompt · replan · retire`. Reports go to `reports/ModelUpgrade/`.

## Gotchas

- A scan hit is a lead. Gates (`Verify`, "never send"), house rules, and quoted bad examples stay; judge each hit in context.
- Tuning for one model must not regress another the skill is stamped for: model-neutral fixes go in the skill, model-specific advice in `Prompting/vendors/<Vendor>.md` (`Rubric.md` §3).
- Retiring or renaming a skill is the owner's decision; Assess proposes it, Apply never deletes on its own.
- Stamp only after the skill was judged (and, for replans, A/B tested on the target model). A stamp is the claim that it fits.
- Ledger entries come from the vendor's own release notes or prompting guide, dated and cited; never from memory.

## Examples

```
User: "adapt my skills to the model I'm on"
→ Adapt: identify the running model → resolve → (new? add ledger entry) → Assess → Apply → PR
```
```
User: "a new Claude model shipped, update the skills"  → Watch → Assess → Apply → PR
```
