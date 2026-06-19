#!/usr/bin/env node
// Build/refresh the Phase-A QA ledger: one row per content item (review/roundup/article),
// tracking per-dimension check status. Status-PRESERVING (re-run keeps existing marks).
// Usage: node _internal/qa/build-ledger.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const LEDGER = path.join(ROOT, '_internal/qa/qa-ledger.json');
const SRC = [
  ['review', 'astro/src/content/reviews'],
  ['roundup', 'astro/src/content/roundups'],
  ['article', 'astro/src/content/articles'],
];
const fnameCluster = f => (f.match(/-([a-z-]+)\.json$/) || [])[1] || '';

const prev = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : { items: [] };
const prevByKey = new Map((prev.items || []).map(r => [r.kind + ':' + r.file, r]));

const items = [];
for (const [kind, dir] of SRC) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter(x => x.endsWith('.json')).sort()) {
    let cluster = '';
    try { cluster = JSON.parse(fs.readFileSync(path.join(abs, f), 'utf8')).cluster || fnameCluster(f); } catch { cluster = fnameCluster(f); }
    const key = kind + ':' + f;
    const old = prevByKey.get(key);
    items.push(old || {
      file: f, kind, cluster,
      status: 'unchecked',                 // unchecked | checked | fixed | issue
      dims: { data: null, template: null, image: null, writing: null }, // null=not-checked, true=pass, false=fail/fixed
      notes: '', date: '',
    });
    if (old) old.cluster = cluster; // refresh cluster
  }
}
const out = { built: prev.built || null, items };
fs.writeFileSync(LEDGER, JSON.stringify(out, null, 0));

// summary
const byStatus = {}, byClusterUnchecked = {};
for (const it of items) {
  byStatus[it.status] = (byStatus[it.status] || 0) + 1;
  if (it.status === 'unchecked') byClusterUnchecked[it.cluster] = (byClusterUnchecked[it.cluster] || 0) + 1;
}
console.log(`QA ledger: ${items.length} items`);
console.log('by status:', JSON.stringify(byStatus));
console.log('by kind:', JSON.stringify(SRC.reduce((a, [k]) => (a[k] = items.filter(i => i.kind === k).length, a), {})));
const topUn = Object.entries(byClusterUnchecked).sort((a, b) => b[1] - a[1]).slice(0, 12);
console.log('top unchecked clusters:', topUn.map(([c, n]) => c + ':' + n).join('  '));
