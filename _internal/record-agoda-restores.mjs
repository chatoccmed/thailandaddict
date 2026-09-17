/* Record, in pin-fixes.json, the pins the Agoda import brought back.

   pin-fixes.json is the ledger of every pin decision, and after the import of
   2026-09-17 it disagreed with the world: 100 hotels it recorded as dropped had
   a pin again. live-verify-moves read those drops and failed 158 checks while
   describing nothing that was actually wrong.

   A restore is a real decision and deserves its own entry rather than an edit
   to the drop that came before - the drop was correct when it was made, and
   erasing it would erase the reason the hotel had no pin for a day. Each entry
   carries the coordinate that was removed (pos), the coordinate that replaced
   it (to), and the evidence the new one passed.

   Usage: node _internal/record-agoda-restores.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const BATCH = '2026-09-17-agoda-feed-restore';

const PF = path.join(ROOT, '_internal/pin-fixes.json');
const raw = fs.readFileSync(PF, 'utf8');
const fixes = JSON.parse(raw);
const store = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/hotel-coords.json'), 'utf8'));

/* the last decision per slug is the one that describes the world */
const latest = new Map();
for (const e of fixes) if (e.kind === 'reviews') latest.set(e.slug, e);

const add = [];
for (const [slug, v] of Object.entries(store)) {
  if (!v || v.via !== 'agoda' || !Number.isFinite(v.lat)) continue;
  const last = latest.get(slug);
  if (!last || last.action !== 'drop') continue;          /* nothing to supersede */
  if (last.batch === BATCH) continue;                     /* already recorded */
  const ownerDecided = /owner decision/i.test(String(last.evidence || ''));
  add.push({
    batch: BATCH,
    action: 'restore',
    kind: 'reviews',
    slug,
    at: '(root)',
    pos: last.pos || '',
    to: `${v.lat},${v.lng}`,
    prov: v.prov || last.prov || '',
    name: v.agodaName || last.name || '',
    rule: 'agoda-feed-validated',
    evidence: `Restored ${new Date().toISOString().slice(0, 10)} from the owner's Agoda partner feed. ${String(v.q || '').replace(/^.*?— /, '')}. This supersedes the drop recorded in batch ${last.batch}, which removed a DIFFERENT and wrong coordinate: ${String(last.evidence || '').slice(0, 220)}${ownerDecided ? ' — that drop was the owner’s own decision; the owner ruled on 2026-09-17 that a validated coordinate from another source may supersede a deletion, since the decision was that the pin was wrong, not that the hotel may never have one.' : ''}`,
  });
}

const owner = add.filter((e) => /owner’s own decision/.test(e.evidence));
console.log(`agoda pins whose latest ledger entry is a drop: ${add.length}`);
console.log(`  of those, drops the owner decided personally : ${owner.length}`);
for (const e of owner) console.log(`    ${e.slug.replace(/^review-/, '')}  ${e.pos} -> ${e.to}`);
if (!APPLY) { console.log('\ndry run — nothing written. Re-run with --apply'); process.exit(0); }

fixes.push(...add);
fs.writeFileSync(PF, serializeLike(raw, fixes).text);
console.log(`\nappended ${add.length} restore entry(ies) · pin-fixes.json now ${fixes.length} entries`);
