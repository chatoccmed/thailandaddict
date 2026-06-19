#!/usr/bin/env node
// Apply deep-audit verdicts to the QA ledger. Usage: node apply-verdicts.mjs <verdicts.json>
// verdicts.json = { cluster, verdicts:[{slug,real,open,dataOk,imageOk,issue,severity}] }
// All-OK (real&&open&&dataOk&&imageOk) → status='checked', dims.data=true, dims.image=true (unless already 'onerror').
// Any fail → status='issue', dims set to the failing flag, notes=issue (collected for fix/owner).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const LEDGER = path.join(ROOT, '_internal/qa/qa-ledger.json');
const V = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
const byFile = new Map(L.items.map(it => [it.file, it]));
let checked = 0; const issues = [];
for (const v of (V.verdicts || [])) {
  if (String(v.slug).startsWith('__batch')) { if (v.issue) console.error('BATCH ERROR:', v.issue); continue; }
  const it = byFile.get(v.slug + '.json'); if (!it) { console.error('not in ledger:', v.slug); continue; }
  const allOk = v.real && v.open && v.dataOk && v.imageOk;
  it.dims.data = v.dataOk && v.real && v.open;
  if (it.dims.image !== 'onerror') it.dims.image = v.imageOk ? true : false;
  it.date = '2026-06-19';
  if (allOk) { it.status = 'checked'; it.notes = ''; checked++; }
  else { it.status = 'issue'; it.notes = `deep:${v.severity || '?'}:${v.issue || 'fail'}`; issues.push({ slug: v.slug, severity: v.severity, issue: v.issue, real: v.real, open: v.open, dataOk: v.dataOk, imageOk: v.imageOk }); }
}
fs.writeFileSync(LEDGER, JSON.stringify(L, null, 0));
const c = {}; for (const it of L.items) c[it.status] = (c[it.status] || 0) + 1;
console.log(`applied ${V.cluster}: checked +${checked}, issues ${issues.length}`);
if (issues.length) console.log('ISSUES:\n  ' + issues.map(i => `[${i.severity}] ${i.slug} — ${i.issue} (real=${i.real} open=${i.open} data=${i.dataOk} img=${i.imageOk})`).join('\n  '));
console.log('ledger status:', JSON.stringify(c));
