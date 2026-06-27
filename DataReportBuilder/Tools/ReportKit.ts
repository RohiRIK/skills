/**
 * ReportKit.ts — reusable toolkit for two-layer Excel reports (bun + ExcelJS).
 *
 * Produces workbooks with a plain-language Summary tab (for non-technical
 * readers), optional analysis tabs, and an untouched Raw Data tab.
 *
 * Usage:
 *   import { ReportBuilder } from "./ReportKit.ts";
 *
 *   const rb = new ReportBuilder("My Report Title", { subtitle: "Org · Month 2026" });
 *   const s = rb.summary();
 *   s.intro("What we looked at", "Plain-language paragraph...");
 *   s.cards("Where things stand", [
 *     { label: "Ready",   value: 288, sub: "64% of staff", desc: "Already fine.",     status: "green" },
 *     { label: "Cleanup", value: 50,  sub: "11% of staff", desc: "Small fix needed.", status: "amber" },
 *     { label: "Action",  value: 113, sub: "25% of staff", desc: "Must take action.", status: "red"   },
 *   ]);
 *   s.table("Breakdown", ["Group", "Count", "Action"], rows, { accentCol: 1 });
 *   s.steps("Recommended next steps", ["1. ...", "2. ..."]);
 *   rb.actionList(rows, { statusCol: "Status" });   // optional filterable tab
 *   rb.rawData(originalRows);                        // always include
 *   await rb.save("./outputs/Report.xlsx");
 *
 * After saving, ALWAYS run `bun Tools/Recalc.ts <file>` to verify zero errors.
 */

import ExcelJS from "exceljs";

const FONT = "Arial";

// Palette — ARGB (ExcelJS requires the leading alpha pair). ---------------
const NAVY = "FF1F3864";
const BLUE = "FF2F5496";
const GREY = "FF595959";
const LIGHT = "FFD6E4F0";

/** Status key → [text colour, fill colour] as ARGB. */
const STATUS: Record<string, readonly [string, string]> = {
  green: ["FF548235", "FFE2EFDA"],
  amber: ["FFBF8F00", "FFFFF2CC"],
  red: ["FFC00000", "FFFCE4E4"],
  blue: ["FF2F5496", "FFDEEAF6"],
  grey: ["FF595959", "FFEDEDED"],
};

export type StatusKey = keyof typeof STATUS;

/**
 * Free-text status label → status colour, used by `actionList` colour-coding.
 * Matching is case-insensitive and substring-based. Extend as needed.
 */
const STATUS_BY_LABEL: ReadonlyArray<readonly [string, StatusKey]> = [
  ["action needed", "red"],
  ["action", "red"],
  ["at risk", "red"],
  ["blocked", "red"],
  ["cleanup", "amber"],
  ["minor", "amber"],
  ["in progress", "amber"],
  ["review", "amber"],
  ["ready", "green"],
  ["compliant", "green"],
  ["done", "green"],
  ["ok", "green"],
];

function statusForLabel(label: string): readonly [string, string] {
  const l = label.toLowerCase();
  for (const [needle, key] of STATUS_BY_LABEL) {
    if (l.includes(needle)) return STATUS[key];
  }
  return ["FF000000", "FFFFFFFF"];
}

export type CellValue = string | number | boolean | null | undefined;
export type Row = Record<string, CellValue>;

interface FontOpts {
  size?: number;
  bold?: boolean;
  color?: string;
  italic?: boolean;
}

function font(o: FontOpts = {}): Partial<ExcelJS.Font> {
  return {
    name: FONT,
    size: o.size ?? 11,
    bold: o.bold ?? false,
    italic: o.italic ?? false,
    color: { argb: o.color ?? "FF000000" },
  };
}

function fill(argb: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb } };
}

const COLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface Card {
  label: string;
  value: number | string;
  sub?: string;
  desc: string;
  status: StatusKey;
}

interface PutOpts extends FontOpts {
  bg?: string;
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
  wrap?: boolean;
}

/** Plain-language Summary sheet builder. Tracks the current write row. */
class Summary {
  private row = 2;

  constructor(private readonly ws: ExcelJS.Worksheet) {
    ws.views = [{ showGridLines: false }];
    [3, 34, 16, 18, 38, 3].forEach((w, i) => {
      ws.getColumn(i + 1).width = w;
    });
  }

  private put(ref: string, val: CellValue, o: PutOpts = {}): ExcelJS.Cell {
    const c = this.ws.getCell(ref);
    c.value = val ?? null;
    c.font = font(o);
    if (o.bg) c.fill = fill(o.bg);
    c.alignment = {
      horizontal: o.align ?? "left",
      vertical: o.valign ?? "middle",
      wrapText: o.wrap ?? false,
    };
    return c;
  }

