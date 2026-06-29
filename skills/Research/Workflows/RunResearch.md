# RunResearch Workflow

Research the query at one of three depths, then synthesize cited findings. The query is `$ARGUMENTS`.

## Step 1: Pick the Depth

| Mode | Cost | Use when |
|------|------|----------|
| **Quick** | 1 search | a single fact or a fast orientation |
| **Standard** | search + 1 worker | a comparison or a claim worth a second opinion |
| **Deep** | search + 3 workers | high-stakes, contested, or "find everything" |

If the user didn't say, infer from the query and state which mode you chose.

## Step 2: Gather

**Quick** — run one `web_search` pass on the query. Collect the best 3-5 sources.

**Standard** — run `web_search` **and**, in parallel, delegate the same query to one worker via the `Agy` skill (a Gemini-backed second opinion). Two independent angles.

**Deep** — fan the query out **in parallel** across all three delegation skills — `Agy`, `OpenCode`, `Pi` — each as an independent researcher, plus a `web_search` pass. Launch them in the same turn (background) so they run concurrently. Four independent angles.

Give each delegated worker the same precise question and ask it to return findings **with sources**.

## Step 3: Cross-Check

Reconcile the angles:
- Where sources agree → state it as well-supported.
- Where they disagree → surface the disagreement explicitly and say which is better-grounded (and why).
- Drop claims no source backs; verify a surprising claim against its actual source before keeping it.

## Step 4: Synthesize (via the Prompting skill)

Author the writeup using the `Prompting` skill — lead with the direct answer, then the supporting findings grouped by sub-question, then a **Sources** list. Keep it signal-dense; cite every non-obvious claim.

## Step 5: Capture Worker Failures

If a delegated worker exits non-zero, its wrapper writes failure context to `.agent-state.md` (see the delegation skills). Note the missing angle in the output rather than silently dropping it.

## Gotchas

- Deep mode's value is *independent* angles — if you feed workers each other's output they converge and you lose the cross-check.
- Always run web_search even in Standard/Deep; the workers are a complement to fresh search results, not a replacement.
- Cite as you go — reconstructing sources after synthesis loses the link between claim and evidence.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Research","workflow":"RunResearch","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
