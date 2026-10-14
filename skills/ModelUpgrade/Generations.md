# ModelUpgrade — Generations ledger

One entry per model generation the library has been tuned against, **newest first**. The first `## <id>` heading is the current generation: `Tools/ModelUpgrade.ts` reads it, `stamp` writes it into `tuned-for:`, and `baseline` flags every skill tuned for anything older.

Each entry records what changed for **skill text** (not API code) and what to do about it. The `Assess` workflow adds a new entry at the top when a new generation ships, from the vendor's own release notes and migration guides; cite them and date the entry. Older entries stay as history: they say which instructions were workarounds for which model, so a later audit knows what is safe to remove.

The ledger is Claude-first because the library's skills are authored for Claude (`Prompting/vendors/Claude.md`). When a skill targets another vendor, add a `## <vendor>-<version>` entry for it the same way.

---

## claude-5.5 — 2026-10 · Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1

Sources: Anthropic model-migration and prompt-audit guides as bundled with the `claude-api` skill (models table cached 2026-10-06). Claude Opus 5.5 is the default model; Fable 5.1 is the most capable.

What changed for skill text:
- **Thinking is always on** (Opus 5.5, Fable 5.1) and **effort** is the depth control (Opus 5.5 defaults to `medium`). Prose that steers thinking ("think step by step", "think harder", "don't overthink", "answer without deliberating") is dead weight or unfollowable. Depth belongs to the `effort` frontmatter and the host's settings.
- **Prompts written for older models are often too prescriptive** and lower output quality. State the goal, the constraints, and how to verify; keep numbered steps only where order is fragile (destructive operations, auth, release steps).
- **Instruction following is close and literal.** Hedges ("try to", "if possible") are read as permission to skip; caps emphasis over-applies. Pressure language belongs only on real safety or irreversibility gates.
- **Less formatting by default** (Fable 5.1 especially). Anti-formatting rules now strip structure readers wanted.
- **Fewer user-facing updates during long tool chains.** "Don't narrate" / "hold all findings" lines make it go quiet; say when updates are wanted instead.
- **Reasoning reproduction can be refused.** "Show your reasoning" sections or `reasoning` fields in an output schema can trigger a `reasoning_extraction` refusal; ask for a short explanation of the answer.
- **Delegation reverses again.** Fable 5.1 delegates well and benefits from asynchronous sub-agents; Opus 5-era "delegate rarely" caps may now under-use it. Keep spawn ceilings, drop blanket discouragement, and say *when* delegation helps.
- **Verification is generation-dependent.** Delete Opus 5-era "add a final verification step" scaffolding on Opus 5.5 only after re-testing; on Fable 5.1 keep "test before reporting" lines. Real gates (the `Verify` skill) are not scaffolding.
- **Vision needs less scaffolding.** Opus 5.5 reads charts, diagrams, and screenshots precisely without crop/OCR pre-passes; keep crop and zoom tools for the densest inputs.
- **Frontend direction works best as named defaults to avoid** (cream backgrounds, italic accent words, "01/02/03" labels, monospace labels, pill buttons), not "avoid a generic AI look".
- **Search triggering at low effort.** Models answer from memory more at `low`; skills about fast-moving tools should say to verify names and versions against a live source.
- API-level facts that skill text sometimes repeats: assistant prefill and `budget_tokens` return errors on 4.6+ and 5.x; forced `tool_choice` (`any`/`tool`) errors on Opus 5.5, Sonnet 5.5, and Fable 5.1; Sonnet 5.5 turns thinking off only via `between_tools`.

## claude-5 — 2026 · Opus 5, Sonnet 5, Fable 5

- Thinking on by default for Opus 5; disabling it is capped at `high` effort and can leak tool calls into visible text.
- Longer responses and more narration; conciseness instructions work, effort does not change visible length.
- **Over-verification:** Opus 5 self-verifies unprompted; "add a verification step" and "use a subagent to verify" instructions cause extra work. Same for per-prompt "double-check your answer".
- **Scope expansion:** adds unrequested steps; a "deliver what was asked, at the scope intended" instruction fixes it.
- **Delegates readily** (the opposite of Opus 4.8); "delegate more" guidance written for 4.8 should come out.
- Narrates its own corrections at length.

## claude-4.7 — 2026 · Opus 4.7, Opus 4.8

- Effort gains `xhigh` (the best setting for most coding and agentic work); `budget_tokens` and sampling parameters removed; thinking display defaults to omitted.
- Opus 4.8 under-reached for subagents and needed prompting to delegate.
- Severity filters ("only report high-severity issues") depress recall: the model follows them literally. Ask for everything with confidence and severity, then filter in a separate pass.

## claude-4.6 — 2026 · Opus 4.6, Sonnet 4.6

- Adaptive thinking replaces fixed budgets; effort becomes the main lever.
- Explores more at high effort; spawns subagents eagerly; may skip the summary after tool use.
- Defaults to LaTeX for math unless told otherwise.

## claude-4.5 — 2025 · Opus 4.5, Sonnet 4.5, Haiku 4.5

- **Follows the system prompt much more closely than earlier models.** Text written to overcome older models' reluctance ("CRITICAL: You MUST use this tool", "If in doubt, use X", "Default to X") now over-triggers. This is the origin of the library's rule to reserve `CRITICAL` / `MUST` / `NEVER` for real gates.
- Over-engineers: extra files, abstractions, and defensive error handling unless told to keep changes minimal.
- With thinking disabled, the word "think" nudges extra reasoning; "consider" and "evaluate" are neutral.
