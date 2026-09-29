---
name: MacPluginPlaybook
description: "Phased playbook to build or port a native SwiftUI macOS menu bar app. USE WHEN starting or porting a macOS menu bar plugin. NOT FOR one view's styling (use MacUX)."
category: workflow
effort: high
domain: dev
---

# MacPluginPlaybook

The process that took a Linux bar widget to a polished native macOS menu bar app in one day, as phases with gates. Each phase names a companion skill when installed and carries its own checklist when not.

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **NewPlugin** | "build a macOS plugin", "port this widget to macOS", "what's next for the plugin" | `Workflows/NewPlugin.md` |

## Quick Reference

- Phases: 0 Workspace → 1 Research → 2 Scaffold → 3 Logic (test-first) → 4 UI loop → 5 App shell → 6 Audit → 7 Verify + PR → 8 Record. Never start with UI.
- Companion skills (load if present): `PortOmarchyPlugin`, `MacAppArchitecture`, `MacAppBuild`, `MacUX` (+ `DesignPass`), `swiftui-expert-skill`, `swift-concurrency-pro`.
- Everything that went wrong or right, with the fix: `Lessons.md`. Read it at the start of every plugin.
- The user's screenshot is the ground truth for UI; previews and green builds are not.
- Record each lesson in the same turn it is learned, in the skill that owns it.

## Gotchas

- Glaze-style AI Mac-app builders are React in a WebView; for native Swift, copy their *process* (one gate, bounded inspection, per-app memory), not their stack.
- Menu bar (`LSUIElement`) apps need Quit + Open at Login, a distinct menu bar icon, `NSApp.activate()` before any window, and Location "Always" for Wi-Fi names.
- SwiftUI previews do not run in an executable target: views go in a library target with a library product.
- A tabbed panel needs one fixed content height, or it jumps and clips its own top.
- Check license before borrowing: MIT → adapt with notice; no license → read only.

## Examples

**Example 1: Port a Linux bar widget**
```
User: "port <omarchy widget repo> to macOS"
→ NewPlugin: workspace check → clone + inventory → SwiftPM scaffold → port helpers + tests
→ panel UI via DesignPass with the user's screenshots → Settings + onboarding → audit → PR report
```
