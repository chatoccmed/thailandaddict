/* Live checks for the 2026-09-25 honesty/links deploy. Each one names the thing
   a reader would have hit before the fix, so a failure says what regressed
   rather than just "check 7 failed".

   Read-only. Usage: node live-verify-honesty-fixes.mjs [--base https://...] */
import { setTimeout as sleep } from 'node:timers/promises';

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'https://thailandaddict.com').replace(/\/$/, '');
const UA = 'Mozilla/5.0 (compatible; thailandaddict-selfcheck/1.0)';

let pass = 0; const fails = [];
const ok = (name) => { pass++; console.log('  ✓ ' + name); };
const bad = (name, detail) => { fails.push(name + ' — ' + detail); console.log('  ✗ ' + name + ' — ' + detail); };

async function get(p, redirect = 'follow') {
  const r = await fetch(BASE + p, { headers: { 'User-Agent': UA }, redirect });
  return { status: r.status, location: r.headers.get('location'), body: redirect === 'manual' ? '' : await r.text() };
}

/* 1. the root-only redirect, including the two shapes it used to miss */
console.log('redirects');
for (const [path, want] of [['/en/trip', '/trip'], ['/en/trip/', '/trip'], ['/ja/my-list', '/my-list'], ['/ar/t/abc123', '/t/abc123']]) {
  const r = await get(path, 'manual');
  if (r.status === 301 && r.location === want) ok(path + ' → ' + want);
  else bad(path, 'got ' + r.status + ' ' + (r.location || '(no location)') + ', want 301 ' + want);
}

/* 2. claims the site cannot keep */
console.log('claims');
for (const [path, phrase] of [
  ['/en/top10-hotels-bangkok.html', 'Prices Compared'],
  ['/en/top10-budget-hotels-ayutthaya.html', 'Prices Compared'],
  ['/en/top10-tak-city-hotels.html', "reviewed ourselves"],
]) {
  const r = await get(path);
  if (r.status !== 200) bad(path, 'HTTP ' + r.status);
  else if (r.body.includes(phrase)) bad(path, 'still says "' + phrase + '"');
  else ok(path + ' no longer claims "' + phrase + '"');
}

/* 3. the season card must not describe seas where there are none,
      and must not sell the monsoon on islands that shut for it */
console.log('season cards');
for (const [path, must, mustNot] of [
  ['/city-yala.html', null, 'ทะเลใส'],
  ['/city-phatthalung.html', null, 'ทะเลใส'],
  ['/city-hat-yai.html', null, 'ทะเลใส'],
  ['/city-koh-lipe.html', 'seas-warn', null],
  ['/city-koh-chang.html', 'seas-warn', null],
  ['/city-samui.html', 'ทะเลใส', null],
]) {
  const r = await get(path);
  if (r.status !== 200) { bad(path, 'HTTP ' + r.status); continue; }
  const seas = (r.body.match(/seasgrid[\s\S]{0,1400}/) || [''])[0];
  if (must && !(r.body.includes(must))) bad(path, 'missing ' + must);
  else if (mustNot && seas.includes(mustNot)) bad(path, 'season card still says ' + mustNot);
  else ok(path + (must ? ' has ' + must : ' has no "' + mustNot + '" in its season card'));
}

/* 4. links that used to open a different hotel */
console.log('hotel links');
for (const [path, want, wrong] of [
  ['/top10-hotels-krabi.html', 'hotel-detail-710566', 'hotel-detail-874163'],
  ['/en/top10-honeymoon-hotels-krabi.html', 'hotel-detail-710566', 'hotel-detail-874163'],
  ['/top10-sai-yok-river-raft-hotels-kanchanaburi.html', 'hotel-detail-706846', 'hotel-detail-1500050'],
  ['/top5-love-hotels-sai-tai-bangkok.html', 'hotel-detail-2507598', 'hotel-detail-19890000'],
  ['/top10-hotels-koh-chang.html', 'dinso-resort-villas-ko-chang', 'the-emerald-cove-koh-chang/hotel'],
  ['/top10-hotels-siam-pratunam-bangkok.html', 'amari-watergate-hotel/hotel', 'amari-watergate-hotel-bangkok'],
]) {
  const r = await get(path);
  if (r.status !== 200) { bad(path, 'HTTP ' + r.status); continue; }
  if (r.body.includes(wrong)) bad(path, 'still links the wrong property (' + wrong + ')');
  else if (!r.body.includes(want)) bad(path, 'does not link ' + want);
  else ok(path + ' → ' + want);
}

