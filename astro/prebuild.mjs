// Astro prebuild: refresh homepage data (stats + 77-province map) and sitemap
// from current content before every build. Runs on the full repo (Cloudflare:
// `cd astro && npm run build`). No-ops gracefully where the generators aren't
// reachable (e.g. the isolated _internal/build-test.sh copy), so it never breaks
// a content-only validation build.
// gen-near-me runs AFTER gen-feeds (it reads the just-written feeds/*.json to build the /near-me geo-index).
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
for (const mod of ['../_internal/gen-home.mjs', '../_internal/gen-sitemap.mjs', '../_internal/gen-search-index.mjs', '../_internal/gen-feeds.mjs', '../_internal/gen-near-me.mjs']) {
  // The isolated _internal/build-test.sh copy has no _internal/ — skip a genuinely-absent generator so a
  // content-only validation build still passes. But if the generator IS present and throws, let it fail the
  // build: swallowing it shipped a green build with stale/broken home/sitemap/search/feeds/near-me.
  if (!existsSync(fileURLToPath(new URL(mod, import.meta.url)))) { console.log(`prebuild: skipped ${mod} (not present in this build context)`); continue; }
  await import(mod);
}
