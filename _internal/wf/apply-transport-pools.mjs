// De-duplicate transport images across getting-around-*.json (TH + EN).
// Reads: _internal/wf/transport-dupes.json (dupe URL → provinces)
//        _internal/wf/transport-pools.json (type → verified CC alternates)
// Strategy: per dupe URL, keep the original for ≤2 provinces (prefer a province the
// original filename mentions), assign alternates round-robin (cap 3 uses each),
// force province-matched alternates when the alternate filename mentions the province.
// Updates img/src + credit + creditHref together. TH/EN get the SAME assignment.
import fs from 'node:fs';

const dupes = JSON.parse(fs.readFileSync('_internal/wf/transport-dupes.json', 'utf8'));
const pools = JSON.parse(fs.readFileSync('_internal/wf/transport-pools.json', 'utf8')).pools;

// type classification for a dupe URL by filename keywords
const TYPE_RULES = [
  ['songthaew', /songthaew|สองแถว/i],
  ['tuk-tuk', /tuk[-_]?tuk/i],
  ['grab-motorcycle', /grab|motorcycle|motorbike|motosai/i],
  ['taxi', /taxi/i],
  ['bus-terminal', /terminal|airport/i],
  ['local-bus', /red_bus|city_bus|bus_in_.*town/i],
  ['intercity-bus', /nakhonchai|coach|intercity|bus/i],
  ['van-minibus', /commuter|hiace|minibus|van/i],
  ['bicycle', /bicycle|cycling/i],
  ['car-selfdrive', /car|daihatsu|nissan|almera|serena|mira|highway|road/i],
];
function typeOf(url) {
  const name = decodeURIComponent(url).split('/').pop();
  for (const [t, re] of TYPE_RULES) if (re.test(name)) return t;
  return null;
}
const poolByType = Object.fromEntries(pools.map(p => [p.type, p.images]));

// normalize province token for filename matching
const provWords = (p) => p.split('-').filter(w => w.length > 3);

// build per-dupe assignment: province → replacement image (or null = keep original)
const assignments = new Map(); // dupeURL -> Map(province -> imgObj|null)
const useCount = new Map();    // alternate src -> count (global per type pool member)
let unmatchedTypes = [];
for (const d of dupes) {
  const t = typeOf(d.img);
  const pool = t && poolByType[t] ? [...poolByType[t]] : null;
  if (!pool || !pool.length) { unmatchedTypes.push({ img: d.img.slice(-60), type: t }); continue; }
  const provs = [...d.provinces].sort();
  const map = new Map();
  const origName = decodeURIComponent(d.img).toLowerCase();
  // originals keep: provinces whose name appears in the original filename, else first 2
  const keep = provs.filter(p => provWords(p).some(w => origName.includes(w))).slice(0, 2);
  if (!keep.length) keep.push(provs[0], ...(provs.length > 1 ? [provs[1]] : []));
  for (const p of provs) {
    if (keep.includes(p)) { map.set(p, null); continue; }
    // province-matched alternate first
    let pick = pool.find(im => {
      const n = im.file.toLowerCase();
      return provWords(p).some(w => n.includes(w)) && (useCount.get(im.src) || 0) < 3;
    });
    if (!pick) {
      // least-used alternate
      pick = pool.slice().sort((a, b) => (useCount.get(a.src) || 0) - (useCount.get(b.src) || 0))[0];
    }
    if ((useCount.get(pick.src) || 0) >= 6) { map.set(p, null); continue; } // pool exhausted → keep original
    useCount.set(pick.src, (useCount.get(pick.src) || 0) + 1);
    map.set(p, pick);
  }
  assignments.set(d.img, map);
}
if (unmatchedTypes.length) console.log('no-pool (kept as-is):', JSON.stringify(unmatchedTypes.slice(0, 6)));

// apply to article JSONs
function creditOf(im) { return `ภาพ: ${im.author} · ${im.license}`; }
function hrefOf(im) { return 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(im.file); }

function walkSwap(node, dupeURL, im) {
  let n = 0;
  if (Array.isArray(node)) { for (const c of node) n += walkSwap(c, dupeURL, im); return n; }
  if (!node || typeof node !== 'object') return 0;
  for (const key of ['img', 'src', 'image', 'heroImg']) {
    if (node[key] === dupeURL) {
      node[key] = im.src; n++;
      if (typeof node.credit === 'string') node.credit = creditOf(im);
      if (typeof node.creditHref === 'string') node.creditHref = hrefOf(im);
      if (typeof node.imgCredit === 'string') node.imgCredit = creditOf(im);
      if (typeof node.imgCreditHref === 'string') node.imgCreditHref = hrefOf(im);
    }
  }
  for (const k in node) if (node[k] && typeof node[k] === 'object') n += walkSwap(node[k], dupeURL, im);
  return n;
}

let filesChanged = 0, swaps = 0;
for (const dir of ['astro/src/content/articles', 'astro/src/content/articles-en']) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.startsWith('getting-around-') || !f.endsWith('.json')) continue;
    const prov = f.replace('getting-around-', '').replace('.json', '');
    let j; try { j = JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8')); } catch { continue; }
    let changed = 0;
    for (const [dupeURL, map] of assignments) {
      const im = map.get(prov);
      if (!im) continue;
      changed += walkSwap(j, dupeURL, im);
    }
    if (changed) {
      fs.writeFileSync(dir + '/' + f, JSON.stringify(j, null, 2));
      filesChanged++; swaps += changed;
    }
  }
}
console.log(`files changed: ${filesChanged} · image slots swapped: ${swaps}`);

// post-verify: recount duplicates across getting-around TH
const use = new Map();
for (const f of fs.readdirSync('astro/src/content/articles')) {
  if (!f.startsWith('getting-around-') || !f.endsWith('.json')) continue;
  const s = fs.readFileSync('astro/src/content/articles/' + f, 'utf8');
  for (const m of s.matchAll(/https:\/\/upload\.wikimedia\.org\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp)(?:\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp))?/gi)) {
    if (!use.has(m[0])) use.set(m[0], new Set());
    use.get(m[0]).add(f);
  }
}
const still = [...use.entries()].filter(([, s]) => s.size >= 4);
console.log('images still on >=4 provinces:', still.length);
for (const [u, s] of still.slice(0, 10)) console.log('  x' + s.size + ' ' + decodeURIComponent(u).split('/').pop().slice(0, 70));
