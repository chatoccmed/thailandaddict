// Live check: does production's sitemap.xml give each page the date its source last changed?
// Before 2026-10-27 every hub, static page and the homepage carried one hard-coded date (2026-06-22),
// so Google could not tell which of 16k pages had changed. Run: node _internal/audit/check-sitemap-lastmod-live.mjs
// Exit 0 = all checks pass, 1 = a check failed.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');
const LIVE = process.argv[2] || 'https://thailandaddict.com/sitemap.xml';
const git = args => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { cwd: ROOT, encoding: 'utf8' }).trim();

const xml = await (await fetch(LIVE, { cache: 'no-store' })).text();
const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map(m => ({ loc: m[1], lastmod: m[2] || null }));
const by = new Map(urls.map(u => [u.loc, u.lastmod]));
const today = new Date().toISOString().slice(0, 10);

let fail = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fail++; };

check(urls.length > 15000, `${urls.length} <url> entries`);
// Each sample page's lastmod must be the commit date of the file it is built from.
const samples = [
  ['https://thailandaddict.com/', 'astro/public/index.html'],
  ['https://thailandaddict.com/en/', 'astro/public/en/index.html'],
  ['https://thailandaddict.com/zh/', 'astro/public/zh/index.html'],
  ['https://thailandaddict.com/about', 'astro/public/about.html'],
];
const review = fs.readdirSync(path.join(ROOT, 'astro/src/content/reviews')).find(f => f.endsWith('.json'));
samples.push([`https://thailandaddict.com/${review.slice(0, -5)}`, `astro/src/content/reviews/${review}`]);
for (const [loc, src] of samples) {
  const want = git(['log', '-1', '--format=%cs', '--', src]);
  check(by.get(loc) >= want, `${loc} lastmod ${by.get(loc)} (source last changed ${want})`);
}
const dates = new Set(urls.map(u => u.lastmod).filter(Boolean));
const tally = {}; for (const u of urls) tally[u.lastmod] = (tally[u.lastmod] || 0) + 1;
const [topDate, topN] = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
check(topN / urls.length < 0.5, `most common lastmod ${topDate} covers ${(100 * topN / urls.length).toFixed(1)}% of urls (a blanket date would cover most)`);
const newest = [...dates].sort().pop();
check(newest >= '2026-10-01', `newest lastmod is ${newest}`);
check(![...dates].some(d => d > today), 'no lastmod in the future');
check(!urls.some(u => u.lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(u.lastmod)), 'every lastmod is YYYY-MM-DD');

console.log(fail ? `\n${fail} check(s) failed` : '\nall checks passed');
process.exit(fail ? 1 : 0);
