// Verify EN translations for reviews OR roundups.
// Usage:
//   node _internal/en-check-reviews.mjs reviews  <cluster...>   (reads _en_rev_todo.json)
//   node _internal/en-check-reviews.mjs roundups <group...>     (reads _en_ro_todo.json)
// Reads todo (group -> [slugs]). Auto-fixes BOM + extra keys. Prints per-group status + RESULT:OK / RESULT:FAIL.
import fs from 'node:fs';

const coll = process.argv[2];                       // 'reviews' | 'roundups'
if (coll !== 'reviews' && coll !== 'roundups') { console.error('first arg must be reviews|roundups'); process.exit(2); }
const groups = process.argv.slice(3);
const todoPath = coll === 'reviews' ? '_en_rev_todo.json' : '_en_ro_todo.json';
const todo = JSON.parse(fs.readFileSync(todoPath, 'utf8'));
const thDir = `astro/src/content/${coll}/`;
const enDir = `astro/src/content/${coll}-en/`;
const THAI = /[ก-ฺเ-๛]/;        // Thai letters, excludes ฿ (U+0E3F baht symbol)

// arrays whose length must match TH (structure parity)
const ARRAYS = coll === 'reviews'
  ? ['body', 'highlights', 'ratingBars', 'rooms', 'tips', 'info', 'nearby', 'related', 'faq', 'gallery', 'honestChecks']
  : ['heroStats', 'breadcrumb', 'breadcrumbSchema', 'toc', 'entries', 'compareCols', 'compareRows', 'advice', 'faq'];
// image-path fields that must stay byte-identical to TH
const IMGS = coll === 'reviews'
  ? ['image', 'heroImg', 'heroSub1', 'heroSub2', 'mapImg', 'gallery']
  : ['image', 'heroImg'];

function stripBom(p) {
  const buf = fs.readFileSync(p);
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) { fs.writeFileSync(p, buf.slice(3)); return true; }
  return false;
}

let fail = 0;
for (const g of groups) {
  const slugs = todo[g] || [];
  let ok = 0; const iss = [];
  for (const s of slugs) {
    const tp = thDir + s + '.json';
    const ep = enDir + s + '.json';
    if (!fs.existsSync(ep)) { iss.push(s + ':MISSING'); continue; }
    stripBom(ep);
    let th, en;
    try { th = JSON.parse(fs.readFileSync(tp)); en = JSON.parse(fs.readFileSync(ep)); }
    catch (e) { iss.push(s + ':BADJSON'); continue; }

    // auto-remove extra keys the agent invented
    const thK = new Set(Object.keys(th));
    const extra = Object.keys(en).filter(k => !thK.has(k));
    if (extra.length) { extra.forEach(k => delete en[k]); fs.writeFileSync(ep, JSON.stringify(en, null, 2)); }

    ok++;
    if (en.slug !== th.slug) iss.push(s + ':slug');
    if (coll === 'reviews' && en.cluster !== th.cluster) iss.push(s + ':cluster');
    if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) iss.push(s + ':keys');
    // array length parity
    for (const a of ARRAYS) {
      if (Array.isArray(th[a]) && (!Array.isArray(en[a]) || en[a].length !== th[a].length)) iss.push(s + ':' + a + 'Len');
    }
    // image paths identical
    for (const im of IMGS) {
      if (JSON.stringify(th[im]) !== JSON.stringify(en[im])) iss.push(s + ':img:' + im);
    }
    // no Thai in SEO-critical fields
    if (THAI.test(en.title || '')) iss.push(s + ':thaiTitle');
    if (THAI.test(en.metaDesc || '')) iss.push(s + ':thaiMeta');
    if (THAI.test(en.h1 || '')) iss.push(s + ':thaiH1');
    // /en/ link rules
    if (coll === 'reviews') {
      if (th.parentCrumbUrl && !(en.parentCrumbUrl || '').includes('/en/')) iss.push(s + ':parentCrumbUrl!/en/');
    } else {
      const b0 = en.breadcrumb && en.breadcrumb[0];
      if (b0 && b0.href !== '/en/') iss.push(s + ':bc0!/en/');
      const bs = en.breadcrumbSchema || [];
      if (bs.some(x => x && typeof x.item === 'string' && x.item.includes('thailandaddict.com') && !x.item.includes('/en/')))
        iss.push(s + ':bcSchema!/en/');
    }
  }
  if (iss.length) fail++;
  console.log(`${g}: ${ok}/${slugs.length}${iss.length ? ' ISSUES: ' + iss.slice(0, 8).join(' ') : ' ok'}`);
}
console.log(fail ? 'RESULT:FAIL' : 'RESULT:OK');
process.exit(fail ? 1 : 0);