  title(text: string, subtitle?: string): void {
    this.ws.getRow(1).height = 8;
    this.put(`B${this.row}`, text, { size: 20, bold: true, color: NAVY });
    this.row += 1;
    if (subtitle) {
      this.put(`B${this.row}`, subtitle, { size: 10, color: GREY, italic: true });
      this.ws.mergeCells(`B${this.row}:E${this.row}`);
      this.row += 1;
    }
    this.row += 1;
  }

  private band(text: string): void {
    this.put(`B${this.row}`, text, { size: 11, bold: true, color: "FFFFFFFF", bg: BLUE });
    for (const c of "CDE") this.ws.getCell(`${c}${this.row}`).fill = fill(BLUE);
    this.row += 1;
  }

  /** A blue band heading followed by a wrapped paragraph. */
  intro(heading: string, body: string): void {
    this.band(heading);
    const lines = body.split("\n").length;
    const wraps = Math.floor(body.length / 55);
    this.ws.getRow(this.row).height = Math.max(48, 16 * (lines + wraps));
    const c = this.put(`B${this.row}`, body, { bg: LIGHT, wrap: true });
    c.alignment = { horizontal: "left", vertical: "top", wrapText: true };
    this.ws.mergeCells(`B${this.row}:E${this.row}`);
    this.row += 2;
  }

  /** Headline number cards (2–4). Each: big number + label + sub + description. */
  cards(heading: string, items: Card[]): void {
    this.band(heading);
    for (const { label, value, sub, desc, status } of items) {
      const [fg, bg] = STATUS[status] ?? STATUS.grey;
      const r = this.row;
      this.ws.getRow(r).height = 30;
      this.ws.getRow(r + 1).height = 46;

      const num = this.put(`B${r}`, value, {
        size: 26, bold: true, color: fg, bg, align: "center", valign: "middle",
      });
      if (typeof value === "number") num.numFmt = "#,##0";
      this.ws.mergeCells(`B${r}:B${r + 1}`);

      this.put(`C${r}`, label, { size: 12, bold: true, color: fg, bg });
      this.ws.mergeCells(`C${r}:E${r}`);

      const txt = sub ? `${sub}   —   ${desc}` : desc;
      const c = this.put(`C${r + 1}`, txt, { size: 10, bg, wrap: true });
      c.alignment = { horizontal: "left", vertical: "top", wrapText: true };
      this.ws.mergeCells(`C${r + 1}:E${r + 1}`);
      this.row += 2;
    }
    this.row += 1;
  }

  /** A simple labelled table. `accentCol`: column index to bold + colour red. */
  table(
    heading: string,
    headers: string[],
    rows: CellValue[][],
    opts: { accentCol?: number } = {},
  ): void {
    this.band(heading);
    const cols = COLS.slice(1, 1 + headers.length); // B, C, D, E
    headers.forEach((h, i) => {
      this.put(`${cols[i]}${this.row}`, h, {
        size: 10, bold: true, color: "FFFFFFFF", bg: GREY,
        align: i ? "center" : "left",
      });
    });
    this.row += 1;
    for (const rec of rows) {
      this.ws.getRow(this.row).height = 22;
      rec.forEach((val, i) => {
        const accent = i === opts.accentCol;
        this.put(`${cols[i]}${this.row}`, val, {
          size: 10, bold: accent,
          color: accent ? "FFC00000" : "FF000000",
          align: i ? "center" : "left",
        });
      });
      this.row += 1;
    }
    this.row += 1;
  }

  /** A numbered/ordered list of recommended steps, with optional footnote. */
  steps(heading: string, steps: string[], footnote?: string): void {
    this.band(heading);
    for (const st of steps) {
      this.ws.getRow(this.row).height = 20;
      this.put(`B${this.row}`, st, { size: 10 });
      this.ws.mergeCells(`B${this.row}:E${this.row}`);
      this.row += 1;
    }
    if (footnote) {
      this.put(`B${this.row}`, footnote, { size: 9, color: GREY, italic: true });
      this.ws.mergeCells(`B${this.row}:E${this.row}`);
      this.row += 1;
    }
    this.row += 1;
  }
}

export interface ActionListOpts {
  sheetName?: string;
  statusCol?: string;
  note?: string;
  /** Status values to float to the top, in order (e.g. ["Action needed","Ready"]). */
  sortFirst?: string[];
  /** Explicit column order; defaults to the union of keys across rows. */
  columns?: string[];
}

function colLetter(n: number): string {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function inferColumns(rows: Row[]): string[] {
  const seen = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r)) seen.add(k);
  return [...seen];
}

export class ReportBuilder {
  private readonly wb = new ExcelJS.Workbook();
  private readonly summaryWs: ExcelJS.Worksheet;
  private readonly summarySheet: Summary;

