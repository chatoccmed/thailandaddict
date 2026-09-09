#!/usr/bin/env node
/* =============================================================================
   gen-shell.mjs — build the app-shell artifacts
   Blueprint §4.0, §4.9

   Concatenates the shell sources, strips comments and dead whitespace,
   content-hashes the result and writes:

     astro/public/css/shell.<hash>.css
     astro/public/js/shell.<hash>.js
     astro/src/data/shell-manifest.json      { css, js, v }

   CONTENT HASH, NOT v1. astro/public/_headers serves /*.css and /*.js as
   max-age=31536000, immutable. An unhashed name ships nothing to a returning
   visitor — the trap /js/currency.js and /js/sortable.min.js are already in.
   Hashing removes the human step.

   THIS SCRIPT FAILS THE BUILD (§4.9) when shell.css contains a physical
   direction property outside a comment. RTL correctness by construction,
   not by a retrofit pass.

   Deliberately dependency-free, and deliberately NOT a real minifier:
   it strips comments and whitespace and never rewrites an expression.
   Anything cleverer than that needs a parser, and a broken shell breaks
   ~18,000 pages at once.

   Usage:  node _internal/gen-shell.mjs [--prune] [--check]
             --prune   also delete the PREVIOUS generation, which is otherwise
                       kept so that HTML still in a reader's cache (max-age
                       3600 + stale-while-revalidate 86400) does not 404 on
                       its stylesheet. Everything older than that is deleted
                       on every run regardless.
             --check   lint and report only; write nothing
   ========================================================================== */

import { createHash } from 'node:crypto';
import { brotliCompressSync, constants as zc } from 'node:zlib';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SRC = path.join(HERE, 'shell');

/* Order is load-bearing. tokens.css declares `@layer tokens, shell, page, util`
   in its first rule, so it MUST come first. compat.css comes last: it is the
   old-token alias shim (§2.5), it lives in @layer tokens too, and being later
   in the same layer is what lets it be deleted at the end of Phase 3 without
   touching anything above it. */
const CSS_SOURCES = ['tokens.css', 'shell.css', 'compat.css'];
const JS_SOURCES = ['shell.js', 'sheet.js', 'th-segment.js'];

const OUT_CSS_DIR = path.join(ROOT, 'astro', 'public', 'css');
const OUT_JS_DIR = path.join(ROOT, 'astro', 'public', 'js');
const OUT_MANIFEST = path.join(ROOT, 'astro', 'src', 'data', 'shell-manifest.json');

/* Flags are honoured ONLY when this file is the process entry point.
   astro/prebuild.mjs imports it as the first of eight generators, and
   `--check` calls process.exit(0) — inherited from another command's argv that
   would end the whole prebuild successfully after writing nothing, silently
   skipping gen-hubs and everything after it. */
const IS_CLI = /(^|[\\/])gen-shell\.mjs$/.test(process.argv[1] || '');
const argv = new Set(IS_CLI ? process.argv.slice(2) : []);
const PRUNE = argv.has('--prune');
const CHECK_ONLY = argv.has('--check');

/* ===========================================================================
   1. RTL LINT (§4.9)
   Physical direction properties are forbidden. Logical properties mirror for
   free under dir="rtl"; physical ones have to be un-picked by hand later on
   every locale, which is exactly how the first RTL pass was lost.
   ======================================================================== */

const FORBIDDEN = [
  [/(?<![\w-])margin-left\s*:/g, 'margin-left', 'margin-inline-start'],
  [/(?<![\w-])margin-right\s*:/g, 'margin-right', 'margin-inline-end'],
  [/(?<![\w-])padding-left\s*:/g, 'padding-left', 'padding-inline-start'],
  [/(?<![\w-])padding-right\s*:/g, 'padding-right', 'padding-inline-end'],
  [/(?<![\w-])border-left(-[\w-]+)?\s*:/g, 'border-left', 'border-inline-start'],
  [/(?<![\w-])border-right(-[\w-]+)?\s*:/g, 'border-right', 'border-inline-end'],
  [/(?<![\w-])left\s*:/g, 'left:', 'inset-inline-start'],
  [/(?<![\w-])right\s*:/g, 'right:', 'inset-inline-end'],
  [/(?<![\w-])text-align\s*:\s*left/g, 'text-align:left', 'text-align:start'],
  [/(?<![\w-])text-align\s*:\s*right/g, 'text-align:right', 'text-align:end'],
  [/(?<![\w-])float\s*:\s*(left|right)/g, 'float:left|right', 'float:inline-start|inline-end'],
  [/(?<![\w-])clear\s*:\s*(left|right)/g, 'clear:left|right', 'clear:inline-start|inline-end'],
];

