#!/usr/bin/env bash
# Local Astro build test (pre-push check). Portable across machines.
#
# Why a temp dir: the repo lives in a Google-Drive-synced folder; building in
# place risks EBADF (Drive locking files mid-build) and would drop a huge
# node_modules into the synced tree. So we build a copy OUTSIDE the repo.
# This is a VALIDATION build (does every page + content-collection compile?) —
# it skips public/ for speed, so dist has no images, that's expected.
#
# Usage:  bash _internal/build-test.sh
#   exit 0 = build OK (safe to push)   exit non-zero = build broke (fix first)
set -e

# node: use PATH if present, else the portable install at ~/nodejs (Imac machine)
if ! command -v node >/dev/null 2>&1; then
  export PATH="$HOME/nodejs:$PATH"
fi
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found (install it or set PATH)"; exit 2; }
echo "node $(node -v) · npm $(npm -v)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASTRO="$(cd "$SCRIPT_DIR/../astro" && pwd)"
TMP="$HOME/ta-build-temp"

mkdir -p "$TMP"
# refresh source + config each run; node_modules/dist persist in TMP for speed
rm -rf "$TMP/src"
cp -r "$ASTRO/src" "$TMP/src"
cp "$ASTRO/package.json" "$ASTRO/package-lock.json" "$ASTRO/astro.config.mjs" "$ASTRO/tsconfig.json" "$TMP/"
cp "$ASTRO/prebuild.mjs" "$TMP/"   # prebuild no-ops here (gens live in repo _internal, not copied)

cd "$TMP"
# install only when deps are missing or package-lock changed
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  echo "=== npm ci ==="
  npm ci
fi
echo "=== dark-pattern lint (honesty guardrail — no manufactured urgency/scarcity/countdown) ==="
node "$SCRIPT_DIR/lint-dark-patterns.mjs" || { echo "ERROR: dark-pattern lint failed — rewrite as honest info before push"; exit 3; }

echo "=== astro build ==="
# Site grew past ~3000 pages → Node's default ~2GB heap OOMs mid-build (exit 134,
# "FATAL ERROR: Reached heap limit"). The real fix lives in astro/package.json's
# build script (`node --max-old-space-size=8192 node_modules/astro/astro.js build`)
# so the SAME heap bump applies to the Cloudflare production build (`npm run build`),
# not just this local test. This export is a harmless fallback/override.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=8192}"
npm run build
echo ""
echo "BUILD OK — safe to push"
