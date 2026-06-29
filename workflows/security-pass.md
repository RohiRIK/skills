# Workflow: security-pass

Harden existing code before release. No new feature.

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
