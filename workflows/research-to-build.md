# Workflow: research-to-build

Understand a domain / library / API before building it.

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
