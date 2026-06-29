# Workflow: batch-build

Build or refactor many skills (or many workflows in one skill) at once, in parallel, each reviewed in isolation.

```
Spec  →  Orchestrate (Decompose → RunLayer → MergeQueue)  →  Verify  →  GitHubOps:PullRequest
```

## Steps

1. **Spec** — write acceptance criteria for the whole batch (one criterion per unit). For a fuzzy batch, prefix with **IterativeDepth** to surface the real unit boundaries.
2. **Orchestrate**:
   - **Decompose** — split the spec into a dependency DAG of units.
   - **RunLayer** — build independent units in parallel, delegating to **Agy / OpenCode / Pi** as autonomous workers.
   - **MergeQueue** — land each finished unit; review it in its own context; gate with **Verify**.
3. **Verify** — final full gate across the merged result.
4. **GitHubOps:PullRequest** — one PR, notes generated from the full commit range (`base...HEAD`).

## Delegation

Each unit can go to a CLI worker:

| Worker | Skill |
|--------|-------|
| Antigravity | `Agy` |
| OpenCode | `OpenCode` |
| Pi (pi.dev) | `Pi` |

On worker failure, context is written to `.agent-state.md` and the unit re-plans (no blind retry).

## When to use

- Adding a family of related skills in one sprint.
- A cross-cutting refactor touching many SKILL.md (e.g. add telemetry everywhere → see **library-audit**).

## When NOT to use

- A single skill with 1–2 workflows → use **new-skill-quick** (no orchestration overhead).
