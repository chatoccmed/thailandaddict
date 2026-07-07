// Append Allianceid/SID to every trip.com URL missing them, across all content JSONs.
import fs from 'node:fs';
import path from 'node:path';
let fixed = 0;
const RE = /(https:\/\/(?:www|th)\.trip\.com\/[^"\s\\]*)/g;
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) { walk(fp); continue; }
    if (!e.name.endsWith('.json')) continue;
    let s = fs.readFileSync(fp, 'utf8');
    if (!s.includes('trip.com')) continue;
    const before = s;
    s = s.replace(RE, (m) => {
      if (m.toLowerCase().includes('allianceid')) return m;
      return m + (m.includes('?') ? '&' : '?') + 'Allianceid=6861268&SID=312919111';
    });
    if (s !== before) {
      try { JSON.parse(s); fs.writeFileSync(fp, s); fixed++; }
      catch { console.log('  skip(parse):', fp); }
    }
  }
}
walk('astro/src/content');
console.log('trip.com params added in', fixed, 'files');