/* 5. paid links declared, unpaid ones not */
console.log('affiliate disclosure');
for (const path of ['/city-bangkok.html', '/en/city-krabi.html', '/ja/city-bangkok.html']) {
  const r = await get(path);
  if (r.status !== 200) { bad(path, 'HTTP ' + r.status); continue; }
  const anchors = r.body.match(/<a [^>]*>/gi) || [];
  const paid = anchors.filter((a) => /agoda\.com|booking\.com|trip\.com|klook\.com|href="\/go\/b/i.test(a));
  const undeclared = paid.filter((a) => !/rel="[^"]*sponsored/i.test(a));
  const overdeclared = anchors.filter((a) => /rel="[^"]*sponsored/i.test(a) && /facebook|tripadvisor|trivago|traveloka|choowap/i.test(a));
  if (!paid.length) bad(path, 'no paid anchors found at all — check is not testing anything');
  else if (undeclared.length) bad(path, undeclared.length + ' of ' + paid.length + ' paid links undeclared');
  else if (overdeclared.length) bad(path, overdeclared.length + ' unpaid links wrongly marked sponsored');
  else ok(path + ' — all ' + paid.length + ' paid links declared, no false sponsored');
}

/* 6. English readers must not be sent to a Thai-language Agoda page */
console.log('agoda locale');
for (const path of ['/en/top10-hotels-phatthalung.html', '/en/top10-beach-hotels-koh-samet.html', '/en/top10-hotels-bangkok.html']) {
  const r = await get(path);
  if (r.status !== 200) { bad(path, 'HTTP ' + r.status); continue; }
  const n = (r.body.match(/agoda\.com\/th-th\//g) || []).length;
  if (n) bad(path, n + ' Agoda links still forced to th-th');
  else ok(path + ' no th-th Agoda links');
}

/* 7. the score a reader sees is a sourced one */
const AGODA_94 = /r-src-name[^>]*>Agoda<\/div><div class="r-src-num"[^>]*>9\.4</;
/* prove the pattern discriminates, or it is decoration */
{
  const real = '<div class="r-src-name" >Agoda</div><div class="r-src-num" >9.4</div>';
  const wrong = '<div class="r-src-name" >Agoda</div><div class="r-src-num" >—</div>';
  const other = '<div class="r-src-name" >Booking.com</div><div class="r-src-num" >9.4</div>';
  if (!AGODA_94.test(real) || AGODA_94.test(wrong) || AGODA_94.test(other)) {
    console.error('AGODA_94 pattern is wrong — refusing to report on it');
    process.exit(2);
  }
}
console.log('scores');
{
  const r = await get('/review-rayavadee-krabi.html');
  if (r.status !== 200) bad('/review-rayavadee-krabi.html', 'HTTP ' + r.status);
  // The hero shows Booking's 9.4, so a bare includes('9.4') passed against the
  // OLD site, before the Agoda score was restored — a check that cannot fail is
  // not a check. Assert the Agoda card itself carries the number.
  else if (!AGODA_94.test(r.body.replace(/ data-astro-cid-[a-z0-9]*/g, ''))) bad('/review-rayavadee-krabi.html', 'the Agoda card does not show the checked 9.4');
  else if (r.body.includes('aggregateRating')) bad('/review-rayavadee-krabi.html', 'aggregateRating is back in the schema');
  else ok('/review-rayavadee-krabi.html shows the checked 9.4 and claims no rating of its own');
}

/* 8. the dead score-bar script is gone from every review page */
console.log('dead code');
for (const path of ['/review-rayavadee-krabi.html', '/en/review-rayavadee-krabi.html']) {
  const r = await get(path);
  if (r.status !== 200) { bad(path, 'HTTP ' + r.status); continue; }
  if (r.body.includes('rbar-fill')) bad(path, 'still ships the dead score-bar observer');
  else ok(path + ' no dead score-bar code');
}

await sleep(0);
console.log('\n' + (fails.length ? 'FAILED ' + fails.length + ' of ' + (pass + fails.length) : 'all ' + pass + ' checks passed') + ' (' + BASE + ')');
for (const f of fails) console.log('  ✗ ' + f);
process.exit(fails.length ? 1 : 0);
