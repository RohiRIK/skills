# Audit — the 4-phase context budget

Token estimation: `words × 1.3` for prose, `chars / 4` for code-heavy files.

## Phase 1: Inventory

- **Agents** (`agents/*.md`) — tokens per file; flag >200 lines (heavy) and description >30 words (frontmatter loads into every Task invocation).
- **Skills** (`skills/*/SKILL.md`) — tokens per SKILL.md; flag >400 lines; skip identical copies in `.agents/skills/` to avoid double-counting.
- **Rules** (`rules/**/*.md`) — tokens per file; flag >100 lines; detect overlap between rule files in the same module.
- **MCP servers** (`.mcp.json` / active config) — server + tool counts; ~500 tokens per tool schema; flag servers >20 tools and servers wrapping free CLI commands (`gh`, `git`, `npm`, `supabase`, `vercel`).
- **CLAUDE.md chain** (project + user) — tokens per file; flag combined >300 lines.

## Phase 2: Classify

| Bucket | Criteria | Action |
|--------|----------|--------|
| Always needed | Referenced in CLAUDE.md, backs an active command, matches project type | Keep |
| Sometimes needed | Domain-specific, not referenced in CLAUDE.md | On-demand activation |
| Rarely needed | No command reference, overlapping, no project match | Remove or lazy-load |

## Phase 3: Detect Issues

- Bloated agent descriptions (>30 words — always-on cost) · heavy agents (>200 lines per spawn)
- Redundant components — skills duplicating agent logic, rules duplicating CLAUDE.md
- MCP over-subscription — >10 servers, or CLI-wrappers
- CLAUDE.md bloat — verbose explanations, outdated sections, instructions that belong in rules

## Phase 4: Report

```
Context Budget Report
Total estimated overhead: ~XX,XXX tokens
Effective available context: ~XXX,XXX tokens (XX%)

Component Breakdown: agents N ~X,XXX · skills N ~X,XXX · rules N ~X,XXX ·
                     MCP tools N ~XX,XXX · CLAUDE.md N ~X,XXX

Issues Found (N): [ranked by token savings]
Top 3 Optimizations: 1) [action] → save ~X,XXX  2) …  3) …
Potential savings: ~XX,XXX tokens (XX% of overhead)
```

Verbose mode adds: per-file token counts, line breakdown of heaviest files, side-by-side duplicated rule lines, MCP tool list with per-tool schema sizes.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"ContextBudget","workflow":"Audit","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
