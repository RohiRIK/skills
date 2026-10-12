---
description: Quality gate for any email draft, the agent's or the user's. Mechanical lint plus a judgment checklist, ending in READY or FIX, with one revision loop.
---

# Workflow: Review

Runs at the end of Compose, Reply, Rewrite, and Localize, and on its own when the user asks "is this ok to send?". Input: a draft, ideally with a `Subject:` first line, and its scenario's lint type from `Templates.md`.

## Step 1: Mechanical lint

From the skill folder, pass the draft on stdin:

```bash
bun Tools/LintEmail.ts --type request - <<'EOF'
Subject: ...

...
EOF
```

- No bun: `node --experimental-strip-types Tools/LintEmail.ts …` works on Node 22.6 and later.
- No runtime at all: run the same checks by hand: read `Tells.md` and scan for each phrase, then check markdown, em dashes, exclamation marks, placeholders, subject length, word count against `Anatomy.md`, and for Hebrew: parentheses, slash gender forms, and lines that start with an English word.
- `--lang en|he` overrides language detection, which is useful on bilingual blocks. `--json` gives machine-readable output.
- Exit 0 means no errors, though warnings may remain; exit 1 means errors.

| Lint rule | Level | Meaning |
|---|---|---|
| `tell` | error or warn | A phrase from `Tells.md`; the message gives the replacement |
| `markdown` | error | Bold, headings, tables, or markdown links that arrive as raw symbols |
| `hebrew-parens` | error | A parenthesis in a Hebrew line; house rule |
| `empty` | error | The draft has no body |
| `subject` | warn | Missing, over 60 characters, generic, or ALL CAPS |
| `length` | warn | Body over the budget for its `--type` |
| `em-dash`, `exclaim` | warn | More than one em dash, more than two exclamation marks |
| `placeholder` | warn | An unfilled `[bracket]`; list it for the user |
| `gender-slash` | warn | `תוכל/י`-style forms; rephrase gender-free |
| `bidi-start` | warn | A Hebrew line that starts with an English word |
| `date` | warn | An English numeric date such as 3/4 that reads two ways |
| `url-punct` | warn | A URL followed by punctuation that auto-linkers may swallow |
| `attachment` | info | The email mentions an attachment; remind the user to attach it |

## Step 2: Judgment checklist

| # | Check |
|---|---|
| R1 | Point first: a reader of only the first two lines knows why this email exists. |
| R2 | One ask, with an owner and a day and date; or the email says it's FYI. |
| R3 | One register, from greeting to sign-off, right for the relationship (`Tone.md`). |
| R4 | Every fact traces to the user or the thread; every gap is a listed placeholder. Nothing commits the user to something they didn't say. |
| R5 | No structural tells (`Tells.md`, last section). |
| R6 | Reads as written natively: no calques in either direction. |
| R7 | Hebrew: sender and recipient gender consistent throughout and from a valid source; technical terms in English letters, not translated or glossed. |
| R8 | Dates, times, and money are unambiguous; cross-border times carry a zone; no Friday-afternoon or Saturday slots for Israeli recipients. |
| R9 | Subject is specific and searchable. |
| R10 | Replies: every question and request in the incoming message is answered or explicitly deferred. |

## Step 3: Verdict

**READY**: no lint errors, every warning fixed or intentional, and R1 to R10 pass.
**FIX**: list each failure with its line and the concrete change, not "make it better".

## Step 4: One revision loop

On FIX, apply the fixes and run Steps 1 to 3 once more. Report the final state either way. A second FIX goes to the user with the remaining items and a recommendation, not into another silent loop.

## Output shape

```text
Review: request · he · 84/100 words
Lint: 0 errors · 1 warning (placeholder: [תאריך])
Checklist: R1 ✓ R2 ✓ R3 ✓ R4 ✓ R5 ✓ R6 ✓ R7 ✓ R8 ✓ R9 ✓ R10 n/a
Verdict: READY. Fill [תאריך] before sending.
```

When Review runs inside another workflow, report only the verdict line and any open items; the full block is for direct requests.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Email","workflow":"Review","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
