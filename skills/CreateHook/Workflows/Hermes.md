# Hermes Workflow

Generate a Hermes Agent (NousResearch) plugin hook: a Python file auto-discovered from `~/.hermes/plugins/` (or project-local `.hermes/plugins/`, or a pip entry point) implementing one of the four lifecycle hooks.

## Step 1: Pick the Hook

| Hook | Fires | Common use |
|------|-------|------------|
| `pre_llm_call` | before a request goes to the model | inject context, redact sensitive input, block the call |
| `post_llm_call` | after a model response returns | log, transform the response, trigger a follow-up |
| `on_session_start` | session begins | load workspace state, print a banner |
| `on_session_end` | session ends | persist state, cleanup |

## Step 2: Write the Plugin

```python
from hermes.plugin import Plugin, hook

class BlockForcePush(Plugin):
    @hook("pre_llm_call")
    def check(self, context):
        command = context.get("pending_tool_command", "")
        if "git push" in command and "--force" in command:
            context.block(reason="Force-push requires manual confirmation")
        return context
```

Confirm the exact `context` object shape and `Plugin`/`hook` import path against current Hermes docs (`hermes-agent.nousresearch.com/docs/user-guide/features/plugins`) before finalizing — verify signatures rather than assuming from memory.

## Step 3: Drop In

```bash
mkdir -p ~/.hermes/plugins
cp block_force_push.py ~/.hermes/plugins/
```

Project-local plugins go in `.hermes/plugins/` in the repo root instead, for repo-scoped hooks.

## Step 4: Verify

Start a Hermes session and confirm the plugin loads (check the plugin list/log output) before relying on it — directory-discovered plugins can fail to register silently on a syntax error, same caution as OpenClaw.

## Telemetry

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"CreateHook","workflow":"Hermes","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
