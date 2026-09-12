#!/usr/bin/env node
/* =============================================================================
   check-page-coverage.mjs — every content file must have produced a real page
   Phase 2 build gates · wired into the repo-root `npm run verify`

   WHY THIS EXISTS
   ---------------
   check-file-count.mjs enforces a MAXIMUM: never ship more files than Cloudflare
   will accept. This is the missing half — the MINIMUM. Until this file existed,
   nothing between "the build produced zero pages" and `wrangler deploy` counted
   pages, and a partial deploy is worse than no deploy: production keeps serving
   the last good Worker version until you replace it with a smaller one.

   This is not hypothetical. In June 2026 a green build shipped a dist with no
   content pages in it. The mechanism (_internal/BUILD-ROOTCAUSE-2026-09.md §2,
   §6) was never a crash — a crash exits non-zero and the deploy step is skipped.
   It was silence:

     * getCollection() on a missing or renamed collection console.warn()s and
       returns [] — it does not throw (astro/dist/content/runtime.js).
     * [] → getStaticPaths returns [] → that route emits zero pages.
     * The locale routes and src/lib/locales.ts wrapped those calls in
       try {} catch {}, so even a real error became an empty page list.
     * astro exits 0. Only astro/public/** survives into dist. The deploy
       succeeds. The site is still "up", and every review, roundup and article
       is gone.

   Content collections were retired on 2026-09-09 and the routes now read JSON
   from disk (astro/src/lib/content-fs.ts), which takes getCollection out of the
   picture — but not the failure class. content-fs.ts locates src/content by
   walking up from wherever Rollup put the bundled module; get that wrong and
   readdirSync raises ENOENT, slugsOf() returns [], getStaticPaths returns [],
   and the build is green with zero pages again. That exact thing was MEASURED
   happening on 2026-09-09 with the obvious `../content` spelling. content-fs.ts
   now throws rather than returning [] for that case, and this gate is the belt
   to that brace: it does not care WHY pages are missing, only that they are.

   WHAT IT CHECKS
   --------------
   1. Every directory under astro/src/content maps to a route. reviews /
      roundups / articles render at dist/<slug>.html; <kind>-<loc> renders at
      dist/<loc>/<slug>.html. A directory whose name does not fit that shape is
      a hard failure, not a skip: an unmapped directory is precisely a directory
      that produces no pages, quietly.
   2. Every *.json in those directories has a corresponding .html in dist. The
      filename stem IS the slug — verified across all 19,530 files, 0 exceptions
      — and _internal/qa/validate-content.mjs re-checks that invariant on every
      build, so no index is needed here either.
   3. Every one of those pages is larger than MIN_PAGE_BYTES. A stub is as bad
      as a missing page: it deploys, it returns 200, and it ranks. For scale,
      the smallest real page in a complete dist measured 25,015 bytes on
      2026-09-09 — the floor below is twelve times under the smallest thing this
      site has ever legitimately emitted, so it fires only on genuine wreckage.
   4. Every content directory holding at least one JSON produced at least one
      page. Arithmetically implied by (2); reported separately on purpose,
      because "this whole locale is missing" and "these nine pages are missing"
      have different causes and different fixes, and the first is the June class.
   5. Every *.html under astro/public survived into dist at the same relative
      path — the locale hub snapshots (public/<loc>/*.html), the ~229 city /
      area / activities / region hubs at the root, and index.html. astro copies
      public/ into dist wholesale and prebuild's gen-hubs.mjs writes into
      public/ immediately before it, so a snapshot present in public and absent
      from dist means the copy did not finish.
      DELIBERATE WIDENING (2026-09-09): the spec asked for public/<loc>/*.html
      plus dist/index.html. Checking every public *.html instead is the same
      check with the same failure mode and no locale list to keep in sync, and
      index.html is simply one member of it. Singling out the homepage while
      leaving 88 city hubs unchecked would have been the arbitrary choice.

   WHAT IT DELIBERATELY DOES NOT HAVE
   ----------------------------------
   An environment-variable override. check-file-count.mjs has one because a
   ceiling can legitimately need a one-run bypass while you are moving images to
   R2. A floor cannot: the expected set is DERIVED from the content on disk, so
   content that is genuinely gone shrinks the expectation by itself. An override
   here would only ever be used to ship the outage this file exists to prevent.

   Usage:
     node _internal/qa/check-page-coverage.mjs [distDir]
   Also importable: assertPageCoverage(distDir) throws with the full message.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

const DEFAULT_DIST = path.join(ROOT, 'astro', 'dist');
const DEFAULT_CONTENT = path.join(ROOT, 'astro', 'src', 'content');
const DEFAULT_PUBLIC = path.join(ROOT, 'astro', 'public');

/* ---------------------------------------------------------------------------
   THE FLOOR.

   Bytes, and compared with > rather than >=. Raising it is safe. Lowering it
   means deciding that a smaller page is acceptable, which is a content
   decision, not a build one.
   ------------------------------------------------------------------------ */
