/* Does every hotel link actually reach THAT hotel?

   Two separate questions, and they fail in different ways:

     coverage  does the review carry a link that lands on the hotel's own page
               on Agoda and on Trip.com, rather than a search box or a city
               list? A search link still gets a determined reader there, but it
               is a worse page than the one we promised, and a bare city list
               is not an answer at all.
     identity  does a link that LOOKS direct point at the right hotel? A slug is
               free text in our JSON; nothing has ever checked it against the
               hotel it sits next to. The Agoda feed audit on 2026-09-17 showed
               how easily a plausible name lands on the wrong property - three
               of our reviews matched hotels 300-1,100 km away on name alone.

   Link classes, worst first:
     generic   a city list or an unkeyworded search - the reader must find the
               hotel themselves, and on a list of 400 they will not
     search     a search URL carrying the hotel's name - reaches it, usually
     direct     the hotel's own page (agoda /<slug>/hotel/, trip hotel-detail)

   Identity is only checked on Agoda direct links, because Agoda's slug is
   derived from the hotel name and can be compared to it. Trip.com's detail
   URLs carry a numeric id and a CITY name, so the URL says nothing about which
   hotel it is - that would need the Trip feed, which we do not have.

   Usage: node _internal/audit/audit-ota-links.mjs [--locale th|all] [--json out.json] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const LOCALE = arg('--locale', 'th');
const JSONOUT = arg('--json', null);

const LOCALES = LOCALE === 'all'
  ? ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar']
  : [''];

/* Same folding the pin audit uses: strip diacritics, drop the words every
   hotel shares, and collapse the transliteration pairs Thai romanisation
   swaps freely (ph/p, th/t, k/g, v/w, ee/i). Two names that fold together are
   the same name however they were spelled. */
const STOP = /\b(hotel|hotels|resort|resorts|spa|the|and|by|at|de|a|an|บ้าน|โรงแรม|รีสอร์ท)\b/g;
const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]/g, ' ').replace(STOP, ' ')
  .replace(/\b(ph|th|kh|ch)/g, (m) => m[0]).replace(/[wv]/g, 'w').replace(/ee/g, 'i').replace(/oo/g, 'u')
  .replace(/[^a-z0-9]/g, '');
/* Place names are dropped before comparing: our slugs and names both carry the
   city or province, so "bangkok" matching "bangkok" says nothing about whether
   two hotels are the same. Numbers are kept - "137" and "81" are among the most
   distinctive things a hotel name has. */
const PLACES = new Set(fs.readdirSync(path.join(ROOT, 'astro/src/content/reviews'))
  .map((f) => f.replace(/\.json$/, '').split('-').pop()).filter((w) => w.length > 3));
const tokenFold = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]/g, '').replace(/\b(ph|th|kh|ch)/g, (m) => m[0])
  .replace(/[wv]/g, 'w').replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/(.)\1+/g, '$1');
const tokens = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').replace(STOP, ' ').split(/\s+/)
  .map(tokenFold).filter((w) => w.length >= 3 && !PLACES.has(w));

