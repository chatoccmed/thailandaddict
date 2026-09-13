/* =============================================================================
   json-format.mjs — write a JSON file back in the SAME style it came in

   WHY
   ---
   Content JSON in this repo comes in at least three styles, and every writer
   that did `JSON.stringify(obj, null, 2)` silently converted the others:
     · minified, one line   — top10-attractions-chumphon EN was a single 49 KB
                              line; deleting one coordinate pretty-printed it
                              into a +548/−1 diff
     · 1-space pretty       — the article collections; assuming 2 reformatted
                              464 files into a 124,000-line diff
     · pretty with inline   — review-hotel-amber-sukhumvit-85 keeps "tags" as
       primitive arrays       ["hotel", "3-star", …] on one line; a round trip
                              explodes it into 15 lines
   The content is identical either way and the site builds the same — but a
   diff that rewrites 548 lines to change two numbers cannot be reviewed, and
   it lies about what the commit did.

   HOW
   ---
   Try each known style on the ORIGINAL object and keep the one that reproduces
   the original text byte for byte; write the modified object with it. If no
   style reproduces the file exactly, pick the one that shares the most lines
   with it, and say so — callers can report `exact: false` rather than hide it.
   ========================================================================== */
import fs from 'node:fs';

/* Pretty objects, but arrays whose elements are all primitives stay on one
   line with ", " separators — the style several review files use. */
function prettyCompact(value, unit, level = 0) {
  const pad = unit.repeat(level);
  const padIn = unit.repeat(level + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.every((v) => v === null || typeof v !== 'object')) {
      return '[' + value.map((v) => JSON.stringify(v)).join(', ') + ']';
    }
    return '[\n' + value.map((v) => padIn + prettyCompact(v, unit, level + 1)).join(',\n') + '\n' + pad + ']';
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).filter((k) => value[k] !== undefined);
    if (keys.length === 0) return '{}';
    return '{\n' + keys.map((k) => padIn + JSON.stringify(k) + ': ' + prettyCompact(value[k], unit, level + 1)).join(',\n') + '\n' + pad + '}';
  }
  return JSON.stringify(value);
}

const STYLES = [
  ['minified', (o) => JSON.stringify(o)],
  ['indent-2', (o) => JSON.stringify(o, null, 2)],
  ['indent-1', (o) => JSON.stringify(o, null, 1)],
  ['indent-2-inline-arrays', (o) => prettyCompact(o, '  ')],
  ['indent-1-inline-arrays', (o) => prettyCompact(o, ' ')],
  ['indent-4', (o) => JSON.stringify(o, null, 4)],
  ['tab', (o) => JSON.stringify(o, null, '\t')],
];

/* Which style reproduces this text exactly? Line endings and the trailing
   newline are recorded separately and restored on write. */
export function detectStyle(raw) {
  const text = String(raw);
  const crlf = text.includes('\r\n');
  const norm = crlf ? text.replace(/\r\n/g, '\n') : text;
  const trailing = norm.endsWith('\n');
  const body = trailing ? norm.slice(0, -1) : norm;
  const obj = JSON.parse(body);
  for (const [name, fn] of STYLES) {
    if (fn(obj) === body) return { name, fn, crlf, trailing, exact: true, obj };
  }
  /* Nothing reproduces it: choose the style that keeps the most lines. */
  const have = new Map();
  for (const l of body.split('\n')) have.set(l, (have.get(l) || 0) + 1);
  let best = null;
  for (const [name, fn] of STYLES) {
    const lines = fn(obj).split('\n');
    const pool = new Map(have);
    let kept = 0;
    for (const l of lines) { const c = pool.get(l); if (c) { kept++; pool.set(l, c - 1); } }
    const score = kept / Math.max(lines.length, body.split('\n').length);
    if (!best || score > best.score) best = { name, fn, score };
  }
  return { name: best.name, fn: best.fn, crlf, trailing, exact: false, obj };
}

/* Serialize `obj` in the style of `raw`. */
export function serializeLike(raw, obj) {
  const st = detectStyle(raw);
  let out = st.fn(obj);
  if (st.trailing) out += '\n';
  if (st.crlf) out = out.replace(/\n/g, '\r\n');
  return { text: out, style: st.name, exact: st.exact };
}

/* Read-modify-write helper: `mutate` receives the parsed object and may return
   false to skip the write. Returns null when skipped. */
export function editJsonFile(file, mutate) {
  const raw = fs.readFileSync(file, 'utf8');
  const st = detectStyle(raw);
  const obj = st.obj;
  if (mutate(obj) === false) return null;
  const r = serializeLike(raw, obj);
  fs.writeFileSync(file, r.text);
  return r;
}
