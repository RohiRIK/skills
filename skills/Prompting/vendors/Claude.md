---
type: documentation
category: methodology
description: Claude-specific prompting addendum. Layer on top of Core.md when the target model is Claude. Covers XML steering, imperative calibration, thinking and effort, de-prescription, multi-context, vision.
---

# Vendor Addendum — Claude

Opt-in. Apply on top of `Core.md` when the target model is Claude. Written for the current generation (the head of `ModelUpgrade/Generations.md`, Claude 5.5 family as of 2026-10). Where behaviour differs by model, it is written as a conditional; the per-generation history of what changed lives in that ledger, not here.

## XML Steering (Claude parses XML tags well)

Claude is trained to recognize XML-style tags as structure. Use them to delimit distinct parts of a prompt — they reduce the chance Claude confuses instructions with context or examples.

```xml
<instructions>
Summarize the document for an executive audience.
</instructions>

<document>
{{document_text}}
</document>

<output_format>
Three bullet points, each one sentence.
</output_format>
```

Guidance:
- Use XML tags to separate instructions, context, examples, and input — especially in long prompts.
- Tag names are arbitrary; be consistent and descriptive (`<document>`, `<example>`, `<scratchpad>`).
- Markdown and XML coexist — Markdown for prose/headings inside a block, XML to delimit blocks. Neither is mandatory; use whichever makes the structure clearest.
- This supersedes any older "Markdown only / never use XML" guidance.

## Imperative Calibration (avoid overtriggering)

Claude models since the 4.5 generation follow the prompt closely and overtrigger on forceful language — they over-call tools and over-apply rules when prompts shout. Calibrate force to genuine stakes.

| Instead of | Use |
|------------|-----|
| "CRITICAL: You MUST use this tool when…" | "Use this tool when…" |
| "ALWAYS read the file first" | "Read the file before answering" |
| "NEVER do X" | "Do Y instead" (positive framing) |

Reserve `CRITICAL` / `MUST` / `NEVER` for genuine safety or irreversibility gates (secrets handling, destructive operations, data loss). Everywhere else, normal declarative phrasing steers better and avoids over-eager behaviour.

## Thinking and Effort

Current Claude models think natively; on Opus 5.5 and Fable 5.1 thinking is always on. **Effort** (`low` → `max`) sets how deeply they think, so depth is a configuration choice (a skill's `effort` field, the host's settings), not prose.

- Ask for the answer and let thinking handle the reasoning. Delete "think step by step", "think harder", "don't overthink": redundant at best, and a "don't think" rule can't be followed where thinking is always on.
- Don't ask the model to write out its reasoning in the output or in a `reasoning` field; on Claude 5-family models that can be declined as reasoning extraction. Ask for a short explanation of the answer instead.
- Only where thinking is genuinely off (a Sonnet 5.5 route on `between_tools`), the word "think" still nudges extra reasoning; "consider" and "evaluate" are neutral there.

## Goals Over Choreography

Skills and prompts written for older models are often too prescriptive for current ones and lower output quality. State the goal, the constraints, and how success is checked; let the model plan. Keep exact, ordered steps where only one sequence is safe (destructive commands, auth, releases, file formats). Give the reason behind a constraint, and the larger purpose of the task: current models use intent to fill gaps well.

## Multi-Context / Long-Horizon Work

- Current models have a 1M-token context window; Claude tracks remaining context and the host compacts near the limit — design long tasks to resume from filesystem state rather than relying on a single unbroken context.
- Persist state externally: JSON for structured data (tests, schemas), text for notes, git for checkpoints across sessions.
- A fresh context that rediscovers state from disk often beats a degraded, over-compacted one.
- For complex tasks: "Spend your entire output context working on the task."

## Tool & Agent Design

- Give each tool a single clear purpose and a description that says *when* to use it — not a forceful command to always use it.
- Delegation appetite changes between generations (Opus 4.8 under-delegated, Opus 5 over-delegated, Fable 5.1 delegates well and benefits from asynchronous sub-agents). Say *when* delegation helps ("independent, sizeable tracks; not a few reads or edits") rather than pushing or forbidding it, and keep a hard cap on parallel spawns.
- Each subagent gets minimal, task-specific context and an explicit success criterion.
- Don't discourage tool use in general ("only use tools when strictly necessary"): it is followed literally and the model answers from stale knowledge. Say when a live source must be checked, especially for fast-moving names (models, tools, versions).

## Parallel Execution

"If calling multiple tools with no dependencies between them, make all independent calls in parallel. Call sequentially only when one result feeds the next. Never guess parameters."

## Vision

Claude reads charts, diagrams, and screenshots precisely without pre-passes (Opus 5.5 especially); drop step-by-step chart-reading or OCR scaffolding. For the densest material (technical drawings, tiny chart labels), a crop/zoom tool and higher-resolution input still add accuracy. Break video into frames for analysis.

## Quick Transformations

| ❌ Avoid | ✅ Use |
|----------|--------|
| "CRITICAL: You MUST use this tool" | "Use this tool when…" |
| "Don't use markdown" | "Write in flowing prose paragraphs" |
| "NEVER do X" | "Do Y instead" |
| "Think step by step" / "think harder" | *(delete; set effort instead)* |
| "Show your reasoning" in the output | "Briefly explain the answer" |
| "Never use bullets" | Say when lists help, e.g. "Use a list for 3+ parallel items" |
| Forceful rule on a non-safety instruction | Plain declarative phrasing |

## Current-Generation Behavioural Notes

- **Quieter during long tool chains.** Current models write fewer user-facing updates mid-task. Remove "don't narrate" / "hold all findings" lines first; if you want updates, say when ("before you start, say in a line what you'll do; close with a recap that stands on its own").
- **Less formatting by default.** Anti-formatting rules written for older, bullet-heavy models now strip structure readers want. Replace them with a rule for when formatting helps.
- **Literal hedges.** "Try to" and "if possible" are read as permission to skip. If it is required, say so plainly.
- **Verification is generation-dependent.** Opus 5 over-verified when told to double-check; Fable 5.1 benefits from "test before reporting". Keep real gates (a `Verify` step, a test run), drop per-prompt "re-check your answer" lines unless an A/B shows they help.
- **Scope.** Current models can widen a task; "deliver what was asked, at the scope intended; suggest extras at the end" holds them to it.
- **Frontend direction.** Name the specific defaults to avoid (cream backgrounds, italic accent words, "01/02/03" labels, monospace labels, pill buttons); "avoid a generic AI look" just swaps one default for another.
- **Example sensitivity.** Claude matches the length, tone, and structure of examples closely. Make every example match the desired output; vary them when you want range.

## References

- Anthropic: "Claude 4 Best Practices" — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices
- Anthropic: model-migration and prompt-audit guides (bundled with the `claude-api` skill; per-model behavioural shifts for the 4.6 → 5.5 generations)
- Anthropic: "Use XML tags to structure your prompts" — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/use-xml-tags
- Anthropic: "Extended thinking tips" — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips
