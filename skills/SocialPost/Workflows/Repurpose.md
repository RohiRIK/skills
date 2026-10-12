---
description: Turn one source, such as an article, a talk, a release, or another post, into native posts for several platforms.
---

# Workflow: Repurpose

Input: a source and the target platforms. Output: one native post per platform, each reviewed.

Never paste the same text everywhere. Meta cuts reach for unoriginal content, X labels identical text as spam, and Bluesky and Mastodon readers ignore cross-posted copy. Each platform gets its own hook, length, tags, and link handling.

## Step 1: Extract the atoms

From the source, list: the one main point, two to five supporting facts with numbers, the concrete detail or story, quotable lines the user actually said, the link, and who is involved. Use only what the source contains.

## Step 2: Choose an angle per platform

| Platform | Angle |
|---|---|
| LinkedIn | The lesson or the decision behind it, with the detail; 1,300 to 2,500 characters for insight posts |
| X | The single most forwardable fact; a thread if there are several (`Workflows/Thread.md`) |
| Threads, Bluesky, Mastodon | Conversational: what happened and what you thought of it |
| Facebook | The story, for people who know you; for a Group, the useful part first (`Meta.md`) |
| Instagram | The search phrase plus the visual moment; no caption link |
| WhatsApp, Telegram | The headline and what followers should do |

`bun Tools/Count.ts draft.txt` shows how one draft counts on every platform at once, which helps decide what must be cut or threaded.

## Step 3: Write each post natively

Run the drafting steps of `Workflows/Compose.md` per platform, from the atoms, not from another platform's post. Vary the opening and the order between platforms.

## Step 4: Review each

`Workflows/Review.md` with each post's platform.

## Step 5: Deliver

Grouped by platform, each in its own fence with its count. Suggest an order if the user asked: usually the long-form post first, then the short ones that point to it.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SocialPost","workflow":"Repurpose","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
