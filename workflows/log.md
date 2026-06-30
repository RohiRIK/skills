# Log — workflows bundle

Chronological history of this OKF bundle (OKF reserved file). Newest first.

## 2026-06-30

- Converted the bundle to **OKF** (Open Knowledge Format): added YAML frontmatter
  (`type: Workflow`, `title`, `description`, `tags`, `chain`) to all 22 workflow concepts.
- Renamed `README.md` → `index.md` (OKF reserved progressive-disclosure index).
- Added this `log.md` (OKF reserved history file).
- Each concept now opens with a read-receipt step: state the chain before running it.
- Removed the redundant `/workflow` slash command; the `Workflows` skill is the sole router.

## 2026-06-29

- Created the `workflows/` directory — one document per composed skill chain, two families
  (build & ship, maintain the library). Seeded 22 chains and a README index.
- Added the `frontend-build` chain.
- Surfaced the chains in the AI-discovery layer (`skills.json` + `llms.txt` via `gen-manifest.sh`).
