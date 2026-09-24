/* Replace Agoda q= searches with a city id, because q= does not work.

   Earlier today 240 article CTAs, every hub booking card and the
   ArticleLayout footer were changed from the bare Agoda home page to
   agoda.com/search?cid=1965862&q=<place>. That looked like an improvement and
   was not: Agoda 301s that URL straight back to its home page. Verified live
   for "Krabi", "กระบี่", "甲米" and "كرابي" alike, so it is the URL form and
   not the language.

   What does resolve, both verified live:
     agoda.com/search?city=<id>&cid=..          a city id
     agoda.com/th-th/city/<slug>-th.html?cid=.. the city path (94 articles
                                                already used this, correctly)

   City ids come from _internal/agoda-city-ids.json, derived from the owner's
   Agoda feed: for every hotel of ours matched into it, the modal city_id of
   that hotel's cluster. 89 of 89 city hubs are covered. A cluster with no id -
   only "thailand", on best-of-thailand-2026 - falls back to Agoda's country
   page, which also resolves.

   Usage: node _internal/fix-agoda-city-links.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const ids = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/agoda-city-ids.json'), 'utf8')).ids;
const COUNTRY = 'https://www.agoda.com/th-th/country/thailand.html?cid=1965862';

/* Stop at a backslash as well as a quote. These URLs sit inside JSON string
   values, so the character after the URL is an ESCAPED quote - \" - and a
   pattern that does not exclude the backslash swallows it, leaving the file
   unparseable. The first attempt at this did exactly that; JSON.parse before
   writing caught it on the file where it happened. */
const RE = /https:\/\/www\.agoda\.com\/search\?cid=1965862&q=[^"'\\ )]*/g;

let files = 0, links = 0, toCountry = 0;
const byCluster = {};
for (const dir of ['articles', 'articles-en']) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(d, f);
    const raw = fs.readFileSync(p, 'utf8');
    const found = raw.match(RE);
    if (!found) continue;
    const j = JSON.parse(raw);
    const id = j.cluster && ids[j.cluster];
    const to = id ? `https://www.agoda.com/search?city=${id}&cid=1965862` : COUNTRY;
    if (!id) toCountry += found.length;
    byCluster[j.cluster || '(none)'] = (byCluster[j.cluster || '(none)'] || 0) + found.length;
    const next = raw.replace(RE, to);
    JSON.parse(next);                     /* never write a file that stopped being JSON */
    files++; links += found.length;
    if (APPLY) fs.writeFileSync(p, next);
  }
}
console.log(`files ${files} · links ${links} · fell back to the country page ${toCountry}`);
console.log('top clusters: ' + Object.entries(byCluster).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(APPLY ? 'applied' : 'dry run — nothing written. Re-run with --apply');
