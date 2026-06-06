// Lint TH content for banned "AI words" (v2-clean rule). Reusable, province-agnostic.
// Usage: node _internal/lint-content.mjs [clusterPrefix]
//   no arg  -> scan all
//   arg     -> only files whose slug/cluster starts with the prefix (e.g. "bangkok")
// Exit code 1 if any banned word found (so it can gate a build).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..'); // repo root (resolves wherever cloned)
// Unambiguous AI/marketing words (no Thai false-positive risk — all multi-syllable, distinctive)
const BANNED = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'สุดยอด', 'อันซีน'];
// Proper-noun exceptions (real business/place names) — stripped before counting so the
// banned substring inside a genuine name doesn't trip the gate. Add entries as discovered.
const ALLOW = ['สุดยอดเนื้อตุ๋น'];
const DIRS = ['astro/src/content/articles', 'astro/src/content/reviews', 'astro/src/content/roundups'];
const onlyCluster = process.argv[2] || null;

let hits = [];
for (const d of DIRS) {
  const dir = path.join(ROOT, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
    let raw = fs.readFileSync(path.join(dir, f), 'utf8');
    let cluster = '';
    try { cluster = (JSON.parse(raw).cluster) || ''; } catch {}
    if (onlyCluster && !(f.startsWith(onlyCluster) || cluster === onlyCluster)) continue;
    for (const a of ALLOW) raw = raw.split(a).join('');  // strip proper-noun exceptions
    for (const w of BANNED) {
      let i = 0, n = 0;
      while ((i = raw.indexOf(w, i)) !== -1) { n++; i += w.length; }
      if (n) hits.push({ file: `${d}/${f}`, word: w, count: n });
    }
  }
}
if (!hits.length) { console.log(`✓ lint clean${onlyCluster ? ' for ' + onlyCluster : ''} — no banned AI words`); process.exit(0); }
const byFile = {};
for (const h of hits) (byFile[h.file] ??= []).push(`${h.word}×${h.count}`);
console.log(`✗ banned AI words in ${Object.keys(byFile).length} file(s):`);
for (const [file, ws] of Object.entries(byFile)) console.log(`  ${file}  →  ${ws.join(', ')}`);
process.exit(1);
