# Adapt Workflow

Tune the library for the model the user works with: the one running this session, or one they name. This is the on-demand entry point; `Watch` is the scheduled one.

## Step 1: Identify the target model

- **Named** ("adapt to GPT-5.5", "for Gemini 3 Pro") → use that name.
- **"The model I'm using"** → take the exact model id the host reports for this session: the system prompt's model line, the host's model command or session metadata, or `ANTHROPIC_MODEL` / `MODEL_UPGRADE_TARGET`. A model's guess about its own name is not evidence; if the host reports nothing, ask the user.
- A worker driven through `Agy`, `OpenCode`, or `Pi` counts too: its configured model is the target when the user means "the model those skills run on".

## Step 2: Resolve it against the ledger

```bash
bun Tools/ModelUpgrade.ts resolve "<model id>"
```

- Prints a generation id → that is the target.
- Exits 1 → the model has no ledger entry. Run `Assess` Step 2 to add one from the vendor's own prompting guide and release notes, then resolve again. For a vendor new to the ledger, also check `Prompting/vendors/<Vendor>.md` exists and is current; create or refresh it from the same sources.

## Step 3: See what is already tuned

```bash
bun Tools/ModelUpgrade.ts baseline --target <id>
```

If every skill is `current` for the target, report that and stop. Otherwise continue.

## Step 4: Assess and apply

Run `Assess` with this target, then `Apply`. Both follow `Rubric.md` §3: fixes that help the target without hurting the other families a skill is stamped for go in the skill; advice that only suits the target goes in its vendor file. A/B replans on the target model itself (the host's model switch, or a worker on that model).

## Step 5: Report

One line per outcome: the target id, how many skills were already tuned, how many were stamped now, and the PR link. Retire or rename proposals wait for the owner.

## Gotchas

- Adapting to a cheaper or older model is valid: the rubric asks what that model needs, which can mean adding scaffolding a frontier model would not.
- Do not restamp a skill for a family you did not judge it against; a stamp per family is a separate claim.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"ModelUpgrade","workflow":"Adapt","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
