// Validate translated Klook EN articles: existence, valid JSON, zero Thai script
// (except legitimate photographer names inside credit/heroCredit fields, an
// established site convention), schema-critical fields intact (slug/type/cluster
// match TH source, same block count).
import fs from 'node:fs';

const todo = JSON.parse(fs.readFileSync('_internal/wf/klook-files-only.json', 'utf8'));
const THDIR = 'astro/src/content/articles/';
const ENDIR = 'astro/src/content/articles-en/';
const THAI_RE = /[ก-฾เ-๛]/; // Thai block minus ฿ (U+0E3F, allowed currency symbol per rules)
const CREDIT_KEYS = new Set(['credit', 'heroCredit']); // photographer names may legitimately stay in Thai script
const URL_KEYS = new Set(['creditHref', 'heroCreditHref', 'href', 'src', 'img', 'image', 'heroImg', 'bookHref', 'ctaHref', 'agodaUrl', 'bookingUrl', 'tripUrl', 'mapHref']); // URLs may legitimately contain Thai script (e.g. Wikimedia filenames, Google Maps search queries)

function findThaiLeaks(node, path, out) {
  if (typeof node === 'string') {
    if (THAI_RE.test(node)) {
      const key = path[path.length - 1];
      if (!CREDIT_KEYS.has(key) && !URL_KEYS.has(key)) out.push(path.join('.') + ' :: ' + node.slice(0, 80));
    }
    return;
  }
  if (Array.isArray(node)) { node.forEach((v, i) => findThaiLeaks(v, [...path, i], out)); return; }
  if (node && typeof node === 'object') { for (const k in node) findThaiLeaks(node[k], [...path, k], out); }
}

const missing = [], badJson = [], hasThai = [], mismatch = [], ok = [];

for (const file of todo) {
  const enPath = ENDIR + file;
  if (!fs.existsSync(enPath)) { missing.push(file); continue; }
  let en, th;
  try { en = JSON.parse(fs.readFileSync(enPath, 'utf8')); } catch (e) { badJson.push(file + ' :: ' + e.message.slice(0, 80)); continue; }
  try { th = JSON.parse(fs.readFileSync(THDIR + file, 'utf8')); } catch { th = null; }
  const leaks = [];
  findThaiLeaks(en, [], leaks);
  if (leaks.length) { hasThai.push(file + ' :: ' + leaks.slice(0, 3).join(' | ')); continue; }
  if (th) {
    const problems = [];
    if (en.slug !== th.slug) problems.push('slug mismatch');
    if (en.type !== th.type) problems.push('type mismatch');
    if (en.cluster !== th.cluster) problems.push('cluster mismatch');
    if ((en.blocks || []).length !== (th.blocks || []).length) problems.push(`blocks ${(en.blocks||[]).length} vs ${(th.blocks||[]).length}`);
    if (problems.length) { mismatch.push(file + ' :: ' + problems.join(', ')); continue; }
  }
  ok.push(file);
}

console.log('total expected:', todo.length);
console.log('ok:', ok.length);
console.log('missing (not written yet):', missing.length);
console.log('bad JSON:', badJson.length);
console.log('contains Thai script (excl. credit names):', hasThai.length);
console.log('schema mismatch:', mismatch.length);
for (const [label, arr] of [['badJson', badJson], ['hasThai', hasThai], ['mismatch', mismatch]]) {
  if (arr.length) { console.log(`\n--- ${label} (first 15) ---`); arr.slice(0, 15).forEach(x => console.log('  ' + x)); }
}
if (missing.length) { console.log('\n--- missing (first 15) ---'); missing.slice(0, 15).forEach(x => console.log('  ' + x)); }

fs.writeFileSync('_internal/wf/klook-en-validation.json', JSON.stringify({ ok: ok.length, missing, badJson, hasThai, mismatch }, null, 1));