  constructor(title: string, opts: { subtitle?: string } = {}) {
    this.summaryWs = this.wb.addWorksheet("Summary");
    this.summarySheet = new Summary(this.summaryWs);
    this.summarySheet.title(title, opts.subtitle);
  }

  /** The summary sheet builder — add intro / cards / table / steps. */
  summary(): Summary {
    return this.summarySheet;
  }

  /**
   * A clean, filterable per-row tab. If `statusCol` is given, status cells are
   * colour-coded. `sortFirst` floats matching status values to the top.
   */
  actionList(rows: Row[], opts: ActionListOpts = {}): ExcelJS.Worksheet {
    const sheetName = opts.sheetName ?? "Action List";
    const columns = opts.columns ?? inferColumns(rows);

    let data = [...rows];
    if (opts.statusCol && opts.sortFirst) {
      const order = new Map(opts.sortFirst.map((v, i) => [v, i]));
      data = data
        .map((r, i) => ({ r, i })) // keep stable for ties
        .sort((a, b) => {
          const oa = order.get(String(a.r[opts.statusCol!])) ?? 99;
          const ob = order.get(String(b.r[opts.statusCol!])) ?? 99;
          return oa - ob || a.i - b.i;
        })
        .map((x) => x.r);
    }

    const ws = this.wb.addWorksheet(sheetName, { views: [{ showGridLines: false }] });
    const ncol = columns.length;

    ws.getRow(1).height = 24;
    const t = ws.getCell(1, 1);
    t.value = sheetName;
    t.font = font({ size: 14, bold: true, color: NAVY });
    ws.mergeCells(1, 1, 1, ncol);

    let hdrRow = 2;
    if (opts.note) {
      const n = ws.getCell(2, 1);
      n.value = opts.note;
      n.font = font({ size: 9, color: GREY, italic: true });
      ws.mergeCells(2, 1, 2, ncol);
      hdrRow = 4;
    }

    columns.forEach((col, i) => {
      const c = ws.getCell(hdrRow, i + 1);
      c.value = col;
      c.font = font({ size: 10, bold: true, color: "FFFFFFFF" });
      c.fill = fill(NAVY);
      const maxLen = Math.max(
        col.length,
        ...data.map((r) => String(r[col] ?? "").length),
      );
      ws.getColumn(i + 1).width = Math.max(14, Math.min(34, maxLen + 4));
    });
    ws.getRow(hdrRow).height = 20;

    const thin: Partial<ExcelJS.Border> = { style: "thin", color: { argb: "FFD9D9D9" } };
    data.forEach((rec, ri) => {
      const r = hdrRow + 1 + ri;
      columns.forEach((col, ci) => {
        const c = ws.getCell(r, ci + 1);
        c.value = rec[col] ?? null;
        c.font = font({ size: 9 });
        c.border = { top: thin, left: thin, bottom: thin, right: thin };
        c.alignment = { vertical: "middle" };
        if (opts.statusCol && col === opts.statusCol) {
          const [fg, bg] = statusForLabel(String(rec[col] ?? ""));
          c.font = font({ size: 9, bold: true, color: fg });
          c.fill = fill(bg);
        }
      });
    });

    const last = hdrRow + data.length;
    ws.views = [{ state: "frozen", ySplit: hdrRow }];
    ws.autoFilter = `A${hdrRow}:${colLetter(ncol)}${last}`;
    return ws;
  }

  /** Append the original dataset, untouched, as a filterable tab. */
  rawData(rows: Row[], opts: { sheetName?: string; columns?: string[] } = {}): ExcelJS.Worksheet {
    const sheetName = opts.sheetName ?? "Raw Data";
    const columns = opts.columns ?? inferColumns(rows);
    const ws = this.wb.addWorksheet(sheetName, { views: [{ showGridLines: false }] });

    columns.forEach((col, i) => {
      const c = ws.getCell(1, i + 1);
      c.value = col;
      c.font = font({ size: 10, bold: true, color: "FFFFFFFF" });
      c.fill = fill(GREY);
      ws.getColumn(i + 1).width = 20;
    });
    ws.getRow(1).height = 18;

    rows.forEach((rec, ri) => {
      columns.forEach((col, ci) => {
        const c = ws.getCell(ri + 2, ci + 1);
        c.value = rec[col] ?? null;
        c.font = font({ size: 9 });
      });
    });

    ws.views = [{ state: "frozen", ySplit: 1 }];
    ws.autoFilter = `A1:${colLetter(columns.length)}${rows.length + 1}`;
    return ws;
  }

  async save(path: string): Promise<string> {
    await this.wb.xlsx.writeFile(path);
    return path;
  }
}
