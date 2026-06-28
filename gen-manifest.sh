#!/usr/bin/env bash
# gen-manifest.sh — regenerate skills.json + llms.txt from each skill's SKILL.md frontmatter.
# Updated for Hermes format: lowercase-hyphens, references/, categorized skills.
# Run after adding or editing any skill. Idempotent. Requires: jq.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

command -v jq >/dev/null || { echo "gen-manifest: jq is required" >&2; exit 1; }

skill_dirs() {
  for d in */; do
    d="${d%/}"
    case "$d" in doc|docs|assets|rules|_state) continue;; esac
    # Skip TitleCase dirs (old format) — only process lowercase-hyphens
    [[ "$d" =~ ^[A-Z] ]] && continue
    [ -f "$d/SKILL.md" ] && echo "$d"
  done | sort
}

frontmatter() { awk 'NR==1&&/^---/{f=1;next} f&&/^---/{exit} f{print}' "$1"; }
field() { printf '%s\n' "$1" | grep "^$2:" | sed "s/^$2: *//; s/^\"//; s/\"$//"; }
esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

# Extract category from metadata.hermes.tags (first tag is the category)
category_of() {
  local fm="$1"
  printf '%s\n' "$fm" | grep -A5 'hermes:' | grep 'tags:' | head -1 | sed 's/.*tags: *\[//; s/\].*//' | cut -d',' -f1 | sed 's/^ *//; s/ *$//'
}

# Extract tags from metadata.hermes.tags
tags_of() {
  local fm="$1"
  printf '%s\n' "$fm" | grep -A5 'hermes:' | grep 'tags:' | sed 's/.*tags: *\[//; s/\].*//' | tr ',' '\n' | sed 's/^ *//; s/ *$//' | paste -sd, -
}

# ---- skills.json ----
gen_json() {
  echo '{'
  echo '  "$schema": "https://json-schema.org/draft/2020-12/schema",'
  echo '  "repo": "RohiRIK/skills",'
  echo '  "description": "Hermes-compatible agent skills library. Each skill is a self-contained folder with SKILL.md + references/.",'
  echo "  \"generated\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo '  "skills": ['
  local first=1 d fm name desc catg version tags
  for d in $(skill_dirs); do
    fm="$(frontmatter "$d/SKILL.md")"
    name="$(field "$fm" name)"; desc="$(field "$fm" description)"
    catg="$(category_of "$fm")"; version="$(field "$fm" version || true)"
    tags="$(tags_of "$fm")"
    [ -z "$catg" ] && catg="uncategorized"
    [ -z "$version" ] && version="1.0.0"
    [ $first -eq 0 ] && echo '    },'; first=0
    echo '    {'
    echo "      \"name\": \"$(esc "$name")\","
    echo "      \"path\": \"$d/\","
    echo "      \"category\": \"$(esc "$catg")\","
    echo "      \"version\": \"$(esc "$version")\","
    echo "      \"tags\": \"$(esc "$tags")\","
    echo "      \"description\": \"$(esc "$desc")\""
  done
  echo '    }'
  echo '  ]'
  echo '}'
}

# ---- llms.txt ----
gen_llms() {
  cat <<'HEAD'
# Skills — Hermes agent skills library

> A library of reusable agent skills for Hermes. Each skill is a self-contained folder at the repo root with `SKILL.md` (frontmatter: name, description, version, author, license, metadata.hermes) and `references/` for detailed content.

## How to consume this repo (for AI agents)

- **One-shot machine-readable index:** [skills.json](skills.json) — every skill's name, path, category, version, tags, and description as JSON.
- **Per skill:** read `<skill-name>/SKILL.md` — the `description` field states WHAT it does + WHEN to use it; the `## Workflow Routing` table maps intents to `references/*.md`; `## Gotchas` holds failure knowledge; `## Examples` shows trigger→action.
- **Install:** Run `install-hermes.sh` to symlink all skills into `~/.hermes/skills/<category>/`.

## Skills by category
HEAD
  local c
  for c in workflow quality reference delegation meta visual prompting; do
    echo ""
    echo "### ${c}"
    jq -r --arg c "$c" '.skills[] | select(.category==$c) | "- [\(.name)](\(.path)SKILL.md) — \(.description)"' skills.json
  done
  cat <<'FOOT'

## Key docs

- [README.md](README.md) — human-facing index + install guide
- [install-hermes.sh](install-hermes.sh) — symlink skills into ~/.hermes/skills/
- [skills.json](skills.json) — machine-readable manifest
- [CLAUDE.md](CLAUDE.md) — Claude Code loader
- [AGENTS.md](AGENTS.md) — brief for non-Claude-Code tools
FOOT
}

gen_json > skills.json
jq empty skills.json   # fail loudly if invalid JSON
gen_llms > llms.txt

echo "gen-manifest: wrote skills.json ($(jq '.skills | length' skills.json) skills) + llms.txt"
