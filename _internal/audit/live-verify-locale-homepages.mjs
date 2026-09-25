/* Is the homepage actually in the reader's language, in all nine?

   The seven non-th/en homepages were frozen on the pre-redesign page until the
   generator learned their copy table and their content directories. These
   checks are what "learned" has to mean in practice — not that a page exists,
   but that a reader of that language gets a page that works:

     · it is the planner-first page, with real plan data
     · the destination names, region names, editor bio and the strings the
       planner writes in the browser are all in their language
     · its Latin-word count is no worse than the THAI page's, which is the
       native-language baseline (the Thai page carries photo credits and hotel
       brand names in Latin too, so zero is the wrong target)
     · paid links are declared and the language switcher offers all nine

   Read-only. Runs against production, or against the built files with --local.
   Usage: node _internal/audit/live-verify-locale-homepages.mjs [--base URL] [--local]
   Exit 15 on any failure. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const LOCAL = process.argv.includes('--local');
const BASE = arg('--base', 'https://thailandaddict.com').replace(/\/$/, '');
const LOCS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const RTL = new Set(['he', 'ar']);

let pass = 0; const fails = [];
const ok = (m) => { pass++; console.log('  ✓ ' + m); };
const bad = (m) => { fails.push(m); console.log('  ✗ ' + m); };

async function page(loc) {
  if (LOCAL) {
    const p = path.join(ROOT, 'astro/public', loc === 'th' ? 'index.html' : loc + '/index.html');
    return fs.existsSync(p) ? { status: 200, body: fs.readFileSync(p, 'utf8') } : { status: 404, body: '' };
  }
  const r = await fetch(BASE + (loc === 'th' ? '/' : '/' + loc + '/'), { headers: { 'User-Agent': 'thailandaddict-selfcheck/1.0' } });
  return { status: r.status, body: await r.text() };
}

const visible = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

/* Latin words that are legitimately Latin on every page: brands, place names
   in urls, photo-credit sources. Same list the Thai page is measured with, so
   the comparison is like for like. */
