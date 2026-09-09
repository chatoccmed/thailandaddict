// Astro prebuild: refresh homepage data (stats + 77-province map) and sitemap
// from current content before every build. Runs on the full repo (Cloudflare:
// `cd astro && npm run build`). No-ops gracefully where the generators aren't
// reachable (e.g. the isolated _internal/build-test.sh copy), so it never breaks
// a content-only validation build.
// gen-near-me runs AFTER gen-feeds (it reads the just-written feeds/*.json to build the /near-me geo-index).
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// ── content validation gate ──────────────────────────────────────────────────
// Runs before everything else, including gen-shell. Until 2026-09-09 Astro's content layer
// validated all 19,530 JSON files against the zod schemas in src/content.config.ts; that file is
// gone (it was the reason the build could not finish — _internal/BUILD-ROOTCAUSE-2026-09.md), and
// the schemas moved verbatim to src/lib/schemas.mjs. This runs them, plus the slug === filename
// invariant that src/lib/content-fs.ts depends on. It is first because it is the cheapest gate
// (~20s) and because every generator below reads the same JSON: a malformed file should stop the
// build here, not surface as a broken hub page eight generators later.
{
  const gate = new URL('../_internal/qa/validate-content.mjs', import.meta.url);
  if (!existsSync(fileURLToPath(gate))) {
    console.log('prebuild: skipped the content validation gate (not present in this build context)');
  } else {
    const { assertContentValid } = await import(gate.href);
    // throws with the offending file, the zod path and the message; let it fail the build
    assertContentValid(fileURLToPath(new URL('./src/content', import.meta.url)));
  }
}

// gen-shell runs FIRST OF THE GENERATORS (blueprint §2.1/§4.0): it compiles tokens.css + shell.css + compat.css
// and shell.js + sheet.js + th-segment.js into content-hashed artifacts and writes
// astro/src/data/shell-manifest.json. Everything downstream reads the hashed filenames from that
// manifest — gen-hubs.mjs for the ~476 hub snapshots, Shell.astro (via _internal/lib/chrome.mjs) for
// the three layouts — so it cannot run second. It also FAILS THE BUILD on any physical CSS direction
// property (margin-left, inset right, text-align:left …): he and ar are live locales, and RTL
// correctness is enforced by construction here rather than retrofitted per page later.
// Then gen-hubs: it regenerates every city/region/country/destination hub (all locales) from current
// content, so newly-added roundups/reviews are linked (not orphaned) and downstream gens see fresh hubs.
// (Was previously a manual-only step — a green build could ship stale hubs with unlinked roundups.)
for (const mod of ['../_internal/gen-shell.mjs', '../_internal/gen-hubs.mjs', '../_internal/gen-home.mjs', '../_internal/gen-sitemap.mjs', '../_internal/gen-search-index.mjs', '../_internal/gen-home-index.mjs', '../_internal/gen-feeds.mjs', '../_internal/gen-near-me.mjs']) {
  // The isolated _internal/build-test.sh copy has no _internal/ — skip a genuinely-absent generator so a
  // content-only validation build still passes. But if the generator IS present and throws, let it fail the
  // build: swallowing it shipped a green build with stale/broken home/sitemap/search/feeds/near-me.
  if (!existsSync(fileURLToPath(new URL(mod, import.meta.url)))) { console.log(`prebuild: skipped ${mod} (not present in this build context)`); continue; }
  await import(mod);
}

// ── deploy file-count gate ───────────────────────────────────────────────────
// Cloudflare Workers Static Assets rejects a deploy of more than 20,000 files,
// at UPLOAD time, after the full ~17-minute build, naming no file. This site is
// at 19,801 — 199 files of headroom on a site that adds pages every week.
//
// It measures the dist from the PREVIOUS build, because astro clears dist during
// `build`, i.e. after prebuild. That is the useful thing to measure anyway: it is
// the tree that would go out if you deployed right now, and it gives the warning
// one build EARLIER than a post-build check would. On a first build there is no
// dist and the gate says so instead of passing silently.
//
// The threshold is MAX_DEPLOY_FILES in _internal/qa/check-file-count.mjs. Raising
// it should be its own commit saying what bought the headroom; TA_MAX_DEPLOY_FILES
// overrides it for a single run and announces itself when it does.
{
  const gate = new URL('../_internal/qa/check-file-count.mjs', import.meta.url);
  if (!existsSync(fileURLToPath(gate))) {
    console.log('prebuild: skipped the deploy file-count gate (not present in this build context)');
  } else {
    // ADVISORY here, ENFORCING in `npm run verify` after the build.
    //
    // This measures the PREVIOUS build's dist, which is a useful early warning but
    // is not the tree this build will produce. Throwing on it deadlocks the one
    // case that matters most: when you are deliberately building a SMALLER dist to
    // get back under the cap, the stale larger count refuses the build that would
    // fix it. That happened on 2026-09-09 — a 22,144-file dist blocked the rebuild
    // down to 19,801.
    //
    // So: warn loudly, never block. check-file-count runs again in `npm run verify`
    // against the freshly built dist, where it throws and is the real gate.
    const { assertFileCount } = await import(gate.href);
    try {
      assertFileCount(fileURLToPath(new URL('./dist', import.meta.url)));
    } catch (err) {
      console.log('\n  ⚠ prebuild file-count advisory (previous build\'s dist, not this one):');
      console.log(String(err.message).split('\n').slice(0, 3).map(l => '    ' + l).join('\n'));
      console.log('    Not blocking — `npm run verify` enforces this against the new dist.\n');
    }
  }
}