export const MIN_PAGE_BYTES = 2048;

/* How many bad paths to print before "… and N more". The rest are counted, not
   listed: a build that lost 19,530 pages must not print 19,530 lines. */
export const MAX_LISTED = 20;

/* astro.config.mjs sets build.format 'file' and trailingSlash 'never', so a
   route emits dist/<slug>.html — flat, no per-page directory. If that config
   ever changes this mapping changes with it, and this gate goes red the same
   day, which is the correct outcome. */
const DIR_RE = /^(reviews|roundups|articles)(?:-([a-z]{2}))?$/;

/* Repo-relative for readability, absolute when the path is outside the repo —
   a dist somewhere else prints as itself rather than as ../../../AppData/… */
const rel = (p) => {
  const r = path.relative(ROOT, p).split(path.sep).join('/');
  return !r ? p : r.startsWith('..') ? p.split(path.sep).join('/') : r;
};

function fail(lines) {
  const err = new Error(['', '─'.repeat(78), ...lines, '─'.repeat(78)].join('\n'));
  err.taPageCoverage = true;
  throw err;
}

/* a section rule, ruled out to the same width as the box */
const hdr = (label) => `  ── ${label} `.padEnd(78, '─');

/* ---------------------------------------------------------------------------
   expected — what the content tree says dist must contain
   ------------------------------------------------------------------------ */
export function expectedPages(contentDir = DEFAULT_CONTENT) {
  const dirs = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const unmapped = dirs.filter((d) => !DIR_RE.test(d));
  if (unmapped.length) {
    fail([
      `PAGE-COVERAGE GATE FAILED — ${unmapped.length} content director${unmapped.length === 1 ? 'y does' : 'ies do'} not map to a route.`,
      '',
      ...unmapped.map((d) => `    ${rel(path.join(contentDir, d))}`),
      '',
      '  This gate can only verify pages it knows how to name. A directory that does',
      '  not match  (reviews|roundups|articles)[-<2-letter locale>]  is a directory',
      '  the build produces no pages for AND that no gate notices — the June 2026',
      '  failure, one directory at a time.',
      '',
      '  WHAT TO DO:',
      '   * A real new collection needs three things, not one: a schema entry in',
      '     SCHEMA_BY_DIR (astro/src/lib/schemas.mjs), a route that reads it (see',
      '     _internal/hub-i18n/gen-new-locale-routes.mjs — it writes the seven locale',
      '     routes from one template), and — if the directory name is a new SHAPE',
      '     rather than a new locale — DIR_RE in this file.',
      '   * Scratch or staging data does not belong under astro/src/content/. Move it.',
    ]);
  }

  return dirs.map((dir) => {
    const [, kind, loc = ''] = dir.match(DIR_RE);
    const slugs = fs.readdirSync(path.join(contentDir, dir))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.slice(0, -5))
      .sort();
    return { dir, kind, loc, slugs, out: slugs.map((s) => (loc ? `${loc}/${s}.html` : `${s}.html`)) };
  });
}

/* ---------------------------------------------------------------------------
   expected — every *.html astro copies out of public/
   ------------------------------------------------------------------------ */
