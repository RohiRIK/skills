# ModelUpgrade — Rubric

How to judge one skill against a target generation, of any vendor. Three questions, then one verdict. Adapted from Anthropic's prompt-audit guidance (bundled with the `claude-api` skill), narrowed to a skill library.

## 1. Relevance: is the job still worth a skill?

| Check | Ask | Points to |
|-------|-----|-----------|
| **Host-native** | Does the host or model now do this itself (a built-in command or skill, auto-compaction, native thinking, deferred tool loading)? | `retire`, or `replan` to the part the host doesn't cover |
| **Superseded** | Does another skill in this library now own the job (a sibling split, a newer skill)? | `retire` or fold into the owner |
| **Name collision** | Does a host built-in share the name, so routing picks one at random? | `replan`: rename or narrow the description |
| **BPE** | Would a smarter model make this skill unnecessary? Knowledge the model can't derive (house rules, tool contracts, gotchas, verified facts) says no. | `retire` only when the whole skill is reasoning scaffolding |
| **Still used** | Does `~/.claude/state/execution.jsonl` show it running? No entries is a weak signal, not proof. | context for the verdict |

## 2. Fit: is the text tuned for the target generation?

Run `Tools/ModelUpgrade.ts scan` for leads (`Signals.md`), then read each hit in context. A finding needs a named pattern **and** a reason from the target's entry in `Generations.md`, or a contradiction in the repository itself.

| Pattern | Looks like | Usual fix |
|---------|-----------|-----------|
| Pressure language | caps, 🚨, "MANDATORY", hedges on real requirements | Plain statement with the reason; caps only on safety or irreversibility gates |
| Scaffold the model or API replaced | "think step by step", "use extended thinking", plan-first, word caps, show-your-reasoning | Delete, or move depth to the `effort` field |
| Over-specification | numbered choreography for judgment work, prohibition walls, a single gold example | State goal, constraints, and how to verify; keep steps only where order is fragile |
| Fossil | workarounds named for an older model, update suppressors, anti-formatting rules | Re-test, then remove |
| Stale fact | a slash command, agent, path, flag, or tier claim the repo no longer has | Rewrite to the current fact (high confidence: the repo is the evidence) |
| Host coupling | a host-only command or tool named as a dependency | Name the skill; capability-check the tool and give a fallback (`rules/system.md` §7) |

## What stays (the keep list)

- **Context is never cruft.** Audience, product, environment facts, house rules, and the reasons behind constraints.
- **Fragile operations keep exact scripts.** Destructive commands, auth, release steps, file formats.
- **Gates stay.** `Verify`, "never send or publish", confirm-before-push. They guard irreversible actions, not model weakness.
- **Tool contracts stay and often grow.** Flags, exit codes, failure modes.
- **Routing text may carry calibrated urgency.** A `description` or `NOT FOR` clause is judged on trigger accuracy (`CreateSkill:OptimizeDescription`), not tone.
- **Quotes stay.** A "before → after" teaching table quotes the bad pattern on purpose.
- **Cruft is not length.** Never justify a cut by size alone; a clean skill is a valid result and gets no edits.

## 3. Multi-model: does the fix keep the other targets?

A skill can be stamped for several families (`tuned-for: claude-5.5, gpt-5.5`). Before an edit for the target, read the other families' ledger heads and ask whether the edit would regress any of them.

| The edit is | Do |
|-------------|----|
| Model-neutral (stale fact, plain wording, goal over choreography) | Apply it in the skill |
| Good for the target, harmful for another stamped family | Keep the skill neutral; put the target-specific advice in `Prompting/vendors/<Vendor>.md`, and the skill keeps working on both |
| Needed by the target only, harmless elsewhere | Apply it, with the reason in the line ("weaker models skip this step without it") |

A skill whose job only makes sense for one vendor (a Claude Code hook, a host command) is judged for that vendor and never stamped for others.

## 4. Verdict

| Verdict | Meaning | Next step |
|---------|---------|-----------|
| `keep` | Relevant and fits the target; at most cosmetic findings | Stamp the target into `tuned-for` |
| `reprompt` | Relevant; specific lines need rewording or a stale fact fixed | `Apply` → one finding per edit → stamp |
| `replan` | Relevant job, wrong shape: workflows built for an older model's limits, or overlapping a sibling or host built-in | `Apply` with a short plan; A/B before and after |
| `retire` | The job is gone, superseded, or host-native | Propose only. Deleting a skill is the owner's call |

Every finding carries a confidence: **high** (the target generation's documented behaviour, or the repo contradicts the text), **medium** (consistent observed behaviour), **low** (idiom-dating; report it, don't edit).
