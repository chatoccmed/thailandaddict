#!/usr/bin/env node
/* =============================================================================
   check-rtl.mjs — no physical direction properties in shipped CSS
   Blueprint §4.9 · Phase 2 build gates · EXIT CODE 1

   WHY THIS EXISTS
   ---------------
   he and ar are live locales: ~450 hub snapshots render under dir="rtl" today.
   A physical property (margin-left, inset right, text-align:left …) does not
   mirror. It has to be un-picked by hand, per rule, per locale, later — which
   is exactly how the site's first RTL pass was lost. Logical properties mirror
   for free, so the cheapest possible moment to enforce them is the moment the
   CSS is written.

   _internal/gen-shell.mjs already fails the build on physical properties in the
   shell SOURCES. That check only runs inside prebuild, and prebuild's
   generators are absent from the isolated build-test copy, so on the pre-push
   path it does not run at all. This gate is the one that does — and it reaches
   further: the shipped bundle, the three layouts' <style> blocks, and the
   inline style="" attributes that no stylesheet can ever reach (42 of them in
   ReviewLayout alone).

   SCOPE — GATED vs LEGACY
   -----------------------
   Phase 2 ships in the order layouts → hubs → standalone pages. Gating a file
   that has not been migrated yet would make the gate permanently red and
   therefore useless, so unmigrated stylesheets are listed in LEGACY_UNGATED,
   counted, and printed on every run. Moving one into GATED is a one-line edit
   and is how each rollout step is locked in behind itself.

   Usage:  node _internal/qa/check-rtl.mjs [--list]
           exit 0 = OK · exit 1 = a physical property would ship
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LIST_ONLY = process.argv.includes('--list');

/* ---------------------------------------------------------------------------
   The forbidden set. Kept deliberately identical to the FORBIDDEN array in
   _internal/gen-shell.mjs — checkRuleParity() below reads that file and fails
   if gen-shell grows a rule this gate does not have, so the two can never
   drift into disagreeing about what "physical" means.

   Each lookbehind (?<![\w-]) is what keeps `inset-inline-start:` and
   `--card-left:` out of the `left:` rule, and `background-position:left` out
   of everything (there `left` is a value, not a property).
   ------------------------------------------------------------------------ */
const FORBIDDEN = [
  { name: 'margin-left', re: /(?<![\w-])margin-left\s*:/g, fix: 'margin-inline-start' },
  { name: 'margin-right', re: /(?<![\w-])margin-right\s*:/g, fix: 'margin-inline-end' },
  { name: 'padding-left', re: /(?<![\w-])padding-left\s*:/g, fix: 'padding-inline-start' },
  { name: 'padding-right', re: /(?<![\w-])padding-right\s*:/g, fix: 'padding-inline-end' },
  { name: 'border-left', re: /(?<![\w-])border-left(-[\w-]+)?\s*:/g, fix: 'border-inline-start' },
  { name: 'border-right', re: /(?<![\w-])border-right(-[\w-]+)?\s*:/g, fix: 'border-inline-end' },
  { name: 'left:', re: /(?<![\w-])left\s*:/g, fix: 'inset-inline-start (or inset-inline + margin-inline:auto to centre)' },
  { name: 'right:', re: /(?<![\w-])right\s*:/g, fix: 'inset-inline-end' },
  { name: 'text-align:left', re: /(?<![\w-])text-align\s*:\s*left/g, fix: 'text-align:start' },
  { name: 'text-align:right', re: /(?<![\w-])text-align\s*:\s*right/g, fix: 'text-align:end' },
  { name: 'float:left|right', re: /(?<![\w-])float\s*:\s*(left|right)/g, fix: 'float:inline-start|inline-end' },
  { name: 'clear:left|right', re: /(?<![\w-])clear\s*:\s*(left|right)/g, fix: 'clear:inline-start|inline-end' },
];

/* ---------------------------------------------------------------------------
   What is gated. `kind` decides how much of the file is CSS:
     'css'   — the whole file
     'astro' — only <style> blocks and style="" / style={} attributes, so that
               JS such as track.scrollTo({ left: … }) is not a false positive.
   ------------------------------------------------------------------------ */
const GATED = [
  { file: '_internal/shell/tokens.css', kind: 'css' },
  { file: '_internal/shell/shell.css', kind: 'css' },
  { file: '_internal/shell/compat.css', kind: 'css' },
  { file: 'astro/src/layouts/ReviewLayout.astro', kind: 'astro' },
  { file: 'astro/src/layouts/RoundupLayout.astro', kind: 'astro' },
  { file: 'astro/src/layouts/ArticleLayout.astro', kind: 'astro' },
  { file: 'astro/src/components/Shell.astro', kind: 'astro' },
  { file: '_internal/lib/chrome.mjs', kind: 'astro' },
  /* the shipped bundle is resolved from shell-manifest.json, see below */
];

