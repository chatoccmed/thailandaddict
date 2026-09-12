#!/usr/bin/env node
/* =============================================================================
   drop-shared-positions.mjs — remove pins that two different venues share

   _internal/qa/check-coords.mjs rule 9 finds positions carried by two or more
   genuinely different venues. Two buildings cannot share a point to one metre,
   so whatever answered was an area — a mall, a soi, a park — and it was written
   onto everything inside it. The commonest shape here is a cafe given the
   coordinate of the shopping centre it sits in: Rowie's Coffee on Central
   Ladprao's point, Roots on The Commons', Ros'niyom on Silom Complex's.

   Which member is right cannot be known from the data, so none of them keeps
   it. That is the same rule the road-level pins were held to.

   This script does NOT re-implement the rule. It asks the gate for its own
   verdicts (--json) and acts on exactly those, so the two cannot drift.

   Usage:  node _internal/drop-shared-positions.mjs [--apply]
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];

/* Same indent-preserving rule as everywhere else in this repo: the article
   collections use 1 space, the review collections 2. */
function indentOf(raw, fallback = 2) {
  const m = String(raw).match(/^\{\r?\n( +)"/);
  return m ? m[1].length : fallback;
}

let out = '';
try {
  out = execFileSync('node', [path.join(ROOT, '_internal/qa/check-coords.mjs'), '--json'],
    { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
} catch (e) {
  /* exit 11 is the gate doing its job — the findings are still on stdout. */
  out = e.stdout || '';
}
if (!out.trim()) { console.error('the gate produced no output; nothing to act on'); process.exit(1); }
const groups = JSON.parse(out).failures.filter((f) => f.kind === 'duplicate-position');

console.log(`${groups.length} shared position(s), ${groups.reduce((n, g) => n + g.data.members.length, 0)} coordinate(s) to remove\n`);

/* Walk to a member's point by its recorded path — "(root)" or "blocks.N" —
   rather than guessing where a coordinate lives. */
function pointAt(doc, at) {
  if (at === '(root)') return doc;
  let o = doc;
  for (const seg of at.split('.')) {
    if (!o || typeof o !== 'object') return null;
    o = o[/^\d+$/.test(seg) ? Number(seg) : seg];
  }
  return o && typeof o === 'object' ? o : null;
}

const per = {};
let removed = 0;
for (const g of groups) {
  console.log(`  ${g.data.pos}`);
  for (const mem of g.data.members) {
    console.log(`    − ${mem.kind}/${mem.slug} @ ${mem.at}  "${String(mem.name).slice(0, 40)}"`);
    for (const suffix of LOC) {
      const f = path.join(ROOT, `astro/src/content/${mem.kind}${suffix}`, mem.slug + '.json');
      if (!fs.existsSync(f)) continue;
      const raw = fs.readFileSync(f, 'utf8');
      let doc; try { doc = JSON.parse(raw); } catch { continue; }
      const pt = pointAt(doc, mem.at);
      if (!pt || (pt.lat === undefined && pt.lng === undefined)) continue;
      /* Only if the twin agrees this is the same point — a twin whose blocks
         are out of step must not have a different venue's pin removed. */
      const same = Math.abs(Number(pt.lat) - Number(g.data.pos.split(',')[0])) < 1e-4
        && Math.abs(Number(pt.lng) - Number(g.data.pos.split(',')[1])) < 1e-4;
      if (!same) continue;
      delete pt.lat; delete pt.lng;
      if (APPLY) fs.writeFileSync(f, JSON.stringify(doc, null, indentOf(raw)) + (raw.endsWith('\n') ? '\n' : ''));
      per[`${mem.kind}${suffix}`] = (per[`${mem.kind}${suffix}`] || 0) + 1;
      removed++;
    }
  }
}

console.log(`\n${removed} coordinate(s) ${APPLY ? 'removed' : 'would be removed'}:`);
for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
if (!APPLY) console.log('\nDRY RUN — nothing written. Re-run with --apply.');
else console.log('\nNow: node _internal/gen-feeds.mjs && node _internal/gen-hubs.mjs && node _internal/qa/check-coords.mjs');
