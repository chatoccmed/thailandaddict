// Deterministically stamp affiliate IDs onto the 6 Khao Sok reviews (TH) + sanity-check.
// Agoda: ?cid=1965862 · Trip.com: ?Allianceid=6861268&SID=312919111 · Booking: raw (CJ-wrapped at render).
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('astro/src/content/reviews');
const SLUGS = [
  'review-panvaree-the-greenery-resort-khao-sok-surat-thani',
  'review-praiwan-raft-house-khao-sok-surat-thani',
  'review-our-jungle-house-khao-sok-surat-thani',
  'review-anurak-community-lodge-khao-sok-surat-thani',
  'review-khao-sok-las-orquideas-resort-surat-thani',
  'review-montania-lifestyle-hotel-khao-sok-surat-thani',
];

function withParam(url, kv) {
  if (!url) return url;
  for (const [k, v] of Object.entries(kv)) {
    if (new RegExp('[?&]' + k + '=').test(url)) continue;
    url += (url.includes('?') ? '&' : '?') + k + '=' + v;
  }
  return url;
}

const REQUIRED = ['slug','name','cluster','score','starRating','image','heroImg','gallery','galleryAlts','body','highlights','ratingBars','booking','agoda','honestChecks','rooms','bookingAgoda','bookingBooking','bookingTrip','tips','info','faq'];
let fail = 0;
for (const slug of SLUGS) {
  const p = path.join(DIR, slug + '.json');
  if (!fs.existsSync(p)) { console.log(`✗ ${slug}: FILE MISSING`); fail++; continue; }
  let r;
  try { r = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { console.log(`✗ ${slug}: BAD JSON ${e.message}`); fail++; continue; }

  if (/agoda\.com/.test(r.bookingAgoda || '')) r.bookingAgoda = withParam(r.bookingAgoda, { cid: '1965862' });
  if (/trip\.com/.test(r.bookingTrip || '')) r.bookingTrip = withParam(r.bookingTrip, { Allianceid: '6861268', SID: '312919111' });

  const issues = [];
  for (const k of REQUIRED) if (!(k in r)) issues.push('missing ' + k);
  const lens = { gallery: 3, galleryAlts: 3, highlights: 3, ratingBars: 6, honestChecks: 3, tips: 4 };
  for (const [k, n] of Object.entries(lens)) if (!Array.isArray(r[k]) || r[k].length !== n) issues.push(`${k} len ${r[k]?.length}!=${n}`);
  const bodyChars = (r.body || []).reduce((a, b) => a + (b.html || '').length, 0);
  if (bodyChars < 1800) issues.push('body ' + bodyChars + ' chars (<1800)');
  if (r.cluster !== 'surat-thani') issues.push('cluster=' + r.cluster);
  const hasAgoda = /agoda\.com/.test(r.bookingAgoda || '');
  if (hasAgoda && !/cid=1965862/.test(r.bookingAgoda || '')) issues.push('agoda no cid');

  fs.writeFileSync(p, JSON.stringify(r, null, 2));
  if (issues.length) { fail++; console.log(`✗ ${slug} (${bodyChars}c) — ${issues.join(' · ')}`); }
  else console.log(`✓ ${slug} — ${bodyChars}c · score ${r.score} · ${r.starRating}★ · ${hasAgoda ? 'cid' : 'NO-agoda'} · trip ${/Allianceid/.test(r.bookingTrip||'') ? '✓' : '-'}`);
}
console.log(fail ? `\n=== ${fail} ISSUE(S) ===` : '\n=== ALL 6 CLEAN ===');
process.exit(fail ? 1 : 0);
