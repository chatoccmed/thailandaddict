// Upload astro/public/images/** to R2 via the Cloudflare REST API (api.cloudflare.com).
// Use this when the S3 endpoint (*.r2.cloudflarestorage.com) is blocked by network SNI filtering.
// api.cloudflare.com is NOT filtered, so this path works on the same connection.
//
// AUTH: needs a Cloudflare API token (Bearer) — different from the R2 S3 access key/secret.
//   dash → My Profile → API Tokens → Create Token → Custom →
//   Permissions: Account · Workers R2 Storage · Edit  → your account → Create
//   Then add ONE line to ~/.r2-creds:
//     R2_API_TOKEN=<the token>
//   (~/.r2-creds already has R2_ACCOUNT_ID and R2_BUCKET from before.)
//
// Resumable: records done keys in ~/.r2-uploaded.txt and skips them on re-run.
// Run:  node _internal/upload-r2-api.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const credPath = path.join(os.homedir(), '.r2-creds');
const cred = Object.fromEntries(fs.readFileSync(credPath, 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
for (const k of ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_API_TOKEN']) {
  if (!cred[k]) { console.error(`✗ ~/.r2-creds missing ${k} (need a Cloudflare API token — see header)`); process.exit(1); }
}
const clean = v => String(v || '').replace(/^[<"'\s]+|[>"'\s]+$/g, '');   // tolerate template < > / quotes pasted around values
const ACC = clean(cred.R2_ACCOUNT_ID), BUCKET = clean(cred.R2_BUCKET), TOKEN = clean(cred.R2_API_TOKEN);
const API = `https://api.cloudflare.com/client/v4/accounts/${ACC}/r2/buckets/${BUCKET}/objects/`;

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'astro/public/images');
const CT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif' };
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => { const p = path.join(d, e.name); return e.isDirectory() ? walk(p) : [p]; });

const donePath = path.join(os.homedir(), '.r2-uploaded.txt');
const done = new Set(fs.existsSync(donePath) ? fs.readFileSync(donePath, 'utf8').split(/\r?\n/).filter(Boolean) : []);
const doneStream = fs.createWriteStream(donePath, { flags: 'a' });

const all = walk(SRC);
const queue = all.map(f => ({ f, key: 'images/' + path.relative(SRC, f).split(path.sep).join('/') })).filter(x => !done.has(x.key));
console.log(`${all.length} files · ${done.size} already done · ${queue.length} to upload → ${BUCKET} via REST API`);

const sleep = ms => new Promise(r => setTimeout(r, ms));
let ok = 0, fail = 0, processed = 0, rl = 0;
const CONC = 6;

async function put(item) {
  const url = API + item.key.split('/').map(encodeURIComponent).join('/');
  const body = fs.readFileSync(item.f);
  const ct = CT[path.extname(item.f).toLowerCase()] || 'application/octet-stream';
  for (let attempt = 0; attempt < 7; attempt++) {
    try {
      const res = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': ct }, body });
      if (res.ok) return true;
      if (res.status === 429 || res.status >= 500) {
        rl++;
        const ra = parseInt(res.headers.get('retry-after') || '0', 10);
        await sleep(Math.max(ra * 1000, Math.min(30000, 1000 * 2 ** attempt)));
        continue;
      }
      const t = await res.text();
      if (fail < 8) console.error(`  ✗ ${item.key}: ${res.status} ${t.slice(0, 120)}`);
      return false;
    } catch (e) {
      await sleep(Math.min(20000, 1000 * 2 ** attempt));
    }
  }
  return false;
}

async function worker() {
  for (;;) {
    const item = queue.pop();
    if (!item) return;
    const good = await put(item);
    if (good) { ok++; doneStream.write(item.key + '\n'); } else fail++;
    if (++processed % 250 === 0 || queue.length === 0) console.log(`  ${processed} done · ok ${ok} · fail ${fail} · throttled ${rl} · left ${queue.length}`);
  }
}

await Promise.all(Array.from({ length: CONC }, worker));
doneStream.end();
console.log(`\n${fail ? '⚠️' : '✓'} uploaded ${ok}, failed ${fail} of ${queue.length} (throttled ${rl}×)`);
if (fail) { console.log('re-run to retry failures (resumes via ~/.r2-uploaded.txt)'); process.exit(1); }
