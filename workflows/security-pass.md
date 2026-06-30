---
type: Workflow
title: Security pass
description: Harden existing code before release — no new feature.
tags: [build-ship]
chain: "SecurityReview → fix CRITICAL/HIGH → Verify → GitHubOps:CommitPush"
---

# Workflow: security-pass

Harden existing code before release. No new feature.

> **Run it, don't just read it.** State the chain above to the user, then work left-to-right — **each step is a skill or slash-command to invoke** (load the skill with the Skill tool, or run the `/command`), not prose to summarize. Resolve each name to its skill and let it do the work.

```
SecurityReview → fix CRITICAL/HIGH → Verify → GitHubOps:CommitPush
```

## Steps

1. **SecurityReview** — OWASP Top-10, secrets, SSRF, injection, unsafe crypto, authz gaps.
2. **Fix** — CRITICAL and HIGH first; MEDIUM when cheap. Rotate any exposed secret.
3. **Verify → ship**.

## When to use

Before releasing anything that handles user input, auth, or sensitive data. After any code that touches those surfaces.

## Gate

If a CRITICAL is found: stop, fix before continuing, then sweep the codebase for the same pattern elsewhere.
