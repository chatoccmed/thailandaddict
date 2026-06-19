#!/usr/bin/env node
// Phase A objective audit across ALL content (universally-valid checks only — no judgment calls).
// Roundups: entries===toc===compareRows, each reviewUrl resolves to a review file.
// Reviews: valid JSON, keywords present, heroImg file exists (warn).
// (Body-length is migration-specific — old orphan reviews are intentionally short — so NOT flagged here.)
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const RD = path.join(ROOT, 'astro/src/content/roundups');
const RVD = path.join(ROOT, 'astro/src/content/reviews');
const AD = path.join(ROOT, 'astro/src/content/articles');
const PUB = path.join(ROOT, 'astro/public');

const errs = [], warns = [];
let roundN = 0, revN = 0, artN = 0;

// roundups
for (const f of fs.readdirSync(RD).filter(f => f.endsWith('.json'))) {
  roundN++;
  let o; try { o = JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); } catch (e) { errs.push(`roundup BAD JSON: ${f} (${e.message})`); continue; }
  const e = (o.entries || []).length, t = (o.toc || []).length, c = (o.compareRows || []).length;
  if (!(e === t && t === c && e > 0)) errs.push(`roundup misaligned: ${f} entries=${e} toc=${t} cmp=${c}`);
  (o.entries || []).forEach((en, i) => {
    const slug = String(en.reviewUrl || '').replace(/\.html$/, '');
    if (!slug) errs.push(`${f}: entry[${i}] no reviewUrl`);
    else if (!fs.existsSync(path.join(RVD, slug + '.json'))) errs.push(`${f}: entry[${i}] dead reviewUrl → ${slug}.json`);
  });
}
// reviews
for (const f of fs.readdirSync(RVD).filter(f => f.endsWith('.json'))) {
  revN++;
  let j; try { j = JSON.parse(fs.readFileSync(path.join(RVD, f), 'utf8')); } catch (e) { errs.push(`review BAD JSON: ${f} (${e.message})`); continue; }
  if (!j.keywords) warns.push(`review no keywords: ${f}`);
  let hero = j.heroImg || ''; if (hero) { hero = hero.replace(/^\//, ''); if (!fs.existsSync(path.join(PUB, hero))) warns.push(`review hero missing: ${f} → ${hero}`); }
}
// articles
for (const f of fs.readdirSync(AD).filter(f => f.endsWith('.json'))) {
  artN++;
  let j; try { j = JSON.parse(fs.readFileSync(path.join(AD, f), 'utf8')); } catch (e) { errs.push(`article BAD JSON: ${f} (${e.message})`); continue; }
  for (const k of ['slug', 'type', 'cluster', 'title', 'h1', 'blocks']) if (j[k] === undefined) errs.push(`article ${f} missing ${k}`);
}

console.log(`[audit-all] roundups=${roundN} reviews=${revN} articles=${artN} | errors=${errs.length} warns=${warns.length}`);
if (errs.length) console.log('\nERRORS:\n  ' + errs.slice(0, 60).join('\n  ') + (errs.length > 60 ? `\n  …+${errs.length - 60} more` : ''));
if (warns.length) console.log('\nWARNS:\n  ' + warns.slice(0, 40).join('\n  ') + (warns.length > 40 ? `\n  …+${warns.length - 40} more` : ''));
if (!errs.length && !warns.length) console.log('ALL CLEAN');
