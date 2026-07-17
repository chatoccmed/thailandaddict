#!/usr/bin/env node
// Normalize every Booking.com link in the static hub pages (astro/public/*.html + en/*.html) to the CJ
// click-format deep link (the format CJ currently issues, production-proven to credit commissions):
//   https://www.anrdoezrs.net/click-<PID>-<ADID>?sid=<page>&url=<encoded canonical booking url>
// Handles BOTH raw booking.com hrefs AND legacy dlg-format CJ links (migrates them). Idempotent.
// Mirrors the cjB() emitter in gen-hubs.mjs, so a future gen-hubs regen produces identical output.
import fs from 'node:fs';
import path from 'node:path';
const CJ_PID = '101809619';  // ThailandAddict on CJ · advertiser: Booking.com APAC (7854081)
const CJ_ADID = '17289009';  // active text-link id from our CJ account
const wrap = (dest, sid) => `https://www.anrdoezrs.net/click-${CJ_PID}-${CJ_ADID}?sid=${sid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60)}&url=${encodeURIComponent(dest)}`;

const roots = [['astro/public', ''], ['astro/public/en', 'en-']];
let files = 0, raw = 0, migrated = 0;
for (const [dir, pfx] of roots) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(dir, f);
    let s = fs.readFileSync(p, 'utf8');
    const sid = pfx + (f === 'index.html' ? 'home' : f.replace(/\.html$/, ''));
    let n = 0;
    // 1. raw booking.com hrefs → click format
    s = s.replace(/href="(https:\/\/www\.booking\.com\/[^"]*)"/g, (m, url) => {
      n++; raw++;
      return `href="${wrap(url.replace(/&amp;/g, '&'), sid)}"`;
    });
    // 2. legacy dlg-format CJ links → click format (keep the per-page sid already embedded)
    s = s.replace(new RegExp(`href="https://www\\.anrdoezrs\\.net/links/${CJ_PID}/type/dlg/sid/([^/"]+)/([^"]+)"`, 'g'), (m, oldSid, dest) => {
      n++; migrated++;
      const clean = decodeURIComponent(dest.replace(/&amp;/g, '&'));
      return `href="${wrap(clean, oldSid)}"`;
    });
    if (n) { fs.writeFileSync(p, s); files++; }
  }
}
console.log(`wrap-booking-cj: ${raw} raw wrapped + ${migrated} dlg→click migrated across ${files} static pages`);
