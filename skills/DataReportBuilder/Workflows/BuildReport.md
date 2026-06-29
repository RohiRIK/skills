# BuildReport Workflow

**Purpose:** Take a raw Excel/CSV dataset and produce a two-layer report —
plain-language Summary, optional Action tabs, untouched Raw Data — then validate it.

Run the steps in order. Step 1 is a gate: never skip straight to building.

---

## Step 0 — One-time setup

Install the engine's dependencies once (bun + ExcelJS):

```bash
cd Tools && bun install
```

## Step 1 — ALWAYS ask scoping questions first

A dataset can be reported a dozen ways; a few questions separate a useful report
from a generic one. Ask via the interactive question tool (tappable options) so
the answer takes seconds. Skip any question already answered in the conversation.

Ask **3–5** of these, picking what fits the request:

1. **Who is the report for?** — `Customer / external` · `Management` · `Technical team` · `Mixed audience`
2. **What decision should it support?** — `Prioritise action items` · `Track status / progress` · `Compare options` · `Just understand the data`
3. **What is the single most important question it must answer?** — open question, let them type a sentence.
4. **Break the data down by which field?** (department, region, owner…) — offer the actual column names plus `No breakdown`.
5. **How blunt should the framing be?** — `Diplomatic — lead with the positive` · `Direct — lead with the gap`

If the user says "use your judgement", proceed with defaults (mixed audience,
prioritise action items, diplomatic framing) and state the assumptions in one line.

## Step 2 — Inspect the data

Understand the file before designing. ExcelJS reads both `.xlsx` and `.csv` and
is already a dependency:

```bash
cd Tools && bun -e '
  import ExcelJS from "exceljs";
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(process.argv[1]);          // or wb.csv.readFile(...)
  const ws = wb.worksheets[0];
  const headers = ws.getRow(1).values.slice(1);
  console.log("rows:", ws.rowCount - 1, "cols:", headers.length);
  console.log("columns:", headers.join(", "));
  ws.getRow(2).eachCell((c, i) => console.log(`  ${headers[i-1]} =`, c.value));
' "../path/to/file.xlsx"
```

Identify: the unit of analysis (one row = one user? one ticket?), key categorical
columns, anything needing de-duplication, and date columns stored as Excel serial
numbers. ExcelJS returns real `Date` objects for proper date cells; a raw serial
`n` converts with `new Date(Date.UTC(1899, 11, 30) + n * 86400000)`.

Derive the high-level finding the Step 1 answers point to. Classify rows into a
small number of clear buckets (2–4) — e.g. Ready / Cleanup / Action needed. Fewer
buckets read better.

## Step 3 — Build the report

Write a build script importing `ReportBuilder` from `Tools/ReportKit.ts`. Copy
`Tools/Example.ts` as a complete, runnable starting point.

The Summary tab contains, in this order:

1. **Title + subtitle** (org and date).
2. **Intro band** — one short everyday-language paragraph: *what was looked at and
   why it matters*. No jargon; if a technical concept is unavoidable, explain it in
   one plain sentence.
3. **Number cards** — the headline split (2–4 cards): big number, "% of total",
   one-line description. Status colour: `green` = fine, `amber` = minor work,
   `red` = action needed.
4. **Breakdown table** — the detail behind the headline (by category, or the field
   chosen in Step 1 Q4).
5. **Recommended next steps** — short numbered list. For `diplomatic` framing, lead
   with communication/enablement before any enforcement or blocking step.

Then the detail tabs:

- `actionList(rows, { statusCol, sortFirst })` — filterable per-row tab, status
  colour-coded, "action needed" floated to the top.
- `rawData(originalRows)` — **always include this**, the untouched source.

```ts
// build-report.ts — run with: bun build-report.ts
import { ReportBuilder, type Row } from "./Tools/ReportKit.ts";

const rb = new ReportBuilder("Mobile Email Access Review", { subtitle: "Acme Corp · May 2026" });
const s = rb.summary();
s.intro("What we looked at", "We want to protect company email on staff phones. That protection only works through the Outlook app.");
s.cards("Where staff stand today", [
  { label: "Ready – no action needed", value: 288, sub: "64% of staff", desc: "Already use only the Outlook app.", status: "green" },
  { label: "Minor cleanup", value: 50, sub: "11% of staff", desc: "Have Outlook but also a built-in mail app.", status: "amber" },
  { label: "Action needed", value: 113, sub: "25% of staff", desc: "Must switch to Outlook or lose mobile email.", status: "red" },
]);
s.table("Who needs to switch", ["Mail app today", "Staff", "What they need to do"], [
  ["Samsung Email", 44, "Install Outlook, remove old account"],
  ["Apple Mail", 30, "Install Outlook, remove old account"],
], { accentCol: 1 });
s.steps("Recommended rollout", [
  "1.  Notify the staff who need to switch.",
  "2.  Help them install Outlook.",
  "3.  Allow a grace period.",
  "4.  Only then turn on the blocking policy.",
], "This order means no one is locked out on day one.");

const detail: Row[] = [/* one object per row, keys are column headers */];
rb.actionList(detail, { statusCol: "Status", sortFirst: ["Action needed", "Cleanup", "Ready"], note: "Filter the Status column to plan by group." });
rb.rawData(detail);

await rb.save("./Report.xlsx");
```

The full typed API lives in the header docstring of `Tools/ReportKit.ts` — read it
for any method beyond this example.

## Step 4 — Validate

After saving, ALWAYS recalculate to confirm zero formula errors:

```bash
bun Tools/Recalc.ts ./Report.xlsx
```

Requires LibreOffice (`soffice` on PATH). If `status` is not `success`, fix the
reported cells and re-run. With no formulas, this is still a fast integrity check
that the file opens cleanly.

## Step 5 — Hand off

Present the file with a short summary of the tabs. Keep the chat message brief —
the workbook is the deliverable, not the message.

---

## Principles

- **The Summary must stand alone.** A reader who never opens the other tabs still
  understands the finding and the recommendation.
- **Plain language beats precision in the Summary.** Save exact terminology for the
  detail tabs.
- **Never alter the raw data.** It is the trust anchor — copy it in verbatim.
- **Few buckets, clear colours.** 2–4 status categories; consistent green / amber /
  red meaning throughout.
- **Frame findings as decisions, not failures.** "75% are ready, 25% need a one-time
  switch" lands better than "25% are non-compliant".

## Execution Log

```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"DataReportBuilder","workflow":"BuildReport","status":"ok","duration_s":'$SECONDS'}' \
  >> ~/.claude/state/execution.jsonl
```
