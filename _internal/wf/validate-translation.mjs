// Generalized translation validator for any target-language content collection.
// Usage: node _internal/wf/validate-translation.mjs <lang> [listFile]
//   <lang>     e.g. en, zh, ru — validates astro/src/content/articles-<lang>/ against articles/ (TH source)
//   [listFile] optional JSON array of filenames to check (default: every file in the TH source dir)
// Checks: existence, valid JSON, zero source-script leaks (Thai chars for any target lang),
//         schema parity (slug/type/cluster + block count) vs the TH source.
// Exceptions: credit/heroCredit (photographer names may stay Thai) + URL fields (Wikimedia/Maps
//             URLs legitimately contain Thai). Writes report to _internal/wf/validation-<lang>.json
import fs from 'node:fs';

const lang = process.argv[2];
if (!lang) { console.error('usage: validate-translation.mjs <lang> [listFile]'); process.exit(1); }
const listFile = process.argv[3];

const THDIR = 'astro/src/content/articles/';
const OUTDIR = `astro/src/content/articles-${lang}/`;
const THAI_RE = /[ก-฾เ-๛]/; // Thai block minus ฿ (U+0E3F, allowed currency symbol)
const CREDIT_KEYS = new Set(['credit', 'heroCredit']);
const URL_KEYS = new Set(['creditHref', 'heroCreditHref', 'href', 'src', 'img', 'image', 'heroImg', 'bookHref', 'ctaHref', 'agodaUrl', 'bookingUrl', 'tripUrl', 'mapHref']);

const todo = listFile
  ? JSON.parse(fs.readFileSync(listFile, 'utf8'))
  : fs.readdirSync(THDIR).filter(f => f.endsWith('.json'));

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
  const outPath = OUTDIR + file;
  if (!fs.existsSync(outPath)) { missing.push(file); continue; }
  let out, th;
  try { out = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch (e) { badJson.push(file + ' :: ' + e.message.slice(0, 80)); continue; }
  try { th = JSON.parse(fs.readFileSync(THDIR + file, 'utf8')); } catch { th = null; }
  const leaks = [];
  findThaiLeaks(out, [], leaks);
  if (leaks.length) { hasThai.push(file + ' :: ' + leaks.slice(0, 3).join(' | ')); continue; }
  if (th) {
    const problems = [];
    if (out.slug !== th.slug) problems.push('slug mismatch');
    if (out.type !== th.type) problems.push('type mismatch');
    if (out.cluster !== th.cluster) problems.push('cluster mismatch');
    if ((out.blocks || []).length !== (th.blocks || []).length) problems.push(`blocks ${(out.blocks||[]).length} vs ${(th.blocks||[]).length}`);
    if (problems.length) { mismatch.push(file + ' :: ' + problems.join(', ')); continue; }
  }
  ok.push(file);
}

console.log(`[${lang}] total expected:`, todo.length);
console.log('ok:', ok.length);
console.log('missing (not written yet):', missing.length);
console.log('bad JSON:', badJson.length);
console.log('contains Thai script (excl. credit names + URLs):', hasThai.length);
console.log('schema mismatch:', mismatch.length);
for (const [label, arr] of [['badJson', badJson], ['hasThai', hasThai], ['mismatch', mismatch]]) {
  if (arr.length) { console.log(`\n--- ${label} (first 15) ---`); arr.slice(0, 15).forEach(x => console.log('  ' + x)); }
}
if (missing.length) { console.log('\n--- missing (first 15) ---'); missing.slice(0, 15).forEach(x => console.log('  ' + x)); }

fs.writeFileSync(`_internal/wf/validation-${lang}.json`, JSON.stringify({ ok: ok.length, missing, badJson, hasThai, mismatch }, null, 1));
