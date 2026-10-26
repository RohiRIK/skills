# ModelUpgrade — Signals

Greppable leads for dated prompt text. `Tools/ModelUpgrade.ts scan` reads every row of the table below (first cell a backticked id, third cell a backticked JavaScript regex, case-sensitive) and reports hits per skill. Fenced code blocks, inline `code` spans, and frontmatter are skipped: they usually quote a pattern or route the skill, and routing text is judged separately (see `Rubric.md`).

A hit is a lead, not a verdict. The judge reads the line in context and applies `Rubric.md`; most hits in teaching material (for example a "before → after" table in `Prompting`) are quotes and stay.

| Id | Group | Pattern | What to check |
|----|-------|---------|---------------|
| `pressure-caps` | pressure | `\b(MUST\|NEVER\|ALWAYS\|CRITICAL\|IMPORTANT)\b` | Caps emphasis. Keep it only on a genuine safety or irreversibility gate, ideally with the reason next to it; elsewhere say it at normal volume. |
| `hedge` | pressure | `\b([Tt]ry to\|[Ii]f possible\|[Ii]deally)\b` | Current models read hedges literally as permission to skip. If the step is required, state it plainly. |
| `trait-claim` | pressure | `\b[Yy]ou (tend to\|often\|sometimes)\b\|[Dd]on'?t be too [a-z]+` | Describes a habit of an older model. State the wanted behaviour instead. |
| `be-thorough` | pressure | `[Dd]o not be lazy\|[Dd]on'?t be lazy\|[Bb]e thorough\|[Dd]o not stop early` | Current models are proactive by default; delete unless a measured failure says otherwise. |
| `think-scaffold` | scaffold | `[Tt]hink step[- ]by[- ]step\|[Tt]ake a deep breath\|<scratchpad>\|<thinking>\|[Tt]hink (harder\|less)\|[Dd]on'?t overthink` | Thinking is native and controlled by effort, not prose. On always-thinking models a "don't think" rule cannot be followed. |
| `plan-first` | scaffold | `[Pp]lan before (acting\|you act)\|[Uu]se the think tool` | Current models plan unprompted; the instruction causes over-planning. |
| `word-cap` | scaffold | `\b(at most\|no more than\|under) [0-9]+ (words\|sentences\|bullets)\b` | Numeric output caps starve reasoning on hard problems. Keep only where the format itself needs the limit (a platform character count, a subject line). |
| `cadence` | scaffold | `every [0-9]+ (tool calls\|messages\|turns\|steps)` | Fixed narration or check-in cadences were written for chatty models. |
| `reasoning-output` | scaffold | `[Ss]how your (reasoning\|thinking)\|reasoning (field\|section)` | Asking the model to reproduce its reasoning can trigger a refusal on Claude 5-family models; ask for a short explanation of the answer instead. |
| `prefill` | scaffold | `[Pp]refill` | Assistant prefill returns an error on current Claude models; use structured outputs or a format instruction. |
| `self-verify` | fossil | `[Dd]ouble[- ]check\|[Rr]e-?verify (your\|the)\|[Vv]erify your (work\|answer)` | Generation-dependent: over-verification on Claude Opus 5, useful on Fable 5.1. Keep real gates (the `Verify` skill); question per-prompt "re-check your answer" lines. |
| `update-suppressor` | fossil | `[Hh]old (all )?(findings\|results)\|[Dd]on'?t narrate\|[Nn]o interim updates` | Current models under-narrate when these are present. |
| `anti-format` | fossil | `[Nn]ever use (bullets\|headers\|bold)\|[Nn]o (bullet points\|headers)\b` | Current models already under-format; replace with a rule for when formatting helps. |
| `tool-discourage` | fossil | `[Oo]nly use tools when\|[Mm]inimi[sz]e tool calls` | Followed literally; the model then answers from stale knowledge. Say when to check a source instead. |
| `model-pin` | fossil | `\b(claude-(2\|3\|instant)\|[Cc]laude (2\|3(\.[0-9])?\|[Ii]nstant)\|[Oo]pus 4(\.[0-8])?\|[Ss]onnet [34](\.[0-9])?\|[Hh]aiku [34](\.[0-9])?\|GPT-[34]o?\|[Gg]emini [12](\.[0-9])?)\b` | A named older model. Either the text is history (move it to `Generations.md`) or it is a workaround for that model (re-test, then remove). |
| `grader-vocab` | over-spec | `\b([Yy]ou will be graded\|hidden tests?)\b` | Describes the grader instead of the requirement. |
| `identity-stub` | over-spec | `^You are (a\|an) (helpful\|expert)` | Fine as a one-line focus; a finding only when it is the only context given. |
