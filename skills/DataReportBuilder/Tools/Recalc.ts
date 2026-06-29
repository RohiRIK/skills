#!/usr/bin/env bun
/**
 * Recalc.ts — recalculate every formula in an Excel file with LibreOffice,
 * then scan the result for Excel error values.
 *
 *   bun Recalc.ts <file.xlsx> [timeoutSeconds]
 *
 * Prints JSON:
 *   { status: "success" | "errors_found", total_errors, total_formulas, error_summary }
 * or { error: "..." } on failure.
 *
 * Requires LibreOffice (`soffice` on PATH). On a sandboxed Linux VM where
 * AF_UNIX sockets are blocked, soffice may need an LD_PRELOAD shim — not
 * handled here; this targets normal macOS / Linux desktops.
 */

import { homedir, platform } from "node:os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ExcelJS from "exceljs";

const MACRO_DIR =
  platform() === "darwin"
    ? join(homedir(), "Library/Application Support/LibreOffice/4/user/basic/Standard")
    : join(homedir(), ".config/libreoffice/4/user/basic/Standard");
const MACRO_FILE = join(MACRO_DIR, "Module1.xba");

const RECALCULATE_MACRO = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE script:module PUBLIC "-//OpenOffice.org//DTD OfficeDocument 1.0//EN" "module.dtd">
<script:module xmlns:script="http://openoffice.org/2000/script" script:name="Module1" script:language="StarBasic">
    Sub RecalculateAndSave()
      ThisComponent.calculateAll()
      ThisComponent.store()
      ThisComponent.close(True)
    End Sub
</script:module>`;

const EXCEL_ERRORS = [
  "#VALUE!", "#DIV/0!", "#REF!", "#NAME?", "#NULL!", "#NUM!", "#N/A",
] as const;

type Result =
  | { error: string }
  | {
      status: "success" | "errors_found";
      total_errors: number;
      total_formulas: number;
      error_summary: Record<string, { count: number; locations: string[] }>;
    };

function sofficeEnv(): Record<string, string> {
  return { ...(process.env as Record<string, string>), SAL_USE_VCLPLUGIN: "svp" };
}

/** Install the recalc StarBasic macro into the LibreOffice user profile. */
function setupMacro(): boolean {
  if (existsSync(MACRO_FILE) && readFileSync(MACRO_FILE, "utf8").includes("RecalculateAndSave")) {
    return true;
  }
  if (!existsSync(MACRO_DIR)) {
    // Boot soffice once to materialise the user profile, then create the dir.
    Bun.spawnSync({
      cmd: ["soffice", "--headless", "--terminate_after_init"],
      env: sofficeEnv(),
      timeout: 10_000,
      stdout: "ignore",
      stderr: "ignore",
    });
    mkdirSync(MACRO_DIR, { recursive: true });
  }
  try {
    writeFileSync(MACRO_FILE, RECALCULATE_MACRO);
    return true;
  } catch {
    return false;
  }
}

/** Coerce any ExcelJS cell value into a string we can scan for error tokens. */
function cellText(value: ExcelJS.CellValue): string {
  if (value == null) return "";
  if (typeof value === "object") {
    if ("error" in value && value.error) return String(value.error);
    if ("result" in value) return cellText(value.result as ExcelJS.CellValue);
    if ("richText" in value) return value.richText.map((r) => r.text).join("");
    if ("text" in value) return String(value.text);
    return "";
  }
  return String(value);
}

async function recalc(file: string, timeoutSeconds = 30): Promise<Result> {
  if (!existsSync(file)) return { error: `File ${file} does not exist` };
  const absPath = resolve(file);

  if (!setupMacro()) return { error: "Failed to setup LibreOffice macro" };

  const proc = Bun.spawnSync({
    cmd: [
      "soffice", "--headless", "--norestore",
      "vnd.sun.star.script:Standard.Module1.RecalculateAndSave?language=Basic&location=application",
      absPath,
    ],
    env: sofficeEnv(),
    timeout: timeoutSeconds * 1000,
    stdout: "pipe",
    stderr: "pipe",
  });

  // exitCode 0 = ok; null/124 = timed out after the macro ran (file is saved).
  if (proc.exitCode !== 0 && proc.exitCode !== null && proc.exitCode !== 124) {
    const stderr = proc.stderr.toString().trim() || "Unknown error during recalculation";
    if (stderr.includes("Module1") || !stderr.includes("RecalculateAndSave")) {
      return { error: "LibreOffice macro not configured properly" };
    }
    return { error: stderr };
  }

  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(file);

    const errorLocations: Record<string, string[]> = Object.fromEntries(
      EXCEL_ERRORS.map((e) => [e, []]),
    );
    let totalErrors = 0;
    let totalFormulas = 0;

    wb.eachSheet((ws) => {
      ws.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, (cell) => {
          if (cell.type === ExcelJS.ValueType.Formula) totalFormulas += 1;
          const text = cellText(cell.value);
          if (!text) return;
          for (const err of EXCEL_ERRORS) {
            if (text.includes(err)) {
              errorLocations[err].push(`${ws.name}!${cell.address}`);
              totalErrors += 1;
              break;
            }
          }
        });
      });
    });

    const error_summary: Record<string, { count: number; locations: string[] }> = {};
    for (const [err, locs] of Object.entries(errorLocations)) {
      if (locs.length) error_summary[err] = { count: locs.length, locations: locs.slice(0, 20) };
    }

    return {
      status: totalErrors === 0 ? "success" : "errors_found",
      total_errors: totalErrors,
      total_formulas: totalFormulas,
      error_summary,
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

async function main(): Promise<void> {
  const [file, timeoutArg] = Bun.argv.slice(2);
  if (!file) {
    console.error("Usage: bun recalc.ts <excel_file> [timeout_seconds]");
    console.error("\nRecalculates all formulas in an Excel file using LibreOffice.");
    console.error("Returns JSON: status, total_errors, total_formulas, error_summary.");
    process.exit(1);
  }
  const timeout = timeoutArg ? Number(timeoutArg) : 30;
  const result = await recalc(file, Number.isFinite(timeout) ? timeout : 30);
  console.log(JSON.stringify(result, null, 2));
  if ("error" in result || result.status !== "success") process.exit(1);
}

if (import.meta.main) await main();

export { recalc };
