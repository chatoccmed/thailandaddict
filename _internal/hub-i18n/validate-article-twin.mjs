/* Check a translated article against its English source, structurally.

   A translation agent can produce fluent prose and still drop a block, reorder
   days, translate an anchor id that other pages link to, or quietly move a
   clock time. None of that shows up as a broken build; it shows up as an
   itinerary that says 09:00 in English and 10:00 in Japanese.

   Checks, per file:
     · parses, same top-level key set
     · same blocks[] length, same .kind in the same order
     · fields that are identifiers or facts are IDENTICAL to the source:
       every href, src, id, lat, lng, rank, time, score, rating, ratingCount,
       priceRange, hours
     · arrays that carry content keep their length (items, days, gallery, faq…)
     · prose is actually translated: no Latin-script sentences left in a
       non-Latin locale, no Thai script anywhere but Thai

   Usage: node _internal/hub-i18n/validate-article-twin.mjs [--locales zh,ru] [--quiet]
   Exit 14 on any failure. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const C = path.join(ROOT, 'astro/src/content');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const LOCALES = arg('--locales', 'zh,ru,ko,ja,hi,he,ar').split(',').filter(Boolean);
const QUIET = process.argv.includes('--quiet');

/* identical to the source, always */
/* Identifiers and measurements only.

   NOT here, deliberately, though an earlier version had them: hours, priceRange
   and priceUsd. They look like data and are prose — "Wed–Sat 09:00–19:30
   (closed Sun–Tue)" and "10 THB for Thais / 50 THB for foreigners" are printed
   to the reader with a clock and a banknote icon beside them, and a Chinese
   page showing English weekday names is the defect, not the fix. Freezing them
   made the checker demand the bug. */
const FROZEN = new Set(['href', 'src', 'creditHref', 'mapHref', 'fbHref', 'fbPage', 'igPost',
  'libImg', 'libCreditHref', 'stayHref', 'ctaHref', 'heroCreditHref', 'img', 'id', 'lat', 'lng',
  'rank', 'time', 'score', 'rating', 'ratingCount', 'ratingSrc',
  'kind', 'slug', 'provider', 'emoji', 'icon', 'e', 's', 'cls',
  'heroImg', 'image', 'regionHref', 'cityHref', 'crumbHref', 'canonical', 'ogImage', 'nameEn',
  'veg', 'halal', 'englishMenu', 'date', 'modifiedDate', 'publishedDate']);

/* Prose that must still carry every figure from the source: a translated
   opening time or admission price that drifts is a changed fact. */
const KEEP_FIGURES = new Set(['hours', 'priceRange', 'priceUsd', 'price', 'meta']);

const BRANDS = /\b(Thailandaddict|ThailandAddict|Agoda|Booking\.com|Booking|Trip\.com|Trip|Google|Klook|GetYourGuide|TripAdvisor|Wongnai|IHG|Michelin|Wikimedia|Commons|BY-SA|CC|SHA|Facebook|Instagram|Line|Grab|BTS|MRT|ATM|SIM|VIP|AI|USD|THB|km|kg|Wi-?Fi)\b/g;
const NON_LATIN = new Set(['zh', 'ko', 'ja', 'hi', 'he', 'ar', 'ru']);

const fails = [];
const warns = [];
let filesChecked = 0, valuesChecked = 0;