/* Not yet on the shell, therefore not yet gated. Counted and printed every run.
   Move an entry up into GATED the moment its consumers are migrated:
     premium.css  — gen-hubs snapshots + the ~24 hand-written pages (Phase 2, later)
     proto*.css   — the /_proto prototype only; never shipped to a reader   */
const LEGACY_UNGATED = [
  'astro/public/css/premium.css',
  'astro/public/css/proto.css',
  'astro/public/css/proto2.css',
  'astro/public/css/proto3.css',
];

const failures = [];
const warnings = [];

/* Blank comments out while preserving byte offsets, so reported line numbers
   still point at the real source line. */
const maskCss = s => s.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
const maskHtmlComments = s => s.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' '));

/** Blank out everything in an .astro/.mjs file that is NOT CSS, preserving
 *  offsets. What survives: the body of every <style> block, and the value of
 *  every style="" / style={…} attribute. Everything else — frontmatter,
 *  markup, scripts — becomes spaces. */
function maskToCssOnly(src) {
  const keep = new Uint8Array(src.length);
  for (const m of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const start = m.index + m[0].indexOf('>') + 1;
    for (let i = start; i < start + m[1].length; i++) keep[i] = 1;
  }
  /* style="…"  ·  style='…'  ·  style={…}  (Astro expression) */
  for (const m of src.matchAll(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g)) {
    const val = m[1] ?? m[2] ?? m[3] ?? '';
    const start = m.index + m[0].length - val.length - 1;
    for (let i = start; i < start + val.length; i++) keep[i] = 1;
  }
  let out = '';
  for (let i = 0; i < src.length; i++) out += keep[i] ? src[i] : (src[i] === '\n' ? '\n' : ' ');
  return out;
}

function scan(absPath, relPath, kind) {
  const raw = fs.readFileSync(absPath, 'utf8');
  const lines = raw.split('\n');
  const masked = kind === 'css' ? maskCss(raw) : maskCss(maskHtmlComments(maskToCssOnly(raw)));
  const hits = [];
  for (const { name, re, fix } of FORBIDDEN) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(masked)) !== null) {
      const line = masked.slice(0, m.index).split('\n').length;
      hits.push({ file: relPath, line, name, fix, text: (lines[line - 1] || '').trim().slice(0, 150) });
    }
  }
  return hits;
}

/* ---------------------------------------------------------------------------
   Parity with gen-shell.mjs — if that file gains a rule, this gate must too,
   or the pre-push path silently stops covering it.
   ------------------------------------------------------------------------ */
function checkRuleParity() {
  const p = path.join(ROOT, '_internal', 'gen-shell.mjs');
  if (!fs.existsSync(p)) {
    warnings.push(['_internal/gen-shell.mjs not found — rule-parity check skipped',
      '  This gate can no longer prove it forbids everything the shell builder forbids.']);
    return;
  }
  const src = fs.readFileSync(p, 'utf8');
  const block = /const FORBIDDEN = \[([\s\S]*?)\n\];/.exec(src);
  if (!block) {
    warnings.push(['could not read FORBIDDEN from _internal/gen-shell.mjs — rule-parity check skipped',
      '  Update the parser in check-rtl.mjs::checkRuleParity if that array moved.']);
    return;
  }
  /* second string in each row is the human-readable rule name */
  const theirs = [...block[1].matchAll(/\[[^,]+,\s*'([^']+)'/g)].map(m => m[1]);
  const mine = new Set(FORBIDDEN.map(f => f.name));
  const uncovered = theirs.filter(n => !mine.has(n));
  if (uncovered.length) {
    failures.push({
      headline: `rule drift: gen-shell.mjs forbids ${uncovered.length} property this gate does not check`,
      detail: [
        `  gen-shell.mjs FORBIDDEN has: ${uncovered.join(', ')}`,
        '  gen-shell only runs inside prebuild, which is skipped in the isolated',
        '  build-test copy — so anything only IT checks is unchecked before push.',
        '',
        '  WHAT TO DO: add the same rule(s) to FORBIDDEN in',
        '  _internal/qa/check-rtl.mjs. Keep the two arrays in step, always.',
      ],
    });
  } else {
    console.log(`  ✓ rule parity: all ${theirs.length} gen-shell.mjs rules are covered here`);
  }
}

/* ---------------------------------------------------------------------------
   run
   ------------------------------------------------------------------------ */
console.log('check-rtl — logical CSS properties only (he + ar are live locales)');
checkRuleParity();

/* resolve the CURRENT shipped bundle from the manifest, not by glob: gen-shell
   deliberately keeps the previous generation on disk for cached HTML, and
   failing on a superseded file would be noise. */
const targets = GATED.slice();
const manifestPath = path.join(ROOT, 'astro', 'src', 'data', 'shell-manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const man = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (man.css) targets.push({ file: path.posix.join('astro/public', man.css.replace(/^\//, '')), kind: 'css', shipped: true });
  } catch { /* reported below as a missing target */ }
} else {
  warnings.push(['astro/src/data/shell-manifest.json not found — the shipped bundle was not scanned',
    '  Run: node _internal/gen-shell.mjs']);
}

