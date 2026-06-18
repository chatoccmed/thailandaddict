#!/usr/bin/env node
// Verify a cluster's roundups + reviews on disk. Usage: node verify-cluster.mjs <cluster> [roundupSlug...]
// If roundup slugs given, only those are checked; else all roundups whose cluster===<cluster>.
// Checks: roundup entries===toc===compareRows, id=h1..hN, reviewUrl resolves to a review file,
//         each referenced review: body Thai >=6800, keywords present, heroImg file exists.
// Exit 1 on any hard failure (missing file / misalignment / short review / no keywords).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const RD = path.join(ROOT, 'astro/src/content/roundups');
const RVD = path.join(ROOT, 'astro/src/content/reviews');
const PUB = path.join(ROOT, 'astro/public');
const thai = s => (String(s).match(/[฀-๿]/g) || []).length;
const FLOOR = 6800;

const cluster = process.argv[2];
if (!cluster) { console.error('need <cluster>'); process.exit(2); }
const only = process.argv.slice(3);

let roundups;
if (only.length) roundups = only.map(s => s.replace(/\.json$/, ''));
else roundups = fs.readdirSync(RD).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5))
  .filter(s => { try { return JSON.parse(fs.readFileSync(path.join(RD, s + '.json'), 'utf8')).cluster === cluster; } catch { return false; } });

const errs = [], warns = [];
const reviewsSeen = new Set();
for (const rs of roundups) {
  const f = path.join(RD, rs + '.json');
  if (!fs.existsSync(f)) { errs.push(`roundup missing: ${rs}.json`); continue; }
  let o; try { o = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { errs.push(`roundup invalid JSON: ${rs} (${e.message})`); continue; }
  const e = (o.entries || []).length, t = (o.toc || []).length, c = (o.compareRows || []).length;
  if (!(e === t && t === c && e > 0)) errs.push(`${rs}: misaligned entries=${e} toc=${t} compareRows=${c}`);
  (o.entries || []).forEach((en, i) => {
    if (en.id && en.id !== 'h' + (i + 1)) warns.push(`${rs}: entry[${i}].id=${en.id} (expected h${i + 1})`);
    const slug = String(en.reviewUrl || '').replace(/\.html$/, '');
    if (!slug) { errs.push(`${rs}: entry[${i}] no reviewUrl`); return; }
    reviewsSeen.add(slug);
    if (!fs.existsSync(path.join(RVD, slug + '.json'))) errs.push(`${rs}: entry[${i}] review missing: ${slug}.json`);
  });
}
// per-review checks
for (const slug of reviewsSeen) {
  const f = path.join(RVD, slug + '.json');
  if (!fs.existsSync(f)) continue;
  let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { errs.push(`review invalid JSON: ${slug}`); continue; }
  const n = thai(JSON.stringify(j.body ?? j.sections ?? ''));
  if (n < FLOOR) errs.push(`review SHORT: ${slug} (${n} < ${FLOOR})`);
  if (!j.keywords) errs.push(`review NO keywords: ${slug}`);
  if (j.cluster !== cluster) warns.push(`review cluster=${j.cluster} (expected ${cluster}): ${slug}`);
  let hero = j.heroImg || '';
  if (hero) { hero = hero.startsWith('/') ? hero.slice(1) : hero; if (!fs.existsSync(path.join(PUB, hero))) warns.push(`hero image missing: ${slug} -> ${hero}`); }
}

console.log(`[verify ${cluster}] roundups=${roundups.length} reviews=${reviewsSeen.size} errors=${errs.length} warns=${warns.length}`);
if (warns.length) console.log('WARN:\n  ' + warns.join('\n  '));
if (errs.length) { console.error('FAIL:\n  ' + errs.join('\n  ')); process.exit(1); }
console.log('VERIFY OK');
