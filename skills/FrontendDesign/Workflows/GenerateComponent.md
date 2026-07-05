---
description: Scaffolds a new React component following strict composition and accessibility patterns.
intent_map:
  "make a component": "--name"
  "create ui": "--name"
---

# Workflow: GenerateComponent

This workflow generates a production-ready React component structure.

## Prerequisites
- **Context**: Read `skills/FrontendDesign/Patterns.md` to understand the "Composition Over Inheritance" and "Compound Components" patterns.

## Steps

### 0. Load the Design Brief (when one exists)

Look for `design-brief.md` in the target project (default `docs/design-brief.md`, else project root). When present, it is the single source of visual truth: derive every color, font, radius, shadow, and motion value from its `:root` tokens — never invent a hex, font name, or duration inline. When absent and the component is user-facing, recommend running `FrontendAesthetics` → DesignBrief first; proceed token-less only for internal/unstyled work.

Also decide the component type before writing: Server Component by default; add `"use client"` only if it needs state, events, effects, or browser APIs (see the Server vs Client table in `Patterns.md`).

### 1. Identify Requirements
Analyze the user's request to determine:
- **Component Name** (e.g., `DataCard`, `UserList`).
- **Functionality** (Display, Interactive, Form, etc.).
- **Sub-components** needed (e.g., `Header`, `Body`, `Footer`, `Item`).

### 2. Scaffold Interface
Define the Props interface first. Avoid `any`.
- If the component wraps content, ensure `children: React.ReactNode` is included.
- Use discriminated unions for `variant` props if applicable.

### 3. Implement Component
Fast path: scaffold the file set (`<Name>.tsx`, `index.ts`, `<Name>.test.tsx`) with the bundled script, then fill in:
```bash
bun skills/FrontendDesign/Tools/GenerateComponent.ts <Name> --path <output-dir>
```
Write the code using the **Compound Component** pattern if it involves multiple related parts.

**Template Structure:**
```typescript
import React from 'react';
import { cn } from '@/lib/utils'; // Assumed utility

interface [Name]Props {
  children: React.ReactNode;
  className?: string;
}

export function [Name]({ children, className }: [Name]Props) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
}

export function [Name]Header({ children }: { children: React.ReactNode }) {
  return <div className="header-styles">{children}</div>;
}
```

### 4. Accessibility Check
- Does it need `role` attributes?
- Are keyboard interactions (Enter, Space, Escape) handled?
- Refer to the "Accessibility Patterns" section in `Patterns.md`.

### 5. Final Output
Present the complete code block to the user.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"FrontendDesign","workflow":"GenerateComponent","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
