#!/usr/bin/env node
// REGRESSION GUARD for Booking.com→CJ monetization. Fails (exit 1) if any layer breaks:
//   1. content JSON: booking.com URLs must be CANONICAL (no aid=/label= — legacy params kill CJ attribution)
//   2. static hubs (astro/public): no raw booking.com href may remain (all must be CJ-wrapped)
//   3. dist (optional 1st arg, e.g. astro/dist or ~/ta-build-temp/dist): no raw booking.com href/data-href,
//      and the CJ link count must be ≥ FLOOR (proves the layout wrappers actually ran)
// Run before every deploy: node _internal/qa/check-booking-cj.mjs [distDir]
import fs from 'node:fs';
import path from 'node:path';
const FLOOR = 4000;
let fail = 0;
const bad = (msg) => { console.error('  ✗ ' + msg); fail++; };

// 1. content canonical
{
  let dirty = 0, canonical = 0;
  for (const d of ['reviews', 'reviews-en', 'roundups', 'roundups-en', 'articles', 'articles-en']) {
    const base = 'astro/src/content/' + d;
    if (!fs.existsSync(base)) continue;
    for (const f of fs.readdirSync(base)) {
      if (!f.endsWith('.json')) continue;
      const s = fs.readFileSync(path.join(base, f), 'utf8');
      const m = s.match(/booking\.com[^"]*[?&](aid|label)=[^"]*/g);
      if (m) { dirty += m.length; if (dirty <= 3) console.error('    e.g. ' + d + '/' + f); }
      canonical += (s.match(/https:\/\/www\.booking\.com\//g) || []).length;
    }
  }
  if (dirty) bad(`content: ${dirty} booking.com URLs carry aid=/label= (must be canonical — CJ wraps at render)`);
  else console.log(`  ✓ content canonical (${canonical} booking.com URLs, 0 with legacy params)`);
}

// 2. static hubs wrapped
{
  let raw = 0, wrapped = 0;
  for (const dir of ['astro/public', 'astro/public/en']) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.html')) continue;
      const s = fs.readFileSync(path.join(dir, f), 'utf8');
      const r = (s.match(/href="https:\/\/www\.booking\.com\//g) || []).length
              + (s.match(/anrdoezrs\.net\/links\/101809619\/type\/dlg\//g) || []).length; // legacy dlg = stale, must be migrated
      if (r && raw < 3) console.error('    e.g. ' + dir + '/' + f + ' (' + r + ')');
      raw += r;
      wrapped += (s.match(/anrdoezrs\.net\/click-101809619-17289009\?sid=/g) || []).length;
    }
  }
  if (raw) bad(`static hubs: ${raw} RAW booking.com hrefs (run _internal/qa/wrap-booking-cj.mjs — or gen-hubs regenerated without the cjB patch)`);
  else console.log(`  ✓ static hubs wrapped (${wrapped} CJ links, 0 raw)`);
}

// 3. dist (optional)
const dist = process.argv[2];
if (dist && fs.existsSync(dist)) {
  let raw = 0, cj = 0, scanned = 0;
  const walk = (d) => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      const st = fs.statSync(p);
      if (st.isDirectory()) { if (!/images|_astro/.test(f)) walk(p); continue; }
      if (!f.endsWith('.html')) continue;
      scanned++;
      const s = fs.readFileSync(p, 'utf8');
      const r = (s.match(/(?:href|data-href)="https:\/\/www\.booking\.com\//g) || []).length
              + (s.match(/anrdoezrs\.net\/links\/101809619\/type\/dlg\//g) || []).length; // legacy dlg = stale, must be migrated
      if (r && raw < 3) console.error('    e.g. ' + p + ' (' + r + ')');
      raw += r;
      cj += (s.match(/anrdoezrs\.net\/click-101809619-17289009\?sid=/g) || []).length;
    }
  };
  walk(dist);
  if (raw) bad(`dist: ${raw} RAW booking.com CTAs escaped the CJ wrappers (layouts/hubs regression)`);
  else if (cj < FLOOR) bad(`dist: only ${cj} CJ links (< floor ${FLOOR}) — wrappers likely not running`);
  else console.log(`  ✓ dist wrapped (${cj} CJ links across ${scanned} pages, 0 raw)`);
} else if (dist) {
  bad(`dist dir not found: ${dist}`);
}

if (fail) { console.error(`check-booking-cj: ${fail} FAILURE(S) — Booking revenue at risk, do NOT deploy`); process.exit(1); }
console.log('check-booking-cj: ALL PASS');
