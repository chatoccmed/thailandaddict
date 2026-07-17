// Apply {file, old, new, reason} findings from the native-review workflow as
// exact-string patches. Safety: only applies when `old` appears EXACTLY ONCE in
// the file (otherwise logs it as ambiguous/not-found for manual attention —
// never blind-replaces on a non-unique or missing match).
import fs from 'node:fs';

const findingsPath = process.argv[2];
if (!findingsPath) { console.error('usage: apply-findings.mjs <findings.json>'); process.exit(1); }
const findings = JSON.parse(fs.readFileSync(findingsPath, 'utf8'));

let applied = 0, notFound = 0, ambiguous = 0, jsonBroken = 0;
const byFile = new Map();
for (const f of findings) { if (!byFile.has(f.file)) byFile.set(f.file, []); byFile.get(f.file).push(f); }

for (const [file, items] of byFile) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { console.log(`✗ file missing: ${file}`); continue; }
  const before = text;
  for (const it of items) {
    const count = text.split(it.old).length - 1;
    if (count === 0) { console.log(`  NOT FOUND [${file}]: ${JSON.stringify(it.old.slice(0, 80))}`); notFound++; continue; }
    if (count > 1) { console.log(`  AMBIGUOUS (${count}x) [${file}]: ${JSON.stringify(it.old.slice(0, 80))}`); ambiguous++; continue; }
    text = text.split(it.old).join(it.new);
    applied++;
  }
  if (text !== before) {
    if (file.endsWith('.json')) {
      try { JSON.parse(text); } catch (e) { console.log(`  ✗ JSON BROKEN after patch, reverted [${file}]: ${e.message}`); jsonBroken++; continue; }
    }
    fs.writeFileSync(file, text);
  }
}
console.log(`\napplied:${applied} notFound:${notFound} ambiguous:${ambiguous} jsonBroken:${jsonBroken} / total:${findings.length}`);
