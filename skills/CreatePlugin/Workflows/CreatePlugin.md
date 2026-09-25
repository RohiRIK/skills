# CreatePlugin Workflow

Convert a project into one portable AI-agent plugin with shared workflow instructions and thin, host-specific adapters. Work through implementation and verification autonomously unless a human-gated action or genuine product decision requires a question.

## 1. Inspect Before Editing

1. Read every applicable `AGENTS.md` before changing files.
2. Read the project README, package manifest, tests, and existing agent integrations.
3. Inspect `git status` and the current diff; preserve all pre-existing user changes and work around them.
4. Read the official documentation for every supported host before implementing its adapter:
   - Hermes Agent Agent Plugins v1 and skills
   - Claude Code plugins, skills, commands, agents, and hooks
   - OpenClaw skills and MCP configuration
   - Pi packages, skills, prompts, and extensions
   - OpenCode project skills and MCP configuration
5. Determine which features each host provides natively and which require a runtime extension. Do not invent manifest fields or configuration formats.
6. Stop and ask before any installation that would modify global or user-level agent configuration.

## 2. Build the Canonical Package

Create one canonical workflow source, adapting paths to the project's conventions:

```text
plugin/
├── plugin.json
├── .claude-plugin/plugin.json
├── package.json
├── skills/
│   ├── <workflow-one>/SKILL.md
│   └── <workflow-two>/SKILL.md
├── commands/
└── references/
```

Keep all substantive workflow instructions in the shared skills. Host manifests, wrappers, commands, and adapters should only route to those skills; do not duplicate instructions or application logic per host.

Use the following host strategy:

- **Hermes Agent:** implement the Agent Plugins v1 manifest and skills.
- **Claude Code:** implement `.claude-plugin/plugin.json`, skills, commands, and supported agents or hooks.
- **OpenClaw:** use supported skills and MCP configuration; provide a safe, idempotent installer that refuses collisions.
- **Pi:** provide a package with `package.json`, `pi.skills`, optional `pi.prompts`, and an extension only when executable behavior is required.
- **OpenCode:** use native project skills and its supported MCP configuration.
- **Other agents:** use MCP as the common fallback; add a host adapter only when that host supports packages or skills directly.

Reuse existing project paths, scripts, and integrations. Add only the files and runtime code required by the documented host contract.

## 3. Preserve Safety and User Control

Apply these requirements in the package, adapters, tests, and documentation:

1. Never fabricate user, profile, business, or runtime data.
2. Keep secrets and personal data outside version control.
3. Preserve explicit human approval gates for writes and external actions.
4. Do not weaken safety checks merely to make tests pass.
5. Do not run global installers, publish packages, or change user-level configuration without explicit approval.
6. Do not deploy or start anything in production.
7. Do not add Swarm, production ingress, public ports, or unrelated runtime dependencies.
8. Use configuration and environment variables instead of machine-specific absolute paths.

Do not invent a custom command unless the user explicitly requests one. Make installation and activation simple and copy-pasteable, and document one-command local loading where the host supports it.

## 4. Add Tests and Documentation

Add concise automated coverage for the package, using the project's existing test stack:

- Every host manifest parses.
- Shared manifests agree on name and version.
- Every shared skill has valid frontmatter and a useful routing description.
- Every workflow path referenced by a host adapter exists.
- Every CLI command named by a skill exists.
- Required safety and confirmation rules remain present.
- OpenClaw installation is idempotent and refuses to replace unrelated files.
- Pi package resources resolve.
- MCP tools can start from the repository root and relevant nested directories.
- Negative fixtures prove malformed or incomplete packages fail.

Document installation and activation commands, clear validation commands for each host, rollback commands, and any interactive or runtime checks that remain. Add a concise `Unreleased` changelog entry. State whether related repository documentation remains accurate.

## 5. Verify and Report Actual Results

Run the focused plugin/integration tests and the complete project test suite. Run TypeScript typechecking. Run host-native validators where available, for example:

- `hermes plugins doctor <package>`
- `claude plugin validate <package> --strict`
- Pi package loading in a non-interactive mode

Also run secret and personal-data scanning, repository boundary and size checks when available, `git diff --check`, and the final `git diff` plus `git status`.

Record the actual output and distinguish these states:

- **Statically validated:** files parse and documented checks pass.
- **Loaded successfully:** the host reported a successful package load.
- **Interactive/runtime verified:** a real command or MCP invocation was exercised.
- **Not verified:** the host or runtime evidence was unavailable; do not claim the plugin works merely because its files parse.

Use a concise completion report that answers:

- What changed?
- How was it implemented and verified?
- Why was it implemented this way?
- What is the impact on CPU, memory, disk, network, downtime, blast radius, and review cost?

Also include installation, validation, and rollback commands; checks not run and why; whether related repository documentation remains accurate; and any host-specific limitations or human approval still required.

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreatePlugin","workflow":"CreatePlugin","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
