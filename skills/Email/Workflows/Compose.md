---
description: Draft a new email from the user's intent, in English or Hebrew, with Review as the gate.
---

# Workflow: Compose

Input: what the user wants to say, to whom. Output: one ready-to-paste draft, plus its assumptions and placeholders.

## Step 1: Read the profile

Load the voice profile if it exists (`VoiceProfile.md` says where). It supplies the name, signature, Hebrew grammatical gender, registers, and font.

## Step 2: Build the brief

Extract what the request already contains, then infer the rest:

| Field | Source, in order |
|---|---|
| Recipient and relationship | the request → the thread → "new external contact" |
| Purpose and the one ask | the request; when unclear, ask, because nothing else is worth drafting without it |
| Language | an explicit instruction → the thread's language → the recipient's context, such as an Israeli authority → the language of the request |
| Register | `Tone.md` table from the relationship, one notch up for money, bad news, or legal topics |
| Facts | only the request and the thread; everything else becomes a `[placeholder]` |
| Recipient's Hebrew gender | stated by the user, or visible in the recipient's own Hebrew; otherwise gender-free forms |

Ask at most two questions, and only when the answer changes the email: the purpose, or a fact the ask depends on. Otherwise draft now and state the assumptions after the draft.

## Step 3: Pick the scenario

Find the scenario in `Templates.md` and read its file. Take its moves and subject pattern; rewrite every line for this recipient. No fitting template: follow `Anatomy.md` directly.

## Step 4: Draft

- Write directly in the target language, applying `Anatomy.md`, `Tone.md`, and `English.md` or `Hebrew.md`.
- Hebrew: technical terms in English letters, no parentheses, every line starting with a Hebrew word, gender per Step 2.
- Bilingual requested: hand over to `Workflows/Localize.md` bilingual mode after drafting the primary language.
- Stay inside the length budget for the scenario's lint type.

## Step 5: Review

Run `Workflows/Review.md` on the draft with the scenario's lint type. Fix every error, and every warning that isn't intentional.

## Step 6: Deliver

```text
Subject: [subject]

[body]
```

Under the fence, only the lines that apply:
- `Assumptions:` one line: register, language, gender forms, anything inferred.
- `Fill before sending:` every placeholder.
- `Attach:` files the email mentions.
- First run with no profile: one line offering the Profile workflow.

For rich text, add the `Tools/RenderEmail.ts` command (`Anatomy.md`). Never send the email or call a mail-sending tool.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"Email","workflow":"Compose","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
