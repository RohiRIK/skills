---
type: Workflow
title: Model upgrade
description: Re-tune the library when a new model generation ships — relevance and fit per skill, then reprompt, replan, or retire.
tags: [maintain-library]
chain: "ModelUpgrade:Watch → ModelUpgrade:Assess → ModelUpgrade:Apply → CreateSkill:ValidateSkill → GitHubOps:PullRequest"
---

# Workflow: model-upgrade

Skills are per-model artifacts. When a new model generation ships, or you switch to another model (any vendor), check every skill: is its job still worth a skill, and is its text tuned for that model?

For the model you are using now, or one you name, start at **ModelUpgrade:Adapt** instead of Watch: it identifies the model, resolves it against the ledger (adding an entry if it is new), then runs the same Assess → Apply steps.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill to invoke** (load it with the Skill tool), not prose to summarize. Resolve each name to its skill and let it do the work.

```
ModelUpgrade:Watch → ModelUpgrade:Assess → ModelUpgrade:Apply → CreateSkill:ValidateSkill → GitHubOps:PullRequest
```

## Steps

1. **Watch** — confirm a generation newer than the head of `ModelUpgrade/Generations.md` exists, from the vendor's own listing. Nothing new → stop.
2. **Assess** — add the ledger entry (sourced, dated), run `ModelUpgrade.ts scan` and `baseline`, judge each skill with `Rubric.md`, write `reports/ModelUpgrade/<date>-<generation>.md`.
3. **Apply** — reprompt the flagged lines; replan with `CreateSkill:ImproveSkill` and an A/B `CreateSkill:TestSkill` (old version vs new); stamp the target into `tuned-for` on what passes (one id per model family, so other families' stamps stay). Retire and rename only with the owner's yes.
4. **ValidateSkill** — every touched skill still meets the canon.
5. **PullRequest** — one PR with the report linked.

## Cadence

Every new frontier model generation, and a monthly `Watch`. Run `library-audit` afterwards if the report lists canon drift.
