// Build a client-side search index for the static site (no server).
// Writes astro/public/search-index.json (TH) + astro/public/en/search-index.json (EN).
// Each entry = [title, url, cat, place, blob].
//   blob = normalized BILINGUAL search text: this-locale + other-locale title/place, romanized slug,
//   category keywords (TH+EN), and the entry's province name in BOTH languages → a query typed in
//   either Thai or English (incl. category words like "โรงแรม"/"hotel") matches the same page.
//   cat: stay|rank|see|eat|plan|guide|city. Run on import (prebuild) or: node _internal/gen-search-index.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const CONTENT = path.join(ROOT, 'astro/src/content');
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const detitle = (s) => strip(s).split(' | ')[0];               // drop " | ThailandAddict" suffix
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const slugsIn = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
// search-normalize: lowercase; keep letters/numbers AND combining marks (Thai vowels/tones are \p{M} —
// dropping them would mangle Thai words, e.g. ภูเก็ต); collapse everything else to a space.
const norm = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu, ' ').replace(/\s+/g, ' ').trim();

const CAT = { attraction: 'see', food: 'eat', 'eat-ranking': 'eat', itinerary: 'plan', prep: 'guide', guide: 'guide' };
// category keywords (TH+EN) folded into each entry's blob so "โรงแรม ภูเก็ต" / "hotel phuket" / "ร้านอาหารกระบี่" match
const CAT_KW = {
  stay: 'โรงแรม ที่พัก รีสอร์ท เกสต์เฮาส์ hotel stay resort accommodation',
  rank: 'โรงแรม ที่พัก จัดอันดับ ยอดนิยม hotel top ranking best',
  see: 'ที่เที่ยว สถานที่ท่องเที่ยว เที่ยว attraction sights things to do',
  eat: 'ที่กิน ร้านอาหาร อาหาร คาเฟ่ restaurant food eat cafe dining',
  plan: 'แผนเที่ยว ทริป แผน itinerary plan trip',
  guide: 'คู่มือ ไกด์ แนะนำ guide tips',
  city: 'เมือง จังหวัด city province destination',
};
const REGION_NAME = {
  north: { th: 'ภาคเหนือ', en: 'Northern Thailand' }, isan: { th: 'ภาคอีสาน', en: 'Isan (Northeast)' },
  central: { th: 'ภาคกลาง', en: 'Central Thailand' }, east: { th: 'ภาคตะวันออก', en: 'Eastern Thailand' },
  west: { th: 'ภาคตะวันตก', en: 'Western Thailand' }, south: { th: 'ภาคใต้', en: 'Southern Thailand' },
};
const FIXED_HUB = {
  'country-thailand': { th: 'เที่ยวไทย 77 จังหวัด', en: 'Explore Thailand — all provinces' },
  destinations: { th: 'เมืองท่องเที่ยวยอดนิยม', en: 'Top tourist cities' },
  'plan-your-trip': { th: 'เตรียมตัวเที่ยวไทย', en: 'Plan Your Trip' },
};
const EXCLUDE = new Set(['404', 'font-compare', 'search', 'index']);

