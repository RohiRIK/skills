#!/usr/bin/env bun
/**
 * RenderEmail: turn a plain-text email draft into paste-ready HTML, with direction set per paragraph
 * and one font stack that renders Hebrew and English alike.
 *
 *   bun Tools/RenderEmail.ts [--font "<css font stack>"] [--size <px>] <file | -> > email.html
 *
 * Open the HTML in a browser, select all, copy, and paste into Gmail or Outlook: font and direction survive.
 * - Paragraphs are separated by blank lines; one where Hebrew letters dominate gets dir="rtl", otherwise dir="ltr".
 * - Lines starting with "- " or "1. " become list items; other lines in a paragraph are joined with <br>.
 * - http(s) URLs become links. A first line "Subject: ..." becomes the page <title>, not body text.
 * Runs on bun, or on node >= 22.6 with --experimental-strip-types. No dependencies.
 *
 * Exit codes: 0 ok · 2 usage error.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const DEFAULT_FONT = "Arial, 'Segoe UI', Tahoma, sans-serif"
export type Dir = "rtl" | "ltr"

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export function paragraphDir(text: string): Dir {
  const he = (text.match(/[א-ת]/g) ?? []).length
  const en = (text.match(/[A-Za-z]/g) ?? []).length
  // Same threshold as LintEmail: Hebrew paragraphs carry English technical terms.
  return he > 0 && he / (he + en) >= 0.3 ? "rtl" : "ltr"
}

function inline(line: string): string {
  return escapeHtml(line).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g, (url) => `<a href="${url}">${url}</a>`)
}

type Segment = { kind: "text" | "ul" | "ol"; lines: string[] }

function segments(paragraph: string[]): Segment[] {
  const out: Segment[] = []
  for (const line of paragraph) {
    const kind = /^\s*[-*•]\s+/.test(line) ? "ul" : /^\s*\d+[.)]\s+/.test(line) ? "ol" : "text"
    const content = kind === "text" ? line : line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "")
    const last = out[out.length - 1]
    if (last && last.kind === kind) last.lines.push(content)
    else out.push({ kind, lines: [content] })
  }
  return out
}

export function renderEmail(text: string, opts: { font?: string; size?: number } = {}): string {
  const font = escapeHtml(opts.font ?? DEFAULT_FONT)
  const size = opts.size ?? 14
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const firstIdx = lines.findIndex((l) => l.trim() !== "")
  const subjectMatch = firstIdx >= 0 ? lines[firstIdx].trim().match(/^(?:subject|נושא)\s*:\s*(.*)$/i) : null
  const bodyLines = subjectMatch ? lines.filter((_, i) => i !== firstIdx) : lines

  const paragraphs: string[][] = []
  let current: string[] = []
  for (const line of bodyLines) {
    if (line.trim()) current.push(line.trimEnd())
    else if (current.length) {
      paragraphs.push(current)
      current = []
    }
  }
  if (current.length) paragraphs.push(current)

  const html: string[] = []
  let rtl = 0
  for (const p of paragraphs) {
    const dir = paragraphDir(p.join(" "))
    if (dir === "rtl") rtl++
    const align = dir === "rtl" ? "right" : "left"
    for (const seg of segments(p)) {
      if (seg.kind === "text") {
        html.push(`<p dir="${dir}" style="margin:0 0 1em;text-align:${align}">${seg.lines.map(inline).join("<br>")}</p>`)
      } else {
        const pad = dir === "rtl" ? "padding:0 1.5em 0 0" : "padding:0 0 0 1.5em"
        const items = seg.lines.map((l) => `<li>${inline(l)}</li>`).join("")
        html.push(`<${seg.kind} dir="${dir}" style="margin:0 0 1em;${pad};text-align:${align}">${items}</${seg.kind}>`)
      }
    }
  }

  const pageDir: Dir = rtl * 2 >= paragraphs.length && rtl > 0 ? "rtl" : "ltr"
  const title = subjectMatch ? escapeHtml(subjectMatch[1].trim()) : "Email"
  return [
    "<!doctype html>",
    `<html lang="${pageDir === "rtl" ? "he" : "en"}" dir="${pageDir}">`,
    `<head><meta charset="utf-8"><title>${title}</title></head>`,
    `<body style="margin:0;padding:16px;background:#ffffff">`,
    `<div style="font-family:${font};font-size:${size}px;line-height:1.5;color:#222222">`,
    ...html,
    "</div>",
    "</body>",
    "</html>",
    "",
  ].join("\n")
}

const USAGE = `Usage: bun Tools/RenderEmail.ts [--font "<css font stack>"] [--size <px>] <file | -> > email.html
Default font: ${DEFAULT_FONT}`

export function main(argv: string[]): number {
  let font: string | undefined
  let size: number | undefined
  let file: string | undefined
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--help" || a === "-h") {
      console.log(USAGE)
      return 0
    } else if (a === "--font") {
      font = argv[++i]
    } else if (a === "--size") {
      size = Number(argv[++i])
      if (!Number.isFinite(size) || size < 8 || size > 32) {
        console.error(`--size must be a number from 8 to 32\n\n${USAGE}`)
        return 2
      }
    } else if (a === "-" || !a.startsWith("-")) {
      file = a
    } else {
      console.error(`Unknown option ${a}\n\n${USAGE}`)
      return 2
    }
  }
  if (!file || (font !== undefined && !font.trim())) {
    console.error(USAGE)
    return 2
  }
  let text: string
  try {
    text = readFileSync(file === "-" ? 0 : file, "utf8")
  } catch (e) {
    console.error(`Cannot read ${file}: ${(e as Error).message}`)
    return 2
  }
  process.stdout.write(renderEmail(text, { font, size }))
  return 0
}

const isMain =
  (import.meta as { main?: boolean }).main ??
  (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
if (isMain) process.exit(main(process.argv.slice(2)))
