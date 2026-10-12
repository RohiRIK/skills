---
description: Draft a comment, reply, or quote post for the user to post themselves, adding one specific point.
---

# Workflow: Reply

Input: someone's post and what the user wants to say, if anything. Output: one short reply for the user to post by hand.

A comment is read by the author and by everyone scrolling the thread. Generic comments read as automated: LinkedIn hides automated or excessive comments, and X labels identical replies as spam.

## Step 1: Read the post

What it claims, what's specific in it, its language, and its tone. Who is the author to the user?

## Step 2: Find the one thing to add

One of: a number or result from the user's own experience, a counterexample, a specific question about the post's detail, a resource the user actually knows, or plain thanks for something specific. If the user has nothing to add, say so; no comment beats "Great post!".

## Step 3: Pick the form

- **Comment or reply**: 1 to 4 sentences. On LinkedIn, comments are limited to 1,250 characters (`Platforms.md`).
- **Quote post** on X, Threads, or Bluesky: when the user's take should reach their own followers; a reply mostly stays in the original thread.
- In the post's language, unless the user says otherwise. A Hebrew reply addresses the author in their own grammatical gender only if their Hebrew shows it; otherwise gender-free forms (`Hebrew.md`).

## Step 4: Draft

- Start with the addition, not with praise.
- No links unless the user asked; no self-promotion; no tags of people who aren't in the conversation.
- Never the same text for two threads.
- Disagreeing: name the shared goal, then the specific point and why.

## Step 5: Review

`Workflows/Review.md` with `--platform linkedin-comment` or the post's platform.

## Step 6: Deliver

The reply in a `text` fence. Never post it, and never set up automated commenting.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SocialPost","workflow":"Reply","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
