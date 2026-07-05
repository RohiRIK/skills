// Resync skills.json + llms.txt skill descriptions from SKILL.md frontmatter.
// Run from anywhere: bun skills/SkillForge/Tools/SyncMirrors.ts
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repo = resolve(import.meta.dir, "..", "..", "..");
const skillsDir = join(repo, "skills");

type Meta = { name: string; description: string; category?: string; effort?: string };
const metas = new Map<string, Meta>();

for (const dir of readdirSync(skillsDir)) {
  let raw: string;
  try {
    raw = readFileSync(join(skillsDir, dir, "SKILL.md"), "utf8");
  } catch {
    continue;
  }
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const get = (k: string) => {
    const m = fm[1].match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m"));
    return m ? m[1] : undefined;
  };
  metas.set(dir, {
    name: get("name") ?? dir,
    description: get("description") ?? "",
    category: get("category"),
    effort: get("effort"),
  });
}

// skills.json — update description/category/effort per entry, matched by path
const sj = JSON.parse(readFileSync(join(repo, "skills.json"), "utf8"));
let sjChanged = 0;
for (const entry of sj.skills) {
  const dir = (entry.path ?? "").replace(/^skills\//, "").replace(/\/$/, "");
  const meta = metas.get(dir);
  if (!meta) continue;
  for (const k of ["description", "category", "effort"] as const) {
    if (meta[k] && entry[k] !== meta[k]) {
      entry[k] = meta[k];
      sjChanged++;
    }
  }
}
sj.generated = new Date().toISOString().replace(/\.\d+Z$/, "Z");
writeFileSync(join(repo, "skills.json"), JSON.stringify(sj, null, 2) + "\n");

// llms.txt — rewrite "- [Name](skills/<Dir>/SKILL.md) — <desc>" lines
const llmsPath = join(repo, "llms.txt");
const lines = readFileSync(llmsPath, "utf8").split("\n");
let llChanged = 0;
const out = lines.map((line) => {
  const m = line.match(/^- \[([^\]]+)\]\(skills\/([^/]+)\/SKILL\.md\) — /);
  if (!m) return line;
  const meta = metas.get(m[2]);
  if (!meta) return line;
  const next = `- [${m[1]}](skills/${m[2]}/SKILL.md) — ${meta.description}`;
  if (next !== line) llChanged++;
  return next;
});
writeFileSync(llmsPath, out.join("\n"));

console.log(`skills.json fields updated: ${sjChanged}; llms.txt lines updated: ${llChanged}`);
