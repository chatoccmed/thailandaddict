#!/usr/bin/env node
/* =============================================================================
   validate-content.mjs — the zod validation Astro used to do, without Astro
   Phase 2 build gates · wired into astro/prebuild.mjs

   WHY THIS EXISTS
   ---------------
   Until 2026-09-09 every content JSON file was validated by Astro's content
   layer, because astro/src/content.config.ts declared 27 collections with zod
   schemas and Astro parsed every file on every build. That validation was real
   and it caught things. It was also the reason the build could not finish: the
   content layer serialized all 19,530 files into a single 464 MB
   data-store.json and handed it to Rollup as one JavaScript module, four
   O(corpus) copies deep, on an 8 GB machine. Full diagnosis:
   _internal/BUILD-ROOTCAUSE-2026-09.md.

   The routes now read one JSON file at a time from disk (astro/src/lib/
   content-fs.ts) and content.config.ts is gone. The schemas are NOT gone: they
   moved verbatim to astro/src/lib/schemas.mjs, and this gate runs them over
   every file BEFORE astro starts. Same schemas, same failures, in seconds and a
   few hundred MB instead of a 17-minute build and 3.6 GB.

   WHAT IT CHECKS
   --------------
   1. Every directory under astro/src/content has a schema. A renamed or new
      directory is a hard failure, not a silent skip — a directory the build
      does not know about produces zero pages and a green build (the June 2026
      failure class).
   2. Every *.json file safeParses against its directory's schema. Fails on the
      FIRST bad file, naming the file, the zod path and the message.
   3. slug === filename stem, and no duplicate slugs within a directory. This is
      not cosmetic: content-fs.ts locates an entry BY FILENAME and the layouts
      emit canonical / hreflang / language-switcher URLs from data.slug. If the
      two disagree the page builds at one URL and claims another.

   Usage:
     node _internal/qa/validate-content.mjs [contentDir]
   Also imported by astro/prebuild.mjs, which lets it throw and fail the build.
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_BY_DIR } from '../../astro/src/lib/schemas.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const DEFAULT_CONTENT = path.join(ROOT, 'astro', 'src', 'content');

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/') || p;
const schemaNameFor = (dir) =>
  dir.startsWith('reviews') ? 'reviewSchema' : dir.startsWith('roundups') ? 'roundupSchema' : 'articleSchema';

function fail(lines) {
  const err = new Error(['', '─'.repeat(78), ...lines, '─'.repeat(78)].join('\n'));
  err.taContentValidation = true;
  throw err;
}

export function assertContentValid(contentDir = DEFAULT_CONTENT, { log = console.log } = {}) {
  if (!fs.existsSync(contentDir)) {
    log(`  content validation: ${rel(contentDir)} does not exist — NOT CHECKED.`);
    log('  (the isolated _internal/build-test.sh copy has no content tree of its own)');
    return { checked: false };
  }

  const dirs = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const unknown = dirs.filter((d) => !SCHEMA_BY_DIR[d]);
  if (unknown.length) {
    fail([
      `CONTENT VALIDATION FAILED — ${unknown.length} content director${unknown.length === 1 ? 'y has' : 'ies have'} no schema.`,
      '',
      ...unknown.map((d) => `    ${rel(path.join(contentDir, d))}`),
      '',
      '  A directory the build does not know about is neither validated nor routed:',
      '  it produces zero pages and a green build. That is how a partial dist shipped',
      '  in June 2026.',
      '',
      '  WHAT TO DO:',
      '   * If this is a real new collection, add it to SCHEMA_BY_DIR in',
      '     astro/src/lib/schemas.mjs AND add a route that reads it (see',
      '     _internal/hub-i18n/gen-new-locale-routes.mjs, which writes the seven',
      '     locale routes from one template).',
      '   * If it is scratch data, move it out of astro/src/content/.',
    ]);
  }

  const perDir = [];
  let files = 0;

  for (const dir of dirs) {
    const schema = SCHEMA_BY_DIR[dir];
    const abs = path.join(contentDir, dir);
    const names = fs.readdirSync(abs).filter((f) => f.endsWith('.json')).sort();
    const seen = new Map();

    for (const name of names) {
      const file = path.join(abs, name);
      const stem = name.slice(0, -5);
      files++;

      let raw;
      try {
        raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch (e) {
        fail([
          `CONTENT VALIDATION FAILED — ${rel(file)} is not valid JSON.`,
          '',
          `    ${e.message}`,
          '',
          '  Nothing downstream can read this file. Fix the syntax and rebuild.',
        ]);
      }

      const r = schema.safeParse(raw);
      if (!r.success) {
        const issues = r.error.issues.slice(0, 12);
        fail([
          `CONTENT VALIDATION FAILED — ${rel(file)} does not match its schema.`,
          '',
          ...issues.map((i) => `    ${i.path.length ? i.path.join('.') : '(root)'}: ${i.message}`),
          ...(r.error.issues.length > issues.length
            ? [`    … and ${r.error.issues.length - issues.length} more problem(s) in this file`]
            : []),
          '',
          `  The schema is ${schemaNameFor(dir)} in astro/src/lib/schemas.mjs. These are the`,
          '  same schemas astro/src/content.config.ts enforced until 2026-09-09; they',
          '  moved, they did not loosen. Fix the file — or change the schema deliberately',
          '  if the shape is genuinely new.',
        ]);
      }

      // content-fs.ts locates entries by filename; the layouts build URLs from data.slug.
      if (raw.slug !== stem) {
        fail([
          `CONTENT VALIDATION FAILED — ${rel(file)} has slug "${raw.slug}" but filename stem "${stem}".`,
          '',
          '  astro/src/lib/content-fs.ts finds an entry by FILENAME, so this page would',
          `  build at /${stem} while its canonical, hreflang and language-switcher links`,
          `  all say /${raw.slug}. Rename the file to ${raw.slug}.json, or fix the slug field.`,
        ]);
      }
      if (seen.has(raw.slug)) {
        fail([
          `CONTENT VALIDATION FAILED — duplicate slug "${raw.slug}" in ${dir}.`,
          '',
          `    ${rel(path.join(abs, seen.get(raw.slug)))}`,
          `    ${rel(file)}`,
          '',
          '  Two entries claiming one URL: the second silently overwrites the first.',
        ]);
      }
      seen.set(raw.slug, name);
    }

    perDir.push([dir, names.length]);
  }

  log(`  ✓ content validation: ${files} files in ${dirs.length} directories, all valid`);
  const empty = perDir.filter(([, n]) => n === 0).map(([d]) => d);
  if (empty.length) {
    log(`    NOTE: ${empty.length} content director${empty.length === 1 ? 'y is' : 'ies are'} empty and will produce no pages: ${empty.join(', ')}`);
  }
  return { checked: true, files, dirs: perDir };
}

/* ---------------------------------------------------------------------------
   CLI
   ------------------------------------------------------------------------ */
const isCli = /(^|[\\/])validate-content\.mjs$/.test(process.argv[1] || '');
if (isCli) {
  const dir = path.resolve(process.argv[2] || DEFAULT_CONTENT);
  console.log('validate-content — the zod schemas that used to live in astro/src/content.config.ts');
  const t0 = Date.now();
  try {
    const r = assertContentValid(dir);
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    const mb = (process.memoryUsage().rss / 1048576).toFixed(0);
    console.log(r.checked ? `validate-content: ALL PASS (${secs}s, RSS ${mb} MB)` : 'validate-content: NOT CHECKED');
  } catch (e) {
    console.error(e.message);
    console.error('validate-content: FAILED — the build would ship this. Fix it first.');
    process.exit(1);
  }
}