/** Blank out comments while preserving byte offsets, so reported line
 *  numbers still point at the real source line. */
function maskCssComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function lintCss(file, src) {
  const masked = maskCssComments(src);
  const problems = [];
  for (const [re, name, fix] of FORBIDDEN) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(masked)) !== null) {
      const line = masked.slice(0, m.index).split('\n').length;
      const text = src.split('\n')[line - 1].trim();
      problems.push({ file, line, name, fix, text });
    }
  }
  return problems;
}

/* JS cannot be concatenated if a source imports a sibling — the bundle has
   no module resolver. Assert it instead of shipping a broken file. */
function lintJs(file, src) {
  const problems = [];
  src.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (/^import\s/.test(line) || /^export\s+\*\s/.test(line)) {
      problems.push({ file, line: i + 1, name: 'import/re-export', fix: 'attach to the TA global instead', text: line });
    }
  });
  return problems;
}

/* ===========================================================================
   2. SAFE STRIPPING — comments and whitespace only, never expressions
   ======================================================================== */

function stripCss(src) {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, '');
  out = out.replace(/\s+/g, ' ');
  /* Only the delimiters that can never be part of a value or a combinator.
     `(`, `)` and `:` are left alone on purpose: "@supports not (x:y)" is
     invalid the moment the space before the paren disappears. */
  out = out.replace(/\s*([{};])\s*/g, '$1');
  out = out.replace(/\s+,/g, ',');
  out = out.replace(/;}/g, '}');
  return out.trim();
}

function stripJs(src) {
  const hasTemplate = src.includes('`');
  const lines = src.split(/\r?\n/);
  const out = [];
  let inBlock = false;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (inBlock) {
      if (trimmed.includes('*/')) inBlock = false;
      continue;
    }
    /* Only FULL-LINE comments are removed. A `/*` or `//` that is not at the
       start of a trimmed line could live inside a string or a regex literal
       ( /\/index\.html$/ ), and rewriting those needs a real parser. */
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlock = true;
      continue;
    }
    if (trimmed.startsWith('//')) continue;
    if (trimmed === '') continue;
    /* Drop the ES re-export lines: the bundle is served as one classic
       script, and `export` outside a module is a syntax error that would
       kill the whole shell. The source files stay importable as modules. */
    if (/^export\s+(\{[^}]*\}|default\b)/.test(trimmed)) continue;
    /* Indentation is never significant in JS — unless a template literal
       spans lines, in which case we leave the file alone. */
    out.push(hasTemplate ? raw : trimmed);
  }
  return out.join('\n');
}

/* ===========================================================================
   3. BUILD
   ======================================================================== */

const bytes = (s) => Buffer.byteLength(s, 'utf8');
const br = (s) => brotliCompressSync(Buffer.from(s, 'utf8'), {
  params: { [zc.BROTLI_PARAM_QUALITY]: 11 }
}).length;
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const hash8 = (s) => createHash('sha256').update(s).digest('hex').slice(0, 8);

function read(dir, name) {
  const p = path.join(dir, name);
  if (!existsSync(p)) {
    console.error(`\n  MISSING SOURCE: ${p}\n`);
    process.exit(1);
  }
  return readFileSync(p, 'utf8');
}

const cssParts = CSS_SOURCES.map((f) => ({ file: f, src: read(SRC, f) }));
const jsParts = JS_SOURCES.map((f) => ({ file: f, src: read(SRC, f) }));