const classify = {
  agoda(u) {
    /* Agoda's partner deep link names the property by id, so it reaches one
       hotel and cannot reach the wrong one. Used where our slug pointed at a
       different hotel entirely and no correct slug was known - see
       _internal/fix-wrong-agoda-links.mjs. */
    if (/agoda\.com\/partners\/partnersearch\.aspx\?[^"']*\bhid=\d+/i.test(u)) return 'direct';
    if (/agoda\.com\/[a-z0-9_.-]+\/hotel\//i.test(u)) return 'direct';
    if (/agoda\.com\/(city|country)\//i.test(u)) return 'generic';
    if (/agoda\.com\/search/i.test(u)) return /[?&](q|textToSearch)=[^&]+/i.test(u) ? 'search' : 'generic';
    return 'other';
  },
  trip(u) {
    if (/hotel-detail-?\d+/i.test(u)) return 'direct';
    if (/hotel-detail/i.test(u)) return 'direct';
    if (/moments/i.test(u)) return 'other';
    if (/hotels?\/list|hotels?-list|hotel-list|-hotels(?:$|[?/])/i.test(u)) {
      return /[?&](keyword|searchWord)=[^&]+/i.test(u) ? 'search' : 'generic';
    }
    return 'other';
  },
};
/* Affiliate attribution is NOT decided here and must not be judged from the
   content files. stampAffiliate() in astro/src/lib/affiliate.ts adds the tag at
   RENDER, through goB() in all three layouts, so a URL stored bare still ships
   tagged. Scanning content for a missing cid=/Allianceid= reported 98 links as
   earning nothing on 2026-09-24; every one of them was tagged in astro/dist.
   The built HTML is the only place this question has an answer, so it is asked
   there or not at all. */
const tagged = { agoda: (u) => /[?&]cid=\d+/i.test(u), trip: (u) => /[?&]Allianceid=\d+/i.test(u) };
const DIST = path.join(ROOT, 'astro/dist');
const CAN_CHECK_TAGS = fs.existsSync(DIST);

const rows = [];
for (const suffix of LOCALES) {
  const dir = path.join(ROOT, 'astro/src/content/reviews' + suffix);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    if (!/agoda\.com|trip\.com/i.test(raw)) { rows.push({ slug: f.replace(/\.json$/, ''), loc: suffix || 'th', name: '', agoda: [], trip: [] }); continue; }
    let j = null; try { j = JSON.parse(raw); } catch { /* keep going on the regex */ }
    const grab = (re) => [...raw.matchAll(re)].map((m) => m[0]);
    rows.push({
      slug: f.replace(/\.json$/, ''), loc: suffix || 'th', name: (j && (j.name || j.h1)) || '',
      agoda: grab(/https?:\/\/[^"'\\ )]*agoda\.com[^"'\\ )]*/g),
      trip: grab(/https?:\/\/[^"'\\ )]*trip\.com[^"'\\ )]*/g),
    });
  }
}

const tally = { agoda: {}, trip: {} };
const noDirect = { agoda: [], trip: [], both: [] };
const untagged = { agoda: [], trip: [] };
const mismatched = [];

for (const r of rows) {
  for (const ota of ['agoda', 'trip']) {
    let direct = 0;
    for (const u of r[ota]) {
      const c = classify[ota](u);
      tally[ota][c] = (tally[ota][c] || 0) + 1;
      if (c === 'direct') direct++;
      /* only meaningful against the BUILT page - see the note on `tagged` */
      if (CAN_CHECK_TAGS && !tagged[ota](u) && untagged[ota].length < 400) {
        const built = path.join(DIST, (r.loc === 'th' ? '' : r.loc.replace('-', '') + '/') + r.slug + '.html');
        const html = fs.existsSync(built) ? fs.readFileSync(built, 'utf8') : '';
        const stem = u.split('?')[0].replace(/^https?:\/\//, '');
        const i = html.indexOf(stem);
        const rendered = i < 0 ? null : html.slice(i, i + stem.length + 120).split(/["'<\s]/)[0];
        if (!rendered || !tagged[ota](rendered)) untagged[ota].push({ slug: r.slug, loc: r.loc, url: u, rendered });
      }
    }
    if (!direct) noDirect[ota].push({ slug: r.slug, loc: r.loc, has: r[ota].length });
  }
  /* identity, Agoda only - the slug is derived from the hotel's name */
  if (r.name) {
    for (const u of r.agoda) {
      if (classify.agoda(u) !== 'direct') continue;
      const m = u.match(/agoda\.com\/([a-z0-9_.-]+)\/hotel\//i);
      if (!m) continue;
      /* Compare DISTINCTIVE TOKENS, not whole strings. Whole-string containment
         flagged 179 links of which almost all were the same hotel written
         differently - "137 Pillars Suites & Residence" against
         "137-pillars-suites-bangkok" (a city suffix), "Amari Bangkok" against
         "amari-watergate-hotel" (the branch name), "Amarinnakhon" against
         "amarin-nakorn" (romanisation). Sharing one distinctive token is weak
         evidence of sameness but the ABSENCE of any shared token is strong
         evidence of difference, which is the direction that matters here. */
      const bare = m[1].replace(/-h\d{5,}$/, '').replace(/_\d+$/, '');
      const a = new Set(tokens(bare)), b = new Set(tokens(r.name));
      if (!a.size || !b.size) continue;
      if ([...a].some((t) => b.has(t))) continue;
      /* Agoda writes names solid as often as hyphenated - "48metro" for
         "48 Metro", "baansabairimkhong" for "Baan Sabai Rim Khong" - so token
         sets can miss entirely on names that are plainly identical. Comparing
         the run-together forms too removes that whole class. */
      const ca = [...a].join(''), cb = [...b].join('');
      if (ca.includes(cb) || cb.includes(ca)) continue;
      /* One side being a prefix of the other is the same hotel abbreviated
         ("aranhostel" for "Aranya Hostel"), not a different one. */
      const short = ca.length < cb.length ? ca : cb, long = ca.length < cb.length ? cb : ca;
      if (short.length >= 6 && long.startsWith(short.slice(0, 6))) continue;
      mismatched.push({ slug: r.slug, loc: r.loc, name: r.name, urlSlug: m[1], a: ca, b: cb });
    }
  }
}
const byBoth = new Set(noDirect.agoda.map((x) => x.loc + x.slug));
noDirect.both = noDirect.trip.filter((x) => byBoth.has(x.loc + x.slug));

console.log('reviews scanned: ' + rows.length + '  (locales: ' + LOCALES.map((l) => l || 'th').join(', ') + ')');
console.log();
for (const ota of ['agoda', 'trip']) {
  const t = tally[ota];
  const total = Object.values(t).reduce((a, b) => a + b, 0);
  console.log(ota.toUpperCase().padEnd(6) + ' links ' + total + ' — ' + ['direct', 'search', 'generic', 'other'].map((k) => k + ' ' + (t[k] || 0)).join(' · '));
  console.log('       reviews with NO direct hotel link: ' + noDirect[ota].length);
  console.log('       links missing the affiliate tag  : ' + untagged[ota].length);
}
console.log();
console.log('reviews with no direct link on EITHER site: ' + noDirect.both.length);
console.log('agoda direct links whose slug does not match the hotel name: ' + mismatched.length);
for (const x of mismatched.slice(0, 15)) {
  console.log('   ' + x.slug.replace(/^review-/, '').slice(0, 38).padEnd(38) + ' name "' + String(x.name).slice(0, 28) + '" vs url "' + x.urlSlug.slice(0, 32) + '"');
}
if (JSONOUT) {
  fs.writeFileSync(JSONOUT, JSON.stringify({ tally, noDirect, untagged, mismatched }, null, 1));
  console.log('\nwrote ' + JSONOUT);
}