function compare(loc, rel, en, tr, keyPath) {
  const at = () => rel + ':' + keyPath.join('.');
  if (Array.isArray(en)) {
    if (!Array.isArray(tr)) return fails.push(at() + ' should be an array');
    if (en.length !== tr.length) return fails.push(`${at()} has ${tr.length} items, source has ${en.length}`);
    en.forEach((v, i) => compare(loc, rel, v, tr[i], [...keyPath, i]));
    return;
  }
  if (en && typeof en === 'object') {
    if (!tr || typeof tr !== 'object') return fails.push(at() + ' should be an object');
    for (const k of Object.keys(en)) {
      if (!(k in tr)) { fails.push(at() + '.' + k + ' is missing'); continue; }
      compare(loc, rel, en[k], tr[k], [...keyPath, k]);
    }
    for (const k of Object.keys(tr)) if (!(k in en)) fails.push(at() + '.' + k + ' is not in the source');
    return;
  }
  const key = keyPath[keyPath.length - 1];
  valuesChecked++;
  if (FROZEN.has(key)) {
    if (String(en) !== String(tr)) fails.push(`${at()} changed a frozen field: "${String(en).slice(0, 48)}" -> "${String(tr).slice(0, 48)}"`);
    return;
  }
  if (typeof en !== 'string' || !en.trim()) return;
  if (typeof tr !== 'string') return fails.push(at() + ' should be a string');

  /* HTML must survive intact */
  const tags = (s) => (String(s).match(/<\/?[a-z][a-z0-9]*/gi) || []).map((t) => t.toLowerCase()).sort().join(',');
  if (tags(en) !== tags(tr)) fails.push(`${at()} HTML tags changed — "${tags(en)}" -> "${tags(tr)}"`);

  /* An opening time or a price may be reworded, never renumbered — but
     "renumbered" has to mean the figure, not its spelling, or the check ends up
     demanding the bug. Three things are spelling:

       · separators — Russian writes 1 000 and 1,5 where English writes 1,000
         and 1.50, so both sides are folded to a plain number first
       · leading zeros — ~2am is 02:00 in Russian and 2:00 in Chinese
       · small counts a language says in words — "dinner for 2" is ужин на
         двоих, "Open 24 hrs" is Круглосуточно, "closed 3rd Wed" is 每月第三个
         周三. Nothing was renumbered; the number became a word.

     So a lost figure is a FAILURE when it is a clock time, when it is 32 or
     larger (a price or a rate — no language turns 1,200 baht into a word), or
     when the translation carries a number in its place that the source does
     not have, which is a substitution rather than a rewording. Everything else
     is a warning for a human to glance at. */
  if (KEEP_FIGURES.has(key)) {
    const figures = (s) => {
      const t = String(s)
        .replace(/(\d)[    ](?=\d{3}(?!\d))/g, '$1') /* 1 000 -> 1000 */
        .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')                     /* 1,000 -> 1000 */
        .replace(/(\d),(?=\d{1,2}(?!\d))/g, '$1.');                 /* 1,5   -> 1.5  */
      return {
        clocks: [...t.matchAll(/\b(\d{1,2}):(\d{2})\b/g)].map((m) => Number(m[1]) + ':' + m[2]),
        nums: [...t.replace(/\b\d{1,2}:\d{2}\b/g, ' ').matchAll(/\d+(?:\.\d+)?/g)].map((m) => String(Number(m[0]))),
      };
    };
    const a = figures(en), b = figures(tr);
    const unmatched = (want, have) => {
      const pool = [...have];
      return want.filter((n) => { const i = pool.indexOf(n); if (i < 0) return true; pool.splice(i, 1); return false; });
    };
    const lostClocks = unmatched(a.clocks, b.clocks);
    const lostNums = unmatched(a.nums, b.nums);
    const substituted = lostNums.length && unmatched(b.nums, a.nums).length;
    const hard = [...lostClocks, ...lostNums.filter((n) => substituted || Number(n) >= 32)];
    const soft = lostNums.filter((n) => !hard.includes(n));
    if (hard.length) fails.push(`${at()} lost figures [${hard.join(', ')}] — "${String(en).slice(0, 44)}" -> "${String(tr).slice(0, 44)}"`);
    else if (soft.length) warns.push(`${at()} figure [${soft.join(', ')}] is not in the translation — a word, or a drift? "${String(en).slice(0, 40)}" -> "${String(tr).slice(0, 40)}"`);
  }

  if (!NON_LATIN.has(loc)) return;
  /* ฿ is the baht sign and lives in the Thai block; every locale prints it. */
  if (/[฀-฾เ-๿]/.test(tr)) return fails.push(`${at()} contains Thai script: "${tr.slice(0, 50)}"`);
  /* A long run of Latin words in a non-Latin locale means the value was not
     translated. Brands and urls are stripped first. A run of Capitalised words
     is a list of names — "Siam Paragon, Siam Discovery, CentralWorld" is right
     in every language — so the run only counts as English when it carries
     lowercase words, which is what grammar is made of. */
  const stripped = String(tr).replace(/<[^>]+>/g, ' ').replace(BRANDS, ' ').replace(/https?:\/\/\S+/g, ' ');
  const run = stripped.match(/(?:\b[A-Za-z][A-Za-z'’-]{2,}\b[^A-Za-zЀ-ӿ֐-ࣿऀ-ॿ　-鿿가-힯]{0,3}){5,}/);
  if (run) {
    const lower = (run[0].match(/\b[a-z][a-z'’-]{2,}\b/g) || []).filter((w) => !/^(the|and|for|with|from|near|into|onto)$/.test(w));
    if (lower.length >= 3) fails.push(`${at()} looks untranslated: "${run[0].trim().slice(0, 70)}"`);
  }
}

for (const loc of LOCALES) {
  const dir = path.join(C, 'articles-' + loc);
  if (!fs.existsSync(dir)) { console.log(loc + ': no articles dir'); continue; }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  let bad0 = fails.length;
  for (const f of files) {
    const enP = path.join(C, 'articles-en', f);
    if (!fs.existsSync(enP)) { fails.push(`articles-${loc}/${f} has no English source`); continue; }
    let en, tr;
    try { en = JSON.parse(fs.readFileSync(enP, 'utf8')); } catch { fails.push('articles-en/' + f + ' does not parse'); continue; }
    try { tr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { fails.push(`articles-${loc}/${f} does not parse: ${String(e.message).slice(0, 60)}`); continue; }
    filesChecked++;
    const ek = Object.keys(en).sort().join(), tk = Object.keys(tr).sort().join();
    if (ek !== tk) {
      const miss = Object.keys(en).filter((k) => !(k in tr)), extra = Object.keys(tr).filter((k) => !(k in en));
      fails.push(`articles-${loc}/${f} top-level keys differ` + (miss.length ? ' — missing ' + miss.join(',') : '') + (extra.length ? ' — extra ' + extra.join(',') : ''));
    }
    compare(loc, `articles-${loc}/${f}`, en, tr, []);
  }
  const n = fails.length - bad0;
  console.log('  ' + loc.padEnd(3) + String(files.length).padStart(4) + ' files · ' + (n ? n + ' FAILURES' : 'ok'));
}

console.log('\nchecked ' + filesChecked + ' files, ' + valuesChecked + ' values');
if (warns.length) {
  console.log(warns.length + ' warnings — a figure the translation says in words, or a drift nobody caught:');
  for (const w of warns.slice(0, QUIET ? 5 : 40)) console.log('  ! ' + w);
  if (warns.length > (QUIET ? 5 : 40)) console.log('  … and ' + (warns.length - (QUIET ? 5 : 40)) + ' more');
  console.log('');
}
if (fails.length) {
  console.error(fails.length + ' FAILURES');
  const show = QUIET ? 15 : 60;
  for (const f of fails.slice(0, show)) console.error('  ✗ ' + f);
  if (fails.length > show) console.error('  … and ' + (fails.length - show) + ' more');
  process.exit(14);
}
console.log('all translated articles match their source structurally');
