#!/usr/bin/env bash
# gen-manifest.sh — regenerate skills.json + llms.txt from each skill's SKILL.md frontmatter.
# Run after adding or editing any skill. Idempotent. Requires: jq.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

command -v jq >/dev/null || { echo "gen-manifest: jq is required" >&2; exit 1; }

skill_dirs() {
  for d in skills/*/; do
    d="${d%/}"
    [ -f "$d/SKILL.md" ] && echo "$d"
  done | sort
}

frontmatter() { awk 'NR==1&&/^---/{f=1;next} f&&/^---/{exit} f{print}' "$1"; }
field() { printf '%s\n' "$1" | grep "^$2:" | sed "s/^$2: *//; s/^\"//; s/\"$//"; }
esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

# Composed workflow chains live in workflows/ — an OKF bundle (one concept .md per workflow,
# plus the OKF reserved files index.md + log.md). Each concept carries YAML frontmatter.
workflow_docs() {
  for f in workflows/*.md; do
    case "$(basename "$f")" in index.md|log.md) continue ;; esac
    [ -f "$f" ] && echo "$f"
  done | sort
}
wf_name() { basename "$1" .md; }

tier_of() {
  local fm="$1"
  if   printf '%s\n' "$fm" | grep -q '^user-invocable: *false';        then echo "A-reference"
  elif printf '%s\n' "$fm" | grep -q '^disable-model-invocation: *true'; then echo "B-command"
  elif printf '%s\n' "$fm" | grep -q '^context: *fork';                then echo "D-fork"
  else echo "C-auto"; fi
}

# ---- skills.json ----
gen_json() {
  echo '{'
  echo '  "$schema": "https://json-schema.org/draft/2020-12/schema",'
  echo '  "repo": "RohiRIK/skills",'
  echo '  "description": "Personal library of reusable Agent Skills for Claude Code, opencode, and other AI coding tools. Each entry is a self-contained skill folder with a SKILL.md.",'
  echo "  \"generated\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo '  "skills": ['
  local first=1 d fm name desc catg eff dom tier wf
  for d in $(skill_dirs); do
    fm="$(frontmatter "$d/SKILL.md")"
    name="$(field "$fm" name)"; desc="$(field "$fm" description)"
    catg="$(field "$fm" category)"; eff="$(field "$fm" effort)"; dom="$(field "$fm" domain)"; tier="$(tier_of "$fm")"
    wf="$(ls "$d/Workflows" 2>/dev/null | sed 's/\.md$//' | paste -sd, - 2>/dev/null || true)"
    [ $first -eq 0 ] && echo '    },'; first=0
    echo '    {'
    echo "      \"name\": \"$(esc "$name")\","
    echo "      \"path\": \"$d/\","
    echo "      \"category\": \"$(esc "$catg")\","
    echo "      \"effort\": \"$(esc "$eff")\","
    echo "      \"domain\": \"$(esc "$dom")\","
    echo "      \"tier\": \"$tier\","
    echo "      \"workflows\": \"$(esc "$wf")\","
    echo "      \"description\": \"$(esc "$desc")\""
  done
  echo '    }'
  echo '  ],'
  echo '  "workflows_index": "workflows/index.md",'
  echo '  "workflows": ['
  local wf_first=1 f wname wfm wtitle wdesc wchain wtags
  for f in $(workflow_docs); do
    wname="$(wf_name "$f")"
    wfm="$(frontmatter "$f")"
    wtitle="$(field "$wfm" title)"; wdesc="$(field "$wfm" description)"
    wchain="$(field "$wfm" chain)"; wtags="$(field "$wfm" tags)"
    [ $wf_first -eq 0 ] && echo '    },'; wf_first=0
    echo '    {'
    echo "      \"name\": \"$(esc "$wname")\","
    echo "      \"title\": \"$(esc "$wtitle")\","
    echo "      \"path\": \"$f\","
    echo "      \"tags\": \"$(esc "$wtags")\","
    echo "      \"chain\": \"$(esc "$wchain")\","
    echo "      \"summary\": \"$(esc "$wdesc")\""
  done
  echo '    }'
  echo '  ]'
  echo '}'
}

# ---- llms.txt ----
gen_llms() {
  cat <<'HEAD'
# Skills — personal Agent Skills library

> A library of reusable Agent Skills for Claude Code, opencode, and other AI coding tools. Each skill is a self-contained folder under `skills/` with a `SKILL.md` (frontmatter: name, description, category, effort, domain + instructions). The agentic skills compose: primitives (Verify, Reflect) are called by drivers (Iterate, Orchestrate, IterativeDepth, Research); meta skills (CreateSkill, SkillForge) build and audit the library.

## How to consume this repo (for AI agents)

- **One-shot machine-readable index:** [skills.json](skills.json) — every skill's name, path, category, effort, domain, tier, workflows, and description as JSON. Parse this instead of opening every file.
- **Per skill:** read `<SkillName>/SKILL.md` — the `description` field states WHAT it does + WHEN to use it; the `## Workflow Routing` table maps intents to `Workflows/*.md`; `## Gotchas` holds the highest-density failure knowledge; `## Examples` shows trigger->action.
- **System model:** [rules/system.md](rules/system.md) — tier model (A/B/C/D), frontmatter contract, composition graph, state + telemetry conventions.
- **Composed workflows:** [workflows/index.md](workflows/index.md) — an OKF bundle of multi-skill chains for full jobs (build & ship, maintain the library); each chain is one markdown concept with YAML frontmatter (`type: Workflow`, `chain`, `tags`). `skills.json` also carries a `workflows` array with each chain's `title`, `chain`, `tags`, and `summary`.

## Skills by category
HEAD
  local c
  for c in workflow quality reference delegation meta visual prompting; do
    echo ""
    echo "### ${c}"
    jq -r --arg c "$c" '.skills[] | select(.category==$c) | "- [\(.name)](\(.path)SKILL.md) — \(.description)"' skills.json
  done

  echo ""
  echo "## Workflows (composed skill chains)"
  echo ""
  echo "> Multi-skill chains for full jobs, as an OKF bundle — one markdown concept per workflow with YAML frontmatter. Two families: build & ship (use the skills on a project) and maintain the library (meta). Index: [workflows/index.md](workflows/index.md)."
  echo ""
  jq -r '.workflows[] | "- [\(.title)](\(.path)) — \(.summary) · chain: \(.chain)"' skills.json

  cat <<'FOOT'

## Key docs

- [README.md](README.md) — human-facing index + install guide
- [workflows/index.md](workflows/index.md) — composed skill chains, OKF bundle (one concept per workflow)
- [rules/system.md](rules/system.md) — canonical skill-system spec
- [CLAUDE.md](CLAUDE.md) — Claude Code loader + composition map
- [AGENTS.md](AGENTS.md) — brief for non-Claude-Code tools
- [INSTALL-AI.md](INSTALL-AI.md) — install guide for all supported tools
- [skills.json](skills.json) — machine-readable manifest (skills + workflows)
FOOT
}

gen_json > skills.json
jq empty skills.json   # fail loudly if invalid JSON
gen_llms > llms.txt

echo "gen-manifest: wrote skills.json ($(jq '.skills | length' skills.json) skills, $(jq '.workflows | length' skills.json) workflows) + llms.txt"
