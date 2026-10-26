# Assess Workflow

Judge every skill against a target model generation, of any vendor, and write the upgrade report. Read-only on skills; it writes only the ledger entry and the report.

## Step 1: Set the target

The target is the model `Adapt` identified or the user names (resolve a model name with `bun Tools/ModelUpgrade.ts resolve <model>`); else the one `Watch` found; else the ledger's default head. State it at the top of the report, with the other families the library is stamped for.

## Step 2: Update the ledger (target not in it yet)

Add a `## <id> — <YYYY-MM> · <models>` entry to `Generations.md`, above that family's older entries (at the very top only for a new default target): what changed for skill text, each point tied to the vendor's release notes or migration guide (cite them in a `Sources:` line). Record behaviour shifts that make existing instructions dead weight *and* ones that call for new guidance. For a model from another vendor, record how it differs from the default target: what the library's current wording over- or under-does on it. `Research` can gather the sources; the vendor's own pages win over secondary write-ups.

If the shifts introduce a new greppable pattern, add a row to `Signals.md`.

## Step 3: Collect the evidence

```bash
bun Tools/ModelUpgrade.ts baseline --target <id>   # who is behind the target
bun Tools/ModelUpgrade.ts scan --json               # dated-prompt leads per skill
```

Also read, per skill: `SKILL.md`, its workflows, and git history for when it last changed. Check the host's built-in skills and commands for overlaps (the session's skill list is the evidence).

## Step 4: Judge each skill

Apply `Rubric.md`: relevance first, then fit, then the multi-model check (§3), then one verdict with confidence. Read every scan hit in context and drop the ones the keep list protects. For a large library, judge independent skills in parallel workers, each given `Rubric.md`, the target's ledger entry, and its skills' scan output; merge their verdicts yourself.

## Step 5: Write the report

`reports/ModelUpgrade/<YYYY-MM-DD>-<generation>.md`:

1. Target, scope, and date.
2. The two or three highest-impact findings in prose.
3. A verdict table: skill · verdict · confidence · finding (`file:line`) · proposed fix.
4. Decisions only the owner can make (retire, rename, merge), each with a recommendation.
5. Library-level notes (canon drift, shared stale facts) that belong to another workflow.

## Step 6: Hand off

Ask the owner to confirm the retire/rename decisions, then run `Apply`. In an unattended run, run `Apply` on the `reprompt` set only and leave `replan`/`retire` for the owner.

## Gotchas

- The scan skips frontmatter: descriptions are routing text, judged for trigger accuracy, not tone.
- A skill with no findings is a `keep` with no edits. Don't manufacture a diff.
- Overlap with a host built-in matters only on hosts that have it; say which host.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"ModelUpgrade","workflow":"Assess","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
