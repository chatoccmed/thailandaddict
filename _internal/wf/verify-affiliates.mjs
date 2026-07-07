// Verify Agoda / Klook / Trip links across all dist HTML after the /go/b changes:
//  - counts + affiliate-param coverage per platform (href AND data-href)
//  - none accidentally wrapped into /go/b (u= must never be agoda/klook/trip)
//  - none mangled into "/https:/" or relative forms
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'astro/dist';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) walk(fp);
    else if (e.name.endsWith('.html')) files.push(fp);
  }
})(DIST);

const stat = {
  agoda: { total: 0, withId: 0, bad: [] },
  klook: { total: 0, withId: 0, bad: [] },
  trip:  { total: 0, withId: 0, bad: [] },
};
const wrongWrap = [];   // agoda/klook/trip inside /go/b?u=
const mangled = [];     // /https:/ or /en/https:/ forms

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8').replace(/&amp;|&#38;/g, '&');
  const rel = path.relative(DIST, f).replace(/\\/g, '/');

  for (const m of html.matchAll(/(?:href|data-href)="([^"]+)"/g)) {
    const u = m[1];
    if (/^\/?(en\/)?https?:\//.test(u) && !/^https?:\/\//.test(u)) { mangled.push(rel + ' → ' + u.slice(0, 90)); continue; }
    if (u.startsWith('/go/b')) {
      const dm = u.match(/[?&]u=([^&]+)/);
      if (dm) {
        const dec = decodeURIComponent(dm[1]);
        if (/agoda\.com|klook\.com|trip\.com/i.test(dec)) wrongWrap.push(rel + ' → ' + dec.slice(0, 90));
      }
      continue;
    }
    const l = u.toLowerCase();
    if (l.includes('agoda.com')) { stat.agoda.total++; l.includes('cid=1965862') ? stat.agoda.withId++ : stat.agoda.bad.push(rel + ' → ' + u.slice(0, 100)); }
    else if (l.includes('klook.com')) { stat.klook.total++; l.includes('aid=121442') ? stat.klook.withId++ : stat.klook.bad.push(rel + ' → ' + u.slice(0, 100)); }
    else if (l.includes('trip.com')) { stat.trip.total++; (l.includes('allianceid=6861268') && l.includes('sid=312919111')) ? stat.trip.withId++ : stat.trip.bad.push(rel + ' → ' + u.slice(0, 110)); }
  }
}

console.log('pages scanned:', files.length);
for (const [k, v] of Object.entries(stat)) {
  console.log(`${k.padEnd(6)}: total ${v.total} · with-affiliate-id ${v.withId} · MISSING ${v.total - v.withId}`);
  v.bad.slice(0, 8).forEach(x => console.log('   ✗ ' + x));
}
console.log('wrapped-into-/go/b by mistake:', wrongWrap.length);
wrongWrap.slice(0, 5).forEach(x => console.log('   ✗ ' + x));
console.log('mangled (/https:/ style):', mangled.length);
mangled.slice(0, 5).forEach(x => console.log('   ✗ ' + x));
