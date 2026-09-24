/* For every review with no DIRECT Agoda hotel link, find that hotel in the feed.

   audit-ota-links reports 360 reviews (all locales) whose Agoda link is a
   search or a city list rather than the hotel's own page. The owner's Agoda
   partner feed holds 65,524 Thai properties with ids, so most of those can be
   resolved exactly — the same join that fixed the four wrong-hotel links.

   Confidence tiers, and why each exists:

     exact     name matches AND the house number matches. Two independent
               identifiers agreeing; safe to apply unattended.
     province  name matches, no house number to compare, but the feed hotel
               sits in the review's own province. The province test is what
               caught BaanKong Hostel in Lamphun matching an "OYO Baan Kong
               Hostel" in Khao Lak, 1,087 km away, on name alone.
     ambiguous several feed hotels share the name, or the only candidate is in
               a different province, or the name matches loosely. NOT applied —
               written out for a human or a verification pass to judge.

   Nothing is written here. This finds and classifies; applying is a separate
   step, because a link that opens the wrong hotel is worse than a link that
   opens a search.

   Usage: node _internal/audit/find-missing-ota-links.mjs [--json out.json] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);
const FEED = arg('--feed', path.join(ROOT, '_internal/audit/cache/agoda-th.jsonl'));

if (!fs.existsSync(FEED)) {
  console.error(`feed subset not found at ${FEED}\n` +
    'Re-extract it from the owner\'s zip (Thailand rows only, ~51 s) before running this.');
  process.exit(2);
}
const feed = [];
for (const l of fs.readFileSync(FEED, 'utf8').split('\n')) if (l.trim()) feed.push(JSON.parse(l));

const nk = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9฀-๿]/g, '');
const houseNo = (s) => { const m = String(s || '').match(/(?:^|[\s,])(\d+(?:\/\d+)?(?:-\d+)?)/); return m ? m[1] : null; };
/* Thai province names appear in our addresses; the feed's `city` column is a
   Thai province name too - but it is NOT reliable (Suanphai Resort's address
   says Chai Nat while its city column says Uthai Thani), so it is used only as
   supporting evidence, never as the deciding test. */
const provinceOf = (s) => { const m = String(s || '').match(/(?:จังหวัด|จ\.)\s*([฀-๿]+)/); return m ? m[1] : null; };

const byName = new Map();
for (const r of feed) {
  for (const n of [r.hotel_name, r.hotel_translated_name, r.hotel_formerly_name]) {
    const k = nk(n); if (!k) continue;
    if (!byName.has(k)) byName.set(k, []);
    byName.get(k).push(r);
  }
}

/* A locale prefix may sit between the domain and the hotel slug -
   agoda.com/th-th/adrian-view-resort/hotel/chonburi-th.html - and requiring the
   slug immediately after the domain counted every such link as "no direct
   link". That false positive put reviews on this list whose links were already
   correct and already resolving (verified live), and I came close to rewriting
   them. */
const DIRECT = /agoda\.com\/(?:[a-z]{2}-[a-z]{2}\/)?(?:[a-z0-9_.-]+\/hotel\/|partners\/partnersearch\.aspx\?[^"']*\bhid=\d+)/i;
const rows = [];
const dir = path.join(ROOT, 'astro/src/content/reviews');
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue;
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  if (DIRECT.test(raw)) continue;                    /* already reaches a hotel page */
  const j = JSON.parse(raw);
  const slug = f.replace(/\.json$/, '');
  /* Dedupe by hotel id: a property is indexed under its English name AND its
     Thai translation AND any former name, so the same hotel can appear two or
     three times and look like an ambiguous match when it is a single
     unambiguous one. Asia Lampang Hotel was counted as "2 candidates" this
     way, both of them id 15628805. */
  const seenId = new Set();
  const cands = (byName.get(nk(j.name)) || []).filter((c) => !seenId.has(c.hotel_id) && seenId.add(c.hotel_id));
  const ourNo = houseNo(j.mapAddr), ourProv = provinceOf(j.mapAddr);
  const exact = cands.filter((c) => ourNo && houseNo(c.addressline1) === ourNo);
  const sameProv = cands.filter((c) => ourProv && String(c.city || '').includes(ourProv));
  let tier, pick = null;
  if (exact.length === 1) { tier = 'exact'; pick = exact[0]; }
  else if (!exact.length && sameProv.length === 1) { tier = 'province'; pick = sameProv[0]; }
  else if (cands.length) { tier = 'ambiguous'; pick = cands[0]; }
  else tier = 'not in feed';
  rows.push({ slug, name: j.name, addr: j.mapAddr, cluster: j.cluster, tier,
    candidates: cands.length,
    pick: pick ? { id: pick.hotel_id, name: pick.hotel_name, addr: pick.addressline1, city: pick.city } : null });
}

const by = {};
for (const r of rows) by[r.tier] = (by[r.tier] || 0) + 1;
console.log(`reviews with no direct Agoda hotel link: ${rows.length}`);
for (const k of ['exact', 'province', 'ambiguous', 'not in feed']) console.log(`  ${k.padEnd(13)} ${by[k] || 0}`);
console.log('\nsample exact matches:');
for (const r of rows.filter((x) => x.tier === 'exact').slice(0, 8)) {
  console.log(`   ${r.slug.replace(/^review-/, '').slice(0, 40).padEnd(40)} -> ${r.pick.id} ${r.pick.name.slice(0, 32)}`);
}
console.log('\nsample ambiguous (need judgement):');
for (const r of rows.filter((x) => x.tier === 'ambiguous').slice(0, 8)) {
  console.log(`   ${r.slug.replace(/^review-/, '').slice(0, 36).padEnd(36)} ${r.candidates} candidates, first: ${r.pick.name.slice(0, 28)} [${r.pick.city}]`);
}
if (OUT) { fs.writeFileSync(OUT, JSON.stringify(rows, null, 1)); console.log(`\nwrote ${OUT}`); }
