// Add the Booking.com affiliate id to EVERY booking.com URL site-wide.
// Usage: node _internal/wf/add-booking-aid.mjs <AID>
//   1) patches every content JSON (reviews/roundups/articles, TH+EN)
//   2) patches the gen-hubs.mjs template so future hub pages carry it
//   3) prints counts — then: node _internal/gen-hubs.mjs && rebuild && deploy
// Booking affiliate format: ?aid=XXXXXXX (query param, numeric partner id)
import fs from 'node:fs';
import path from 'node:path';

const AID = process.argv[2];
if (!AID || !/^\d{5,9}$/.test(AID)) {
  console.error('usage: node _internal/wf/add-booking-aid.mjs <numeric AID from Booking Partner Centre>');
  process.exit(1);
}

const RE = /(https:\/\/www\.booking\.com\/[^"\s\\]*)/g;
const addAid = (u) => {
  if (/[?&]aid=/.test(u)) return u;
  return u + (u.includes('?') ? '&' : '?') + 'aid=' + AID;
};

// 1) content JSONs
let files = 0, links = 0;
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) { walk(fp); continue; }
    if (!e.name.endsWith('.json')) continue;
    let s = fs.readFileSync(fp, 'utf8');
    if (!s.includes('booking.com')) continue;
    let n = 0;
    const out = s.replace(RE, (m) => { const r = addAid(m); if (r !== m) n++; return r; });
    if (n) {
      try { JSON.parse(out); fs.writeFileSync(fp, out); files++; links += n; }
      catch { console.log('  skip (parse):', fp); }
    }
  }
}
walk('astro/src/content');
console.log(`content JSONs: ${files} files · ${links} links updated`);

// 2) gen-hubs template (search links built at generate-time)
let g = fs.readFileSync('_internal/gen-hubs.mjs', 'utf8');
const gBefore = g;
g = g.replace(/(booking\.com\/searchresults[^"`]*?)(?=["`])/g, (m) => (/aid=/.test(m) ? m : m + (m.includes('?') ? '&' : '?') + 'aid=' + AID));
if (g !== gBefore) { fs.writeFileSync('_internal/gen-hubs.mjs', g); console.log('gen-hubs.mjs template updated'); }
else console.log('gen-hubs.mjs: no booking search templates needed updating');

console.log('\nNEXT: node _internal/gen-hubs.mjs && clean astro build && wrangler deploy (chatmaliwan)');
