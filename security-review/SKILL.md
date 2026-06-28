---
name: security-review
description: "Audits code for vulnerabilities and secrets. Use when reviewing code for security issues."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [quality]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='security-review', file_path='references/audit-code.md') before taking any action."
---


# SecurityReview

Full security audit skill. Forks a `security-reviewer` subagent — does not run inline.
See `references/what-gets-checked.md` for the full checklist and integration points.

## Workflow Routing

| Workflow | Trigger |
|----------|---------|
| **AuditCode** | "audit security", "check vulnerabilities", "security review", "scan for secrets", "OWASP check", "is this code secure?" |

Run a workflow:
`Run the AuditCode workflow`

## Gotchas

- Trace untrusted input from entry point to sink — a vuln is the *path*, not the function; reviewing functions in isolation misses injection that spans layers.
- Flag secrets by pattern even if they "look like examples" — committed example-looking keys are still leaks.

## Examples

**Example 1: Pre-commit audit**
```
User: "security-review this branch"
→ AuditCode → secrets, injection, authz, unsafe crypto, OWASP top 10
```

**Example 2: Endpoint review**
```
User: "is this upload handler safe?"
→ AuditCode → path traversal, type/size validation, SSRF
```
