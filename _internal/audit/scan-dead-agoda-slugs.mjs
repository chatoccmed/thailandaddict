/* ⚠ READ CLAUDE.md FIRST: Agoda throttles a serial sweep. After ~2,000 requests
   it starts answering 502 and serving empty pages, and a throttled request can
   land on /city/ exactly as a dead slug does — so a 'dead' verdict from a long
   run is NOT evidence. Run this in small batches with delays, and confirm any
   hit by probing a known-good url in the same batch. The 14 wrong-hotel links
   fixed on 2026-09-25 were proven pairwise (one side reached the hotel, the
   other did not, in back-to-back requests), not by this sweep alone. */

/* Site-wide sweep for the failure the wrong-hotel fix uncovered: an Agoda slug
   that no longer exists does not 404. Agoda redirects it to /city/<city>.html,
   so the reader who clicked "check prices for this hotel" gets a list of every
   hotel in town, and every check we run on our side passes. Only the landing
   url tells you.

   Probes each DISTINCT slug once, not each link, and writes a json report. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const C = 'C:/Users/Imac/Thailandaddict/thailandaddict/astro/src/content/';
const SP = path.resolve(import.meta.dirname, 'cache') + '/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const LIMIT = Number(process.env.LIMIT || 0);

/* Thai and English only: the translations mirror the same urls, and a slug is a
   slug in every language. */
const urls = new Map();   // canonical agoda url -> {slug, where:Set}
const RE = /https:\/\/www\.agoda\.com\/(?:[a-z]{2}-[a-z]{2}\/)?([a-z0-9._-]+)\/hotel\/([a-z0-9-]+)\.html/gi;
for (const dir of ['reviews', 'roundups', 'articles', 'reviews-en', 'roundups-en', 'articles-en']) {
  const d = path.join(C, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const raw = fs.readFileSync(path.join(d, f), 'utf8');
    for (const m of raw.matchAll(RE)) {
      const key = 'https://www.agoda.com/' + m[1] + '/hotel/' + m[2] + '.html';
      if (!urls.has(key)) urls.set(key, { slug: m[1], city: m[2], where: new Set() });
      urls.get(key).where.add(dir + '/' + f);
    }
  }
}

const all = [...urls.keys()];
const todo = LIMIT ? all.slice(0, LIMIT) : all;
console.log('distinct Agoda hotel slugs: ' + all.length + (LIMIT ? ' (probing first ' + LIMIT + ')' : ''));

const dead = [], errs = [];
let i = 0, ok = 0;
for (const u of todo) {
  i++;
  let code = '', final = '';
  try {
    const out = execFileSync('curl', ['-sL', '-A', UA, '--max-time', '30', '-o', SP + '_scan.html',
      '-w', '%{http_code}|%{url_effective}', u], { encoding: 'utf8' });
    [code, final] = out.split('|');
  } catch (e) { errs.push({ url: u, err: String(e.message).slice(0, 60) }); continue; }
  const isDead = code === '404' || /\/city\//.test(final) || /pagenotfound/.test(final);
  if (isDead) {
    const r = urls.get(u);
    dead.push({ url: u, code, final: final.replace(/\?.*$/, ''), where: [...r.where] });
    console.log('DEAD  ' + code + '  ' + r.slug + '  -> ' + final.replace(/\?.*$/, '').replace('https://www.agoda.com', ''));
  } else ok++;
  if (i % 50 === 0) console.log('  ... ' + i + '/' + todo.length + '  live ' + ok + '  dead ' + dead.length);
}

fs.writeFileSync(SP + 'dead-agoda.json', JSON.stringify({ total: todo.length, live: ok, dead, errs }, null, 2));
console.log('\nprobed ' + todo.length + ' · live ' + ok + ' · DEAD ' + dead.length + ' · errors ' + errs.length);
console.log('report: ' + SP + 'dead-agoda.json');
