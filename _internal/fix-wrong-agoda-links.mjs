/* Repoint four Agoda links that opened a different hotel.

   The link audit compared each Agoda URL's slug against the hotel it sits
   beside and found four where they share no distinctive word. Checked against
   the owner's Agoda feed, our hotel exists in it under its own name in every
   case, while the slug in our link matches nothing or belongs elsewhere:

     Chivapuri Residence Trat   ->  chanchiva-lodge        (0 hits in the feed)
     The LA49 Hotel             ->  la-residence_4
     Canal Village Pakpra       ->  a-villa-with-amazing-river-views-...
     Hotel Amber Sukhumvit 85   ->  at-mind-executive-suites  (every "At Mind"
                                    property in the feed is in Pattaya, and
                                    this hotel is on Sukhumvit in Bangkok)

   Each replacement is the feed's own hotel_id, matched on name AND house
   number - 1148/8-11, 22/2, 225, 8 - so it cannot be a different property.

   The link form is Agoda's partner deep link, the same one the feed publishes
   in its url column. The tidier-looking search?selectedproperty=<id> form was
   rejected: without a city id it 301s straight to the Agoda homepage, which is
   the exact failure this session spent its time removing from 16,865 pages,
   and with one it depends on a city id we would be hardcoding. partnersearch
   resolves the property itself - verified, 302 to
   search?cid=..&selectedproperty=<id>&city=..&pslc=1, then 200.

   Usage: node _internal/fix-wrong-agoda-links.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const CID = '1965862';
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];

/* slug -> { id, wrong: the slug our link used, name: the feed's name } */
const FIX = {
  'review-chivapuri-trat': { id: '782252', wrong: 'chanchiva-lodge', name: 'Chivapuri Residence Trat' },
  'review-la49-hotel-bangkok': { id: '2094330', wrong: 'la-residence', name: 'The LA49 Hotel' },
  'review-canal-village-pakpra-phatthalung': { id: '37011662', wrong: 'a-villa-with-amazing-river-views', name: 'Canal Village Pakpra Phatthalung' },
  'review-hotel-amber-sukhumvit-85-bangkok': { id: '433315', wrong: 'at-mind-executive-suites', name: 'Hotel Amber Sukhumvit 85' },
};
const target = (id) => `https://www.agoda.com/partners/partnersearch.aspx?hid=${id}&cid=${CID}`;

let files = 0, links = 0;
const missed = [];
for (const [slug, f] of Object.entries(FIX)) {
  const re = new RegExp(`https?://(?:www\\.)?agoda\\.com/${f.wrong}[a-z0-9_-]*/hotel/[^"'\\\\ )]*`, 'gi');
  let hitAnyLocale = false;
  for (const suffix of LOC) {
    const p = path.join(ROOT, `astro/src/content/reviews${suffix}`, `${slug}.json`);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const found = raw.match(re);
    if (!found) continue;
    hitAnyLocale = true;
    const next = raw.replace(re, target(f.id));
    files++; links += found.length;
    console.log(`  ${(suffix || 'th').padEnd(4)} ${slug.replace(/^review-/, '').slice(0, 40).padEnd(40)} ${found.length} link(s) -> hid=${f.id}`);
    if (APPLY) {
      /* replace in the raw text, then re-parse to prove the file is still valid
         JSON before it is written - a regex over raw text is fast but blind */
      JSON.parse(next);
      fs.writeFileSync(p, next);
    }
  }
  if (!hitAnyLocale) missed.push(slug);
}
console.log(`\nfiles ${files} · links ${links}`);
if (missed.length) console.log('NOT FOUND (the wrong slug no longer appears): ' + missed.join(', '));
console.log(APPLY ? 'applied' : 'dry run — nothing written. Re-run with --apply');
