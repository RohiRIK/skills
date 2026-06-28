# Coding Standards Quick Reference

## Workflow Routing Notification

When executing a workflow, output this notification:

```
Running the **WorkflowName** workflow from the **CodingStandards** skill...
```

## Quick Reference Table

| Language | Key rule |
|----------|---------|
| TypeScript | Bun runtime · named exports · discriminated unions · `Promise.all` |
| Python | `uv` always — never `pip` · pydantic at boundaries · ruff |
| PowerShell | `[CmdletBinding()]` + `$ErrorActionPreference = 'Stop'` · `-Param:$false` syntax |
| Bash | `set -euo pipefail` · last resort only · 50-line limit |
| Swift | `.app` bundle for GUI · `@MainActor` for UI · `struct` by default |
| Rust | `Result<T,E>` + `?` everywhere · `thiserror` libs · `anyhow` apps · no `.unwrap()` |

**context7:** Always prepend `use context7` before writing code against any external library.

## Starter Templates

Load StarterTemplates when: user says "new project", "scaffold", "starting a project", or asks which template to use.
Load M365Admin.md when: user mentions Graph API, Exchange Online, Entra ID, Teams admin, SharePoint, PnP, or M365 admin tasks.
