/* Bring the frozen hub snapshots up to date with the dictionaries.

   The hub layer has two engines. gen-hubs.mjs builds the ~30 tourism-city hubs
   per locale fresh on every build from _internal/hub-i18n/<lang>.json. Every
   other hub page — ~190 per locale — is a snapshot localize.mjs wrote once
   from the English DOM, and nothing regenerates it. So every translation added
   to the dictionaries since a snapshot was written reaches the generated pages
   and stops there: the footer slogan, 59 chrome strings translated on
   2026-10-01, and whatever comes next.

   Re-running localize.mjs to catch up would re-translate ~1,300 pages to
   change a few strings, and coverage drops silently when that happens. This
   does the narrow thing instead: a text node whose WHOLE content is still an
   English dictionary key gets the translation. Whole-node matching is the
   safety: it cannot reach inside a brand name or a sentence, and a node that
   is already translated is never an English key, so it is never touched.

   Templated keys ("How do I get to ${nm}?") are matched the way the
   generator's own translator does it: the canonicaliser has already put the
   page's localised province name into the snapshot, so the node reads
   "How do I get to 宋卡?" — put the token back where the name is, look that up,
   and fill the name back in.

   Runs in prebuild after the page writers. Writes by default; --dry reports.
   Only the seven non-th/en locales; Thai keeps its English footer slogan by
   design (CLAUDE.md). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const APPLY = !process.argv.includes('--dry');
const VERBOSE = process.argv.includes('--verbose');

const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/* The UI strings the hub pages print outside the hub dictionary — the footer
   above all. Paired by key path, English to locale. */
function uiPairs(lang) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/i18n/ui.en.json'), 'utf8'));
  const tr = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/i18n', 'ui.' + lang + '.json'), 'utf8'));
  const out = {};
  const walk = (a, b) => {
    for (const k of Object.keys(a || {})) {
      if (typeof a[k] === 'string' && typeof (b || {})[k] === 'string' && a[k] !== b[k]) out[a[k]] = b[k];
      else if (a[k] && typeof a[k] === 'object') walk(a[k], (b || {})[k]);
    }
  };
  walk(en.footer, tr.footer);
  /* The footer prints the slogan in the same node as the brand —
     "ThailandAddict — Explore Thailand Like a Local" — so the bare tagline can
     never match that node whole. Both brand casings occur on the site. */
  const tEn = (en.footer || {}).tagline, tTr = (tr.footer || {}).tagline;
  if (tEn && tTr && tEn !== tTr) {
    for (const brand of ['ThailandAddict', 'Thailandaddict']) out[brand + ' — ' + tEn] = brand + ' — ' + tTr;
  }
  return out;
}

/* The province a hub page is about, from its file name — city-songkhla,
   activities-songkhla — so a templated key can be reconstructed. */
const SLUG_OF = /^(?:city|activities|where-to-stay)-(.+)\.html$/;

const SKIP = /<(script|style)\b[\s\S]*?<\/\1>/gi;
let grand = 0, grandFiles = 0;
const unmatchedMarkup = new Set();

for (const lang of LANGS) {
  const dict = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/hub-i18n', lang + '.json'), 'utf8'));
  Object.assign(dict, uiPairs(lang));
  const plain = new Map(Object.entries(dict).filter(([k]) => !k.includes('${') && !k.includes('<') && k.trim().length >= 2));
  const templ = Object.entries(dict).filter(([k]) => k.includes('${nm}') && !k.includes('<'));
  for (const [k] of Object.entries(dict)) if (k.includes('<')) unmatchedMarkup.add(k);
  const places = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', lang + '.json'), 'utf8')).prov || {};

  const dir = path.join(ROOT, 'astro/public', lang);
  let n = 0, files = 0;
  const seen = new Map();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    const m = f.match(SLUG_OF);
    const nm = m && places[m[1]] && places[m[1]].n;

    const holes = [];
    let masked = src.replace(SKIP, (x) => { holes.push(x); return '\u0000' + (holes.length - 1) + '\u0000'; });
    let hits = 0;
    masked = masked.replace(/>([^<]+)</g, (whole, text) => {
      const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
      const core = text.trim();
      if (!core || !/[A-Za-z]/.test(core)) return whole;
      let tr = plain.get(core);
      if (tr === undefined && nm && core.includes(nm)) {
        const key = core.split(nm).join('${nm}');
        const hit = templ.find(([k]) => k === key);
        if (hit) tr = hit[1].split('${nm}').join(nm);
      }
      if (tr === undefined || tr === core) return whole;
      hits++;
      seen.set(core, (seen.get(core) || 0) + 1);
      return '>' + lead + tr + trail + '<';
    });
    if (!hits) continue;
    files++; n += hits;
    if (!APPLY) continue;
    const out = masked.replace(/\u0000(\d+)\u0000/g, (_x, i) => holes[+i]);
    fs.writeFileSync(p + '.tmp', out, 'utf8');
    if (fs.readFileSync(p + '.tmp', 'utf8') !== out) { console.error('readback mismatch: ' + p); process.exit(1); }
    fs.renameSync(p + '.tmp', p);
  }
  grand += n; grandFiles += files;
  console.log(`  ${lang}  ${files} page(s) · ${n} English text node(s) → translated · ${seen.size} distinct`);
  if (VERBOSE) for (const [k, c] of [...seen].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`        ×${String(c).padStart(4)}  ${JSON.stringify(k.slice(0, 60))}`);
}

console.log(`\n${grand} text node(s) on ${grandFiles} page(s) ` + (APPLY ? 'rewritten' : 'would be rewritten (--dry)'));
console.log(`${unmatchedMarkup.size} dictionary key(s) carry markup (<em>…) and span several text nodes — this pass does not reach them.`);
