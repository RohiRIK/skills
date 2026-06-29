#!/usr/bin/env bash
# install.sh — onboard this skills repo into your AI tools.
# Symlinks every skill folder (skills/*) into ~/.claude/skills (and opencode's path if present),
# and every slash command (commands/*.md) into ~/.claude/commands.
# Idempotent: existing correct links are left alone; existing real files are skipped with a warning.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude/skills"
OPENCODE_DIR="$HOME/.config/opencode/skills"
COMMANDS_DIR="$HOME/.claude/commands"

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

link_commands() {
  [ -d "$REPO_DIR/commands" ] || return 0
  mkdir -p "$COMMANDS_DIR"
  for src in "$REPO_DIR"/commands/*.md; do
    [ -e "$src" ] || continue
    local name; name="$(basename "$src")"
    local dest="$COMMANDS_DIR/$name"
    if [ -L "$dest" ]; then
      ln -sfn "$src" "$dest"
      echo "  relinked  /$(basename "$name" .md)"
    elif [ -e "$dest" ]; then
      echo "  SKIP      /$(basename "$name" .md) (real file already exists at $dest)"
    else
      ln -s "$src" "$dest"
      echo "  linked    /$(basename "$name" .md)"
    fi
  done
}

echo "Skills repo: $REPO_DIR"
echo
echo "Claude Code skills -> $CLAUDE_DIR"
link_into "$CLAUDE_DIR"

if [ -d "$HOME/.config/opencode" ]; then
  echo
  echo "opencode skills -> $OPENCODE_DIR"
  link_into "$OPENCODE_DIR"
fi

echo
echo "Claude Code commands -> $COMMANDS_DIR"
link_commands

echo
echo "Done. Restart your AI tool session to pick up the skills and commands."
