# CreateSkill — Writing Guidance

How to write skill instructions that actually help. Derived from Anthropic's skill-creator methodology and Thariq Shihipar's "Lessons from Building Claude Code" (Mar 2026). Word everything via the `Prompting` skill.

## Core Principles

- **Don't state the obvious.** The model is competent at programming and knows codebases. Focus on what **breaks its default patterns** — things it gets wrong without guidance. Test: "Would the model do this wrong without being told?" If not, remove it.
- **Explain the why, not just the what.** Models with good theory of mind and clear reasoning outperform models under rigid constraints. Instead of "ALWAYS use 3 bullets", explain why bullets matter for the audience.
- **Keep it lean.** The context window is a public good. Remove instructions that don't improve output. If test transcripts show wasted steps, cut them. SKILL.md stays ≤ 50 lines; move detail to context files.
- **Generalize, don't overfit.** Fix underlying patterns, not specific test failures — the skill runs on many prompts beyond your test set.
- **Bundle repeated work.** If test agents independently wrote similar helper scripts, add that script to `Tools/` so every future invocation benefits.
- **Set appropriate degrees of freedom.** Match specificity to task fragility — migrations need exact commands; reviews need general direction.
- **Don't over-constrain.** Skills are reused heavily; leave flexibility for different contexts.

## Description Best Practices

- **Descriptions are for models, not humans.** The description is injected into the system prompt; the model reads it to decide whether to invoke the skill. It is the router.
- **Be slightly pushy.** Models undertrigger. Name specific scenarios even when the user may not mention the skill.
- **Include negative triggers for confusable skills.** Add `NOT FOR …` clauses when skills share vocabulary (e.g. `NOT FOR TypeScript CLI generation (use CreateCLI)`).
- Lead with WHAT, then the `USE WHEN` trigger. Stay ≤ 30 words (hard ceiling 1024 chars).

## Gotchas Section (required)

Every skill has a `## Gotchas` section after the routing table — "the highest information density in any skill". Populate with API quirks the model doesn't know, common mistakes observed in use, non-obvious ordering requirements, and silent-failure edge cases. **Gotchas accumulate** — after every skill failure, add the lesson.

## BPE (Bitter-Pilled Engineering) Check

Before finalizing, ask: **"Would a smarter model make this skill unnecessary?"**

- **Anti-fragile (keep):** verification harnesses, data pipelines, tool wrappers, accumulated gotchas, deterministic scripts.
- **Fragile (question):** chain-of-thought orchestrators, format parsers, retry cascades, elaborate reasoning scaffolds.

Focus skills on knowledge the model can't derive (failure modes, API quirks), tools it can't replicate (API calls, automation), and workflows that benefit from consistency.

## Progressive Disclosure

Three loading levels: (1) YAML frontmatter — always in the system prompt, triggering info only; (2) SKILL.md body — loaded on invocation, routing + key guidance; (3) context files (skill-root `.md`) — loaded on demand. Tell the model what files exist; it reads them when appropriate.

## Public vs Private Naming — the Release Boundary

Skill name encodes public/private status. Two valid forms:

| Type | Directory | Allowed content |
|------|-----------|-----------------|
| **Public** | `TitleCase` (`Blogging`, `CreateSkill`) | Templated, generic, safe — ready for public release |
| **Private** | `_ALLCAPS` (`_INBOX`, `_DOTFILES`) | Anything personal, sensitive, identity-bound, environment-specific |

The leading underscore is the public-release boundary — release/publish tooling skips `_*` skills. This repo is published, so public skills must contain only generic content: no real names, domains, hostnames, IPs, credentials (even example-looking), private repo paths, customer data, first-person war stories, or absolute home-directory paths (a leading slash followed by `Users/<name>` or `home/<name>`).

**Decision rule:** "Could this skill be dropped, as-is, into a stranger's `~/.claude/skills/` and just work?" Yes → public (`TitleCase`). No (it references your identity, customers, paid APIs, private infra, or private data) → private (`_ALLCAPS`). When in doubt, build private first; promoting `_Foo` → `Foo` later is easy, un-leaking a public skill is not.

### Pre-Flight Grep (public skills only)

Before shipping or modifying any `TitleCase` skill:

```bash
rg -i "/(Users|home)/[a-z]+/|<your-name>|<your-org>|<your-domain>" <SkillName>/
```

Zero matches = ready. Any match = scrub it or rename the skill to `_ALLCAPS`. `_ALLCAPS` skills are exempt — private by design.
