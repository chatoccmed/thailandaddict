// Post-process EN roundup twins: enforce verified data from the TH source,
// fix /en/ breadcrumbs, and scan for any leaked Thai script (only ฿ allowed).
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve('.');
const TH_DIR = path.join(REPO, 'astro/src/content/roundups');
const EN_DIR = path.join(REPO, 'astro/src/content/roundups-en');

const SLUGS = [
  'top9-koh-lanta-hotels-krabi',
];

const TOP_KEYS = ['slug','title','metaDesc','ogTitle','ogDesc','image','heroImg','heroEyebrow','h1','heroSub','heroStats','breadcrumb','breadcrumbSchema','navReviewLabel','navReviewHref','introH2','introHtml','mrtHtml','secLabel','toc','entries','compareTitle','compareCols','compareRows','adviceTitle','advice','noteHtml','faqTitle','faq'];
const VERIFIED = ['name','score','stars','img','agodaUrl','bookingUrl','tripUrl','reviewUrl','priceBig'];

// Thai block U+0E00–U+0E7F EXCEPT ฿ (U+0E3F).
const THAI_RE = /[฀-฾เ-๿]/;  // Thai block except ฿ (U+0E3F)
function scanThai(obj, pathStr, hits) {
  if (typeof obj === 'string') { if (THAI_RE.test(obj)) hits.push(pathStr + ' → "' + obj.replace(/<[^>]+>/g, '').slice(0, 50) + '"'); return; }
  if (Array.isArray(obj)) { obj.forEach((v, i) => scanThai(v, pathStr + '[' + i + ']', hits)); return; }
  if (obj && typeof obj === 'object') { for (const [k, v] of Object.entries(obj)) scanThai(v, pathStr + '.' + k, hits); }
}

let anyFail = false;
for (const slug of SLUGS) {
  const enPath = path.join(EN_DIR, slug + '.json');
  const thPath = path.join(TH_DIR, slug + '.json');
  const issues = [];
  if (!fs.existsSync(enPath)) { console.log(`\n✗ ${slug}: EN FILE NOT WRITTEN`); anyFail = true; continue; }
  let en, th;
  try { en = JSON.parse(fs.readFileSync(enPath, 'utf8')); } catch (e) { console.log(`\n✗ ${slug}: INVALID JSON — ${e.message}`); anyFail = true; continue; }
  th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

  for (const k of TOP_KEYS) if (!(k in en)) issues.push('missing top key: ' + k);
  en.slug = slug;
  en.navReviewHref = slug + '.html';

  // enforce verified entry fields from TH (match by index; verify reviewUrl aligns)
  if (!Array.isArray(en.entries) || en.entries.length !== th.entries.length) {
    issues.push(`entry count ${en.entries?.length} != TH ${th.entries.length}`);
  } else {
    en.entries.forEach((e, i) => {
      const t = th.entries[i];
      for (const k of VERIFIED) e[k] = t[k];
      e.id = t.id; e.rank = t.rank; e.rankColor = t.rankColor;
      // rooms: keep EN-translated type text, but enforce price from TH by index
      if (Array.isArray(e.rooms) && Array.isArray(t.rooms)) e.rooms.forEach((rm, j) => { if (t.rooms[j]) rm.price = t.rooms[j].price; });
    });
    // toc + compareRows verified bits from TH
    en.toc = th.entries.map((t, i) => ({ n: String(i + 1), color: t.rankColor || '#06B6D4', name: t.name, price: t.priceBig }));
    if (Array.isArray(en.compareRows)) en.compareRows.forEach((row, i) => { const t = th.entries[i]; if (t) { row.rank = String(i + 1); row.name = t.name; row.score = String(t.score); row.price = t.priceBig; row.rankColor = t.rankColor; } });
    en.heroImg = th.entries[0].img; en.image = th.entries[0].img;
  }

  // fix /en/ breadcrumbs
  if (Array.isArray(en.breadcrumb) && en.breadcrumb[0]) en.breadcrumb[0].href = '/en/';
  if (Array.isArray(en.breadcrumbSchema)) en.breadcrumbSchema.forEach(b => { if (b.item) b.item = b.item.replace('https://thailandaddict.com/', 'https://thailandaddict.com/en/').replace('/en/en/', '/en/'); });

  // Thai-leak scan (skip the verified fields we just forced from TH, which legitimately hold only URLs/scores/฿ prices)
  const scanTarget = { ...en, entries: en.entries?.map(e => { const c = { ...e }; for (const k of VERIFIED) delete c[k]; return c; }), toc: undefined, compareRows: en.compareRows?.map(r => ({ ...r, name: undefined, price: undefined, score: undefined })) };
  const hits = []; scanThai(scanTarget, slug, hits);
  if (hits.length) { issues.push(hits.length + ' Thai-leak(s): ' + hits.slice(0, 6).join(' | ')); }

  fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
  if (issues.length) { anyFail = true; console.log(`\n✗ ${slug} (${en.entries?.length || 0} entries) — ${issues.length} issue(s):`); issues.slice(0, 12).forEach(x => console.log('   - ' + x)); }
  else console.log(`\n✓ ${slug} — ${en.entries.length} entries, verified data enforced, /en/ breadcrumbs, no Thai leak`);
}
console.log(anyFail ? '\n=== SOME ISSUES — review above ===' : '\n=== ALL 7 EN TWINS CLEAN ===');
process.exit(anyFail ? 1 : 0);