/* --- Lint first. Nothing is written if the shell would ship broken RTL. --- */
let problems = [];
for (const p of cssParts) problems = problems.concat(lintCss(p.file, p.src));
for (const p of jsParts) problems = problems.concat(lintJs(p.file, p.src));

if (problems.length) {
  console.error('\n  gen-shell: RTL / bundling lint FAILED\n');
  for (const p of problems) {
    console.error(`   ${p.file}:${p.line}  ${p.name}  ->  use ${p.fix}`);
    console.error(`      ${p.text.slice(0, 100)}`);
  }
  console.error(`\n  ${problems.length} problem(s). Physical direction properties do not mirror`);
  console.error('  under dir="rtl", and he/ar are live locales. Nothing was written.\n');
  process.exit(1);
}

const cssRaw = cssParts.map((p) => p.src).join('\n');
const jsRaw = jsParts.map((p) => p.src).join('\n');
const cssMin = cssParts.map((p) => stripCss(p.src)).join('\n');
const jsMin = jsParts.map((p) => stripJs(p.src)).join('\n;\n');

const cssHash = hash8(cssMin);
const jsHash = hash8(jsMin);
const v = hash8(cssHash + jsHash);

const cssName = `shell.${cssHash}.css`;
const jsName = `shell.${jsHash}.js`;

/* --- Report ------------------------------------------------------------- */
console.log('\n  gen-shell — ThailandAddict app shell\n');
console.log('  lint: 0 physical-direction properties, 0 cross-module imports  OK\n');
console.log('  source                       raw        stripped');
for (const p of cssParts) {
  console.log(`  ${p.file.padEnd(24)} ${kb(bytes(p.src)).padStart(9)}  ${kb(bytes(stripCss(p.src))).padStart(9)}`);
}
for (const p of jsParts) {
  console.log(`  ${p.file.padEnd(24)} ${kb(bytes(p.src)).padStart(9)}  ${kb(bytes(stripJs(p.src))).padStart(9)}`);
}
console.log('  ' + '-'.repeat(52));
console.log(`  ${cssName.padEnd(24)} ${kb(bytes(cssMin)).padStart(9)}  ${kb(br(cssMin)).padStart(9)} br  (${bytes(cssMin)} B)`);
console.log(`  ${jsName.padEnd(24)} ${kb(bytes(jsMin)).padStart(9)}  ${kb(br(jsMin)).padStart(9)} br  (${bytes(jsMin)} B)`);
console.log(`\n  raw in: ${kb(bytes(cssRaw) + bytes(jsRaw))}   shipped: ${kb(bytes(cssMin) + bytes(jsMin))}   over the wire: ${kb(br(cssMin) + br(jsMin))}`);
console.log(`  shell-manifest.v = ${v}\n`);

if (CHECK_ONLY) {
  console.log('  --check: nothing written.\n');
  process.exit(0);
}

/* --- Write --------------------------------------------------------------- */
mkdirSync(OUT_CSS_DIR, { recursive: true });
mkdirSync(OUT_JS_DIR, { recursive: true });
mkdirSync(path.dirname(OUT_MANIFEST), { recursive: true });

writeFileSync(path.join(OUT_CSS_DIR, cssName), cssMin, 'utf8');
writeFileSync(path.join(OUT_JS_DIR, jsName), jsMin, 'utf8');
writeFileSync(OUT_MANIFEST, JSON.stringify({
  css: `/css/${cssName}`,
  js: `/js/${jsName}`,
  v
}, null, 2) + '\n', 'utf8');

console.log(`  wrote  astro/public/css/${cssName}`);
console.log(`  wrote  astro/public/js/${jsName}`);
console.log('  wrote  astro/src/data/shell-manifest.json');

/* --- Keep the prototype service worker in step ---------------------------
   _proto/sw.js precaches the shell by its literal hashed path and names all
   three of its caches from shell-manifest.v ("bump the shell, bump every cache
   in one step; a half-updated CSS/JS pair cannot exist"). Both were being
   hand-edited, and both drifted: measured twice on 2026-09-08, the precache
   paths had been updated to the new build while SHELL_V still named the
   previous one, so an installed worker kept its old caches and never rotated
   them. Regenerating the shell now rewrites both, so they cannot drift again.
   Silent no-op once /_proto/ is deleted. */
