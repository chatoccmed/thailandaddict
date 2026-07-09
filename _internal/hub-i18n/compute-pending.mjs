// Compute the exact pending translation work-list per language, derived from disk.
// Emits JSON: { lang: { cities: { <city>: { roundupMissing: bool, reviews: [slug,...] } }, totalReviews, totalRoundups } }
// Usage: node _internal/hub-i18n/compute-pending.mjs <lang> [<lang> ...]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const slugMap = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '_city-review-slugs.json'), 'utf8'));
const langs = process.argv.slice(2);
if (!langs.length) { console.error('usage: compute-pending.mjs <lang> ...'); process.exit(2); }

const exists = p => fs.existsSync(p);
const out = {};
for (const lang of langs) {
  const rvDir = path.join(ROOT, `astro/src/content/reviews-${lang}`);
  const ruDir = path.join(ROOT, `astro/src/content/roundups-${lang}`);
  const cities = {};
  let totalReviews = 0, totalRoundups = 0;
  for (const [city, slugs] of Object.entries(slugMap)) {
    const roundupFile = path.join(ruDir, `top10-hotels-${city}.json`);
    // sanity: EN source must exist for the roundup
    const enRoundup = path.join(ROOT, `astro/src/content/roundups-en/top10-hotels-${city}.json`);
    const roundupMissing = exists(enRoundup) && !exists(roundupFile);
    const missingReviews = slugs.filter(s => {
      const enSrc = path.join(ROOT, `astro/src/content/reviews-en/${s}.json`);
      const tgt = path.join(rvDir, `${s}.json`);
      return exists(enSrc) && !exists(tgt);
    });
    if (roundupMissing || missingReviews.length) {
      cities[city] = { roundupMissing, reviews: missingReviews };
      if (roundupMissing) totalRoundups++;
      totalReviews += missingReviews.length;
    }
  }
  out[lang] = { cities, totalReviews, totalRoundups };
  console.error(`${lang}: ${totalReviews} reviews + ${totalRoundups} roundups pending across ${Object.keys(cities).length} cities`);
}
process.stdout.write(JSON.stringify(out, null, 0));
