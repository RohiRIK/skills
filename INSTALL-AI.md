# Skills — AI Tool Installation

> **If an AI is reading this on your behalf:** Before running anything, ask the user:
> 1. **Which tool?** (Claude Code / opencode, Cursor, VS Code + Copilot, Windsurf)
> 2. **Which skills?** List the skills from the repo and let the user pick — do not install all by default.
>
> Then jump to the matching section and run only the commands for the selected skills.

The fastest path on Mac/Linux for Claude Code + opencode is the bundled script:

```bash
git clone https://github.com/RohiRIK/skills.git ~/rohi-skills
cd ~/rohi-skills && ./install.sh
```

The sections below are the manual equivalents, per tool.

---

## Which tool are you using?

| Tool | Go to |
|---|---|
| Claude Code / opencode | [Claude Code / opencode](#claude-code--opencode) |
| Cursor | [Cursor](#cursor) |
| VS Code + GitHub Copilot | [VS Code + GitHub Copilot](#vs-code--github-copilot) |
| Windsurf | [Windsurf](#windsurf) |

---

## Claude Code / opencode

| Tool | Skills path |
|---|---|
| Claude Code | `~/.claude/skills/` |
| opencode | `~/.config/opencode/skills/` |

### Mac / Linux

```bash
# 1. Clone
git clone https://github.com/RohiRIK/skills.git ~/rohi-skills

# 2a. Link one skill  (replace Art with any skill folder name)
ln -s ~/rohi-skills/skills/Art ~/.claude/skills/Art
ln -s ~/rohi-skills/skills/Art ~/.config/opencode/skills/Art  # opencode

# 2b. Or link all skills at once (or just run ./install.sh)
for d in ~/rohi-skills/skills/*/; do n=$(basename "$d"); [ "$n" = assets ] && continue; ln -s "$d" ~/.claude/skills/"$n"; done
mkdir -p ~/.config/opencode/skills
for d in ~/rohi-skills/skills/*/; do n=$(basename "$d"); [ "$n" = assets ] && continue; ln -s "$d" ~/.config/opencode/skills/"$n"; done

# 3. Verify
test -f ~/.claude/skills/Art/SKILL.md && echo "OK"
```

### Windows (elevated PowerShell)

```powershell
# 1. Clone
git clone https://github.com/RohiRIK/skills.git "$env:USERPROFILE\rohi-skills"

# 2a. Link one skill  (replace Art with any skill folder name)
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\skills\Art" -Target "$env:USERPROFILE\rohi-skills\skills\Art"

# 2b. Or link all skills at once
Get-ChildItem "$env:USERPROFILE\rohi-skills\skills" -Directory | Where-Object Name -ne 'assets' | ForEach-Object {
  New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\skills\$($_.Name)" -Target $_.FullName
}

# 3. Verify
Test-Path "$env:USERPROFILE\.claude\skills\Art\SKILL.md"
```

### Uninstall

```bash
rm ~/.claude/skills/Art              # Claude Code
rm ~/.config/opencode/skills/Art    # opencode
```

---

## Cursor

Cursor loads skills as rule files (`.mdc`) inside `.cursor/rules/`. Run from your project root.

```bash
# Mac / Linux
git clone https://github.com/RohiRIK/skills.git ~/rohi-skills   # skip if cloned
mkdir -p .cursor/rules
for d in ~/rohi-skills/skills/*/; do n=$(basename "$d"); [ "$n" = assets ] && continue; cp "$d/SKILL.md" ".cursor/rules/$n.mdc"; done
```

```powershell
# Windows
git clone https://github.com/RohiRIK/skills.git "$env:USERPROFILE\rohi-skills"   # skip if cloned
New-Item -ItemType Directory -Force ".cursor\rules" | Out-Null
Get-ChildItem "$env:USERPROFILE\rohi-skills\skills" -Directory | Where-Object Name -ne 'assets' | ForEach-Object {
  Copy-Item "$($_.FullName)\SKILL.md" ".cursor\rules\$($_.Name).mdc"
}
```

> Rules are project-local. Repeat per project, or use Cursor's global rules setting.

---

## VS Code + GitHub Copilot

VS Code Copilot natively supports the `SKILL.md` format. Link skill folders into `.github/skills/` (project) or `~/.copilot/skills/` (all projects). Skills appear as `/` slash commands in Copilot Chat.

```bash
# Mac / Linux — all skills, project-local
git clone https://github.com/RohiRIK/skills.git ~/rohi-skills   # skip if cloned
mkdir -p .github/skills
for d in ~/rohi-skills/skills/*/; do n=$(basename "$d"); [ "$n" = assets ] && continue; ln -s "$d" ".github/skills/$n"; done

# Mac / Linux — all skills, personal (every project)
mkdir -p ~/.copilot/skills
for d in ~/rohi-skills/skills/*/; do n=$(basename "$d"); [ "$n" = assets ] && continue; ln -s "$d" ~/.copilot/skills/"$n"; done
```

```powershell
# Windows (elevated) — personal
New-Item -ItemType Directory -Force "$env:USERPROFILE\.copilot\skills" | Out-Null
Get-ChildItem "$env:USERPROFILE\rohi-skills\skills" -Directory | Where-Object Name -ne 'assets' | ForEach-Object {
  New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.copilot\skills\$($_.Name)" -Target $_.FullName
}
```

Type `/` in Copilot Chat to invoke an installed skill; `/skills` opens the Configure Skills menu.

---

## Windsurf

Windsurf reads project rules from `.windsurfrules` in your project root.

```bash
# Mac / Linux
git clone https://github.com/RohiRIK/skills.git ~/rohi-skills   # skip if cloned
for d in ~/rohi-skills/skills/*/; do n=$(basename "$d"); [ "$n" = assets ] && continue; cat "$d/SKILL.md" >> .windsurfrules && echo "" >> .windsurfrules; done
```

```powershell
# Windows
git clone https://github.com/RohiRIK/skills.git "$env:USERPROFILE\rohi-skills"   # skip if cloned
Get-ChildItem "$env:USERPROFILE\rohi-skills\skills" -Directory | Where-Object Name -ne 'assets' | ForEach-Object {
  Get-Content "$($_.FullName)\SKILL.md" | Add-Content ".windsurfrules"
  Add-Content ".windsurfrules" ""
}
```

> Rules are project-local. For global availability, use Windsurf's global rules setting.

---

## Troubleshooting

**Broken symlink (Mac/Linux):**
```bash
rm ~/.claude/skills/Art && ln -s ~/rohi-skills/skills/Art ~/.claude/skills/Art
```

**"You do not have sufficient privilege" (Windows):** reopen PowerShell as Administrator, then retry.

**Skill not triggering:**
- Confirm the skill *folder* (not just `SKILL.md`) exists at the destination.
- Restart your AI tool session.
- **Claude Code / opencode:** check the skill's `description:` field — it controls automatic activation.
- **VS Code:** type `/` in Copilot Chat; the skill should appear. If not, confirm the folder name matches the `name:` in `SKILL.md`.
