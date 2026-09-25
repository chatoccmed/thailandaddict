/* Re-extract the Thailand subset of the owner's Agoda partner feed. The zip is
   2.8 GB of CSV for every country; only the Thai rows are useful here, and only
   a few columns of them. Streamed through unzip -p so nothing is written to
   disk twice. Output: one json object per line, the shape
   find-missing-ota-links.mjs already expects. */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import readline from 'node:readline';

const ZIP = 'C:/Users/Imac/Downloads/56A3C1A2-0531-49F3-8720-D7D4B1410E41_TH.zip';
const OUT = path.resolve(import.meta.dirname, 'cache/agoda-th.jsonl');
fs.mkdirSync(path.dirname(OUT), { recursive: true });

/* a CSV line splitter that respects quotes - hotel names contain commas */
function splitCsv(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const KEEP = ['hotel_id', 'hotel_name', 'hotel_formerly_name', 'hotel_translated_name',
  'city', 'state', 'country', 'star_rating', 'longitude', 'latitude', 'url'];

const p = spawn('unzip', ['-p', ZIP], { stdio: ['ignore', 'pipe', 'inherit'] });
const rl = readline.createInterface({ input: p.stdout, crlfDelay: Infinity });
const ws = fs.createWriteStream(OUT);

let head = null, idx = null, n = 0, kept = 0;
const t0 = process.hrtime.bigint();
for await (const line of rl) {
  if (!line) continue;
  if (!head) {
    head = splitCsv(line.replace(/^\uFEFF/, ''));
    idx = Object.fromEntries(KEEP.map((k) => [k, head.indexOf(k)]));
    const missing = KEEP.filter((k) => idx[k] < 0);
    if (missing.length) { console.error('missing columns: ' + missing.join(', ')); process.exit(1); }
    const ci = head.indexOf('country');
    idx.__country = head.indexOf('countryisocode');
    continue;
  }
  n++;
  // cheap pre-filter before paying for the split
  if (!line.includes(',TH,')) continue;
  const f = splitCsv(line);
  if (f[idx.__country] !== 'TH') continue;
  const o = {};
  for (const k of KEEP) o[k] = f[idx[k]];
  ws.write(JSON.stringify(o) + '\n');
  kept++;
  if (kept % 20000 === 0) console.log('  kept ' + kept + ' of ' + n + ' rows read');
}
ws.end();
console.log('rows read ' + n + ' · Thailand rows kept ' + kept +
  ' · ' + Math.round(Number(process.hrtime.bigint() - t0) / 1e9) + ' s');
console.log('-> ' + OUT);
