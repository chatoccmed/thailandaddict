/* A paid booking button must say whose button it is.

   The hub cards carry Agoda, Booking.com and Trip.com buttons side by side,
   labelled with the partner's name. localize.mjs translated those labels as
   ordinary words, so ~8,900 buttons across seven locales read "itinerary",
   "plan" or "reservation" (行程, План, Бронирование, 予約…) beside one still
   reading "Agoda" — a reader could no longer tell which partner a paid link
   opens. Fixed 2026-10-04; this keeps it fixed.

   Rule: a sponsored anchor that points at an OTA is labelled with the
   partner's name, or is a call-to-action ending in an arrow ("Check price →",
   translated). Anything else fails.

   Usage: node _internal/audit/live-verify-ota-labels.mjs [--base URL] [--local]
   Exit 17 on any failure. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const LOCAL = process.argv.includes('--local');
const BASE = arg('--base', 'https://thailandaddict.com').replace(/\/$/, '');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
/* hubs that carry all three buttons, in every locale */
const PAGES = ['city-songkhla', 'city-chanthaburi', 'city-krabi', 'city-chiang-mai', 'city-lampang'];
const BRAND = /^(Agoda|Booking|Booking\.com|Trip|Trip\.com|Klook)$/i;
const OTA = /agoda\.com|trip\.com|\/go\/b\b|booking\.com|klook\.com/;

async function page(loc, slug) {
  if (LOCAL) {
    for (const base of ['astro/public', 'astro/dist']) {
      const p = path.join(ROOT, base, loc, slug + '.html');
      if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    }
    return null;
  }
  const r = await fetch(`${BASE}/${loc}/${slug}`, { headers: { 'User-Agent': 'thailandaddict-selfcheck/1.0' } });
  return r.ok ? r.text() : null;
}

let pass = 0; const fails = [];
for (const loc of LANGS) {
  for (const slug of PAGES) {
    const html = await page(loc, slug);
    if (html == null) { fails.push(`${loc}/${slug}: not reachable`); continue; }
    const bad = new Map(); let n = 0;
    for (const m of html.matchAll(/<a\b([^>]*)>([^<]{1,40})<\/a>/g)) {
      const attrs = m[1], label = m[2].trim();
      if (!/\bsponsored\b/.test(attrs) || !OTA.test(attrs)) continue;
      n++;
      if (BRAND.test(label) || /→\s*$/.test(label)) continue;
      bad.set(label, (bad.get(label) || 0) + 1);
    }
    if (!n) continue;
    if (bad.size) fails.push(`${loc}/${slug}: ${[...bad].map(([l, c]) => `"${l}" ×${c}`).join(', ')} on a paid button`);
    else pass++;
  }
}
for (const f of fails) console.log('  ✗ ' + f);
console.log((fails.length ? `FAILED ${fails.length} of ${pass + fails.length}` : `all ${pass} checks passed`) + ` (${LOCAL ? 'local' : BASE})`);
process.exit(fails.length ? 17 : 0);