// collect raw entries {title,url,cat,place,cluster} for one locale + a cluster→display-name map (blob added later)
function collect(loc) {
  const suf = loc === 'en' ? '-en' : '';
  const entries = [];
  const clusterName = {};                                       // cluster -> display name (locale-specific)

  for (const f of slugsIn(path.join(CONTENT, 'articles' + suf))) {
    const d = readJson(path.join(CONTENT, 'articles' + suf, f)); if (!d) continue;
    const place = strip(d.crumbCity);
    if (d.cluster && place && !clusterName[d.cluster]) clusterName[d.cluster] = place;
    entries.push({ title: detitle(d.title || d.h1), url: `${d.slug}.html`, cat: CAT[d.type] || 'guide', place, cluster: d.cluster || '' });
  }
  for (const f of slugsIn(path.join(CONTENT, 'reviews' + suf))) {
    const d = readJson(path.join(CONTENT, 'reviews' + suf, f)); if (!d) continue;
    const place = strip(d.addressLocality) || clusterName[d.cluster] || strip(d.cluster);
    entries.push({ title: strip(d.name), url: `${d.slug}.html`, cat: 'stay', place, cluster: d.cluster || '' });
  }
  for (const f of slugsIn(path.join(CONTENT, 'roundups' + suf))) {
    const d = readJson(path.join(CONTENT, 'roundups' + suf, f)); if (!d) continue;
    const bc = Array.isArray(d.breadcrumb) ? d.breadcrumb : [];
    const place = strip((bc[bc.length - 2] || {}).name) || '';
    entries.push({ title: detitle(d.title), url: `${d.slug}.html`, cat: 'rank', place, cluster: '' });
  }
  const htmlDir = loc === 'en' ? path.join(PUB, 'en') : PUB;
  for (const f of (fs.existsSync(htmlDir) ? fs.readdirSync(htmlDir) : [])) {
    if (!f.endsWith('.html')) continue;
    const name = f.slice(0, -5);
    if (EXCLUDE.has(name)) continue;
    if (name.startsWith('city-')) {
      const slug = name.slice(5);
      const disp = clusterName[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      entries.push({ title: disp, url: f, cat: 'city', place: loc === 'en' ? 'Province / city' : 'จังหวัด/เมือง', cluster: slug });
    } else if (name.startsWith('region-')) {
      const r = name.slice(7); const rn = REGION_NAME[r]; if (rn) entries.push({ title: rn[loc], url: f, cat: 'city', place: loc === 'en' ? 'Region' : 'ภาค', cluster: '' });
    } else if (name.startsWith('area-')) {                        // per-ย่าน hub (area-<city>-<hood>)
      const html = fs.readFileSync(path.join(htmlDir, f), 'utf8');
      const t = detitle((html.match(/<title>([^<]+)<\/title>/) || [])[1] || name.replace(/-/g, ' '));
      entries.push({ title: t, url: f, cat: 'stay', place: loc === 'en' ? 'Bangkok neighbourhood' : 'ย่านกรุงเทพ', cluster: '' });
    } else if (FIXED_HUB[name]) {
      entries.push({ title: FIXED_HUB[name][loc], url: f, cat: 'city', place: loc === 'en' ? 'Guide' : 'คู่มือ', cluster: '' });
    }
  }
  return { entries, clusterName };
}

const TH = collect('th'), EN = collect('en');
const RAW = { th: TH.entries, en: EN.entries };
const PROV = { th: TH.clusterName, en: EN.clusterName };        // cluster -> Thai / English province name
// twin lookup by page key (slug without .html) → normalized TH + EN text, so each entry carries BOTH languages
const keyOf = (e) => e.url.replace(/\.html$/, '');
const twin = {};
for (const e of RAW.th) (twin[keyOf(e)] ??= {}).th = norm(e.title + ' ' + e.place);
for (const e of RAW.en) (twin[keyOf(e)] ??= {}).en = norm(e.title + ' ' + e.place);

function emit(loc) {
  const arr = RAW[loc].map((e) => {
    const t = twin[keyOf(e)] || {};
    const prov = `${PROV.th[e.cluster] || ''} ${PROV.en[e.cluster] || ''}`;   // province name in BOTH languages (fixes English-only hotel addresses)
    const blob = norm([e.title, e.place, keyOf(e).replace(/-/g, ' '), t.th || '', t.en || '', CAT_KW[e.cat] || '', prov].join(' '));
    return [e.title, e.url, e.cat, e.place, blob];
  });
  const out = loc === 'en' ? path.join(PUB, 'en', 'search-index.json') : path.join(PUB, 'search-index.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(arr));
  return { n: arr.length, kb: (fs.statSync(out).size / 1024).toFixed(0) };
}

const th = emit('th');
const en = emit('en');
console.log(`search-index.json · TH ${th.n} entries (${th.kb} KB) · EN ${en.n} entries (${en.kb} KB) · bilingual blobs`);
