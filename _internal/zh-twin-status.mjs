// Progress report for the TH->ZH mass translation (6,578 files across 3 collections).
// Stateless by design: recomputed from disk every run (no manifest to go stale).
// A file counts as "done" only if a ZH twin exists AND passes validate-zh-twin.mjs.
// Usage: node _internal/zh-twin-status.mjs [--pending articles|reviews|roundups]   (list remaining filenames for a collection)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const COLLS = ['articles', 'reviews', 'roundups'];
const arg = process.argv[2];

function listFiles(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];
}

if (arg === '--pending') {
  const coll = process.argv[3];
  if (!COLLS.includes(coll)) { console.error('usage: --pending articles|reviews|roundups'); process.exit(2); }
  const thFiles = listFiles(path.join(ROOT, `astro/src/content/${coll}`));
  const zhDir = path.join(ROOT, `astro/src/content/${coll}-zh`);
  const pending = thFiles.filter(f => !fs.existsSync(path.join(zhDir, f)));
  console.log(pending.join('\n'));
  console.error(`\n(${pending.length} pending of ${thFiles.length} total)`);
  process.exit(0);
}

let grandTotal = 0, grandDone = 0;
for (const coll of COLLS) {
  const thFiles = listFiles(path.join(ROOT, `astro/src/content/${coll}`));
  const zhDir = path.join(ROOT, `astro/src/content/${coll}-zh`);
  const zhFiles = new Set(listFiles(zhDir));
  const written = thFiles.filter(f => zhFiles.has(f));
  console.log(`${coll}: ${thFiles.length} TH source · ${written.length} ZH twins written · ${thFiles.length - written.length} pending`);
  grandTotal += thFiles.length; grandDone += written.length;
}
console.log(`\nTOTAL: ${grandDone}/${grandTotal} written (${grandTotal - grandDone} pending) — note: "written" ≠ "validated"; run validate-zh-twin.mjs to check quality/structure.`);
