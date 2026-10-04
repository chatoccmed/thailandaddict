/* The Booking.com affiliate button was labelled "Reservation" in three locales.

   The hub cards carry three booking buttons side by side — Agoda, Booking,
   Trip.com. localize.mjs translated the snapshots from the English DOM through
   a context-free memory, and that memory maps the word "Booking" to the noun:
   "Бронирование" (ru), "予約" (ja), "הזמנה" (he). So on 890 buttons per locale
   the reader saw "Agoda · Reservation · Trip.com" and could not tell that the
   middle one goes to Booking.com — on a paid link.

   Rewrites the label only on anchors whose href is the /go/b Booking.com
   route, and only when the label is exactly the mistranslated word. Then sets
   the memory entry to the brand, so the next localize.mjs run keeps it.
   Idempotent. Writes by default; --dry reports. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const APPLY = !process.argv.includes('--dry');
const WRONG = { ru: 'Бронирование', ja: '予約', he: 'הזמנה' };

let total = 0;
for (const [lang, word] of Object.entries(WRONG)) {
  const dir = path.join(ROOT, 'astro/public', lang);
  const rx = new RegExp('(<a\\b[^>]*\\bhref="/go/b[^"]*"[^>]*>)' + word + '(</a>)', 'g');
  let n = 0, files = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    let hits = 0;
    const out = src.replace(rx, (_m, a, b) => { hits++; return a + 'Booking' + b; });
    if (!hits) continue;
    n += hits; files++;
    if (APPLY) {
      fs.writeFileSync(p + '.tmp', out, 'utf8');
      if (fs.readFileSync(p + '.tmp', 'utf8') !== out) { console.error('readback mismatch: ' + p); process.exit(1); }
      fs.renameSync(p + '.tmp', p);
    }
  }
  const tmPath = path.join(ROOT, '_internal/i18n', 'tm.' + lang + '.json');
  const tm = JSON.parse(fs.readFileSync(tmPath, 'utf8'));
  const before = tm.Booking;
  if (APPLY && before !== 'Booking') {
    tm.Booking = 'Booking';
    const out = JSON.stringify(tm, null, 2) + '\n';
    fs.writeFileSync(tmPath + '.tmp', out, 'utf8');
    fs.renameSync(tmPath + '.tmp', tmPath);
  }
  total += n;
  console.log(`  ${lang}  ${n} button(s) on ${files} page(s) "${word}" → "Booking" · memory: ${JSON.stringify(before)} → "Booking"` + (APPLY ? '' : ' (dry)'));
}
/* The Trip.com button, same defect, every locale: the memory maps "Trip" to
   行程 / План / 플랜 / プラン / प्लान / תוכנית / الخطة — "itinerary", "plan" —
   because the same English word is ALSO the app shell's trip tab, where that
   translation is right. So the memory entry is not touched here; only the
   label on sponsored anchors that point at trip.com, and only when it is
   exactly the memory's translation of "Trip". */
/* The words as they actually stand on the pages (survey, 2026-10-04). Not read
   from the memory: tm.<lang>.Trip has since been corrected to "Trip", but the
   891 snapshot buttons per locale were written before that and never
   regenerated — which is exactly why reading the memory found nothing. */
const TRIP_WRONG = { zh: '行程', ru: 'План', ko: '플랜', ja: 'プラン', hi: 'प्लान', he: 'תוכנית', ar: 'الخطة' };
for (const [lang, word] of Object.entries(TRIP_WRONG)) {
  const wordRx = word.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m);
  const rx = new RegExp('(<a\\b(?=[^>]*\\bhref="https?://[a-z.]*trip\\.com[^"]*")(?=[^>]*\\bsponsored\\b)[^>]*>)' + wordRx + '(</a>)', 'g');
  const dir = path.join(ROOT, 'astro/public', lang);
  let n = 0, files = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    let hits = 0;
    const out = src.replace(rx, (_m, a, b) => { hits++; return a + 'Trip' + b; });
    if (!hits) continue;
    n += hits; files++;
    if (APPLY) {
      fs.writeFileSync(p + '.tmp', out, 'utf8');
      if (fs.readFileSync(p + '.tmp', 'utf8') !== out) { console.error('readback mismatch: ' + p); process.exit(1); }
      fs.renameSync(p + '.tmp', p);
    }
  }
  total += n;
  console.log(`  ${lang}  ${n} Trip.com button(s) on ${files} page(s) "${word}" → "Trip"` + (APPLY ? '' : ' (dry)'));
}

console.log(`\n${total} button label(s) ` + (APPLY ? 'restored' : 'would be restored (--dry)'));
