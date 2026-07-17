// Fix parent* breadcrumb fields (parentName/parentShort/parentCrumbName) left in English or rendered
// inconsistently across a city's reviews. These 3 fields describe the shared parent roundup, so they must
// be IDENTICAL for every review of a city. Strategy: per (lang, city) pick the canonical translated value
// (most common value that contains target script) and propagate it to every review whose value is English
// or divergent. Deterministic — no re-translation. Cities with NO translated sibling are reported (need an agent).
// Usage: node fix-parent-fields.mjs [--apply]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const APPLY = process.argv.includes('--apply');
const SCRIPT = { ru: /[Ѐ-ӿ]/, ko: /[가-힣]/, ja: /[぀-ヿ一-鿿]/, hi: /[ऀ-ॿ]/, he: /[֐-׿]/, ar: /[؀-ۿ]/ };
// langs from argv (any of the SCRIPT keys), else default to the Wave-1 set.
const LANGS = process.argv.filter(a => SCRIPT[a]);
const ACTIVE = LANGS.length ? LANGS : ['ru', 'ko', 'ja'];
const FIELDS = ['parentName', 'parentShort', 'parentCrumbName'];
const cityOf = href => (String(href || '').match(/top10-hotels-([a-z-]+)\.html/) || [])[1] || '?';
const translated = (lang, v) => typeof v === 'string' && v.trim() && SCRIPT[lang].test(v);

let totalFixed = 0;
const needAgent = [];
for (const lang of ACTIVE) {
  const dir = path.join(ROOT, `astro/src/content/reviews-${lang}`);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  // group files by city
  const byCity = {};
  const cache = {};
  for (const f of files) {
    const o = cache[f] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    (byCity[cityOf(o.parentHref)] ??= []).push(f);
  }
  for (const [city, cityFiles] of Object.entries(byCity)) {
    // canonical per field = most common translated value
    const canon = {};
    for (const fld of FIELDS) {
      const counts = {};
      for (const f of cityFiles) { const v = cache[f][fld]; if (translated(lang, v)) counts[v] = (counts[v] || 0) + 1; }
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      canon[fld] = best ? best[0] : null;
    }
    if (FIELDS.some(fld => !canon[fld])) { needAgent.push(`${lang}/${city}`); continue; }
    // apply canonical to any file whose field differs (English OR divergent translation)
    for (const f of cityFiles) {
      const o = cache[f];
      let changed = false;
      for (const fld of FIELDS) if (o[fld] !== canon[fld]) { o[fld] = canon[fld]; changed = true; }
      if (changed) { totalFixed++; if (APPLY) fs.writeFileSync(path.join(dir, f), JSON.stringify(o, null, 2) + '\n'); }
    }
  }
}
console.log(`${APPLY ? 'APPLIED' : 'DRY-RUN'} — ${totalFixed} review files ${APPLY ? 'updated' : 'would change'} (parent* normalized to per-city canonical).`);
if (needAgent.length) console.log(`\n⚠ ${needAgent.length} cities have NO translated parent* sibling (need agent translation):\n  ${needAgent.join(', ')}`);
