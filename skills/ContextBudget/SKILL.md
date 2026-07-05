---
name: ContextBudget
description: "Audit Claude Code context-window consumption across agents, skills, MCP servers, and rules, and produce prioritized token-savings recommendations. USE WHEN context feels bloated or you want to cut token usage."
category: meta
effort: medium
---

# ContextBudget

Analyze token overhead across every loaded component in a Claude Code session and surface actionable optimizations. Run after adding agents/skills/MCP servers to catch creep early, or when output quality degrades.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **Audit** | "/context-budget", "context feels bloated", "how much headroom do I have", "do I have room for N more servers" | `Workflows/Audit.md` |

Modes: default report · `--verbose` (per-file breakdown, per-tool MCP sizes) · pre-expansion check (project the cost of proposed additions before installing).

## Quick Reference

- MCP is the biggest lever: each tool schema ≈500 tokens — a 30-tool server outweighs all skills combined.
- Agent `description` fields are always-on — present in every Task context even if never invoked.
- Estimation: `words × 1.3` prose, `chars / 4` code.

## Gotchas

- Measure before cutting — a skill's frontmatter cost (always loaded) differs from its body cost (loaded on invocation); target always-on consumers first.
- Disabling a skill that another skill composes with breaks the dependent — check the composition map (CLAUDE.md) before recommending removal.
- Verbose mode is for pinpointing offenders, not regular audits.

## Examples

**Example 1:** `/context-budget` → 16 agents (12.4k), 28 skills (6.2k), 87 MCP tools (43.5k) → top saving: drop 3 CLI-replaceable MCP servers, −27.5k tokens.

**Example 2:** "I want to add 5 MCP servers, do I have room?" → projects ~25k added tokens → recommends removing 2 CLI-wrappers first to stay under 40% overhead.
