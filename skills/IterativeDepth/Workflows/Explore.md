# Explore Workflow

Run several structured passes through the same problem, each from a different **lens**. Each pass surfaces requirements and edge cases the others miss; the combination yields criteria no single pass produces. Output feeds the `Spec` skill or `Orchestrate/Decompose`.

## Step 1: Pick the Depth

Scale the number of passes to how much the task warrants:

| Mode | Passes | When |
|------|--------|------|
| Fast | 2 | quick blind-spot check before a small build |
| Standard | 3-4 | normal feature/refactor planning |
| Deep | 5-8 | high-stakes redesign, security-sensitive, or wide blast radius |

Diminishing returns set in past ~5 passes for most problems — stop early if passes stop producing new findings.

## Step 2: Run the Lens Passes

Take one lens per pass, in roughly this order (pick the ones that fit; lead with the highest-value for this task):

| Lens | Asks |
|------|------|
| **Functional** | What must it do? Happy-path behaviour and core requirements. |
| **Failure** | How does it break? Error paths, partial failure, bad input. |
| **Stakeholder** | Who is affected? Users, operators, downstream consumers, future maintainers. |
| **Temporal** | What changes over time? Migration, versioning, data growth, deprecation. |
| **Constraint-inversion** | What if a fixed assumption flips? (no network, 100× load, hostile input) |
| **Experiential** | What does using it actually feel like? Latency, ergonomics, surprise. |
| **Security** | What can be abused? Authz, injection, secrets, trust boundaries. |
| **Integration** | What does it touch? APIs, schemas, backward-compat, contracts. |

Each pass records **only genuinely NEW findings** — don't restate what an earlier lens already caught. **Stop when a pass produces nothing new** (the lenses have converged), even if you haven't hit the depth target.

## Step 3: Synthesize

Deduplicate across passes and group the findings by lens into a single set of acceptance criteria — concrete, testable statements. Note which lens surfaced each, so the reader sees the coverage.

## Step 4: Hand Off

- Default → feed the criteria into the `Spec` skill (it writes them up as acceptance criteria with code/LTM grounding).
- If the work is multi-unit → hand them to `Orchestrate/Decompose` as the `acceptance` for the work units.

## Gotchas

- The value is in the *different* lenses, not in repeating the functional pass louder. If two passes produce the same findings, you picked overlapping lenses — switch lens or stop.
- Don't pad to hit the pass count. Convergence (no new findings) is the real stop signal; the depth number is just a ceiling.
- This is exploration, not implementation — produce criteria, not code.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"IterativeDepth","workflow":"Explore","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
