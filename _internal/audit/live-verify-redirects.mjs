/* After deploy: every merged review page must redirect on the live site —
     · the old URL answers 301 (not 200, which would mean the page is still
       served, and not 404, which would lose the link)
     · its Location is the page that stayed
     · that target answers 200
   Both URL shapes a reader can arrive on are checked (clean and .html); each
   target is fetched once.

   The redirects live in worker-redirects.js, answered by worker.js before it
   falls through to static assets — NOT in astro/public/_redirects, which
   Cloudflare caps at 100 rules (the 2026-09-16 deploy of 280 was rejected,
   code 100324). So this reads the Worker's own map.

   Usage: node live-verify-redirects.mjs [--limit N]
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const SITE = 'https://thailandaddict.com';
const li = process.argv.indexOf('--limit');
const LIMIT = li > 0 ? Number(process.argv[li + 1]) : Infinity;
const { MOVED_PAGES } = await import(pathToFileURL(`${ROOT}/worker-redirects.js`).href);
const bust = `v=${Date.now()}`;

const head = async (p) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${SITE}${p}?${bust}`, { method: 'GET', redirect: 'manual', headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(30000) });
      return { status: r.status, loc: r.headers.get('location') };
    } catch { await new Promise((r) => setTimeout(r, 1200)); }
  }
  return { status: 0, loc: null };
};
const seenTarget = new Map();
const targetOk = async (t) => {
  if (seenTarget.has(t)) return seenTarget.get(t);
  const r = await head(t);
  const ok = r.status === 200;
  seenTarget.set(t, ok);
  return ok;
};

let fail = 0, pass = 0, n = 0;
const entries = Object.entries(MOVED_PAGES);
console.log(`${entries.length} merged page(s) · ${entries.length * 2} URL shape(s) to check on ${SITE}\n`);
for (const [src, tgt] of entries) {
  if (++n > LIMIT) break;
  for (const url of [src, `${src}.html`]) {
    const r = await head(url);
    if (r.status !== 301) { fail++; console.log(`✗ ${url}: HTTP ${r.status || 'no answer'}, expected 301`); continue; }
    const loc = String(r.loc || '').replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
    if (loc !== tgt) { fail++; console.log(`✗ ${url}: 301 → ${loc || '(none)'}, expected ${tgt}`); continue; }
    pass++;
  }
  if (!(await targetOk(tgt))) { fail++; console.log(`✗ target ${tgt}: does not answer 200`); } else pass++;
}
console.log(fail ? `\n${fail} redirect check(s) failed · ${pass} passed` : `\nall ${pass} live redirect checks passed (${SITE})`);
process.exit(fail ? 1 : 0);