export function expectedSnapshots(publicDir = DEFAULT_PUBLIC) {
  const out = [];
  const walk = (abs, relDir) => {
    let entries;
    try { entries = fs.readdirSync(abs, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const r = relDir ? `${relDir}/${e.name}` : e.name;
      if (e.isDirectory()) walk(path.join(abs, e.name), r);
      else if (e.isFile() && e.name.endsWith('.html')) out.push(r);
    }
  };
  walk(publicDir, '');
  return out.sort();
}

/* ---------------------------------------------------------------------------
   measure — never throws on a coverage problem, so a caller can inspect it
   ------------------------------------------------------------------------ */
export function measurePageCoverage(distDir, { contentDir = DEFAULT_CONTENT, publicDir = DEFAULT_PUBLIC } = {}) {
  const groups = expectedPages(contentDir);
  const missing = [];          /* {rel, why, bytes, dir} — pages, in content order */
  const emptyDirs = [];        /* content dirs with >=1 JSON and 0 pages           */
  const emptyContentDirs = []; /* content dirs with 0 JSON — a note, not a failure */
  const perDir = [];

  for (const g of groups) {
    let found = 0, miss = 0, stub = 0;
    for (const r of g.out) {
      let st = null;
      try { st = fs.statSync(path.join(distDir, r)); } catch { /* ENOENT */ }
      if (!st || !st.isFile()) { miss++; missing.push({ rel: r, why: 'missing', bytes: null, dir: g.dir }); continue; }
      if (st.size <= MIN_PAGE_BYTES) { stub++; missing.push({ rel: r, why: 'stub', bytes: st.size, dir: g.dir }); continue; }
      found++;
    }
    perDir.push({ dir: g.dir, expected: g.out.length, found, missing: miss, stub });
    if (g.out.length === 0) emptyContentDirs.push(g.dir);
    else if (found === 0) emptyDirs.push({ dir: g.dir, expected: g.out.length });
  }

  const snapshots = expectedSnapshots(publicDir);
  const missingSnapshots = snapshots.filter((r) => !fs.existsSync(path.join(distDir, r)));
  /* THE HOMEPAGE, beyond "the file is there".
   *
   * Existence was the only assertion, and existence is what the old homepage
   * also satisfied for the three days it sat at / while a commit message said
   * the planner-first page was "verified and deployed". Nothing in the build
   * disagreed, because nothing in the build looked at what was in the file.
   *
   * So: it must be on the app shell, it must carry analytics, and it must not
   * be a stub. Each check names one thing that has actually gone wrong here —
   * a page off the shell, a page with no GA4, a truncated generator run. */
  const homeFile = path.join(distDir, 'index.html');
  const indexHtml = fs.existsSync(homeFile);
  const homeIssues = [];
  if (indexHtml) {
    const h = fs.readFileSync(homeFile, 'utf8');
    if (h.length < 20_000) homeIssues.push(`dist/index.html is ${h.length} B — under the 20,000 B floor, so it is a stub or a truncated generator run`);
    if (!h.includes('ta-topbar')) homeIssues.push('dist/index.html carries no .ta-topbar — the homepage is NOT on the app shell');
    if (!h.includes('ta-tabbar')) homeIssues.push('dist/index.html carries no .ta-tabbar — the homepage is NOT on the app shell');
    if (!/G-[A-Z0-9]{8,}/.test(h)) homeIssues.push('dist/index.html has no GA4 measurement id — the site\'s most-visited page would go dark');
    if (/name="robots"[^>]*noindex/i.test(h)) homeIssues.push('dist/index.html is marked noindex — a prototype head reached the site root');
  }

  const expected = perDir.reduce((n, d) => n + d.expected, 0);
  const found = perDir.reduce((n, d) => n + d.found, 0);

  return {
    distDir, contentDir, publicDir,
    perDir, expected, found, missing, emptyDirs, emptyContentDirs,
    snapshots: snapshots.length, missingSnapshots, indexHtml, homeIssues,
    ok: missing.length === 0 && missingSnapshots.length === 0 && indexHtml && homeIssues.length === 0,
  };
}

/* ---------------------------------------------------------------------------
   assert — throws with a message that says what to do, not just what broke
   ------------------------------------------------------------------------ */
export function assertPageCoverage(distDir = DEFAULT_DIST, { log = console.log, ...opts } = {}) {
  if (!fs.existsSync(distDir)) {
    /* Deliberately NOT the soft "not checked" that check-file-count.mjs uses.
       That gate runs in prebuild, before astro clears dist, where an absent
       tree is normal. This one runs after the build, where an absent tree means
       the build produced nothing at all. */
    fail([
      `PAGE-COVERAGE GATE FAILED — ${rel(distDir)} does not exist.`,
      '',
      '  There is nothing to deploy. A failed astro build wipes dist rather than',
      '  leaving the previous one in place, so this is what an interrupted or',
      '  OOM-killed build looks like from here.',
      '',
      '  WHAT TO DO:  npm run build   (from the repo root) and read its exit code.',
      '  Production is unaffected meanwhile — it is served by the Worker version',
      '  already deployed. Deploy nothing until a build succeeds.',
    ]);
  }

  const r = measurePageCoverage(distDir, opts);

  if (r.ok) {
    log(`  ✓ page coverage: ${r.found}/${r.expected} content pages present in ${rel(distDir)}, all > ${MIN_PAGE_BYTES} B`);
    log(`    ${r.perDir.length} content directories, every non-empty one produced pages`);
    log(`    ${r.snapshots} public/*.html snapshots copied through · dist/index.html present`);
    if (r.emptyContentDirs.length) {
      log(`    NOTE: ${r.emptyContentDirs.length} content director${r.emptyContentDirs.length === 1 ? 'y holds' : 'ies hold'} no JSON and produced no pages: ${r.emptyContentDirs.join(', ')}`);
    }
    return r;
  }

  const nMissing = r.missing.filter((m) => m.why === 'missing').length;
  const nStub = r.missing.filter((m) => m.why === 'stub').length;

  const lines = [];
  lines.push(`PAGE-COVERAGE GATE FAILED — ${r.found} of ${r.expected} expected pages are present.`);
  lines.push('');
  lines.push(`  dist     : ${rel(distDir)}`);
  lines.push(`  content  : ${rel(r.contentDir)}  (${r.perDir.length} directories, ${r.expected} entries)`);
  lines.push(`  missing  : ${nMissing}`);
  lines.push(`  stubs    : ${nStub}   (present but ≤ ${MIN_PAGE_BYTES} bytes)`);
  if (r.missingSnapshots.length) lines.push(`  snapshots: ${r.missingSnapshots.length} of ${r.snapshots} public/*.html files did not reach dist`);
  if (!r.indexHtml) lines.push('  homepage : dist/index.html IS MISSING');
  for (const m of (r.homeIssues || [])) lines.push('  homepage : ' + m);
  lines.push('');
  lines.push('  WHY THIS MATTERS: deploying this tree REPLACES the live site with it.');
  lines.push('  Cloudflare accepts it happily — a partial dist is a valid dist. Every page');
  lines.push('  missing here 404s in production the moment the deploy finishes, while the');
  lines.push('  sitemap, the search index and every hub page still link to all of them.');

  /* (4) the June class, first and loudest, because the fix is a different one */
  if (r.emptyDirs.length) {
    lines.push('');
    lines.push(hdr('WHOLE DIRECTORIES PRODUCED ZERO PAGES'));
    for (const d of r.emptyDirs) lines.push(`      ${d.dir.padEnd(16)}${String(d.expected).padStart(6)} entries → 0 pages`);
    lines.push('');
    lines.push('      This is not "some pages are missing". This is a route that ran and');
    lines.push('      emitted nothing — the exact shape of the June 2026 partial deploy.');
    lines.push('      In order of likelihood:');
    lines.push('       a. The route file is gone or was never generated. Check that');
    lines.push('          astro/src/pages/<loc>/[slug].astro exists and that its');
    lines.push('          getStaticPaths calls slugsOf() for the directory named above.');
    lines.push('          _internal/hub-i18n/gen-new-locale-routes.mjs regenerates all seven.');
    lines.push('       b. The content root was not found, so slugsOf() returned [] for');
    lines.push('          everything. astro/src/lib/content-fs.ts throws rather than');
    lines.push('          returning [] for that case — look for its error in the build log');
    lines.push('          before assuming the build was clean.');
    lines.push('       c. The directory was renamed and only half the references followed.');
    lines.push('      Re-read the WHOLE build log. This failure never looks like a failure');
    lines.push('      at the end of a log; it looks like a fast, quiet, successful build.');
  }

  if (r.missing.length) {
    lines.push('');
    const nShown = Math.min(MAX_LISTED, r.missing.length);
    lines.push(hdr(`FIRST ${nShown} BAD PAGE${nShown === 1 ? '' : 'S'} (relative to dist)`));
    for (const m of r.missing.slice(0, MAX_LISTED)) {
      lines.push(`      ${m.rel.padEnd(62)}${m.why === 'stub' ? `STUB ${m.bytes} B` : 'MISSING'}`);
    }
    if (r.missing.length > MAX_LISTED) lines.push(`      … and ${r.missing.length - MAX_LISTED} more`);
    if (nStub) {
      lines.push('');
      lines.push('      A STUB is a page that rendered and came out nearly empty. It is not a');
      lines.push('      build that stopped early — that page has its own entry, its own layout');
      lines.push('      call and its own output, and what came back was a few hundred bytes.');
      lines.push('      Read the entry named above: almost always a data shape the layout did');
      lines.push('      not expect, so every block guarded itself out and only the shell was');
      lines.push('      emitted. It deploys, it returns 200 and it ranks, which is why it is');
      lines.push('      counted as a failure rather than a warning.');
    }
  }

  if (r.missingSnapshots.length) {
    lines.push('');
    lines.push(hdr('PUBLIC SNAPSHOTS THAT DID NOT REACH DIST'));
    for (const s of r.missingSnapshots.slice(0, MAX_LISTED)) lines.push(`      ${rel(r.publicDir)}/${s}`);
    if (r.missingSnapshots.length > MAX_LISTED) lines.push(`      … and ${r.missingSnapshots.length - MAX_LISTED} more`);
    lines.push('');
    lines.push('      astro copies public/ into dist verbatim, and prebuild\'s gen-hubs.mjs');
    lines.push('      writes the hub snapshots into public/ immediately before it. A file in');
    lines.push('      public and not in dist means the copy did not finish: the build was');
    lines.push('      interrupted, or dist was edited by hand afterwards. Rebuild — do not');
    lines.push('      copy the missing files across by hand.');
  }

  lines.push('');
  lines.push(hdr('PER-DIRECTORY COVERAGE'));
  lines.push('      directory       expected     found   missing     stub');
  for (const d of r.perDir) {
    const flag = d.expected > 0 && d.found === 0 ? '  ← ZERO' : d.missing + d.stub > 0 ? '  ←' : '';
    lines.push(`      ${d.dir.padEnd(16)}${String(d.expected).padStart(7)}${String(d.found).padStart(10)}${String(d.missing).padStart(10)}${String(d.stub).padStart(9)}${flag}`);
  }

  lines.push('');
  lines.push('  WHAT TO DO:');
  lines.push('');
  lines.push('   1. Do NOT deploy. The Worker version currently live is complete; this tree');
  lines.push('      is not, and deploying replaces the former with the latter.');
  lines.push('   2. Rebuild from the repo root and read the exit code:  npm run build');
  lines.push('      Then re-run this gate:                              npm run verify');
  lines.push('   3. If it fails again in the same directories the cause is structural, not');
  lines.push('      transient — work the list above rather than rebuilding a third time.');
  lines.push('   4. Do NOT "fix" this by narrowing what is expected. The expectation is');
  lines.push('      derived from the JSON files on disk: content that is genuinely retired');
  lines.push('      is retired by deleting its .json, and this gate shrinks with it. There');
  lines.push('      is deliberately no environment-variable override — a ceiling can need a');
  lines.push('      one-run bypass, a floor never can.');

  fail(lines);
}

/* ---------------------------------------------------------------------------
   CLI
   ------------------------------------------------------------------------ */
const isCli = /(^|[\\/])check-page-coverage\.mjs$/.test(process.argv[1] || '');
if (isCli) {
  const dist = path.resolve(process.argv[2] || DEFAULT_DIST);
  console.log('check-page-coverage — every content file must have produced a real page in dist');
  const t0 = Date.now();
  try {
    assertPageCoverage(dist);
    console.log(`check-page-coverage: ALL PASS (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  } catch (e) {
    console.error(e.message);
    console.error('check-page-coverage: FAILED — do NOT deploy. A partial deploy is worse than no deploy.');
    process.exit(1);
  }
}
