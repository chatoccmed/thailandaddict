#!/usr/bin/env node
// Wrap every raw booking.com href in the static hub pages (astro/public/*.html + en/*.html) in a CJ deep link.
// Idempotent (skips hrefs already CJ-wrapped). Mirrors the cjB() emitters patched into gen-hubs.mjs, so a future
// gen-hubs regen produces identical output. sid = page slug (en- prefix under /en/) → per-page revenue in CJ Reports.
import fs from 'node:fs';
import path from 'node:path';
const CJ_PID = '101809619'; // ThailandAddict on CJ · advertiser: Booking.com APAC (7854081)
const wrap = (dest, sid) => `https://www.anrdoezrs.net/links/${CJ_PID}/type/dlg/sid/${sid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60)}/${/[?]/.test(dest) ? encodeURIComponent(dest) : dest}`;

const roots = [['astro/public', ''], ['astro/public/en', 'en-']];
let files = 0, links = 0;
for (const [dir, pfx] of roots) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(dir, f);
    let s = fs.readFileSync(p, 'utf8');
    const sid = pfx + (f === 'index.html' ? 'home' : f.replace(/\.html$/, ''));
    let n = 0;
    s = s.replace(/href="(https:\/\/www\.booking\.com\/[^"]*)"/g, (m, url) => {
      const dest = url.replace(/&amp;/g, '&');
      n++;
      return `href="${wrap(dest, sid)}"`;
    });
    if (n) { fs.writeFileSync(p, s); files++; links += n; }
  }
}
console.log(`wrap-booking-cj: wrapped ${links} booking.com hrefs across ${files} static pages`);
