# AuditAgentic Workflow

Score every skill in the library on a 5-axis agentic-readiness rubric and report what to fix first. Fleet-level — this looks at the whole library at once, not one skill.

## Step 1: Enumerate Skills

List every skill directory at the repo root (each with a `SKILL.md`). Read each `SKILL.md` and its `Workflows/`.

## Step 2: Score the 5-Axis Rubric (0 / 1 / 2 each)

| Axis | 0 | 1 | 2 |
|------|---|---|---|
| **Iteration** | single-shot | some retry notion | bounded loop with exit conditions |
| **Verification** | none | ad-hoc checks | calls `Verify` (or equivalent gate) |
| **Reflection** | none | informal self-check | calls `Reflect` / scored self-eval |
| **State** | none | mentions state | reads/writes `.agent-state.md` |
| **Telemetry** | none | partial | every action workflow emits the `execution.jsonl` line |

Max 10. **Tier-A reference skills** (passive knowledge — `CodingStandards`, `DockerPatterns`, `BackendDesign`, `FrontendDesign`, `StrategicCompact`, etc.) are **"reference, exempt"** — they are not supposed to loop or verify, so don't score them as failures.

## Step 3: Classify

| Score | Class |
|-------|-------|
| 8-10 | loop-ready |
| 4-7 | partial |
| 1-3 | single-shot |
| — | reference, exempt (Tier A) |

## Step 4: Report

Output a ranked table (skill · category · score · class · missing axes), then **top fixes ranked by leverage** — how many skills each change unblocks (e.g. "wire `Verify` into Build/Test/Spec → +2 Verification across 3 skills"). Lead with the change that lifts the most skills.

## Gotchas

- Don't penalize reference skills for lacking loops — mark them exempt. Scoring them as single-shot pollutes the report.
- Telemetry presence is per *action workflow*, not per skill — a skill with three workflows where one lacks the line scores 1, not 2.
- This audits; it doesn't fix. To instrument telemetry in bulk, hand off to `AddTelemetry`.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SkillForge","workflow":"AuditAgentic","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
