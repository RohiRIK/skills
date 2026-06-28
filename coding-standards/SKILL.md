---
name: coding-standards
description: "Reference for house coding standards across TypeScript, Python, PowerShell, Bash, Swift, and Rust. Use when writing or reviewing code to match project conventions."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reference]
    related_skills: []
usage_hint: "After loading this skill, immediately call skill_view(name='coding-standards', file_path='references/type-script.md') for the relevant language."
---
# Coding Standards

House coding standards — not generic linting. Encodes choices a linter won't catch (immutability, error-handling shape, file size).

## Language Routing

| Language detected | Standards file |
|-------------------|----------------|
| TypeScript / JS / Bun / Hono | `references/type-script.md` |
| Python / uv / pydantic | `references/python.md` |
| PowerShell / Azure / Entra / Graph | `references/power-shell.md` |
| Bash / shell / CI | `references/bash.md` |
| Swift / AppKit / SwiftUI / macOS | `references/swift.md` |
| Rust / Cargo / Tokio / Axum | `references/rust.md` |

## Quick Reference

- Quick reference table + workflow notification: `references/coding-standards-quick-reference.md`

## Gotchas

- Load only the language file you need — pulling all of them wastes context.
- These are house standards, not generic linting.

## Examples

**Before writing code**
```
User: "scaffold a TS service module"
→ load type-script.md → apply strict types, no any, spread-not-mutate
```

**Review**
```
User: "does this Python match our standards?"
→ load python.md → check typing, validation, idioms
```
