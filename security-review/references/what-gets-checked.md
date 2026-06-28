# What Gets Checked

- Hardcoded secrets, API keys, tokens (see overview.md for full checklist)
- OWASP Top 10: injection, XSS, CSRF, broken auth, insecure deserialization
- Input validation gaps
- Path traversal, SSRF, command injection
- Insecure dependencies

Full checklist: overview.md (12KB — loaded on demand by AuditCode workflow)

## Integration

- After writing auth/API/input-handling code → auto-trigger
- Before `/commit-push-pr` on security-sensitive changes → manual trigger
- Pairs with `code-reviewer` for complete post-implementation review
