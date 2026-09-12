#!/usr/bin/env node
/* =============================================================================
   check-snapshots.mjs — no generated page may be older than its generator
   Phase 2 build gates · EXIT CODE 1

   WHY THIS EXISTS
   ---------------
   astro/public holds 2,033 pre-generated HTML snapshots. They are checked into
   the repo and copied verbatim into dist — Astro never re-renders them. So a
   snapshot is only ever as correct as the last time somebody ran its generator,
   and "somebody forgot" has already shipped: gen-hubs.mjs was a manual step
   until it was moved into prebuild, and stale hubs with unlinked roundups went
   live in the meantime.

   During Phase 2 the risk is sharper than usual. The shell bundle is content-
   hashed and old generations are pruned, so a snapshot that still points at a
   superseded hash does not merely look old — its stylesheet 404s and the page
   renders unstyled. That check is section 2 and it self-activates: it only
   fires for snapshots that reference a shell bundle at all, so it costs
   nothing today and starts guarding the moment the hubs move onto the shell.

   SECTIONS
     1. generator freshness  — snapshot mtime must be ≥ its generator's mtime
     2. shell hash pinning   — a referenced shell.<hash>.* must be the current one
     3. shell artifact age   — the built bundle vs the sources it is built from
     4. unowned snapshots    — pages no generator will ever refresh (reported)

   WHICH "TIME" — AND WHY NOT PLAIN MTIME
   --------------------------------------
   A filesystem mtime says when a file was last written, which is not the same
   as when its contents last changed: `git checkout`, a branch switch, a Drive
   re-sync or a stray `touch` all bump it, and on a fresh clone every file
   carries checkout time in arbitrary order. Comparing raw mtimes therefore
   produces confident nonsense on exactly the machines that matter.

   So for a generator that is CLEAN in git, this gate uses the commit time of
   the last commit that touched it — the moment its behaviour actually changed.
   For a generator with uncommitted edits it falls back to mtime, which is then
   the right answer. Snapshots are compared on mtime either way, since they are
   the artefacts and being rewritten is precisely what they are for.

   TA_QA_SKIP_SNAPSHOT_MTIME=1 turns section 1 off for a run, for the case where
   git is unavailable and the tree has just been unpacked. The gate says so in
   its own failure text rather than leaving you to work it out.

   Usage:  node _internal/qa/check-snapshots.mjs [--strict] [--list]
             --strict  promote section 3 from warning to failure
             --list    print every offending file instead of the first 20
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PUB = path.join(ROOT, 'astro', 'public');
const STRICT = process.argv.includes('--strict');
const LIST = process.argv.includes('--list');
const SKIP_MTIME = process.env.TA_QA_SKIP_SNAPSHOT_MTIME === '1';

/* ---------------------------------------------------------------------------
   Which generator owns which snapshot.

   `dirs` is relative to astro/public: '' is the Thai root, the rest are the
   locale mirrors gen-hubs writes with genAll(loc, outDir). `files` are
   basename globs (only * is supported, deliberately — a richer matcher would
   hide typos rather than surface them).
   ------------------------------------------------------------------------ */
