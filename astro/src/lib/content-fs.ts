// Read one content entry from disk, at render time.
//
// This replaces Astro's content collections for thailandaddict.com. The content layer made every
// build cost O(entire corpus) four times over — 19,530 JSON files devalue-serialized into a single
// 464 MB data-store.json, that file handed to Rollup as ONE JavaScript module, an AST for it held
// across the whole bundle, and every entry's full data object copied into getStaticPaths props —
// for a site that uses none of the content layer's features (no astro:assets, no render(), no
// entry.body). Peak was ~3.65 GB on an 8 GB machine. Reading the same 19,530 files one at a time
// costs 68 MB peak RSS in 6 s. Full diagnosis: _internal/BUILD-ROOTCAUSE-2026-09.md.
//
// The contract that makes this safe, and the one to keep:
//   * getStaticPaths returns ONLY { kind, dir, availableLocales } in props — never the data object.
//     Putting `data` back in props re-materialises the whole corpus in memory and undoes the fix.
//   * The route reads its one entry below the fence, so exactly one is live at a time.
//   * Validation moved to a prebuild gate: _internal/qa/validate-content.mjs runs the same zod
//     schemas (now in src/lib/schemas.mjs) over every file before astro starts. It did not vanish.
//
// astro/package.json pins the build heap at 4096 MB deliberately, well under what O(corpus)
// behaviour needs, so a regression here fails loudly on the next build instead of eating the machine.
//
// COSMETIC RESIDUE, measured 2026-09-09: with content.config.ts deleted, Astro 5.18 still
// auto-generates an implicit *markdown* collection for each directory under src/content/ and warns
// that it found no .md files — 27 WARN lines per build, one per directory. They are noise, not a
// problem: node_modules/.astro/data-store.json went from 464,308,445 bytes to 1,615 (metadata only,
// zero entries). An empty `export const collections = {}` does NOT silence them (autogenerateCollections
// in astro/dist/content/utils.js runs whenever src/content/ exists and no collection uses a loader);
// only moving the corpus out of src/content/ would, and that is 19,530 paths hard-coded across
// _internal/. Not worth it. If a real build warning ever needs to be visible here, filter on
// "glob-loader".

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* ---------------------------------------------------------------------------
   Where the corpus is.

   NOT `path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content')`.
   That is the obvious spelling and it is wrong, silently, in exactly the way that
   matters: in `astro build` Rollup bundles this module into dist/chunks/*.mjs, so
   import.meta.url is
       file:///…/astro/dist/chunks/ArticleLayout_<hash>.mjs
   and '../content' resolves to astro/dist/content, which does not exist. Every
   readdirSync throws ENOENT, every slugsOf() returns [], every getStaticPaths
   returns [] — and the build finishes GREEN with ZERO pages. Measured 2026-09-09
   on a real build; it is the same failure class that shipped a partial dist in
   June 2026. (src/lib/locales.ts has always resolved '../../public' the same way
   and works only by coincidence: dist/chunks and src/lib are both two levels below
   the project root. Do not rely on that twice.)

   So: find the project root by walking up from wherever this module ended up —
   and from cwd, since `npm run build` runs in astro/ — looking for src/content.
   Resolved once at module load. If it cannot be found we THROW, because the
   alternative is a green build that publishes nothing.
   ------------------------------------------------------------------------ */
function findContentRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));

  // dev / test: this module really is at src/lib, so ../content is the corpus.
  const direct = path.resolve(here, '../content');
  if (fs.existsSync(direct)) return direct;

  // build: walk up to the project root and take src/content from there.
  for (const start of [here, process.cwd()]) {
    let d = path.resolve(start);
    for (let i = 0; i < 10; i++) {
      const candidate = path.join(d, 'src', 'content');
      if (fs.existsSync(candidate)) return candidate;
      const up = path.dirname(d);
      if (up === d) break;
      d = up;
    }
  }

  throw new Error(
    'content-fs: could not locate src/content.\n' +
    `  searched upward from ${here}\n` +
    `  and from cwd ${process.cwd()}\n` +
    '  Every page on this site is read from that directory at render time. Rather than\n' +
    '  build zero pages and exit 0 — which is how a partial dist shipped in June 2026 —\n' +
    '  this fails the build. Run the build from astro/ (npm run build), or fix the path.');
}

