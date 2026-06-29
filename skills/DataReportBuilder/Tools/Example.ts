#!/usr/bin/env bun
/**
 * Example.ts — end-to-end demo of the report engine. Run it, open the xlsx:
 *
 *   bun Example.ts            # writes ./Report-example.xlsx
 *   bun Recalc.ts ./Report-example.xlsx
 *
 * Copy this file as the starting point for a real report and edit the data.
 */

import { ReportBuilder, type Row } from "./ReportKit.ts";

const detail: Row[] = [
  { Name: "A. Cohen", Department: "Sales", "Mail app today": "Samsung Email", Status: "Action needed" },
  { Name: "B. Levi", Department: "Sales", "Mail app today": "Apple Mail", Status: "Action needed" },
  { Name: "C. Mizrahi", Department: "Ops", "Mail app today": "Outlook + built-in", Status: "Cleanup" },
  { Name: "D. Peretz", Department: "Ops", "Mail app today": "Outlook", Status: "Ready" },
  { Name: "E. Avraham", Department: "Finance", "Mail app today": "Outlook", Status: "Ready" },
];

const rb = new ReportBuilder("Mobile Email Access Review", {
  subtitle: "Acme Corp · May 2026",
});

const s = rb.summary();
s.intro(
  "What we looked at",
  "We want to protect company email on staff phones. That protection only " +
    "works through the Outlook app, so we checked which mail app each person " +
    "uses today and who needs to switch.",
);
s.cards("Where staff stand today", [
  { label: "Ready – no action needed", value: 288, sub: "64% of staff", desc: "Already use only the Outlook app.", status: "green" },
  { label: "Minor cleanup", value: 50, sub: "11% of staff", desc: "Have Outlook but also a built-in mail app.", status: "amber" },
  { label: "Action needed", value: 113, sub: "25% of staff", desc: "Must switch to Outlook or lose mobile email.", status: "red" },
]);
s.table(
  "Who needs to switch",
  ["Mail app today", "Staff", "What they need to do"],
  [
    ["Samsung Email", 44, "Install Outlook, remove old account"],
    ["Apple Mail", 30, "Install Outlook, remove old account"],
    ["Other built-in", 39, "Install Outlook, remove old account"],
  ],
  { accentCol: 1 },
);
s.steps(
  "Recommended rollout",
  [
    "1.  Notify the staff who need to switch.",
    "2.  Help them install Outlook.",
    "3.  Allow a grace period.",
    "4.  Only then turn on the blocking policy.",
  ],
  "This order means no one is locked out on day one.",
);

rb.actionList(detail, {
  statusCol: "Status",
  sortFirst: ["Action needed", "Cleanup", "Ready"],
  note: "Filter the Status column to plan by group.",
});
rb.rawData(detail);

const out = await rb.save("./Report-example.xlsx");
console.log(`Wrote ${out}`);
