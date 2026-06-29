# Prompting — Agentic Workflows

Prompt-authoring guidance for long-horizon, multi-context, and multi-agent work. Folded from LifeOS Prompting `Standards.md` (Claude 4.x agentic blocks). Maps directly onto this repo's `.agent-state.md`, `Iterate`, `Orchestrate`, `Research`, and `StrategicCompact`.

## Multi-Context Window Workflows

For tasks that span more than one context window:

- **First-context setup.** Establish the framework before iterative work: test structures, validation scripts, explicit success criteria.
- **State tracking.** Use structured formats (JSON) for schema-dependent data like test status; unstructured text for progress notes; git for checkpoints across sessions. (This repo's convention is `.agent-state.md` — see `_state/StateFileSchema.md`.)
- **Quality-of-life tooling.** A setup script (`init.sh`) for graceful startup, test-env init, and state restoration pays for itself across resets.
- **Starting fresh vs compacting.** Strong models discover state from the filesystem well — a full context reset is often more effective than aggressive compaction of a degraded long context. (See `StrategicCompact`.)
- **Verification without a human in the loop.** Give the agent a way to check its own work: automated test suites, browser/visual validation, self-checking mechanisms. This is what makes an unattended loop trustworthy (see `Verify`).
- **Complete context usage.** For genuinely complex tasks, instruct the model to spend its entire output context on the task; pair with memory tools for seamless transitions across compaction.

## Parallel Tool Calling

- **Maximize parallelism by default.** If calling multiple tools with no dependencies, make all independent calls in one batch — e.g. read 3 files in 3 parallel calls. Call sequentially only when a call depends on a previous result. Never use placeholders or guess parameters. (This directly informs `Orchestrate/RunLayer`.)
- **Reduce parallelism when stability matters.** For fragile or stateful operations, execute sequentially with brief pauses between steps.

## Agentic Coding

- **Read before edit.** Never speculate about code you haven't opened. If a file is referenced, read it before answering or proposing a fix. Grounded answers only — no hallucinated APIs.
- **Prevent overengineering.** Make only directly-requested or clearly-necessary changes. Don't add unrequested features, refactor surrounding code, or build hypothetical flexibility. Reuse existing abstractions; keep it DRY.
- **Minimize file creation.** Remove temporary files, scripts, and helpers at task end.
- **No test-focused hard-coding.** Write general-purpose solutions that work for all valid inputs, not just the test cases. Don't hard-code values to make a test pass.

## Subagent Orchestration

- Define subagent tools with clear descriptions; a capable model then delegates naturally without explicit instruction. To restrict it: "Only delegate when a task clearly benefits from a separate agent with a new context window."
- **Subagent context design.** Each subagent receives minimal task-specific context, clear success criteria, and a structured interface for its result. (This is the contract `Orchestrate` uses when delegating to `Agy`/`OpenCode`/`Pi`, and the author-bias rule: the reviewer is a separate context from the writer.)
