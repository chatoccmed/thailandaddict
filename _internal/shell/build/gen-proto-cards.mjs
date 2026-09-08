/* gen-proto-cards.mjs — card-sized image derivatives for the planner homepage.
 *
 * WHY THIS EXISTS
 * The deck paints 3:2 photo cards at 264 CSS px on a 375 px phone (528 device
 * px at DPR 2). The source photographs are full-size originals: measured on
 * 2026-09-09, the four Krabi stay cards alone pulled 526 KB over the wire on
 * first view (krabi-rayavadee-1.jpg is 1280x960 / 226 KB for a 528 px slot —
 * 11x the pixels needed), which put the page at 651 KB against a 500 KB budget.
 *
 * images/{hotels,cm,food,gallery} are excluded from the deploy bundle by
 * .assetsignore and served from R2. images/_cards IS bundled, and the guide
 * cards and the editor avatar already use it with the -560 naming convention.
 * This extends that same convention to the deck's photo cards.
 *
 * Outputs, pre-cropped to 3:2 so the width/height attributes are honest:
 *   images/_cards/<dir>/<name>-560.webp   (mobile DPR2: 264 CSS px x 2 = 528)
 *   images/_cards/<dir>/<name>-880.webp   (desktop DPR2: 360 CSS px x 2 = 720)
 *   images/_cards/<dir>/<name>-560.jpg    (fallback for the <img> element)
 *
 * Idempotent: an output newer than its source is left alone. Run it after
 * changing which photos the deck shows, then re-run gen-proto-home.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from '../../../astro/node_modules/sharp/lib/index.js';

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'astro/public');
const HTML = ['astro/public/_proto/home.html', 'astro/public/_proto/en/home.html'];
const R2_RE = /https:\/\/pub-65cf98dcb15e4c06a7a465ec411b870a\.r2\.dev\/(images\/[^"'\s>]+\.(?:jpe?g|png|webp))/g;

/* 3:2 is the .ta-r-3-2 card ratio. Cropping here (rather than leaning on
   object-fit) is what makes width/height truthful instead of decorative. */
const W = [560, 880];
const RATIO = 3 / 2;

const srcs = new Set();
for (const f of HTML) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, 'utf8').matchAll(R2_RE)) srcs.add(m[1]);
}

/* images/hotels/x.jpg -> images/_cards/hotels/x ; nested dirs preserved. */
export const cardBase = (rel) =>
  'images/_cards/' + String(rel).replace(/^\//, '').replace(/^images\//, '').replace(/\.[a-z0-9]+$/i, '');

let made = 0, skipped = 0, missing = 0;
for (const rel of [...srcs].sort()) {
  const src = path.join(PUB, rel);
  if (!fs.existsSync(src)) { console.warn('  MISSING SOURCE', rel); missing++; continue; }
  const base = path.join(PUB, cardBase(rel));
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const mt = fs.statSync(src).mtimeMs;
  const jobs = [
    ...W.map((w) => ({ out: `${base}-${w}.webp`, w, webp: true })),
    { out: `${base}-560.jpg`, w: 560, webp: false },
  ];
  for (const j of jobs) {
    if (fs.existsSync(j.out) && fs.statSync(j.out).mtimeMs >= mt) { skipped++; continue; }
    const pipe = sharp(src).resize(j.w, Math.round(j.w / RATIO), { fit: 'cover', position: 'attention' });
    await (j.webp ? pipe.webp({ quality: 74, effort: 5 }) : pipe.jpeg({ quality: 76, mozjpeg: true })).toFile(j.out);
    made++;
  }
}
console.log(`sources: ${srcs.size} · written: ${made} · up-to-date: ${skipped} · missing: ${missing}`);
