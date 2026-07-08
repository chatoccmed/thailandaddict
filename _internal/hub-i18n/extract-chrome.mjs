// Extract tx('th','en') chrome-string pairs from gen-hubs.mjs into a th/en dict
// keyed by the EN string (the key the 9-way tx() lookup will use).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const src = fs.readFileSync(path.join(ROOT, '_internal', 'gen-hubs.mjs'), 'utf8');

// parse a JS string literal starting at index i (src[i] is the opening quote).
// returns {value, end} or null. handles ' " ` with backslash escapes.
function parseStr(s, i) {
  const q = s[i];
  if (q !== "'" && q !== '"' && q !== '`') return null;
  let out = '', j = i + 1;
  while (j < s.length) {
    const c = s[j];
    if (c === '\\') { out += c + s[j + 1]; j += 2; continue; }
    if (c === q) return { value: out, end: j };
    out += c; j++;
  }
  return null;
}
// unescape a JS single/double/backtick literal body into the real string
function unescape(lit) {
  return lit.replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
}

const pairs = {}; // en -> th
let count = 0, skipped = 0;
const re = /tx\(/g; let m;
while ((m = re.exec(src))) {
  let i = m.index + 3; // after 'tx('
  while (' \n\t'.includes(src[i])) i++;
  const a = parseStr(src, i);
  if (!a) { skipped++; continue; }
  let k = a.end + 1;
  while (' \n\t'.includes(src[k])) k++;
  if (src[k] !== ',') { skipped++; continue; }
  k++;
  while (' \n\t'.includes(src[k])) k++;
  const b = parseStr(src, k);
  if (!b) { skipped++; continue; }
  const th = unescape(a.value), en = unescape(b.value);
  count++;
  if (!(en in pairs)) pairs[en] = th;
}
fs.writeFileSync(path.join(HERE, '_strings.json'), JSON.stringify(pairs, null, 2));
console.log(`tx() calls parsed: ${count}, skipped(non-literal): ${skipped}, unique EN keys: ${Object.keys(pairs).length}`);
