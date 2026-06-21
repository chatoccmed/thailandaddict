// Astro prebuild: refresh homepage data (stats + 77-province map) and sitemap
// from current content before every build. Runs on the full repo (Cloudflare:
// `cd astro && npm run build`). No-ops gracefully where the generators aren't
// reachable (e.g. the isolated _internal/build-test.sh copy), so it never breaks
// a content-only validation build.
for (const mod of ['../_internal/gen-home.mjs', '../_internal/gen-sitemap.mjs', '../_internal/gen-search-index.mjs', '../_internal/gen-feeds.mjs']) {
  try { await import(mod); }
  catch (e) { console.log(`prebuild: skipped ${mod} (${e && e.code || e})`); }
}
