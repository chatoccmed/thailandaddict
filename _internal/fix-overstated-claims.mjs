/* Remove two claims the site cannot keep, from titles, H1s and meta.

   1. "we reviewed it" / "ที่เรารีวิวไว้แล้ว"
      In English this states first-hand inspection. The site does not inspect
      properties and its own review pages say so plainly: the scores come from
      Booking and Agoda guest reviews. The overstatement sat at the top of the
      funnel - titles, H1s, meta descriptions, the homepage - while the honest
      disclosure sat deep on the review page, which is the wrong way round. What
      IS true is that we write the reviews, so that is what it now says.

   2. "Prices Compared Across 3 Sites" / "เทียบราคา 3 เว็บ"
      Past tense, stated as a feature of the page. Verified: a roundup entry
      carries exactly one price (priceBig) and zero per-OTA price fields across
      all 12 entries of every roundup checked. The page shows three BOOKING
      LINKS, not three prices - so it now invites the reader to compare rather
      than claiming we already did.

   Neither is a lie anyone set out to tell; both are copy that drifted past what
   the data supports. The fix is subtractive and reversible.

   Usage: node _internal/fix-overstated-claims.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');

/* Order matters: the longest Thai form must be tried before its prefixes, or
   "ที่เรารีวิวไว้แล้ว" is half-matched by "ที่เรารีวิวแล้ว" and left malformed. */
const RULES = [
  // --- claim 1: first-hand inspection
  [/ที่เรารีวิวไว้แล้ว/g, 'ที่เราเขียนรีวิวไว้'],
  [/ที่เรารีวิวแล้ว/g, 'ที่เราเขียนรีวิวไว้'],
  [/ที่เรารีวิวเอง/g, 'ที่เราเขียนรีวิวไว้'],
  [/We've Already Reviewed/g, "We've Written Up"],
  [/We've Actually Reviewed/g, "We've Written Up"],
  [/We Actually Reviewed/g, "We've Written Up"],
  [/we've already reviewed/g, "we've written up"],
  [/we've actually reviewed/g, "we've written up"],
  [/we actually reviewed/g, "we've written up"],
  // --- claim 2: a comparison we did not do
  [/เทียบราคา ?3 ?เว็บ/g, 'ลิงก์เทียบราคา 3 เว็บ'],
  [/Prices Compared Across 3 Sites/g, 'Compare Prices on 3 Sites'],
  [/Prices compared across 3 sites/g, 'Compare prices on 3 sites'],
  [/prices compared across 3 sites/g, 'compare prices on 3 sites'],
  [/Price Compared Across 3 Site/g, 'Compare Prices on 3 Sites'],
  [/3-Site Price Compare/g, 'Compare 3 Sites'],
  [/3-site price compare/g, 'compare 3 sites'],
];

let files = 0, hits = 0;
const byRule = {};
for (const dir of ['roundups', 'roundups-en', 'reviews', 'reviews-en', 'articles', 'articles-en']) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(d, f);
    const raw = fs.readFileSync(p, 'utf8');
    let next = raw, n = 0;
    for (const [re, to] of RULES) {
      const m = next.match(re);
      if (!m) continue;
      n += m.length;
      byRule[re.source] = (byRule[re.source] || 0) + m.length;
      next = next.replace(re, to);
    }
    if (!n) continue;
    /* never write a file that stopped being JSON - these are user-visible
       titles inside string values and a bad replacement is invisible until the
       build fails hours later */
    JSON.parse(next);
    files++; hits += n;
    if (APPLY) fs.writeFileSync(p, next);
  }
}

console.log(`files ${files} · replacements ${hits}`);
for (const [k, v] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
console.log(APPLY ? '\napplied' : '\ndry run — nothing written. Re-run with --apply');
