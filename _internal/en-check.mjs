// Verify EN translations for given clusters. Usage: node _internal/en-check.mjs <cluster> [cluster...]
// Reads _en_todo.json (cluster -> [slugs]). Prints per-cluster status + final RESULT:OK / RESULT:FAIL.
import fs from 'node:fs';
const todo = JSON.parse(fs.readFileSync('_en_todo.json', 'utf8'));
const clusters = process.argv.slice(2);
let fail = 0;
for (const c of clusters) {
  const slugs = todo[c] || [];
  let ok = 0; const iss = [];
  for (const s of slugs) {
    const tp = 'astro/src/content/articles/' + s + '.json';
    const ep = 'astro/src/content/articles-en/' + s + '.json';
    if (!fs.existsSync(ep)) { iss.push(s + ':MISSING'); continue; }
    let th, en;
    try { th = JSON.parse(fs.readFileSync(tp)); en = JSON.parse(fs.readFileSync(ep)); }
    catch { iss.push(s + ':BADJSON'); continue; }
    ok++;
    if (en.slug !== th.slug) iss.push(s + ':slug');
    if (en.cluster !== th.cluster) iss.push(s + ':cluster');
    if (en.crumbCityHref !== th.crumbCityHref) iss.push(s + ':crumbHref');
    if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) iss.push(s + ':keys');
    if ((th.blocks || []).map(b => b.kind).join() !== (en.blocks || []).map(b => b.kind).join()) iss.push(s + ':blocks');
    if (/[ก-฾เ-๛]/.test(en.title)) iss.push(s + ':thaiTitle'); // Thai letters, excluding ฿ (U+0E3F baht symbol, valid in EN)
  }
  if (iss.length) fail++;
  console.log(`${c}: ${ok}/${slugs.length}${iss.length ? ' ISSUES: ' + iss.slice(0, 6).join(' ') : ' ok'}`);
}
console.log(fail ? 'RESULT:FAIL' : 'RESULT:OK');
process.exit(fail ? 1 : 0);
