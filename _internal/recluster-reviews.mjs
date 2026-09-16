#!/usr/bin/env node
/* =============================================================================
   recluster-reviews.mjs — move a review under a different city hub

   A review's cluster decides which hub lists it, which hotel roundup is its
   parent, and what its breadcrumb says. Seven fields carry that, and four of
   them are human labels written per language:

     cluster · parentName · parentShort · parentHref
     parentCrumbName · parentCrumbUrl · crumbCityName · crumbCityHref

   The labels are never invented here. For each locale the page exists in, they
   are copied from a review that already sits in the target cluster in THAT
   locale — which also gets the per-locale URL shape right (zh points at the
   Thai-style URL, ru/ko/ja/hi/he/ar at the English one). A locale with no such
   sibling is reported and left untouched rather than guessed at.

   Nothing else is touched: slug, canonicalSlug, image paths (they carry the old
   province in their FILENAME, which is not a reference), related[] and
   prev/next links all stay as they are.

   Dry run by default. Usage:
     node _internal/recluster-reviews.mjs review-x=pai review-y=huahin [--apply]
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const pairs = process.argv.slice(2).filter((a) => a.includes('=')).map((a) => a.split('='));
if (!pairs.length) { console.log('usage: node _internal/recluster-reviews.mjs <slug>=<cluster> … [--apply]'); process.exit(2); }
const LOCS = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const dirOf = (loc) => path.join(ROOT, 'astro/src/content', loc === 'th' ? 'reviews' : `reviews-${loc}`);
const FIELDS = ['parentName', 'parentShort', 'parentHref', 'parentCrumbName', 'parentCrumbUrl', 'crumbCityName', 'crumbCityHref'];

let changed = 0, skipped = 0, problems = 0;
for (const [slug, cluster] of pairs) {
  console.log(`=== ${slug} → ${cluster}`);
  for (const loc of LOCS) {
    const dir = dirOf(loc);
    const file = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    if (data.cluster === cluster) { console.log(`   ${loc}: already in ${cluster}`); continue; }
    /* a sibling already in the target cluster, in this locale, carries the labels */
    let sibling = null;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json') || f === `${slug}.json`) continue;
      let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
      if (j.cluster !== cluster || !FIELDS.every((k) => j[k])) continue;
      sibling = j; break;
    }
    if (!sibling) { console.log(`   ✗ ${loc}: no review already in ${cluster} to take the labels from — left unchanged`); skipped++; problems++; continue; }
    const before = `${data.cluster} · ${data.crumbCityName} · ${data.parentHref}`;
    data.cluster = cluster;
    for (const k of FIELDS) data[k] = sibling[k];
    const out = serializeLike(raw, data).text;
    JSON.parse(out);
    changed++;
    console.log(`   ${loc}: ${before}  →  ${cluster} · ${data.crumbCityName} · ${data.parentHref}`);
    if (APPLY) fs.writeFileSync(file, out);
  }
}
console.log(`\n${APPLY ? 'applied' : 'dry run'} · files changed ${changed} · locales skipped ${skipped}`);
if (problems) { console.log(`${problems} locale(s) had no sibling to copy labels from`); if (APPLY) process.exit(1); }
if (!APPLY) console.log('DRY RUN — nothing written. Re-run with --apply.');
