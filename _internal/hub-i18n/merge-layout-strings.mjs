// Merge translated review-<lang>.json / roundup-<lang>.json into the S = {...}[lang]
// dict inside ReviewLayout.astro / RoundupLayout.astro. Replaces the existing
// `}[lang];` closer with the 7 new language blocks inserted before it — th/en
// blocks are left completely untouched (byte-identical).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

function merge(layoutFile, prefix) {
  const file = path.join(ROOT, 'astro', 'src', 'layouts', layoutFile);
  let src = fs.readFileSync(file, 'utf8');
  if (src.includes("  zh: {")) { console.log('already merged:', layoutFile); return; }
  const marker = '\n}[lang];';
  const idx = src.indexOf(marker);
  if (idx < 0) throw new Error('marker not found in ' + layoutFile);
  let blocks = '';
  for (const l of LANGS) {
    const dict = JSON.parse(fs.readFileSync(path.join(HERE, `${prefix}-${l}.json`), 'utf8'));
    // JSON.stringify produces valid JS object-literal syntax (quoted keys are valid JS)
    blocks += `\n  ${l}: ${JSON.stringify(dict, null, 2).replace(/\n/g, '\n  ')},`;
  }
  src = src.slice(0, idx) + blocks + src.slice(idx);
  fs.writeFileSync(file, src);
  console.log('merged', LANGS.length, 'languages into', layoutFile);
}

merge('ReviewLayout.astro', 'review');
merge('RoundupLayout.astro', 'roundup');
