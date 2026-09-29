# Lessons from the first plugin

Consolidated from building a native network menu bar app (a port of a Linux bar widget) on
2026-09-29. Each line: what happened → the rule. Grouped by phase.

## Workspace and tooling

- SwiftPM `.build/` for a hello-world app was 461 MB inside a synced Drive folder → scratch path in `~/Library/Caches`.
- Command Line Tools only: `swift test` fails with "no such module 'Testing'" → add `-F`/rpath to the CLT `Testing.framework`, or select Xcode.
- A code-graph hook's output got committed into the plugin repo → add generated dirs to `.gitignore` before the first commit.
- Project MCP servers added mid-session are not loaded by background sessions → approve via `enabledMcpjsonServers`; drive `xcrun mcpbridge` from a small client meanwhile.
- Bun `spawn` stdin is buffered → `flush()` after each write, and send `tools/call` only after the `initialize` reply, or the MCP request hangs.
- Xcode MCP approval is per calling program and folder → the first `XcodeOpenWorkspace` triggers an Allow dialog the user must click.
- The preview renderer deleted all images when asked for a subset → clean the output folder only on full runs.
- `RenderPreview` can fail right after a rebuild → retry once.
- Background sessions cannot `screencapture` or list other apps' windows → ask the user for screenshots.

## Research and licensing

- AI Mac-app builders (Glaze) ship React + Node in a WebView, not Swift → study their process (short hard-rules file, narrow skills, one verify gate, per-app `PROJECT-CONTEXT.md`), not their code.
- The GitHub API reported "no license" for repos whose `LICENSE` file is MIT → read the file itself.
- MIT (SwiftUI and concurrency agent skills, CodexBar) → install or adapt with the notice; no license → read only.
- An installed, polished app solving the same problem (CodexBar for menu bar UX) answered design questions faster than docs.

## Porting and system calls

- JS `toFixed` rounds halves away from zero; Swift `String(format:)` rounds to even → round explicitly; port a test that hits a .5 case.
- `osascript -e … args`: arguments starting with `-` were parsed as osascript flags → put `--` before argv.
- `do shell script` turns `\n` into `\r` → split on any newline.
- `networksetup` reports some failures on stdout with exit 0 → parse output, not just the exit code.
- CoreWLAN cannot read saved Wi-Fi passwords from the system keychain → join saved networks with `networksetup -setairportnetwork <dev> <ssid>`; new ones in-process (never a password on argv).
- Location "While Using" leaves CoreWLAN SSIDs nil for a menu bar app (never "in use") → request Always; after the first answer, open System Settings instead of prompting.
- Loopback ping is dropped under firewall stealth mode → fake the runner in tests instead of pinging live.

## Architecture and concurrency

- An `LSUIElement` app shipped with no way to quit → Quit (⌘Q) is mandatory.
- `refresh()` called beside a running poll loop double-counted rates → one loop, restarted on open/close/key/action.
- `Process` without a timeout could hang forever → kill after N seconds; test with a hung `sleep`.
- `@unchecked Sendable` + `Task.detached` around CoreWLAN → an `actor`.
- `onChange` + `Task {}` let an older read overwrite a newer one → `.task(id:)`.
- Errors assigned to a message nobody rendered → every error has a visible place.

## UI

- First panel was called "Windows 98": bordered cards, grouped `Form`, segmented control, big padding → copy the system Wi-Fi menu; no glass on content (HIG).
- `MenuBarExtra(.window)` kept an old height when content grew → the top clipped, rows overlapped, and a click hit the wrong row → `.fixedSize(vertical)` on the root.
- A `Form` inside the panel was clipped ("not the whole tab") → grouped-look rows built from a VStack.
- Plain rows for live data looked unfinished → a Control Center-style module with a stats grid and health dots won approval.
- The menu bar icon matched Apple's Wi-Fi icon, so the user opened the wrong menu → a distinct icon.
- Tabs changed the panel height, which jumped and clipped its top → one fixed content height, scroll inside.
- Tab icons felt too big → 11 pt icons, `.caption2` labels, 34 pt segments.
- Row dividers ran past rounded groups → clip the group shape.
- A separate IP Settings window was rejected; then Settings + onboarding windows were requested → network features in panel tabs, app preferences in a Settings window.

## Process

- The user's screenshot found something previews could not on every pass → ask for one after each relaunch.
- Running the architecture and concurrency skills as reviewers found real bugs that tests missed → audit before the PR.
- A local gate + PR comment with preview images replaced CI when there was no Actions budget.
- Lessons written in the same turn stayed accurate; batching them would have lost the details.
