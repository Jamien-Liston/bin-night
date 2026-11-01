// Date checks for index.html. Run from the repo root: node test/dates.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const logicSrc = html.match(/<script id="bin-logic">([\s\S]*?)<\/script>/)[1];
const uiSrc = html.match(/<script>\s*(\(function \(\) \{[\s\S]*?)<\/script>/)[1];
new vm.Script(uiSrc, { filename: "index.html (page script)" }); // syntax check only; doesn't run it

const L = new Function(logicSrc + "\nreturn BinLogic;")();
const H = new Function("return " + html.match(/var HOUSEHOLD = (\{[^}]*\});/)[1])();
const N = (y, m, d) => L.toNum(y, m, d);
const iso = (n) => L.toISO(n);

let failures = 0;
function check(label, got, want) {
  const ok = got === want;
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${ok ? "" : `  (got ${got}, want ${want})`}`);
}

// Calendar basics
check("1 Nov 2026 is a Sunday", L.weekday(N(2026, 11, 1)), 0);
check("Easter Sunday 2026 is 5 Apr", iso(L.easterSunday(2026)), "2026-04-05");
check("Easter Sunday 2027 is 28 Mar", iso(L.easterSunday(2027)), "2027-03-28");
check("Cup Day 2026 is Tue 3 Nov", (L.holidayOn(N(2026, 11, 3)) || {}).short, "Cup Day");
check("impossible dates are rejected", L.parseISO("2026-02-30"), null);

// Council notice, Christmas 2024-25: Wednesday collections moved to Thursday, normal again from Mon 6 Jan
check("Christmas 2024: Wed moves to Thu", iso(L.shiftFor(N(2024, 12, 25)).actual), "2024-12-26");
check("Christmas 2024: Tue before it unchanged", iso(L.shiftFor(N(2024, 12, 24)).actual), "2024-12-24");
check("New Year 2025: Wed moves to Thu", iso(L.shiftFor(N(2025, 1, 1)).actual), "2025-01-02");
check("New Year 2025: Fri moves to Sat", iso(L.shiftFor(N(2025, 1, 3)).actual), "2025-01-04");
check("Mon 6 Jan 2025 normal", iso(L.shiftFor(N(2025, 1, 6)).actual), "2025-01-06");

// Other no-collection holidays, assumed to follow the same rule
check("Christmas 2026: Fri moves to Sat", iso(L.shiftFor(N(2026, 12, 25)).actual), "2026-12-26");
check("Good Friday 2027: Fri moves to Sat", iso(L.shiftFor(N(2027, 3, 26)).actual), "2027-03-27");
check("Anzac Day 2028 (a Tuesday) moves to Wed", iso(L.shiftFor(N(2028, 4, 25)).actual), "2028-04-26");

// Our household against the council calendar: R rubbish, Y recycling, F food and garden, P glass
const cfg = { day: H.day, rubbish: H.rubbish, recycling: L.parseISO(H.recycling), glass: L.parseISO(H.glass) };
const code = (n) => {
  const b = L.binsFor(n, cfg);
  return (b.rubbish ? "R" : "") + (b.recycling ? "Y" : "") + (b.fogo ? "F" : "") + (b.glass ? "P" : "");
};
const council = {
  "2026-11-03": "YF", "2026-11-10": "RFP", "2026-11-17": "YF", "2026-11-24": "RF", "2026-12-01": "YF",
  "2026-12-08": "RFP", "2026-12-15": "YF", "2026-12-22": "RF", "2026-12-29": "YF"
};
for (const [date, want] of Object.entries(council)) check(`council calendar ${date}`, code(L.parseISO(date)), want);

// What the page leads with, and when it moves on
let up = L.upcoming(cfg, N(2026, 11, 1), 19, 8);
check("Sun 1 Nov evening: next collection Tue 3 Nov", iso(up.list[0].actual), "2026-11-03");
check("...with eight weeks listed", up.list.length, 8);
up = L.upcoming(cfg, N(2026, 11, 3), 9, 8);
check("Tue 3 Nov 9am: collection is today", iso(up.list[0].actual), "2026-11-03");
up = L.upcoming(cfg, N(2026, 11, 3), 14, 8);
check("Tue 3 Nov 2pm: moves on to 10 Nov", iso(up.list[0].actual), "2026-11-10");

console.log(failures ? `\n${failures} failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
