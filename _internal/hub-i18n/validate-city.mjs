// Validate translated city data files against their English source:
// parses, key-parity, array lengths, and structural fields (slug/neighbors/
// heroEmoji/attractions[].kind) unchanged. Usage: node validate-city.mjs <lang> [slug...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const EN = path.join(ROOT, '_internal', 'province-data-en');
const lang = process.argv[2];
if (!lang) { console.error('usage: validate-city.mjs <lang> [slug...]'); process.exit(1); }
const DIR = path.join(ROOT, '_internal', 'province-data-' + lang);
let slugs = process.argv.slice(3);
if (!slugs.length) slugs = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : [];

let ok = 0, bad = 0;
for (const slug of slugs) {
  const errs = [];
  const ef = path.join(EN, slug + '.json'), tf = path.join(DIR, slug + '.json');
  if (!fs.existsSync(tf)) { console.log(`✗ ${slug}: file missing`); bad++; continue; }
  let en, tr;
  try { en = JSON.parse(fs.readFileSync(ef, 'utf8')); } catch { console.log(`✗ ${slug}: EN unparseable`); bad++; continue; }
  try { tr = JSON.parse(fs.readFileSync(tf, 'utf8')); } catch (e) { console.log(`✗ ${slug}: INVALID JSON — ${e.message}`); bad++; continue; }
  const ek = Object.keys(en).sort().join(','), tk = Object.keys(tr).sort().join(',');
  if (ek !== tk) errs.push(`keys differ (en:[${ek}] tr:[${tk}])`);
  if (tr.slug !== en.slug) errs.push(`slug changed: ${tr.slug}`);
  if (JSON.stringify(tr.neighbors) !== JSON.stringify(en.neighbors)) errs.push('neighbors changed');
  if (tr.heroEmoji !== en.heroEmoji) errs.push('heroEmoji changed');
  for (const arr of ['highlights', 'foodScene', 'attractions', 'itineraryIdeas']) {
    if (Array.isArray(en[arr]) && (!Array.isArray(tr[arr]) || tr[arr].length !== en[arr].length))
      errs.push(`${arr} length ${(tr[arr]||[]).length}≠${en[arr].length}`);
  }
  if (Array.isArray(en.attractions) && Array.isArray(tr.attractions)) {
    for (let i = 0; i < en.attractions.length; i++)
      if (tr.attractions[i] && tr.attractions[i].kind !== en.attractions[i].kind)
        errs.push(`attractions[${i}].kind changed`);
  }
  // untranslated check: value identical to EN for a long text field usually means skipped
  if (tr.introHtml && tr.introHtml === en.introHtml && lang !== 'en') errs.push('introHtml NOT translated (== EN)');
  if (errs.length) { console.log(`✗ ${slug}: ${errs.join('; ')}`); bad++; }
  else { ok++; }
}
console.log(`\n[${lang}] ok:${ok} bad:${bad} / ${slugs.length}`);
process.exit(bad ? 1 : 0);