const LOCALE_DIRS = ['', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const OWNERS = [
  {
    generator: '_internal/gen-hubs.mjs',
    dirs: LOCALE_DIRS,
    files: ['city-*.html', 'activities-*.html', 'area-bangkok-*.html', 'region-*.html',
      'country-thailand.html', 'destinations.html', 'plan-your-trip.html', 'search.html'],
  },
  {
    /* The homepage is written WHOLE by gen-proto-home, from live content:
       itineraries, roundups, reviews, restaurant and attraction blocks. It was
       listed here under gen-home.mjs, which only ever injected stat numbers and
       the province map between markers — and the new page has no markers, so
       gen-home is a no-op on it now. Naming the wrong owner meant editing the
       real generator never marked the homepage stale, which is exactly the
       failure this gate exists to catch, on the site's most important page. */
    generator: '_internal/shell/build/gen-proto-home.mjs',
    dirs: ['', 'en'],
    files: ['index.html'],
  },
];

/* Snapshots that no generator owns, and that this gate should not nag about.
   /_proto is the Phase-1 prototype (noindex, never linked, deleted in one
   commit); gen-shell.mjs syncs the bundle hash into it, which section 2 covers. */
const UNOWNED_IGNORE = [/^_proto\//];

const failures = [];
const warnings = [];
const fail = (headline, detail) => failures.push({ headline, detail });

const globToRe = g => new RegExp('^' + g.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*') + '$');

function mtime(p) { try { return fs.statSync(p).mtimeMs; } catch { return null; } }

/** When a generator's BEHAVIOUR last changed, in ms.
 *  Clean in git → the last commit that touched it (immune to checkout/touch).
 *  Dirty, or no git → its mtime, which is then the honest answer.
 *  Returns { t, basis } so the failure text can say which it used. */
function generatorTime(relPath) {
  const abs = path.join(ROOT, relPath);
  const fsT = mtime(abs);
  if (fsT === null) return { t: null, basis: 'missing' };
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', relPath],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (dirty) return { t: fsT, basis: 'uncommitted edits (mtime)' };
    const ct = execFileSync('git', ['log', '-1', '--format=%ct', '--', relPath],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (/^\d+$/.test(ct)) return { t: Number(ct) * 1000, basis: 'last commit that changed it' };
  } catch { /* git absent or not a repo */ }
  return { t: fsT, basis: 'mtime (git unavailable)' };
}
function walkHtml(dir, base = '') {
  const out = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const rel = base ? base + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...walkHtml(path.join(dir, e.name), rel));
    else if (e.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

console.log('check-snapshots — a generated page must never be older than its generator');

const allHtml = walkHtml(PUB);
console.log(`  · ${allHtml.length} HTML snapshots under astro/public`);

/* ===========================================================================
   1. generator freshness
   ======================================================================== */
const owned = new Set();
if (SKIP_MTIME) {
  warnings.push(['mtime comparison skipped (TA_QA_SKIP_SNAPSHOT_MTIME=1)',
    '  Section 1 is off. Turn it back on for the next run — it is the only',
    '  thing standing between an edited generator and a stale deploy.']);
  for (const o of OWNERS) for (const d of o.dirs) for (const g of o.files) {
    const re = globToRe(g);
    for (const rel of allHtml) {
      const parts = rel.split('/');
      const inDir = parts.slice(0, -1).join('/');
      if (inDir === d && re.test(parts[parts.length - 1])) owned.add(rel);
    }
  }
} else {
  for (const o of OWNERS) {
    const { t: genT, basis } = generatorTime(o.generator);
    if (genT === null) {
      fail(`generator not found: ${o.generator}`, [
        '  A snapshot owner that does not exist cannot be compared against, so',
        '  every page it owns is silently unchecked.',
        '  WHAT TO DO: if the generator was renamed, update OWNERS in',
        '  _internal/qa/check-snapshots.mjs.',
      ]);
      continue;
    }
    const res = o.files.map(globToRe);
    const stale = [];
    let counted = 0;
    for (const rel of allHtml) {
      const parts = rel.split('/');
      const name = parts[parts.length - 1];
      const inDir = parts.slice(0, -1).join('/');
      if (!o.dirs.includes(inDir)) continue;
      if (!res.some(re => re.test(name))) continue;
      owned.add(rel);
      counted++;
      const t = mtime(path.join(PUB, rel));
      if (t !== null && t < genT) stale.push({ rel, age: Math.round((genT - t) / 1000) });
    }
    if (stale.length) {
      stale.sort((a, b) => b.age - a.age);
      const detail = [
        `  ${stale.length} of ${counted} page(s) owned by ${o.generator} are older than it.`,
        `  ${o.generator} changed ${new Date(genT).toISOString().replace('T', ' ').slice(0, 19)} UTC`,
        `  (basis: ${basis}).`,
        '',
      ];
      for (const s of (LIST ? stale : stale.slice(0, 20))) {
        detail.push(`  astro/public/${s.rel}   (${(s.age / 3600).toFixed(1)} h older than the generator)`);
      }
      if (!LIST && stale.length > 20) detail.push(`  … and ${stale.length - 20} more (re-run with --list)`);
      detail.push('');
      detail.push('  These files are copied verbatim into dist — Astro does not re-render');
      detail.push('  them — so whatever changed in the generator is NOT on those pages.');
      detail.push('');
      detail.push('  WHAT TO DO — regenerate them, from the repo root:');
      detail.push(`    node ${o.generator.replace(/\\/g, '/')}`);
      detail.push('  It writes straight into astro/public (all 9 locales) and takes a few');
      detail.push('  minutes. Then re-run this gate.');
      detail.push('');
      detail.push('  NOTE, because this gate runs BEFORE the build in build-test.sh and you');
      detail.push('  may be here wanting to build in order to fix it: a full `cd astro &&');
      detail.push('  npm run build` also refreshes these files, since prebuild.mjs runs the');
      detail.push('  generators first. To get past this gate for exactly one run:');
      detail.push('    TA_SKIP_GATES=snapshots bash _internal/build-test.sh');
      detail.push('  If instead you have just cloned the repo and every file carries checkout');
      detail.push('  time, the comparison is meaningless once — use:');
      detail.push('    TA_QA_SKIP_SNAPSHOT_MTIME=1 bash _internal/build-test.sh');
      fail(`${stale.length} snapshot(s) are older than ${o.generator}`, detail);
    } else {
      console.log(`  ✓ ${counted} page(s) owned by ${o.generator} are newer than it (${basis})`);
    }
  }
}

/* ===========================================================================
   2. shell hash pinning — self-activating
   ======================================================================== */
const manPath = path.join(ROOT, 'astro', 'src', 'data', 'shell-manifest.json');
let manifest = null;
try { manifest = JSON.parse(fs.readFileSync(manPath, 'utf8')); } catch { /* handled below */ }

if (!manifest) {
  warnings.push(['astro/src/data/shell-manifest.json is unreadable — shell hash pinning not checked',
    '  Run: node _internal/gen-shell.mjs']);
} else {
  const wantCss = manifest.css || '';
  const wantJs = manifest.js || '';
  const wrong = [];
  const REF = /\/(?:css|js)\/shell\.[0-9a-f]{6,}\.(?:css|js)/g;
  for (const rel of allHtml) {
    const src = fs.readFileSync(path.join(PUB, rel), 'utf8');
    const refs = src.match(REF);
    if (!refs) continue;
    for (const r of new Set(refs)) {
      if (r !== wantCss && r !== wantJs) wrong.push({ rel, r });
    }
  }
  if (wrong.length) {
    const detail = [
      `  ${wrong.length} reference(s) point at a shell bundle that is not the current one.`,
      `  current: ${wantCss}  ·  ${wantJs}`,
      '',
    ];
    for (const w of (LIST ? wrong : wrong.slice(0, 20))) detail.push(`  astro/public/${w.rel}  →  ${w.r}`);
    if (!LIST && wrong.length > 20) detail.push(`  … and ${wrong.length - 20} more (re-run with --list)`);
    detail.push('');
    detail.push('  The bundle is content-hashed and gen-shell prunes old generations,');
    detail.push('  so these pages will request a stylesheet that no longer exists and');
    detail.push('  render completely unstyled. _headers serves /*.css immutable for a');
    detail.push('  year, so a reader who caches the broken page keeps it.');
    detail.push('');
    detail.push('  WHAT TO DO — regenerate whatever writes the reference:');
    detail.push('    node _internal/gen-shell.mjs      # re-syncs /_proto and sw.js');
    detail.push('    node _internal/gen-hubs.mjs       # re-writes the hub snapshots');
    detail.push('  Never hand-edit a hash into a snapshot; it will be wrong again next build.');
    fail(`${wrong.length} snapshot reference(s) pin a stale shell bundle hash`, detail);
  } else {
    console.log(`  ✓ shell hash pinning: no snapshot references a superseded bundle`);
  }
}

/* ===========================================================================
   3. shell artifact age (warning unless --strict)
   ======================================================================== */
if (manifest && manifest.css) {
  const artifact = path.join(PUB, manifest.css.replace(/^\//, ''));
  const artT = mtime(artifact);
  const srcDir = path.join(ROOT, '_internal', 'shell');
  const srcs = fs.existsSync(srcDir)
    ? fs.readdirSync(srcDir).filter(f => /\.(css|js)$/.test(f)).map(f => ({ f, t: mtime(path.join(srcDir, f)) }))
    : [];
  const newer = srcs.filter(s => artT !== null && s.t > artT);
  if (artT === null) {
    fail(`the manifest points at a bundle that does not exist: ${manifest.css}`, [
      '  Every page that links it renders unstyled.',
      '  WHAT TO DO:  node _internal/gen-shell.mjs',
    ]);
  } else if (newer.length) {
    const detail = [
      `  ${manifest.css} was built ${new Date(artT).toISOString().replace('T', ' ').slice(0, 19)},`,
      `  but ${newer.length} source file(s) have been edited since:`,
      ...newer.map(s => `    _internal/shell/${s.f}   (${((s.t - artT) / 3600000).toFixed(1)} h newer)`),
      '',
      '  The shipped bundle does not contain those edits. prebuild runs gen-shell',
      '  first on every real build, so this self-corrects at build time — which is',
      '  why it is a warning. It is still worth fixing now, because everything that',
      '  reads the manifest (check-rtl, the /_proto pages, sw.js) is meanwhile',
      '  looking at the OLD bundle.',
      '',
      '  WHAT TO DO:  node _internal/gen-shell.mjs',
    ];
    if (STRICT) fail(`shell bundle is older than ${newer.length} of its sources`, detail);
    else warnings.push([`shell bundle is older than ${newer.length} of its sources`, ...detail]);
  } else {
    console.log(`  ✓ shell bundle ${manifest.css} is newer than all of _internal/shell/`);
  }
}

/* ===========================================================================
   4. unowned snapshots — reported, never fatal
   ======================================================================== */
const unowned = allHtml.filter(rel => !owned.has(rel) && !UNOWNED_IGNORE.some(re => re.test(rel)));
if (unowned.length) {
  const byDir = new Map();
  for (const rel of unowned) {
    const d = rel.includes('/') ? rel.slice(0, rel.lastIndexOf('/')) : '(root)';
    byDir.set(d, (byDir.get(d) || 0) + 1);
  }
  warnings.push([
    `${unowned.length} snapshot(s) are hand-written — no generator will ever refresh them`,
    ...[...byDir].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([d, n]) => `  ${String(n).padStart(4)}  astro/public/${d}/`),
    '  These are the pages the Phase 2 ship order reaches last. Nothing here is',
    '  wrong — the list exists so that "the generators are up to date" is never',
    '  mistaken for "every page is up to date".',
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
  console.error(`check-snapshots: ${failures.length} FAILURE(S) — do NOT push.`);
  process.exit(1);
}
console.log('check-snapshots: ALL PASS');
