# Writing Guidance

How to write skill instructions that actually help. Derived from Anthropic's skill-creator methodology and Thariq Shihipar's "Lessons from Building Claude Code" (Mar 2026).

## Core Principles

- **Don't state the obvious.** The model is competent at programming and knows codebases. Focus on what **breaks its default patterns** — things it gets wrong without guidance. Test: "Would the model do this wrong without being told?" If not, remove it.
- **Explain the why, not just the what.** Models with good theory of mind and clear reasoning outperform models under rigid constraints. Instead of "ALWAYS use 3 bullets", explain why bullets matter for the audience.
- **Keep it lean.** The context window is a public good. Remove instructions that don't improve output. If test transcripts show wasted steps, cut them. SKILL.md stays ≤ 50 lines; move detail to context files.
- **Generalize, don't overfit.** Fix underlying patterns, not specific test failures — the skill runs on many prompts beyond your test set.
- **Bundle repeated work.** If test agents independently wrote similar helper scripts, add that script to `scripts/` so every future invocation benefits.
- **Set appropriate degrees of freedom.** Match specificity to task fragility — migrations need exact commands; reviews need general direction.
- **Don't over-constrain.** Skills are reused heavily; leave flexibility for different contexts.

## Description Best Practices

- **Descriptions are for models, not humans.** The description is injected into the system prompt; the model reads it to decide whether to invoke the skill. It is the router.
- **Be slightly pushy.** Models undertrigger. Name specific scenarios even when the user may not mention the skill.
- **Include negative triggers for confusable skills.** Add `NOT FOR …` clauses when skills share vocabulary (e.g. `NOT FOR TypeScript CLI generation (use create-cli)`).
- Lead with WHAT, then the `Use when` trigger. Stay ≤ 30 words (hard ceiling 1024 chars).

### Description Format by Context

| Context | Format | Example |
|---------|--------|---------|
| Passive reference | WHAT as a noun phrase (trigger implicit) | `"Reference for Docker Compose patterns."` |
| User-command only | WHAT as an imperative (trigger implicit) | `"Run E2E tests for the current project."` |
| Auto-trigger (default) | `"[WHAT]. Use when [trigger]."` | `"Vendor-agnostic prompt-engineering library. Use when authoring a prompt, skill, or agent instruction."` |

**Never:**
- Keyword lists: `"skill, create, validate"` ✗
- More than 30 words ✗
- A bare `Use when …` with no WHAT clause ✗

## Gotchas Section (required)

Every skill has a `## Gotchas` section — "the highest information density in any skill". Populate with:

- API quirks the model doesn't know
- Common mistakes observed in use
- Non-obvious ordering requirements
- Silent-failure edge cases

**Gotchas accumulate** — after every skill failure, add the lesson.

## BPE (Bitter-Pilled Engineering) Check

Before finalizing, ask: **"Would a smarter model make this skill unnecessary?"**

- **Anti-fragile (keep):** verification harnesses, data pipelines, tool wrappers, accumulated gotchas, deterministic scripts.
- **Fragile (question):** chain-of-thought orchestrators, format parsers, retry cascades, elaborate reasoning scaffolds.

Focus skills on knowledge the model can't derive (failure modes, API quirks), tools it can't replicate (API calls, automation), and workflows that benefit from consistency.

## Progressive Disclosure

Three loading levels:

1. **YAML frontmatter** — always in the system prompt, triggering info only
2. **SKILL.md body** — loaded on invocation, routing + key guidance
3. **Context files** (`references/*.md`) — loaded on demand

Tell the model what files exist; it reads them when appropriate via `skill_view(name, file_path)`.

## Prompt Authoring

A skill's SKILL.md, workflows, and context files are prompts. Key guidance:

- Use XML steering tags where they make structure clearer (the model parses them well).
- Reserve `CRITICAL` / `MUST` / `NEVER` for genuine safety or irreversibility gates. Everywhere else use plain declarative phrasing so eager models don't overtrigger.
- Start simple, add complexity only where test transcripts show the model failing.
