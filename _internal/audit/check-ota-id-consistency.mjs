/* Does the same hotel carry the same OTA id everywhere we link it?

   A hotel appears once as a review page and again as an entry in one or more
   ranked roundups. Both link to Agoda and Trip.com. Nothing has ever checked
   that the two agree, and a roundup entry is the higher-intent link - it sits
   at position 1 with a price beside it.

   The failure this catches is not a broken link. Both ids resolve; they resolve
   to DIFFERENT hotels, so the page looks perfectly healthy while sending the
   reader somewhere else. Found on 2026-09-24: Rayavadee, the #1 entry on three
   Krabi roundups in nine languages, carried a Trip.com id that is not
   Rayavadee's.

   Matching is by the roundup entry's own review link, not by name - a name
   match is what produced the wrong-hotel problem in the first place.

   Usage: node _internal/audit/check-ota-id-consistency.mjs [--json out.json] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null);

const tripId = (s) => { const m = String(s || '').match(/hotel-detail-(\d+)/i); return m ? m[1] : null; };
const agodaSlug = (s) => {
  const m = String(s || '').match(/agoda\.com\/(?:[a-z]{2}-[a-z]{2}\/)?([a-z0-9_.-]+)\/hotel\//i);
  if (m) return m[1].replace(/_\d+$/, '');
  const h = String(s || '').match(/partnersearch\.aspx\?[^"']*\bhid=(\d+)/i);
  return h ? 'hid:' + h[1] : null;
};

/* review slug -> the ids that review page itself uses */
const reviews = new Map();
const RD = path.join(ROOT, 'astro/src/content/reviews');
for (const f of fs.readdirSync(RD)) {
  if (!f.endsWith('.json')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8'));
  reviews.set(f.replace(/\.json$/, ''), {
    name: j.name,
    trip: tripId(j.bookingTrip),
    agoda: agodaSlug(j.bookingAgoda),
  });
}

const rows = [];
for (const dir of ['roundups', 'roundups-en']) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const j = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
    for (const e of (j.entries || [])) {
      /* The entry's own link to our review is the only reliable identity. The
         field is reviewUrl - the first version of this check guessed
         reviewHref/href, matched nothing, and reported a clean pass over 2,371
         reviews. A checker that finds nothing because it is looking in the
         wrong place is worse than no checker. */
      const href = String(e.reviewUrl || '');
      const m = href.match(/(review-[a-z0-9-]+)/i);
      if (!m) continue;
      const r = reviews.get(m[1]);
      if (!r) continue;
      const eTrip = tripId(e.tripUrl || e.bookingTrip), eAgoda = agodaSlug(e.agodaUrl || e.bookingAgoda);
      if (eTrip && r.trip && eTrip !== r.trip) {
        rows.push({ kind: 'trip', file: `${dir}/${f}`, slug: m[1], name: r.name, roundup: eTrip, review: r.trip });
      }
      if (eAgoda && r.agoda && eAgoda !== r.agoda) {
        rows.push({ kind: 'agoda', file: `${dir}/${f}`, slug: m[1], name: r.name, roundup: eAgoda, review: r.agoda });
      }
    }
  }
}

const pairs = [...reviews.values()].length;
const byKind = {};
for (const r of rows) byKind[r.kind] = (byKind[r.kind] || 0) + 1;
console.log(`reviews indexed ${pairs} · mismatches ${rows.length} ` + Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(' · '));
const props = [...new Set(rows.map((r) => r.slug))];
console.log(`distinct properties affected: ${props.length}`);
for (const r of rows) {
  console.log(`  ${r.kind.padEnd(5)} ${r.name.slice(0, 32).padEnd(32)} roundup=${String(r.roundup).padEnd(30)} review=${String(r.review)}  [${r.file}]`);
}
if (OUT) { fs.writeFileSync(OUT, JSON.stringify(rows, null, 1)); console.log(`\nwrote ${OUT}`); }
process.exit(rows.length ? 1 : 0);
