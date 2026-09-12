#!/usr/bin/env node
/* =============================================================================
   check-map-attribution.mjs — OSM tiles may not ship without attribution
   EXIT CODE 12

   WHY THIS EXISTS
   ---------------
   OpenStreetMap data is licensed ODbL. The licence does not ask for a credit as
   a courtesy; it REQUIRES that a work using the data say so, and the Foundation's
   own guidance is explicit that the credit names the contributors, not the
   project: "© OpenStreetMap contributors". Dropping the word "contributors" is
   not a styling choice, it is using the data outside its licence.

   This repo shipped `attribution: '&copy; OpenStreetMap'` on 1,311 pages. It
   came from one string, copied into four generators, and nothing noticed —
   which is precisely the shape of defect a gate is for. Tile usage has also
   grown fast (277 pages → 1,313 in one session), so the same string is now
   load-bearing on province hubs, roundups, reviews, the Michelin finder and
   seven locale homepages.

   The check is deliberately crude and therefore hard to fool: if a file
   references a tile endpoint, that file must also contain the word
   "contributors". Sub-resource attribution (a shared JS bundle crediting on
   behalf of an HTML page) would defeat that, so if we ever move the map code
   into a bundle, this gate must move with it rather than be relaxed.

   Usage:  node _internal/qa/check-map-attribution.mjs [docroot] [--list]
           exit 0 = OK · exit 12 = tiles would ship uncredited
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SHOW_ALL = process.argv.includes('--list');
const argDoc = process.argv.slice(2).find((a) => !a.startsWith('--'));

/* Tile endpoints whose imagery or data is OSM-derived. CARTO's basemaps are
   rendered FROM OSM data, so they carry the same obligation plus CARTO's own. */
const TILE = /tile\.openstreetmap\.org|basemaps\.cartocdn\.com|tiles?\.stadiamaps\.com|api\.maptiler\.com|tile\.thunderforest\.com/;
const CREDITED = /OpenStreetMap<\/a>\s*contributors|OpenStreetMap\s+contributors/;
/* CARTO's terms want their own credit alongside OSM's.
   The credit test must run on text with the tile URLs REMOVED: the host name
   "basemaps.cartocdn.com" itself contains "carto", so a naive search finds the
   URL and pronounces the page credited. The first negative test of this gate
   passed a file that credited CARTO nowhere, for exactly that reason. */
const CARTO = /basemaps\.cartocdn\.com/;
const CARTO_CREDITED = /CARTO|CartoDB/i;
const stripTileUrls = (s) => s.replace(/https?:\/\/[^'"\s)]*cartocdn[^'"\s)]*/gi, '');

/* Both halves of the problem: the GENERATORS (so a fix cannot be undone by the
   next build) and the OUTPUT (so a hand-edited page cannot slip through). */
const SOURCE_GLOBS = [
  '_internal/gen-hubs.mjs',
  '_internal/homepage-i18n/build.mjs',
  '_internal/lib/chrome.mjs',
  '_internal/shell/build/gen-proto-home.mjs',
  '_internal/shell/build/home.page.js',
  'astro/src/layouts/ArticleLayout.astro',
  'astro/src/layouts/ReviewLayout.astro',
  'astro/src/layouts/RoundupLayout.astro',
  'worker.js',
];

/* astro/public by default, not astro/dist. dist is ~19,800 files on a
   OneDrive-synced disk and reading all of them takes minutes; every map in it
   comes either from public (copied verbatim) or from one of the three layouts
   listed above, both of which ARE scanned. Pass a docroot explicitly to check a
   built bundle:  node _internal/qa/check-map-attribution.mjs astro/dist */
const docroots = argDoc ? [argDoc] : ['astro/public'];
const files = [];
for (const rel of SOURCE_GLOBS) {
  const p = path.join(ROOT, rel);
  if (fs.existsSync(p)) files.push(p);
}
let docrootsSeen = 0;
for (const dr of docroots) {
  const base = path.isAbsolute(dr) ? dr : path.join(ROOT, dr);
  if (!fs.existsSync(base)) continue;
  docrootsSeen++;
  (function walk(d, depth) {
    if (depth > 4) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      /* _astro holds hashed bundles; images and fonts cannot contain a tile URL. */
      if (e.isDirectory()) { if (e.name !== 'images' && e.name !== 'fonts') walk(p, depth + 1); continue; }
      if (/\.(html|js|mjs|astro)$/.test(e.name) && !/^leaflet-/.test(e.name)) files.push(p);
    }
  })(base, 0);
}

const bad = [];
let withTiles = 0;
for (const p of files) {
  let s;
  try { s = fs.readFileSync(p, 'utf8'); } catch { continue; }
  if (!TILE.test(s)) continue;
  withTiles++;
  let rel = path.relative(ROOT, p).split(path.sep).join('/');
  if (rel.startsWith('..')) rel = p;               /* a docroot outside the repo */
  if (!CREDITED.test(s)) {
    bad.push({ rel, why: 'loads OSM tiles but never says "contributors"' });
  } else if (CARTO.test(s) && !CARTO_CREDITED.test(stripTileUrls(s))) {
    bad.push({ rel, why: 'loads CARTO basemaps without crediting CARTO' });
  }
}

console.log(`check-map-attribution: ${withTiles} file(s) load map tiles · ${docrootsSeen} docroot(s) scanned`);

if (bad.length) {
  console.error('');
  console.error('─'.repeat(78));
  console.error(`FAIL: ${bad.length} file(s) would ship OSM tiles without the required credit.`);
  console.error('');
  for (const b of (SHOW_ALL ? bad : bad.slice(0, 25))) console.error(`  ${b.rel}\n      ${b.why}`);
  if (!SHOW_ALL && bad.length > 25) console.error(`  … ${bad.length - 25} more (--list)`);
  console.error('');
  console.error('  The attribution string must be, verbatim:');
  console.error('    &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
  console.error('  and for CARTO basemaps, that plus:');
  console.error('    &copy; <a href="https://carto.com/attributions">CARTO</a>');
  console.error('');
  console.error('  ODbL is a licence condition, not a credit line. Fix the GENERATOR,');
  console.error('  not just the generated page, or the next build undoes it.');
  console.error('─'.repeat(78));
  process.exit(12);
}
console.log('check-map-attribution: ALL PASS');