const allHits = [];
let scanned = 0;
for (const t of targets) {
  const abs = path.join(ROOT, t.file);
  if (!fs.existsSync(abs)) {
    failures.push({
      headline: `gated file is missing: ${t.file}`,
      detail: [
        '  A gated file that does not exist is not "clean", it is unchecked.',
        '  If the file was renamed, update GATED in _internal/qa/check-rtl.mjs.',
        t.shipped ? '  If the shell bundle is simply unbuilt: node _internal/gen-shell.mjs' : '',
      ].filter(Boolean),
    });
    continue;
  }
  scanned++;
  allHits.push(...scan(abs, t.file, t.kind));
}

if (allHits.length) {
  const detail = [
    `  ${allHits.length} physical direction propert${allHits.length === 1 ? 'y' : 'ies'} in files that ship to readers.`,
    '  Under dir="rtl" (he, ar) each one lays out backwards, and nothing in the',
    '  build or the browser reports it — the page merely looks wrong to a reader',
    '  who is not in the room.',
    '',
  ];
  for (const h of allHits.slice(0, 25)) {
    detail.push(`  ${h.file}:${h.line}`);
    detail.push(`      ${h.name}   →   use ${h.fix}`);
    detail.push(`      ${h.text}`);
  }
  if (allHits.length > 25) detail.push(`  … and ${allHits.length - 25} more`);
  detail.push('');
  detail.push('  WHAT TO DO: replace each with its logical equivalent shown above.');
  detail.push('  Two cases that are NOT a straight swap:');
  detail.push('   · horizontal centring — `left:50%` + `translate(-50%)` becomes');
  detail.push('     `inset-inline:0; margin-inline:auto; width:max-content`.');
  detail.push('     inset-inline-start:50% is NOT equivalent: it centres in ltr and');
  detail.push('     pushes the element off-screen in rtl.');
  detail.push('   · a value that is genuinely physical (a drop-shadow offset, a');
  detail.push('     background-position) is not matched by this gate at all — if you');
  detail.push('     are looking at one, the match is on a property name, not a value.');
  failures.push({ headline: `${allHits.length} physical direction propert${allHits.length === 1 ? 'y' : 'ies'} in gated files`, detail });
} else {
  console.log(`  ✓ ${scanned} gated file(s) clean — 0 physical direction properties`);
}

/* the not-yet-migrated stylesheets: reported, never fatal */
let legacyTotal = 0;
const legacyRows = [];
for (const rel of LEGACY_UNGATED) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const hits = scan(abs, rel, 'css');
  legacyTotal += hits.length;
  if (hits.length) legacyRows.push(`  ${String(hits.length).padStart(4)}  ${rel}`);
  if (LIST_ONLY) for (const h of hits) console.log(`      ${h.file}:${h.line}  ${h.name}`);
}
if (legacyTotal) {
  warnings.push([
    `${legacyTotal} physical propert${legacyTotal === 1 ? 'y' : 'ies'} remain in stylesheets not yet on the shell`,
    ...legacyRows,
    '  These belong to the hub generator and the ~24 hand-written pages, which',
    '  are later in the Phase 2 ship order. Move each file from LEGACY_UNGATED',
    '  into GATED in _internal/qa/check-rtl.mjs as its consumers migrate — that',
    '  is what stops the rollout sliding backwards.',
  ]);
}

for (const w of warnings) {
  console.log('');
  console.log('  NOTE: ' + w[0]);
  for (const l of w.slice(1)) console.log('  ' + l);
}

if (failures.length) {
  console.error('');
  console.error('─'.repeat(78));
  for (const f of failures) {
    console.error('FAIL: ' + f.headline);
    for (const l of f.detail) console.error(l);
    console.error('');
  }
  console.error('─'.repeat(78));
  console.error(`check-rtl: ${failures.length} FAILURE(S) — do NOT push.`);
  process.exit(1);
}
console.log('check-rtl: ALL PASS');
