/* 253 review-count strings in ru/ko/hi/he still read "144 reviews".

   revCount is a pre-formatted string in the content file — the layouts print it
   verbatim rather than composing it from a number and a word — so these show up
   in English on the roundup pages and, since 2026-09-25, on the locale
   homepages' stay shelves too. zh, ja and ar have none; the four that do have
   plenty of correct examples to copy the shape from:

     ru  "105 отзывов"      ko  "리뷰 105개"      hi  "105 रिव्यूज़"      he  "105 ביקורות"

   Russian agrees with the number, so it gets the real rule rather than one
   fixed form: 1 отзыв · 2-4 отзыва · 5-20 отзывов, and again by last digit.

   Usage: node _internal/hub-i18n/fix-revcount-english.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from '../lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const APPLY = process.argv.includes('--apply');

const ruPlural = (n) => {
  const m100 = n % 100, m10 = n % 10;
  if (m100 >= 11 && m100 <= 14) return 'отзывов';
  if (m10 === 1) return 'отзыв';
  if (m10 >= 2 && m10 <= 4) return 'отзыва';
  return 'отзывов';
};

/* each returns the replacement for "<num> reviews" */
const FORM = {
  ru: (num, n) => num + ' ' + ruPlural(n),
  ko: (num) => '리뷰 ' + num + '개',
  hi: (num) => num + ' रिव्यूज़',
  he: (num) => num + ' ביקורות',
};

/* The rule has to be right before anything is written. */
const TESTS = [
  ['ru', '1 reviews', '1 отзыв'], ['ru', '3 reviews', '3 отзыва'], ['ru', '5 reviews', '5 отзывов'],
  ['ru', '11 reviews', '11 отзывов'], ['ru', '21 reviews', '21 отзыв'], ['ru', '104 reviews', '104 отзыва'],
  ['ru', '1,467 reviews', '1,467 отзывов'], ['ru', '112 reviews', '112 отзывов'],
  ['ko', '243 reviews', '리뷰 243개'], ['hi', '44 reviews', '44 रिव्यूज़'], ['he', '53 reviews', '53 ביקורות'],
];
const REVIEWS = /(\d[\d,]*)\s+reviews?\b/gi;
const rewrite = (loc, s) => s.replace(REVIEWS, (_, num) => FORM[loc](num, Number(String(num).replace(/,/g, ''))));

let tf = 0;
for (const [loc, input, want] of TESTS) {
  const got = rewrite(loc, input);
  if (got !== want) { tf++; console.error(`FAIL ${loc} "${input}" -> "${got}" want "${want}"`); }
}
if (tf) { console.error(tf + ' rule tests failed — writing nothing'); process.exit(1); }
console.log('rule self-test: ' + TESTS.length + ' cases pass');

let files = 0, values = 0;
const perLoc = {};
for (const loc of Object.keys(FORM)) {
  for (const dir of ['roundups-' + loc, 'reviews-' + loc, 'articles-' + loc]) {
    const d = path.join(ROOT, 'astro/src/content', dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (!f.endsWith('.json')) continue;
      const p = path.join(d, f);
      const raw = fs.readFileSync(p, 'utf8');
      let j; try { j = JSON.parse(raw); } catch { continue; }
      let hits = 0;
      const walk = (o) => {
        if (!o || typeof o !== 'object') return;
        for (const [k, v] of Object.entries(o)) {
          if (typeof v === 'string' && (k === 'revCount' || k === 'reviewCount') && REVIEWS.test(v)) {
            REVIEWS.lastIndex = 0;
            const next = rewrite(loc, v);
            if (next !== v) { o[k] = next; hits++; }
          }
          REVIEWS.lastIndex = 0;
          if (v && typeof v === 'object') walk(v);
        }
      };
      walk(j);
      if (!hits) continue;
      files++; values += hits;
      perLoc[loc] = (perLoc[loc] || 0) + hits;
      if (APPLY) {
        const out = serializeLike(raw, j);
        fs.writeFileSync(p, out.text, 'utf8');
      }
    }
  }
}

console.log((APPLY ? 'APPLIED' : 'DRY RUN') + ': ' + values + ' values in ' + files + ' files');
for (const [l, n] of Object.entries(perLoc)) console.log('  ' + l + ': ' + n);

if (APPLY) {
  let left = 0;
  for (const loc of Object.keys(FORM)) {
    for (const dir of ['roundups-' + loc, 'reviews-' + loc, 'articles-' + loc]) {
      const d = path.join(ROOT, 'astro/src/content', dir);
      if (!fs.existsSync(d)) continue;
      for (const f of fs.readdirSync(d)) {
        if (!f.endsWith('.json')) continue;
        const raw = fs.readFileSync(path.join(d, f), 'utf8');
        try { JSON.parse(raw); } catch { console.error('INVALID ' + dir + '/' + f); left++; continue; }
        for (const m of raw.matchAll(/"(?:revCount|reviewCount)"\s*:\s*"([^"]*)"/g))
          if (/\breviews?\b/i.test(m[1])) { left++; }
      }
    }
  }
  console.log('remaining English review counts: ' + left);
  process.exit(left ? 1 : 0);
}