const ROOT = findContentRoot();

// VERIFIED 2026-09-09 across all 19,530 files: slug === filename stem, 0 exceptions,
// 0 duplicate slugs within a collection. Do not add an index; it is not needed.
// (Also verified: every content dir is flat — no subdirectories — so a non-recursive
// readdirSync sees exactly what the old glob('**/*.json') loader saw. Both invariants
// are re-checked on every build by _internal/qa/validate-content.mjs.)
const _slugs: Record<string, string[]> = {};
export function slugsOf(dir: string): string[] {
  if (_slugs[dir]) return _slugs[dir];
  let out: string[] = [];
  try {
    out = fs.readdirSync(path.join(ROOT, dir))
             .filter(f => f.endsWith('.json'))
             .map(f => f.slice(0, -5));
  } catch (e: any) {
    // A genuinely absent collection directory is legitimate (getCollection used to warn
    // and return [] for the same case). Anything else — a permission error, a device
    // error — is not, and must not be swallowed into an empty page list.
    if (e?.code !== 'ENOENT') throw e;
    out = [];
  }
  return (_slugs[dir] = out);
}

/* ---------------------------------------------------------------------------
   The three zod .transform()s that have to survive.

   The old schemas did more than validate: three fields were declared
   `z.union([z.string(), z.number()]).transform(String)` (or transformed in a
   .map), so the layouts have always received them as STRINGS even where the JSON
   holds a number. On disk, 48,554 of them are numbers.

   For almost every use that is invisible — Astro renders a number child through
   destination.write(n) -> n.toString(), byte-identical to String(n). But
   ArticleLayout builds its Leaflet pin array with JSON.stringify(mapPins), and
   there `"rank":"1"` and `"rank":1` are different bytes. The A/B render caught it
   on bangkok-michelin-fine-dining (5 pages, th/en/zh/ru/ko) and nothing else.

   So the coercions come along. They are O(one entry) — a few dozen assignments
   against a JSON.parse that costs 100× more — and they keep the layouts receiving
   exactly the shape they were written against, rather than leaving a string
   guarantee that silently became "string or number". Removing them changes
   emitted HTML. Dispatch is by directory, mirroring SCHEMA_BY_DIR in
   src/lib/schemas.mjs.
   ------------------------------------------------------------------------ */
function applySchemaCoercions(dir: string, data: any): any {
  if (dir.startsWith('roundups')) {
    // roundupSchema: entries[...].transform(arr => arr.map(e => ({...e, score: String(e.score)})))
    if (Array.isArray(data?.entries)) {
      for (const e of data.entries) if (e && e.score !== undefined) e.score = String(e.score);
    }
  } else if (dir.startsWith('articles')) {
    // articleBlock: restaurant.rank and ranked.items[].rank are z.union([string, number]).transform(String)
    if (Array.isArray(data?.blocks)) {
      for (const b of data.blocks) {
        if (!b) continue;
        if (b.kind === 'restaurant') { if (b.rank !== undefined) b.rank = String(b.rank); }
        else if (b.kind === 'ranked' && Array.isArray(b.items)) {
          for (const it of b.items) if (it && it.rank !== undefined) it.rank = String(it.rank);
        }
      }
    }
  }
  return data;
}

export function readEntry(dir: string, slug: string): any {
  return applySchemaCoercions(dir, JSON.parse(fs.readFileSync(path.join(ROOT, dir, `${slug}.json`), 'utf8')));
}

// The project root (the directory holding src/content) — src/lib/locales.ts reads
// public/<loc>/ from here rather than guessing its own depth. See findContentRoot().
export const PROJECT_ROOT = path.resolve(ROOT, '..', '..');
