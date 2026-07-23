# Hook — Design Principles (all runtimes)

Cross-cutting rules that apply regardless of target runtime. Runtime-specific mechanics live in `RuntimeMap.md` and the per-runtime workflow files.

## Idempotency

A hook can fire more than once for the same logical event (retries, replayed sessions, multiple matching patterns). Write handlers so a duplicate firing is harmless — check-before-write, not blind append, when the hook mutates external state (files, DBs, API calls).

## Fast by default

Hooks sit in the agent's hot path — every extra millisecond in a `PreToolUse`/`pre_llm_call` hook delays every single tool call or model turn. Keep hook bodies synchronous and cheap; push anything slow (network calls, heavy parsing) behind an early-exit filter so it only runs for the specific event it needs to handle, not every event of that type.

## Failure mode: fail open vs fail closed

Decide deliberately, per hook:
- **Fail closed** (block the action on hook error) for safety/security hooks — e.g. a hook scanning for destructive commands should block if it can't determine safety.
- **Fail open** (let the action proceed, log the error) for observability/convenience hooks — e.g. a logging hook shouldn't be able to break the agent if the log destination is unreachable.

A hook with unhandled exceptions defaults differently per runtime — check whether the target treats an uncaught error as block or pass-through before shipping.

## Security

A hook has the same access as the process it runs in — a malicious or careless hook can read/write anything the agent can. Treat hook code with the same scrutiny as the tool it's guarding:
- Never hardcode secrets in hook files; read from environment.
- Validate/sanitize any external input the hook receives (tool args, command strings) before using it in a shell command or file path — hook code that shells out with unsanitized input is a command-injection vector.
- Prefer allow-listing specific patterns to block (e.g. `rm -rf`, `git push --force`) over trying to enumerate every dangerous case — but know an allow-list is not exhaustive; pair with a human-in-the-loop confirmation for genuinely destructive actions where possible.

## Testing a hook

Before wiring a hook into the live config, dry-run it: feed it the exact payload shape the runtime sends (see the per-runtime workflow file for the payload schema), confirm the block/allow decision is correct on both a matching and non-matching input, then register it.
