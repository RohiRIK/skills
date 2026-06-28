# How to Use

1. Read core.md — the universal principles (true for any capable LLM).
2. Pick a structural frame from frameworks.md (COSTAR / RISEN / RTF).
3. Optionally layer a technique from reasoning.md (few-shot, CoT, ReAct, self-consistency).
4. Apply the addendum for your target model: `references/claude.md`, `references/openai.md`, or `references/gemini.md`.
5. Need a skeleton? Use templates.md. Generating prompts from data? Use templating-system.md.

## Two-Layer Principle

The **core is vendor-agnostic and durable** — no model or vendor pinning. Provider-specific behaviour (Claude's XML steering and imperative calibration, OpenAI's role/JSON-mode conventions, Gemini's prefix style) lives only in `references/*`. A model swap within a family, or authoring for a different vendor, means selecting a different addendum — never rewriting the core.

## Tools

- `scripts/render-template.ts` — render a Handlebars template against YAML data.
- `scripts/validate-template.ts` — validate template syntax against sample data.

See templating-system.md for usage.
