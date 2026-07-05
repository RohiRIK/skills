---
name: CodingStandards
description: "Language coding standards (TS, Python, Bash, PowerShell, Swift, Rust). USE WHEN writing, reviewing, or scaffolding code."
category: reference
effort: low
user-invocable: false
---

# CodingStandards

USE WHEN writing, implementing, reviewing, or scaffolding code in TypeScript, Python, Bash, PowerShell, Swift, or Rust.

## Language Standards

Load the language file first, then implement:

| Language detected | Standards | Starter Template |
|-------------------|-----------|-----------------|
| TypeScript / JS / Bun / Hono | `TypeScript.md` | `StarterTemplateTypeScript.md` |
| Python / uv / pydantic | `Python.md` | `StarterTemplatePython.md` |
| PowerShell / Azure / Entra / Graph | `PowerShell.md` | `StarterTemplatePowerShell.md` |
| Bash / shell / CI | `Bash.md` | `StarterTemplateBash.md` |
| Swift / AppKit / SwiftUI / macOS | `Swift.md` | `StarterTemplateSwift.md` |
| Rust / Cargo / Tokio / Axum | `Rust.md` | `StarterTemplateRust.md` |

**Load StarterTemplates when:** user says "new project", "scaffold", "starting a project", or asks which template to use.
**Load M365Admin.md when:** user mentions Graph API, Exchange Online, Entra ID, Teams admin, SharePoint, PnP, or M365 admin tasks.

## Quick Reference

| Language | Key rule |
|----------|---------|
| TypeScript | Bun runtime · named exports · discriminated unions · `Promise.all` |
| Python | `uv` always — never `pip` · pydantic at boundaries · ruff |
| PowerShell | `[CmdletBinding()]` + `$ErrorActionPreference = 'Stop'` · `-Param:$false` syntax |
| Bash | `set -euo pipefail` · last resort only · 50-line limit |
| Swift | `.app` bundle for GUI · `@MainActor` for UI · `struct` by default |
| Rust | `Result<T,E>` + `?` everywhere · `thiserror` libs · `anyhow` apps · no `.unwrap()` |

**context7:** always prepend `use context7` before writing code against any external library. **Review:** "review my code" → `code-review` skill / code-reviewer agent — this skill supplies the standards it checks against.

## Gotchas

- Load only the language file you need — pulling all of them wastes context.
- House standards, not generic linting — encode choices a linter won't catch (immutability, error-handling shape, file size).

## Examples

**Example 1:** "scaffold a TS service module" → load `TypeScript.md` → strict types, no `any`, spread-not-mutate.
**Example 2:** "does this Python match our standards?" → load `Python.md` → check typing, validation, idioms.
