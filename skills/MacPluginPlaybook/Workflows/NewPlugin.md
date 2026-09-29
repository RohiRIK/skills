# NewPlugin Workflow

Build (or port) one native macOS menu bar app, phase by phase. Each phase ends with a gate; do not
start the next phase until it passes. Companion skills are named in brackets; if one is not installed,
follow the checklist here.

## Phase 0: Workspace

- One workspace folder for all plugins: `AGENTS.md` (how we work), `.claude/skills/` (shared skills),
  `plugins/<name>/` (one git repo each), `tasks/todo.md` (plan), `tasks/lessons.md` (corrections),
  `tools/` (preview renderer, Xcode MCP client).
- Kebab-case repo names with no personal names; private repo; license decided up front.
- Cloud-synced folder (Google Drive, iCloud): keep SwiftPM build caches outside it
  (`--scratch-path ~/Library/Caches/<ns>/<name>`) and push after every commit.
- **Gate:** workspace files exist; `tasks/lessons.md` read.

## Phase 1: Research [PortOmarchyPlugin]

- Porting: clone the source, inventory every feature, key, and shell-out into a table with a macOS
  approach and keep/drop reason. Map every Linux tool to a macOS API before writing code.
- New or porting: find the best existing app for the job (installed apps first, e.g. a polished menu bar
  app), and existing agent skills. Check each license: MIT → install or adapt with notice; none → read only.
- Apple HIG pages are JS-rendered: read `developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`.
- **Gate:** plan in `tasks/todo.md` with inventory, risks, dropped features; user confirms.

## Phase 2: Scaffold [MacAppBuild]

- SwiftPM, three targets: `<App>Core` (logic, tested), `<App>UI` (views + model, **library product** so
  previews render), `<App>` (`@main` only). `LSUIElement` Info.plist, bundle script, ad-hoc signing.
- Scripts: `test.sh` (Command Line Tools-safe), `bundle.sh`, `check.sh` (the one gate), `pr-report.sh`.
- No CI if there is no Actions budget: the local gate plus a PR comment is the record.
- **Gate:** `check.sh` green; the `.app` launches.

## Phase 3: Logic, test-first [MacAppArchitecture]

- Port pure helpers with their source tests first; keep output byte-identical (watch rounding).
- System tools through an injected runner with a timeout; absolute paths, argv arrays, secrets never
  on argv; admin actions via one `osascript` prompt with argv after `--` and `quoted form of`.
- Non-Sendable Apple clients (CoreWLAN, EventKit) wrapped in an `actor`.
- **Gate:** every source test ported and green; live read-only smoke test of each system tool.

## Phase 4: UI loop [MacUX › DesignPass]

- Copy the closest Apple UI (system Wi-Fi menu, Control Center module, System Settings rows).
  Live data in a softly filled module; lists as menu rows; edits as grouped rows.
- Every view gets `#Preview`s for every state, including the one in the user's screenshot. Render all
  of them and read the PNGs (≤3 fix cycles).
- Relaunch the real app and ask the user for a screenshot. Repeat until they approve.
- **Gate:** user approves the look ("looks good") and it is recorded.

## Phase 5: App shell

- Panel = the app's job, split into tabs when there is more than one job; constant tab height.
- Footer: `Settings…` (⌘,) and `Quit` (⌘Q) only.
- Settings window (General · Permissions · Appearance) and a first-launch onboarding window
  (`defaultLaunchBehavior`, macOS 15+). Shared permission rows with live status and one action each.
- Theme (System/Light/Dark) + accent applied to every window root.
- **Gate:** first launch shows onboarding once; ⌘, opens Settings in front; theme applies everywhere.

## Phase 6: Audit [MacAppArchitecture + swift-concurrency-pro]

- Run both skills as reviewers over the whole plugin; fix every real finding.
- Typical finds: no way to quit, overlapping refresh loops, missing timeouts, errors never shown,
  `@unchecked Sendable` + `Task.detached` instead of an actor, stale async results (`.task(id:)`).
- **Gate:** findings table fixed or explicitly deferred; `check.sh` green.

## Phase 7: Verify + PR [MacAppBuild › Verify]

- Branch, conventional commits, previews committed under `docs/previews/`.
- `gh pr create` with a test plan: automated items ticked, manual items (permissions, admin prompts,
  joining networks) unticked for the user. `pr-report.sh` posts the gate report and preview images.
- **Gate:** report posted; user has the manual checklist.

## Phase 8: Record

- Each lesson goes to the skill that owns it, in the same turn; corrections to `tasks/lessons.md`;
  the plugin's `PROJECT-CONTEXT.md` gets a dated Recent History entry; durable cross-project lessons
  also go to long-term memory if the host has it.
- Add new cross-plugin lessons to this skill's `Lessons.md`.

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"MacPluginPlaybook","workflow":"NewPlugin","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
