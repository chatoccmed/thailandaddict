// Ping IndexNow (Bing, Yandex, Naver, Seznam, …) with our sitemap URLs so answer
// engines that retrieve from the Bing index — notably ChatGPT — discover and
// re-crawl our pages fast. Submitting our own already-public URLs is a standard
// SEO action, not a publish. Run AFTER the key file is deployed and reachable:
//   node _internal/submit-indexnow.mjs            # submit all sitemap URLs
//   node _internal/submit-indexnow.mjs --dry      # print the plan, submit nothing
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const HOST = 'thailandaddict.com';
const KEY = fs.readFileSync(path.join(ROOT, '_internal/.indexnow-key'), 'utf8').trim();
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const DRY = process.argv.includes('--dry');

// verify the key file is live first — IndexNow rejects the whole batch otherwise
const keyLive = await fetch(KEY_LOCATION).then(r => r.ok ? r.text() : '').catch(() => '');
if (keyLive.trim() !== KEY) {
  console.error(`✗ key file not reachable / mismatched at ${KEY_LOCATION} (got ${JSON.stringify(keyLive.slice(0, 20))}) — deploy it first`);
  process.exit(1);
}
console.log(`✓ key verified at ${KEY_LOCATION}`);

// pull URLs from the built sitemap (prefer local dist, fall back to live)
let xml = '';
for (const p of ['astro/dist/sitemap.xml', 'astro/public/sitemap.xml']) {
  try { xml = fs.readFileSync(path.join(ROOT, p), 'utf8'); if (xml) { console.log('sitemap:', p); break; } } catch {}
}
if (!xml) xml = await fetch(`https://${HOST}/sitemap.xml`).then(r => r.text());
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(u => u.startsWith(`https://${HOST}/`));
console.log(`${urls.length} URLs to submit (batches of 10,000)`);
if (DRY) { console.log('DRY — sample:', urls.slice(0, 5)); process.exit(0); }

let ok = 0, fail = 0;
for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  }).catch(e => ({ ok: false, status: 'ERR ' + e.message }));
  if (res.ok || res.status === 200 || res.status === 202) { ok += urlList.length; console.log(`  batch ${i / 10000 + 1}: ${res.status} · ${urlList.length} URLs accepted`); }
  else { fail += urlList.length; console.error(`  batch ${i / 10000 + 1}: ${res.status} — ${await (res.text ? res.text() : Promise.resolve('')).catch(() => '')}`); }
}
console.log(`\n${fail ? '⚠️' : '✓'} submitted ${ok} URLs (${fail} failed) to IndexNow`);
