// Fix a systematic translator mistake: for dynamic keys like "Explore ${nm}",
// several translators copied the placeholder NAME from the Thai reference value
// (which uses a different variable name, e.g. "${th}") instead of the English
// key's own placeholder ("${nm}"). Since dict keys are the source of truth and
// the mismatch is always exactly N-missing/N-extra per key, do a deterministic
// per-key rename (extra -> missing) rather than a blanket global replace.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const all = JSON.parse(fs.readFileSync(path.join(HERE, '_strings.json'), 'utf8'));
const dynKeys = Object.keys(all).filter(k => /\$\{/.test(k));

for (const lang of process.argv.slice(2)) {
  const file = path.join(HERE, lang + '.json');
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  let fixed = 0, unresolved = 0;
  for (const k of dynKeys) {
    const kphs = [...k.matchAll(/\$\{([^}]+)\}/g)].map(m => m[1]);
    let val = d[k] || '';
    const vphs = [...val.matchAll(/\$\{([^}]+)\}/g)].map(m => m[1]);
    const missing = kphs.filter(p => !vphs.includes(p));
    const extra = vphs.filter(p => !kphs.includes(p));
    if (!missing.length) continue;
    if (missing.length === extra.length) {
      for (let i = 0; i < missing.length; i++) val = val.split('${' + extra[i] + '}').join('${' + missing[i] + '}');
      d[k] = val;
      fixed++;
    } else {
      console.log(`  UNRESOLVED [${lang}]: ${JSON.stringify(k)} missing=${missing} extra=${extra}`);
      unresolved++;
    }
  }
  fs.writeFileSync(file, JSON.stringify(d, null, 2));
  console.log(`[${lang}] fixed:${fixed} unresolved:${unresolved}`);
}
