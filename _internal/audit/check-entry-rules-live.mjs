// Live check: production tells travellers the current entry rules, from entry-rules.json.
// For each page with the entry-rules box, in every language it exists in:
//   - no visa-free stay that contradicts the rules (same scanner as the build gate, run on the
//     served HTML including its JSON-LD FAQ, which is what AI answers quote);
//   - the box is there, and says the date in entry-rules.json.
// Run: node _internal/audit/check-entry-rules-live.mjs [base]   Exit 0 = all pass, 1 = a check failed.
import fs from 'node:fs';
import path from 'node:path';
import { staleClaims } from '../lib/entry-rules-scan.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const BASE = process.argv[2] || 'https://thailandaddict.com';
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/data/entry-rules.json'), 'utf8'));
const C = path.join(ROOT, 'astro/src/content');

const pages = [];
for (const dir of fs.readdirSync(C).filter(d => /^articles(-|$)/.test(d))) {
  const lang = dir === 'articles' ? 'th' : dir.slice('articles-'.length);
  for (const f of fs.readdirSync(path.join(C, dir))) {
    if (!f.endsWith('.json')) continue;
    const o = JSON.parse(fs.readFileSync(path.join(C, dir, f), 'utf8'));
    if (o.entryRules) pages.push(`${lang === 'th' ? '' : '/' + lang}/${o.slug}`);
  }
}

let fail = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fail++; return ok; };
check(pages.length >= 20, `${pages.length} pages carry the entry-rules box in content`);
const bust = 'er=' + Date.now();
for (const p of pages) {
  const res = await fetch(`${BASE}${p}?${bust}`, { cache: 'no-store' });
  const html = await res.text();
  if (!check(res.status === 200, `${p} → ${res.status}`)) continue;
  // Judge the page's own prose: the box is entry-rules.json verbatim, and its "visa-free" wording
  // would otherwise pull neighbouring trip lengths ("21 days") into the scanner's window.
  const prose = html.replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<aside[^>]*data-entry-rules[\s\S]*?<\/aside>/, ' ');
  const stale = staleClaims(prose, rules.allowedVisaFreeDays);
  check(stale.length === 0, `${p} no stale visa-free claim` + (stale.length ? ` — ${stale[0].days} days: "${stale[0].snippet.slice(0, 120)}"` : ''));
  const box = html.match(/<aside[^>]*data-entry-rules[^>]*>/);
  check(!!box && box[0].includes(`data-checked="${rules.lastChecked}"`), `${p} entry-rules box, checked ${rules.lastChecked}`);
}
console.log(fail ? `\n${fail} check(s) failed` : '\nall checks passed');
process.exit(fail ? 1 : 0);
