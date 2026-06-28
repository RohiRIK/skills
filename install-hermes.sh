#!/usr/bin/env bash
# install-hermes.sh — symlink skills from this repo into ~/.hermes/skills/<category>/
# Hermes stores skills at ~/.hermes/skills/<category>/<skill-name>/
# Idempotent: existing correct links are left alone; existing real dirs are skipped.
set -uo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HERMES_DIR="$HOME/.hermes/skills"

# Extract YAML frontmatter field (simple grep-based, no yq needed)
field() { grep "^$1:" "$2" | head -1 | sed "s/^$1: *//; s/^\"//; s/\"$//"; }

link_skill() {
  local src="$1"
  local category="$2"
  local name="$3"
  local dest_dir="$HERMES_DIR/$category"
  local dest="$dest_dir/$name"

  mkdir -p "$dest_dir"
  if [ -L "$dest" ]; then
    ln -sfn "$src" "$dest"
    echo "  relinked  $category/$name"
  elif [ -e "$dest" ]; then
    echo "  SKIP      $category/$name (already exists)"
  else
    ln -s "$src" "$dest"
    echo "  linked    $category/$name"
  fi
}

echo "Skills repo: $REPO_DIR"
echo "Hermes dir:  $HERMES_DIR"
echo

linked=0
skipped=0

for src in "$REPO_DIR"/*/; do
  src="${src%/}"
  name="$(basename "$src")"

  # Skip non-skill directories
  [ "$name" = "assets" ] && continue
  [ "$name" = "rules" ] && continue
  [ "$name" = "_state" ] && continue
  # Skip TitleCase dirs (old format)
  [[ "$name" =~ ^[A-Z] ]] && continue
  [ -f "$src/SKILL.md" ] || continue

  # Extract category from metadata.hermes.tags (first tag is the category)
  category="$(grep -A5 'hermes:' "$src/SKILL.md" 2>/dev/null | grep 'tags:' | head -1 | sed 's/.*tags: *\[//; s/\].*//' | cut -d',' -f1 | sed 's/^ *//; s/ *$//' || true)"
  [ -z "$category" ] && category="uncategorized"

  link_skill "$src" "$category" "$name"
  ((linked++))
done

echo
echo "Done: $linked skills linked into $HERMES_DIR/<category>/"
echo "Restart Hermes to pick up the skills."
