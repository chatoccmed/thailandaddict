// HEAD-check every unique external image URL (R2 + Wikimedia + others).
// Concurrency 10, 429/403-tolerant (Wikimedia throttles; treat as alive).
// Output: _internal/wf/external-img-results.json
import fs from 'node:fs';
import https from 'node:https';
import http from 'node:http';

const urls = JSON.parse(fs.readFileSync('_internal/wf/external-imgs.json', 'utf8'));
const results = { ok: 0, broken: [], throttled: 0, errors: [] };
let idx = 0, active = 0;
const CONC = 10;

function check(url, redirects = 0) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, { method: 'HEAD', timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TA-audit/1.0)' } }, (res) => {
      res.resume();
      const s = res.statusCode;
      if ((s === 301 || s === 302 || s === 307 || s === 308) && res.headers.location && redirects < 3) {
        const loc = new URL(res.headers.location, url).href;
        return resolve(check(loc, redirects + 1));
      }
      resolve(s);
    });
    req.on('timeout', () => { req.destroy(); resolve('timeout'); });
    req.on('error', (e) => resolve('err:' + e.code));
    req.end();
  });
}

async function worker() {
  while (idx < urls.length) {
    const i = idx++;
    const u = urls[i];
    let s = await check(u);
    if (s === 429) { results.throttled++; await new Promise(r => setTimeout(r, 2500)); s = await check(u); if (s === 429) s = 200; }
    if (s === 200 || s === 403) results.ok++;           // 403 = hotlink guard but file exists
    else if (typeof s === 'number' && s >= 400) results.broken.push({ url: u, status: s });
    else if (typeof s !== 'number') results.errors.push({ url: u, err: s });
    else results.ok++;
    if ((i + 1) % 1000 === 0) console.log(`progress ${i + 1}/${urls.length} · ok ${results.ok} · broken ${results.broken.length} · err ${results.errors.length}`);
  }
}

await Promise.all(Array.from({ length: CONC }, worker));
// retry transient errors once, slower
const retry = results.errors.splice(0);
for (const e of retry) {
  const s = await check(e.url);
  if (s === 200 || s === 403 || s === 429) results.ok++;
  else if (typeof s === 'number' && s >= 400) results.broken.push({ url: e.url, status: s });
  else results.errors.push(e);
}
fs.writeFileSync('_internal/wf/external-img-results.json', JSON.stringify(results, null, 1));
console.log(`DONE: total ${urls.length} · ok ${results.ok} · BROKEN ${results.broken.length} · errors ${results.errors.length} · throttled ${results.throttled}`);
if (results.broken.length) results.broken.slice(0, 30).forEach(b => console.log('  BROKEN', b.status, b.url.slice(0, 110)));
