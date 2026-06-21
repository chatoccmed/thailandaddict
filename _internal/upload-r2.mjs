// Upload astro/public/images/** to a Cloudflare R2 bucket via the S3 API (no rclone needed).
// Objects keyed images/... → serve at <PUBLIC_IMG_BASE>/images/... (matches asset() in the layouts).
// Resumable: skips objects already present (HeadObject). Concurrent.
//
// SETUP (owner, one time — secrets stay on the machine, never in chat):
//   1) Cloudflare → R2 → Manage R2 API Tokens → Create (Object Read & Write)
//   2) Create ~/.r2-creds with 4 lines:
//        R2_ACCOUNT_ID=46cdce4b7061ce5424b187cf9353ba92
//        R2_ACCESS_KEY_ID=...
//        R2_SECRET_ACCESS_KEY=...
//        R2_BUCKET=thailandaddict-images
// Deps: npm install @aws-sdk/client-s3   (installed at repo root)
// Run:  node _internal/upload-r2.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const credPath = path.join(os.homedir(), '.r2-creds');
if (!fs.existsSync(credPath)) { console.error('✗ missing ~/.r2-creds (see header)'); process.exit(1); }
const cred = Object.fromEntries(fs.readFileSync(credPath, 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
for (const k of ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']) {
  if (!cred[k]) { console.error('✗ ~/.r2-creds missing ' + k); process.exit(1); }
}

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'astro/public/images');
const BUCKET = cred.R2_BUCKET;
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${cred.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: cred.R2_ACCESS_KEY_ID, secretAccessKey: cred.R2_SECRET_ACCESS_KEY },
});

const CT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif' };
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
  const p = path.join(d, e.name); return e.isDirectory() ? walk(p) : [p];
});

const files = walk(SRC);
console.log(`Found ${files.length} files in ${SRC} → r2://${BUCKET}/images/`);
let done = 0, uploaded = 0, skipped = 0, failed = 0;
const CONC = 24;

async function head(Key) { try { await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key })); return true; } catch { return false; } }

async function worker(queue) {
  for (;;) {
    const file = queue.pop();
    if (!file) return;
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const Key = 'images/' + rel;
    try {
      if (await head(Key)) { skipped++; }
      else {
        await s3.send(new PutObjectCommand({
          Bucket: BUCKET, Key, Body: fs.readFileSync(file),
          ContentType: CT[path.extname(file).toLowerCase()] || 'application/octet-stream',
          CacheControl: 'public, max-age=31536000, immutable',
        }));
        uploaded++;
      }
    } catch (e) { failed++; if (failed <= 10) console.error('  ✗ ' + Key + ': ' + e.message); }
    if (++done % 500 === 0 || done === files.length) console.log(`  ${done}/${files.length}  (up ${uploaded} · skip ${skipped} · fail ${failed})`);
  }
}

const queue = files.slice();
await Promise.all(Array.from({ length: CONC }, () => worker(queue)));
console.log(`\n${failed ? '⚠️' : '✓'} done — uploaded ${uploaded}, skipped ${skipped}, failed ${failed} of ${files.length}`);
if (failed) process.exit(1);
