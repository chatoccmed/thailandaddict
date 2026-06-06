// Live build-progress dashboard for the 77-province build.
// Usage: node _internal/status.mjs            (full table)
//        node _internal/status.mjs --short     (summary only)
//        node _internal/status.mjs --todo       (only unfinished provinces)
// Reads build-queue.md (done flags) + the content/image filesystem (real counts).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..'); // repo root (resolves wherever cloned)
const ARTDIR = path.join(ROOT, 'astro/src/content/articles');
const REVDIR = path.join(ROOT, 'astro/src/content/reviews');
const RUNDIR = path.join(ROOT, 'astro/src/content/roundups');
const IMGDIR = path.join(ROOT, 'astro/public/images/cm');
const HERODIR = path.join(ROOT, 'astro/public/images/heroes');
const QUEUE = path.join(ROOT, '_internal/build-queue.md');
const TARGET_REV = 12, TARGET_ART = 38;
const args = process.argv.slice(2);
const SHORT = args.includes('--short'), TODO = args.includes('--todo');

// 1) parse queue: slug + done flag, preserving order
const queue = [];
for (const line of fs.readFileSync(QUEUE, 'utf8').split('\n')) {
  const m = line.match(/^\s*-\s*\[([ x])\]\s*([a-z-]+)\s*—\s*(\S+)/);
  if (m) queue.push({ slug: m[2], done: m[1] === 'x', th: m[3] });
}

// 2) index articles by cluster
const artByCluster = {};
const imgExists = s => { const fp = path.join(IMGDIR, s + '.jpg'); try { return fs.statSync(fp).size >= 15000; } catch { return false; } };
for (const f of fs.existsSync(ARTDIR) ? fs.readdirSync(ARTDIR).filter(x => x.endsWith('.json')) : []) {
  let c = ''; try { c = JSON.parse(fs.readFileSync(path.join(ARTDIR, f), 'utf8')).cluster || ''; } catch {}
  (artByCluster[c] ??= []).push(f.replace(/\.json$/, ''));
}
// 3) reviews by slug suffix
const reviews = fs.existsSync(REVDIR) ? fs.readdirSync(REVDIR).filter(x => x.endsWith('.json')) : [];
const revCount = slug => reviews.filter(f => f.endsWith(`-${slug}.json`)).length;
const hasRoundup = slug => fs.existsSync(path.join(RUNDIR, `top10-hotels-${slug}.json`));
const hasHero = slug => fs.existsSync(path.join(HERODIR, `${slug}.jpg`));

// 4) build rows
let doneN = 0, totRev = 0, totArt = 0, totImg = 0;
const rows = queue.map(q => {
  const arts = artByCluster[q.slug] || [];
  const imgs = arts.filter(imgExists).length;
  const rev = revCount(q.slug);
  const row = { ...q, rev, roundup: hasRoundup(q.slug), art: arts.length, img: imgs, hero: hasHero(q.slug) };
  row.complete = rev >= TARGET_REV && row.roundup && row.art >= TARGET_ART && imgs >= TARGET_ART && row.hero;
  if (q.done) doneN++;
  totRev += rev; totArt += arts.length; totImg += imgs;
  return row;
});

// 5) detect in-progress (not done but has partial content)
const inprog = rows.filter(r => !r.done && (r.rev > 0 || r.art > 0));

console.log(`\n🇹🇭  ThailandAddict — 77-province build status`);
console.log(`────────────────────────────────────────────`);
const pct = Math.round(doneN / queue.length * 100);
const bar = '█'.repeat(Math.round(pct/5)) + '░'.repeat(20 - Math.round(pct/5));
console.log(`Provinces done : ${doneN}/${queue.length}  [${bar}] ${pct}%`);
console.log(`Content totals : ${totRev} reviews · ${totArt} articles · ${totImg} article images`);
try {
  const log = execSync('git -C "' + ROOT + '" log --oneline -3', { encoding: 'utf8' }).trim();
  console.log(`Last commits   :\n  ${log.split('\n').join('\n  ')}`);
} catch {}
if (inprog.length) console.log(`In progress    : ${inprog.map(r => `${r.slug} (${r.rev}/12 rev, ${r.art}/38 art, ${r.img}/38 img)`).join(' · ')}`);

if (SHORT) process.exit(0);

const show = TODO ? rows.filter(r => !r.complete) : rows;
console.log(`\n${'province'.padEnd(22)} done rev rnd art img hero`);
console.log('─'.repeat(54));
for (const r of show) {
  const flag = r.complete ? '✅' : (r.done ? '⚠️ ' : (r.art || r.rev ? '🔄' : '  '));
  console.log(
    r.slug.padEnd(22) +
    (r.done ? ' [x]' : ' [ ]') +
    `  ${String(r.rev).padStart(2)} ` +
    ` ${r.roundup ? '✓' : '·'} ` +
    ` ${String(r.art).padStart(2)} ` +
    ` ${String(r.img).padStart(2)} ` +
    `  ${r.hero ? '✓' : '·'}  ${flag}`
  );
}
console.log(`\nlegend: ✅ complete · 🔄 building · ⚠️ marked done but content short · [x]=queue checked`);
