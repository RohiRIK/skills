# AuditCode

Perform a security review of the specified code.

## Step 1: Analyze

Scan the code for common vulnerabilities (OWASP Top 10, etc.).

## Step 2: Report

Generate a security report detailing risks and remediation steps.
## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"SecurityReview","workflow":"AuditCode","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
