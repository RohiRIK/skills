# Decompose Workflow

Turn a spec into a dependency DAG of work units that can be implemented in parallel. Output is written to `.agent-state.md` and consumed by `RunLayer`.

## Step 1: Get the Spec

Read the spec/RFC. If its acceptance criteria are thin, run the `Spec` skill first (or `Iterate/RunLenses` → `Spec` for a deep one) so each unit has concrete criteria to implement against.

## Step 2: Produce Work Units

Carve the spec into `WorkUnit`s:

```
WorkUnit { id, name, deps: [id...], acceptance: [criteria...], tier }
```

Rules:
- **Fewer, cohesive units** — a unit is a coherent slice of behaviour, not a single file.
- **Minimize cross-unit file overlap** — units that edit the same files will collide in the merge queue; draw the boundaries to avoid it.
- **Keep tests WITH their implementation** — never split a unit's tests into a separate unit.
- **Dependencies only where there is a real code dependency** — don't serialize units that could run in parallel.

## Step 3: Assign Tier (drives pipeline depth + model)

| Tier | Unit size | Pipeline | Model |
|------|-----------|----------|-------|
| trivial | tiny, mechanical | implement + test | Haiku |
| small | one cohesive feature | implement + test + review | Sonnet |
| medium | multi-file feature | implement + test + separate-context review | Sonnet |
| large | cross-cutting / risky | implement + test + separate-context review + final review | Opus |

The "separate-context review" (small+) is a reviewer that did **not** write the code — author-bias elimination.

## Step 4: Group into Dependency Layers

Topologically sort the units. Layer 0 = units with no deps; layer N = units whose deps are all satisfied by layers < N. Units **within a layer run in parallel**; layers run in order.

## Step 5: Write the Plan to State

Record the units, their tiers, and the layer grouping in `.agent-state.md` (schema: `_state/StateFileSchema.md`) — set `## Goal` from the spec, list the units under `## Progress`, and note the layer order. `RunLayer` reads this.

## Gotchas

- Overlapping files are the #1 cause of merge-queue evictions — spend the effort here to keep unit file-sets disjoint.
- A dependency you add "just to be safe" serializes work that could have been parallel; only add deps for real compile/runtime dependencies.
- Splitting tests away from implementation produces units that can't be verified independently — never do it.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Orchestrate","workflow":"Decompose","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
