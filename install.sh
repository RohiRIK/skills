#!/usr/bin/env bash
# install.sh — onboard this skills repo into your AI tools.
# Symlinks every skill folder (skills/*) into ~/.claude/skills (and opencode's path if present).
# Idempotent: existing correct links are left alone; existing real dirs are skipped with a warning.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude/skills"
OPENCODE_DIR="$HOME/.config/opencode/skills"

link_into() {
  local dest_root="$1"
  mkdir -p "$dest_root"
  for src in "$REPO_DIR"/skills/*/; do
    src="${src%/}"
    local name; name="$(basename "$src")"
    [ -f "$src/SKILL.md" ] || continue
    local dest="$dest_root/$name"
    if [ -L "$dest" ]; then
      ln -sfn "$src" "$dest"
      echo "  relinked  $name"
    elif [ -e "$dest" ]; then
      echo "  SKIP      $name (real dir/file already exists at $dest)"
    else
      ln -s "$src" "$dest"
      echo "  linked    $name"
    fi
  done
}

echo "Skills repo: $REPO_DIR"
echo
echo "Claude Code -> $CLAUDE_DIR"
link_into "$CLAUDE_DIR"

if [ -d "$HOME/.config/opencode" ]; then
  echo
  echo "opencode -> $OPENCODE_DIR"
  link_into "$OPENCODE_DIR"
fi

echo
echo "Done. Restart your AI tool session to pick up the skills."
