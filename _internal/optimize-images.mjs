#!/usr/bin/env node
// Optimize hotel images in place via sharp (buffer→buffer, NO temp files, NO /tmp).
// Resizes to max 1600px wide, re-encodes JPEG q82 mozjpeg. Reads each file into a
// buffer first so we never read+write the same path concurrently (Windows lock-safe).
// Usage: node _internal/optimize-images.mjs <img> [<img> ...]   (pass the untracked new images)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const sharp = require(join(ROOT, 'astro/node_modules/sharp'));

const files = process.argv.slice(2).filter(f => /\.(jpe?g|png)$/i.test(f));
if (!files.length) { console.error('no image paths given'); process.exit(1); }

let before = 0, after = 0, done = 0, skipped = 0, failed = 0;
for (const f of files) {
  let buf;
  try { buf = readFileSync(f); } catch { failed++; continue; }
  const inSize = buf.length;
  try {
    const out = await sharp(buf)
      .rotate()                                   // honor EXIF orientation
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    // only rewrite if we actually shrank it (avoid bloating already-tiny files)
    if (out.length < inSize) { writeFileSync(f, out); after += out.length; done++; }
    else { after += inSize; skipped++; }
    before += inSize;
  } catch (e) { failed++; console.error('FAIL', f, String(e).slice(0, 80)); }
}
const mb = n => (n / 1048576).toFixed(1) + 'MB';
console.log(`optimized ${done} · skipped(already small) ${skipped} · failed ${failed} · total ${files.length}`);
console.log(`size ${mb(before)} → ${mb(after)} (saved ${mb(before - after)})`);