const SW = path.join(ROOT, 'astro/public/_proto/sw.js');
if (existsSync(SW)) {
  const before = readFileSync(SW, 'utf8');
  const after = before
    .replace(/const SHELL_V = '[0-9a-f]{8}';/, `const SHELL_V = '${v}';`)
    .replace(/'\/css\/shell\.[0-9a-f]{8}\.css'/, `'/css/${cssName}'`)
    .replace(/'\/js\/shell\.[0-9a-f]{8}\.js'/, `'/js/${jsName}'`);
  if (after !== before) {
    writeFileSync(SW, after, 'utf8');
    console.log(`  synced astro/public/_proto/sw.js  (SHELL_V=${v}, precache → ${cssName} + ${jsName})`);
  }
}

/* --- Keep every prototype page in step ------------------------------------
   The hashed filenames are written into each /_proto page's <head> at build
   time. sw.js was already synced here; the HTML was not, so a shell change
   re-hashed the CSS and left ~14 pages pointing at a file that no longer
   exists — an unstyled page, and no error anywhere that says so. Rewriting
   both from the same run is what makes the hash a build detail again.
   The generators (e.g. gen-proto-home.mjs) read shell-manifest.json directly,
   so a regenerated page is already correct; this catches the ones that are
   not regenerated in the same pass. Silent no-op once /_proto/ is deleted. */
const PROTO = path.join(ROOT, 'astro/public/_proto');
if (existsSync(PROTO)) {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name))
      : (e.name.endsWith('.html') ? [path.join(d, e.name)] : []));
  let touched = 0;
  for (const f of walk(PROTO)) {
    const before = readFileSync(f, 'utf8');
    const after = before
      .replace(/shell\.[0-9a-f]{8}\.css/g, cssName)
      .replace(/shell\.[0-9a-f]{8}\.js/g, jsName);
    if (after !== before) { writeFileSync(f, after, 'utf8'); touched++; }
  }
  if (touched) console.log('  synced ' + touched + ' prototype page(s) in astro/public/_proto to ' + cssName + ' + ' + jsName);
}

/* --- Stale hashes ---------------------------------------------------------
   Two opposing constraints, and one generation of grace resolves both:

   - HTML is served `max-age=3600, stale-while-revalidate=86400`, so for up to
     a day after a shell change a reader can be holding a cached page that
     names the PREVIOUS hash. Delete that file and they get an unstyled page,
     with nothing in any log to say so.
   - The deploy has ~199 files of headroom against Cloudflare's 20,000 cap, and
     this script runs on every build. Keeping every generation forever spends
     that headroom two files at a time until a deploy silently truncates — the
     exact failure DEPLOY-RUNBOOK.md Phase R documents.

   So: keep the current artifact and the single most recent previous one, and
   delete everything older, automatically, on every run. `--prune` still means
   "delete every stale artifact including that previous generation" — use it
   only when no cached HTML can still be pointing at it.
   ------------------------------------------------------------------------ */
const stalePattern = /^shell\.[0-9a-f]{8}\.(css|js)$/;
const stale = [];
for (const [dir, keep] of [[OUT_CSS_DIR, cssName], [OUT_JS_DIR, jsName]]) {
  const olds = readdirSync(dir)
    .filter((f) => stalePattern.test(f) && f !== keep)
    .map((f) => path.join(dir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);   /* newest first */
  const grace = PRUNE ? 0 : 1;
  for (let i = 0; i < olds.length; i++) {
    if (i < grace) console.log(`  kept   ${path.relative(ROOT, olds[i])}  (previous generation, for cached HTML)`);
    else stale.push(olds[i]);
  }
}
for (const f of stale) {
  unlinkSync(f);
  console.log(`  pruned ${path.relative(ROOT, f)}`);
}

console.log('');
