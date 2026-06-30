---
type: Workflow
title: Research to build
description: Ground an unknown domain, library, or API before building against it.
tags: [build-ship, research]
chain: "Research(standard|deep) → Spec → /plan → /build → Verify → GitHubOps:PullRequest"
---

# Workflow: research-to-build

Understand a domain / library / API before building it.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
Research(standard|deep) → Spec → /plan → /build → Verify → GitHubOps:PullRequest
```

## Steps

1. **Research** — fans out to Agy / OpenCode / Pi + web search; returns cited synthesis. Pick depth by stakes (standard for normal grounding, deep for high-stakes integration).
2. **Spec** — turn findings into acceptance criteria so you design against real API shapes, not guessed ones.
3. **/plan → /build → Verify → PR** — hand to the build chain.

## When to use

Unknown domain, evaluating a library, integrating an unfamiliar API — anytime "I don't know enough yet" blocks the spec.

## Related

- Deliver findings instead of code → **research-to-report**.
- Whole unfamiliar repo, not one API → **onboard-codebase**.
