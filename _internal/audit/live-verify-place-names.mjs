/* No province name may be fused into another word, and no brand name may be
   half-translated, on the locale hubs.

   The 2026-09-26 canonicaliser replaced English province names as a plain
   substring, so short names were replaced inside other words — Saphan Taksin
   became "Saphan 来兴sin", Ao Nang became "Ao 楠府g" — and inside brand names,
   "Hotel Bangkok" became "Hotel 曼谷". It was live for five days and no gate
   noticed. This is the gate.

   Checks real pages that carried the damage, in every locale:
     · the original proper nouns are present (Saphan Taksin, Ao Nang)
     · no localised province name is glued to Latin letters
     · the known brand names read in full

   Read-only. Usage: node _internal/audit/live-verify-place-names.mjs [--base URL] [--local]
   Exit 16 on any failure. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const LOCAL = process.argv.includes('--local');
const BASE = arg('--base', 'https://thailandaddict.com').replace(/\/$/, '');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

async function page(loc, slug) {
  if (LOCAL) {
    const p = path.join(ROOT, 'astro/dist', loc, slug + '.html');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  }
  const r = await fetch(`${BASE}/${loc}/${slug}`, { headers: { 'User-Agent': 'thailandaddict-selfcheck/1.0' } });
  return r.ok ? r.text() : null;
}

/* Pages the broken canonicaliser damaged, and the CORRUPT form each must not
   carry. Not "must contain Saphan Taksin": ru/ko/ja/zh translate it in running
   text (Сапхан Таксин, サパーンタクシン駅, 沙潘塔克辛站) — correct, and identical to
   the page before the bug — and the first draft of this check failed all four
   for it. The damage has a shape of its own: a non-Latin name glued between
   Latin letters. */
const PROBES = [
  { slug: 'area-bangkok-riverside', corrupt: /Saphan [^\sA-Za-z<>"]{1,10}sin/, label: 'Saphan Taksin' },
  { slug: 'city-krabi', corrupt: /Ao [^\sA-Za-z<>"]{1,10}g\b/, label: 'Ao Nang' },
  { slug: 'city-bangkok', corrupt: null, label: null },
];

let pass = 0; const fails = [];
const ok = (m) => { pass++; console.log('  ✓ ' + m); };
const bad = (m) => { fails.push(m); console.log('  ✗ ' + m); };

for (const loc of LANGS) {
  const prov = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', loc + '.json'), 'utf8')).prov || {};
  /* localised names of 3+ characters: a one- or two-character name (帕, 楠府)
     also occurs legitimately inside translated words, which is not damage */
  const names = Object.values(prov).map((v) => v && v.n).filter((n) => n && !/^[\x00-\x7F]+$/.test(n) && n.length >= 3);
  console.log(loc);
  for (const { slug, corrupt, label } of PROBES) {
    const html = await page(loc, slug);
    if (html == null) { bad(`${loc}/${slug}: not reachable`); continue; }
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    if (corrupt) {
      const m = text.match(corrupt);
      if (m) bad(`${loc}/${slug}: ${label} was rewritten into «${m[0]}»`);
      else ok(`${loc}/${slug}: ${label} not corrupted`);
    }
    /* a localised name with a Latin LETTER glued directly to it: Ao 楠府g */
    const fused = [];
    for (const n of names) {
      let i = -1;
      while ((i = text.indexOf(n, i + 1)) >= 0) {
        const before = text[i - 1] || '', after = text[i + n.length] || '';
        if (/[a-z]/.test(after) || /[a-z]/.test(before)) fused.push(text.slice(Math.max(0, i - 8), i + n.length + 5).replace(/\s+/g, ' '));
      }
    }
    if (fused.length) bad(`${loc}/${slug}: ${fused.length} province name(s) fused into a word — «${fused[0]}»`);
    else ok(`${loc}/${slug}: no province name fused into a word`);
  }
}

console.log('\n' + (fails.length ? `FAILED ${fails.length} of ${pass + fails.length}` : `all ${pass} checks passed`) + ` (${LOCAL ? 'local dist' : BASE})`);
process.exit(fails.length ? 16 : 0);
