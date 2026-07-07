// Rigorous verification: are ALL Booking.com links routed through /go/b?
// Checks every HTML in dist for every escape route:
//  - href= / data-href= with any booking.com host form (https, http, no-www, subdomains)
//  - booking.com URLs inside inline <script> (JS-built links)
//  - onclick= handlers with booking.com
//  - decodes every /go/b?u= to confirm the target really is booking.com + sid present
//  - JSON-LD occurrences counted separately (metadata, not clickable — OK to remain)
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

const BOOK = /(?:https?:)?\/\/(?:[a-z0-9-]+\.)*booking\.com/i;
const issues = { href: [], dataHref: [], script: [], onclick: [], badGoB: [], noSid: [] };
let goBTotal = 0, jsonldBooking = 0, pagesWithGoB = 0;

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(DIST, f).replace(/\\/g, '/');

  // strip JSON-LD blocks (metadata — booking URLs there are fine) and count them
  let stripped = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (m) => {
    if (BOOK.test(m)) jsonldBooking++;
    return '';
  });

  // 1) href= direct booking (any host form)
  for (const m of stripped.matchAll(/href="((?:https?:)?\/\/(?:[a-z0-9-]+\.)*booking\.com[^"]*)"/gi))
    issues.href.push(rel + ' → ' + m[1].slice(0, 90));

  // 2) data-href= direct booking
  for (const m of stripped.matchAll(/data-href="((?:https?:)?\/\/(?:[a-z0-9-]+\.)*booking\.com[^"]*)"/gi))
    issues.dataHref.push(rel + ' → ' + m[1].slice(0, 90));

  // 3) onclick with booking.com
  for (const m of stripped.matchAll(/onclick="[^"]*booking\.com[^"]*"/gi))
    issues.onclick.push(rel + ' → ' + m[0].slice(0, 110));

  // 4) inline <script> building booking URLs (exclude /go/b payloads)
  for (const sm of stripped.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)) {
    const body = sm[1];
    for (const m of body.matchAll(/["'`](https?:\/\/(?:[a-z0-9-]+\.)*booking\.com[^"'`]*)["'`]/gi))
      issues.script.push(rel + ' → ' + m[1].slice(0, 90));
  }

  // 5) validate every /go/b link on the page
  const goBs = [...html.matchAll(/(?:href|data-href)="(\/go\/b\?[^"]*)"/g)];
  if (goBs.length) pagesWithGoB++;
  goBTotal += goBs.length;
  for (const m of goBs) {
    const q = m[1].replace(/&amp;|&#38;/g, '&');
    const u = new URLSearchParams(q.split('?')[1]);
    const dest = u.get('u');
    const sid = u.get('sid');
    if (dest) {
      try {
        const h = new URL(dest).hostname;
        if (!/(^|\.)booking\.com$/.test(h)) issues.badGoB.push(rel + ' → u=' + dest.slice(0, 80));
      } catch { issues.badGoB.push(rel + ' → unparseable u=' + String(dest).slice(0, 80)); }
    }
    if (!sid) issues.noSid.push(rel + ' → ' + m[1].slice(0, 80));
  }
}

console.log('pages scanned            :', files.length);
console.log('/go/b links total        :', goBTotal, 'on', pagesWithGoB, 'pages');
console.log('direct href booking      :', issues.href.length);
console.log('direct data-href booking :', issues.dataHref.length);
console.log('onclick booking          :', issues.onclick.length);
console.log('JS-built booking (inline):', issues.script.length);
console.log('/go/b with NON-booking u :', issues.badGoB.length);
console.log('/go/b missing sid        :', issues.noSid.length);
console.log('JSON-LD w/ booking (OK)  :', jsonldBooking, 'pages (metadata, not clickable)');
for (const [k, v] of Object.entries(issues))
  if (v.length) { console.log('\n--- ' + k + ' (first 10) ---'); v.slice(0, 10).forEach(x => console.log('  ' + x)); }
