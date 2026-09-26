/* One name per province per language, everywhere on the hub layer.

   The locale hubs print a province's name three or four different ways on the
   same page: the Latin English name in the body, and two or three different
   transliterations in the <h1>, the <title> and the homepage's own province
   list. 558 city hubs, and every one of them also carried a translated
   spelling somewhere else — so a blanket substitution would not have fixed the
   inconsistency, it would have added another variant.

   The canonical name is the one in _internal/homepage-i18n/<lang>.json, because
   that is what the homepage, the planner and the 77-province list already
   print — the rest of the site is what disagrees with it.

   This does ONE thing: the Latin English name → the canonical name. Exact,
   deterministic, and it removes every Latin province name from the hub layer.

   🚨 It does NOT try to reconcile the remaining transliterations — the <h1>
   saying कमफेंग फेत while the <title> says कामफेंग फेत. The obvious way to do
   that is to treat a near-duplicate spelling as the same name misspelled and
   snap it to the canonical one. That premise is FALSE for Thai provinces,
   which differ from each other by one or two characters. A dry run of exactly
   that idea proposed, among 1,058 substitutions:

       × 764  ru  Чиангмай   → Чианграй      Chiang Mai  → Chiang Rai
       × 718  ko  치앙마이    → 치앙라이       Chiang Mai  → Chiang Rai
       × 471  ru  Чантхабури → Нонтхабури    Chanthaburi → Nonthaburi
       × 375  ru  Районг     → Ранонг        Rayong      → Ranong
       × 374  ru  Чонбури    → Лопбури       and 211 the other way

   It would have renamed Chiang Mai to Chiang Rai on 764 pages. Edit distance
   cannot be part of any fix here. Reconciling the transliterations needs a
   per-page notion of which province the page is actually about, and a guard
   that a candidate is not itself another province's name — do not reach for
   fuzzy matching again.

   Only text a reader sees is touched: text nodes, and the alt / title /
   aria-label / meta-content attributes. Never an href, src, id, class or
   data-*, and never inside <script> or <style> — a province name is also a
   url slug, and rewriting one of those is a 404. Proof after a run:
     every href/src in astro/public/<lang> is still pure ASCII.

   Runs in prebuild after every page writer. Usage: node _internal/qa/canonicalise-place-names.mjs [--dry]
   Writes by default (prebuild imports it with no argv); --dry only reports. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
/* prebuild imports this module with no argv, so it WRITES by default; pass --dry to look first. */
const APPLY = !process.argv.includes('--dry');

const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/* Walk the HTML and hand every reader-visible run of text to fn, leaving
   markup, urls and scripts exactly as they were. */
const SKIP = /<(script|style)\b[\s\S]*?<\/\1>/gi;
const TEXT_ATTRS = /\b(alt|title|aria-label)="([^"]*)"/g;
const META = /(<meta[^>]*\b(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"[^>]*\bcontent=")([^"]*)(")/gi;

function mapVisible(html, fn) {
  const holes = [];
  let masked = html.replace(SKIP, (m) => { holes.push(m); return '\u0000' + (holes.length - 1) + '\u0000'; });
  masked = masked.replace(/>([^<]+)</g, (_m, text) => '>' + fn(text) + '<');
  masked = masked.replace(TEXT_ATTRS, (_m, name, val) => name + '="' + fn(val) + '"');
  masked = masked.replace(META, (_m, a, val, c) => a + fn(val) + c);
  return masked.replace(/\u0000(\d+)\u0000/g, (_m, i) => holes[+i]);
}

let total = 0, filesTouched = 0;

for (const lang of LANGS) {
  const canon = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', lang + '.json'), 'utf8')).prov || {};
  const pairs = Object.entries(canon)
    .filter(([, v]) => v && v.n && !/^[\x00-\x7F]+$/.test(v.n))
    .map(([slug, v]) => ({ en: titleCase(slug), tr: v.n }))
    /* longest English name first: "Nakhon Si Thammarat" before "Nakhon Si" */
    .sort((a, b) => b.en.length - a.en.length);

  const dir = path.join(ROOT, 'astro/public', lang);
  let n = 0, files = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    let hits = 0;
    const out = mapVisible(src, (text) => {
      let t = text;
      for (const { en, tr } of pairs) if (t.includes(en)) { t = t.split(en).join(tr); hits++; }
      return t;
    });
    if (!hits) continue;
    files++; n += hits;
    if (!APPLY) continue;
    fs.writeFileSync(p + '.tmp', out, 'utf8');
    if (fs.readFileSync(p + '.tmp', 'utf8') !== out) { console.error('readback mismatch: ' + p); process.exit(1); }
    fs.renameSync(p + '.tmp', p);
  }
  total += n; filesTouched += files;
  console.log('  ' + lang + '  ' + files + ' page(s) · ' + n + ' Latin name(s) → canonical');
}

console.log('\n' + total + ' Latin province name(s) on ' + filesTouched + ' page(s) '
  + (APPLY ? 'rewritten' : 'would be rewritten (--dry)'));