const BRAND = /\b(Thailandaddict|ThailandAddict|Agoda|Booking\.com|Booking|Trip\.com|Trip|Google|Klook|IHG|Michelin|Wikimedia|Commons|BY-SA|Wongnai|TripAdvisor|SHA|Doi|Wat|Koh|Ko|Baan|Ban|Hotel|Hotels|Resort|Resorts|Villa|Villas|Suite|Suites|Spa|Inn|House|Cafe|Café|Small|Luxury|Best|Siam|Nimman|Chiang|Bangkok|Krabi|Phuket|Pattaya|Rayavadee|BTS|MRT)\b/g;
const latinWords = (h) => (visible(h).replace(BRAND, ' ').match(/[A-Za-z][A-Za-z'’-]{3,}/g) || []);

/* the baseline: Thai, a page nobody would call half-translated */
const th = await page('th');
if (th.status !== 200) { console.error('cannot read the Thai homepage — no baseline'); process.exit(1); }
const BASELINE = latinWords(th.body).length;
console.log('Thai homepage baseline: ' + BASELINE + ' Latin words (' + (LOCAL ? 'local build' : BASE) + ')\n');

/* English strings that must NOT survive into a translated page */
const ENGLISH_RUNTIME = ['Building the plan', 'Start over', 'Open in the trip planner',
  'Read the full guide', 'Overnight', 'Keep this', 'days ago', 'yesterday',
  'stops · guide times', 'Show me the plan', 'Your trip'];
const ENGLISH_PROSE = ['Northern Thailand', 'Isan (Northeast)', 'Southern Thailand',
  'A doctor and lifelong traveler', 'Editor-in-Chief', 'Best beaches', 'Quiet islands'];

for (const loc of LOCS) {
  console.log(loc);
  const r = await page(loc);
  if (r.status !== 200) { bad(loc + ': HTTP ' + r.status); continue; }
  const h = r.body;

  const lang = (h.match(/<html[^>]*\blang="([^"]+)"/) || [, ''])[1];
  const dir = (h.match(/<html[^>]*\bdir="([^"]+)"/) || [, ''])[1];
  if (lang !== loc) bad(`${loc}: <html lang="${lang}">`);
  else if (dir !== (RTL.has(loc) ? 'rtl' : 'ltr')) bad(`${loc}: <html dir="${dir}">`);
  else ok(`${loc}: lang=${lang} dir=${dir}`);

  const canon = (h.match(/<link rel="canonical" href="([^"]+)"/) || [, ''])[1];
  if (!canon.endsWith('/' + loc + '/')) bad(`${loc}: canonical is ${canon}`);
  else ok(`${loc}: canonical ${canon}`);

  const alts = [...h.matchAll(/hreflang="([a-z-]+)"/g)].map((m) => m[1]);
  const want = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
  const missing = want.filter((l) => !alts.includes(l));
  if (missing.length) bad(`${loc}: hreflang missing ${missing.join(',')}`);
  else ok(`${loc}: hreflang has all 9`);

  /* the planner has to have something to plan */
  const plans = (h.match(/"[a-z-]+\|(?:1-day|2d1n|3d2n)"/g) || []).length;
  if (plans < 11) bad(`${loc}: planner has ${plans} plans, expected 11`);
  else ok(`${loc}: planner carries ${plans} plans`);

  /* and they have to be named in the reader's language */
  const dests = [...new Set([...h.matchAll(/"dest":"([^"]{1,30})"/g)].map((m) => m[1]))];
  const latinDests = dests.filter((d) => /^[\x00-\x7F]+$/.test(d));
  if (!dests.length) bad(`${loc}: no destination names in the plan data`);
  else if (latinDests.length) bad(`${loc}: ${latinDests.length}/${dests.length} destinations still Latin — ${latinDests.slice(0, 4).join(', ')}`);
  else ok(`${loc}: all ${dests.length} planner destinations localised (${dests.slice(0, 3).join(' · ')})`);

  /* the browser-rendered planner strings */
  const rtLeak = ENGLISH_RUNTIME.filter((s) => h.includes('"' + s) || h.includes(s + '"'));
  if (rtLeak.length) bad(`${loc}: planner still speaks English — ${rtLeak.slice(0, 4).join(' / ')}`);
  else ok(`${loc}: planner strings localised`);

  /* prose that used to fall back to English */
  const proseLeak = ENGLISH_PROSE.filter((s) => h.includes(s));
  if (proseLeak.length) bad(`${loc}: English prose on the page — ${proseLeak.slice(0, 3).join(' / ')}`);
  else ok(`${loc}: region names, editor bio and pills localised`);

  /* the overall measure */
  const n = latinWords(h).length;
  if (n > BASELINE) bad(`${loc}: ${n} Latin words, worse than the Thai page's ${BASELINE}`);
  else ok(`${loc}: ${n} Latin words (Thai baseline ${BASELINE})`);

  /* Money. The homepage deliberately links to our own review pages, not to the
     OTAs — the booking urls travel as data on the saved-item payload, for the
     trip planner to carry. So the check is not "are the anchors declared" (there
     are none, on any locale including Thai) but "is every OTA url in that
     payload still affiliate-tagged", plus: if an OTA anchor ever does appear,
     it must be declared. */
  const anchors = h.match(/<a\s[^>]*>/gi) || [];
  const paidAnchors = anchors.filter((a) => /agoda\.com|booking\.com|trip\.com|klook\.com|href="\/go\/b/i.test(a));
  const undeclared = paidAnchors.filter((a) => !/rel="[^"]*sponsored/i.test(a));
  const otaUrls = [...h.matchAll(/"(?:agoda|booking|trip)":"([^"]+)"/g)].map((m) => m[1]).filter(Boolean);
  const untagged = otaUrls.filter((u) => !/[?&](cid|Allianceid|aid)=/i.test(u) && !u.startsWith('/go/b'));
  if (undeclared.length) bad(`${loc}: ${undeclared.length}/${paidAnchors.length} paid anchors undeclared`);
  else if (!otaUrls.length) bad(`${loc}: the planner payload carries no booking urls at all`);
  else if (untagged.length) bad(`${loc}: ${untagged.length}/${otaUrls.length} booking urls lost their affiliate id — ${untagged[0].slice(0, 60)}`);
  else ok(`${loc}: ${otaUrls.length} booking urls in the planner payload, all tagged` + (paidAnchors.length ? `; ${paidAnchors.length} anchors all declared` : ''));
  console.log('');
}

console.log(fails.length ? `FAILED ${fails.length} of ${pass + fails.length}` : `all ${pass} checks passed`);
for (const f of fails) console.log('  ✗ ' + f);
process.exit(fails.length ? 15 : 0);
