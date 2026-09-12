#!/usr/bin/env bash
# Local Astro build test (pre-push check). Portable across machines.
#
# Why a temp dir: the repo lives in a Google-Drive-synced folder; building in
# place risks EBADF (Drive locking files mid-build) and would drop a huge
# node_modules into the synced tree. So we build a copy OUTSIDE the repo.
#
# WHAT THE COPY CONTAINS — and why that changed (2026-09-09, Phase 2 gates)
# This used to copy astro/src and nothing else. That made the run fast and made
# it prove much less than it appeared to:
#   · prebuild.mjs found no ../_internal/ and skipped ALL EIGHT generators, so a
#     crash in gen-shell / gen-hubs / gen-sitemap / gen-feeds reached production
#     unchallenged. gen-hubs alone writes ~1,946 of the pages this site serves.
#   · public/ was skipped, so the 2,033 pre-generated HTML snapshots — the hubs,
#     the homepage, the ~24 hand-written pages — were never part of the tree
#     being validated at all.
# Now _internal/ and a filtered public/ are copied too, so the generators really
# run. Bulk image directories (hotels, cm, food, gallery, _cards, heroes, cities)
# are still excluded: ~16,750 files that no generator reads and that the deploy
# serves from R2 anyway. Copying them would add minutes and prove nothing.
# Cost of the change: roughly 2–3 extra minutes, almost all of it gen-hubs
# writing 9 locales.
#
# dist here still has no images — that is expected, and it is why the file-count
# gate below runs against the REAL astro/dist, not this one.
#
# Why a lock: TMP is deliberately REUSED across runs (node_modules is ~600MB —
# a fresh dir per run would mean an npm ci every time and several GB of disk we
# do not have). That makes two concurrent runs actively dangerous, not merely
# slow: run B's `rm -rf $TMP/astro/src` deletes run A's sources mid-build, and
# both write $TMP/astro/dist. Worse than any crash, A can silently validate B's sources and
# report a PASS for a tree that was never tested. So the critical section is
# serialised. (Two sessions do share this machine — the hazard is not
# hypothetical — though no failure has yet been traced to it: the `async write`
# crashes of 2026-07-17 turned out to be ENOSPC, not this.)
#
# Usage:  bash _internal/build-test.sh
#   exit 0 = build OK (safe to push)   exit non-zero = build broke (fix first)
#
# Exit codes:
#   2  node not found
#   3  dark-pattern lint (manufactured urgency/scarcity/countdown/fake discount)
#   4  Booking→CJ revenue guard
#   5  build lock could not be acquired  ·  OR check-touch-targets (see note)
#   6  check-i18n-keys — a tx() key would silently fall back to English
#   7  check-rtl — a physical direction property would ship
#   8  check-snapshots — a generated page is older than its generator
#   9  check-file-count — the deploy would exceed the Cloudflare asset cap
#  11  check-coords — a wrong or invented map pin would ship
#  12  check-map-attribution — OSM tiles without the ODbL credit
#   other = the astro build itself failed
#   NOTE on 5: the blueprint assigns exit 5 to check-touch-targets and this
#   script has used 5 for a lock timeout since it was written. Both are kept —
#   the printed message says which one happened, unambiguously, and renaming
#   either would break a contract someone else already depends on.
#
# Env:
#   TA_BUILD_TMP        build dir (default ~/ta-build-temp). Point two sessions
#                       at different dirs to genuinely build in parallel — costs
#                       a full node_modules each.
#   TA_BUILD_LOCK_WAIT  seconds to wait for the lock (default 1800; 0 = fail now)
#   TA_BUILD_LOCK_STALE seconds before a held lock is presumed abandoned (default 3600)
#   TA_SKIP_GATES       comma-separated gate names to skip for one run
#                       (i18n,rtl,snapshots,filecount,touch). Use it to unblock a
#                       specific known-red gate, never as a habit — say which and
#                       why in the commit message.
#   TA_QA_CHROME        path to chrome/msedge for the touch-target gate
#   TA_QA_TOUCH_DOCROOT doc root for the touch-target gate (default astro/dist,
#                       the last full build — it has the images, and layout
#                       without images is not the layout that ships)
set -e

# node: use PATH if present, else the portable install at ~/nodejs (Imac machine)
if ! command -v node >/dev/null 2>&1; then
  export PATH="$HOME/nodejs:$PATH"
fi
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found (install it or set PATH)"; exit 2; }
echo "node $(node -v) · npm $(npm -v)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASTRO="$(cd "$SCRIPT_DIR/../astro" && pwd)"
TMP="${TA_BUILD_TMP:-$HOME/ta-build-temp}"

# ── build lock ───────────────────────────────────────────────────────────────
# mkdir is the lock primitive: it is atomic and, unlike flock, exists in the
# Git Bash that ships on the Windows machines. The lock lives beside TMP, not
# inside it, because TMP's contents get rewritten on every run.
LOCK="$TMP.lock"
STEAL="$TMP.lock.steal"
LOCK_WAIT="${TA_BUILD_LOCK_WAIT:-1800}"
LOCK_STALE="${TA_BUILD_LOCK_STALE:-3600}"
HALF_CLAIMED=120   # seconds; a lock dir with no pid in it is mid-mkdir, not abandoned

# Seconds since the lock was created or last written to.
lock_age() {
  local now m
  now="$(date +%s)"
  m="$(stat -c %Y "$LOCK" 2>/dev/null)" || m="$now"
  echo "$(( now - m ))"
}

waited=0
while ! mkdir "$LOCK" 2>/dev/null; do
  # Taking over an abandoned lock has to be serialised behind its own mutex,
  # because deciding "this lock is stale" and acting on it must be indivisible.
  # Without that: A renames the stale lock away, B wins the mkdir and becomes a
  # legitimate owner, and C — still inside its own takeover, working from the
  # judgement it made a moment ago — renames B's brand-new lock away and claims
  # it too. Two owners. (Reproduced 3 runs in 5 before this mutex existed.)
  # While we hold STEAL, LOCK cannot be replaced under us: only its owner's trap
  # or another thief could remove it, and the owner is dead by definition and
  # other thieves are shut out here. So the re-read below is authoritative.
  if mkdir "$STEAL" 2>/dev/null; then
    owner="$(cat "$LOCK/pid" 2>/dev/null || true)"
    age="$(lock_age)"
    reason=""
    if [ -n "$owner" ] && ! kill -0 "$owner" 2>/dev/null; then
      reason="its owner (pid $owner) is gone"
    elif [ -n "$owner" ] && [ "$age" -gt "$LOCK_STALE" ]; then
      reason="pid $owner has held it for ${age}s"
    elif [ -z "$owner" ] && [ "$age" -gt "$HALF_CLAIMED" ]; then
      reason="it was left half-claimed ${age}s ago"
    fi
    [ -n "$reason" ] && { echo "note: taking over the build lock — $reason"; rm -rf "$LOCK"; }
    rmdir "$STEAL" 2>/dev/null || true
    [ -n "$reason" ] && continue
  fi
  if [ "$LOCK_WAIT" -le 0 ]; then
    echo "ERROR: another build is running (pid $(cat "$LOCK/pid" 2>/dev/null || echo unknown))."
    echo "       Wait for it, or set TA_BUILD_TMP to build somewhere else."
    exit 5
  fi
  if [ "$waited" -ge "$LOCK_WAIT" ]; then
    echo "ERROR: waited ${waited}s for the build lock held by pid $(cat "$LOCK/pid" 2>/dev/null || echo unknown); giving up."
    echo "       If no build is really running, remove $LOCK (and $STEAL) by hand."
    exit 5
  fi
  [ "$(( waited % 30 ))" -eq 0 ] && echo "waiting for build lock held by pid $(cat "$LOCK/pid" 2>/dev/null || echo unknown)... ${waited}s"
  sleep 5; waited=$(( waited + 5 ))
done
# Only now do we own the lock — arm the trap here, never earlier, or a run that
# exits while merely *waiting* would delete the holder's lock on its way out.
trap 'rc=$?; rm -rf "$LOCK" 2>/dev/null; exit $rc' EXIT INT TERM
echo "$$" > "$LOCK/pid"
[ "$waited" -gt 0 ] && echo "got the build lock after ${waited}s"
# ─────────────────────────────────────────────────────────────────────────────

REPO="$(cd "$SCRIPT_DIR/.." && pwd)"
mkdir -p "$TMP"

# ── TMP now mirrors the repo layout ──────────────────────────────────────────
# It has to: every generator resolves ROOT as <its own dir>/.. and then reaches
# for astro/public, astro/src/data and _internal/<data-dir>. Flattening astro/
# into $TMP (as this script did until 2026-09-09) makes those paths miss, which
# is one of the reasons the generators were silently skipped rather than run.
#
#   $TMP/astro/{src,public,package.json,…,node_modules,dist}
#   $TMP/_internal/**
#
# One-time migration for anyone with an existing $TMP: move node_modules down a
# level instead of forcing a ~600MB npm ci that we have neither the disk nor the
# patience for.
if [ -d "$TMP/node_modules" ] && [ ! -d "$TMP/astro/node_modules" ]; then
  echo "note: migrating $TMP/node_modules → $TMP/astro/node_modules (one time)"
  mkdir -p "$TMP/astro"
  mv "$TMP/node_modules" "$TMP/astro/node_modules"
  # written as `if`, not `[ … ] && mv`: under `set -e` a trailing AND-list whose
  # test fails takes the exit status of the list, and the script would die here
  # on the perfectly normal case of "there was no previous dist".
  if [ -d "$TMP/dist" ]; then mv "$TMP/dist" "$TMP/astro/dist"; fi
  rm -rf "$TMP/src" "$TMP/package.json" "$TMP/package-lock.json" "$TMP/astro.config.mjs" "$TMP/tsconfig.json" "$TMP/prebuild.mjs"
fi
mkdir -p "$TMP/astro"

# refresh sources each run; node_modules/dist persist in TMP for speed
rm -rf "$TMP/astro/src" "$TMP/astro/public" "$TMP/_internal"
cp -r "$ASTRO/src" "$TMP/astro/src"
cp "$ASTRO/package.json" "$ASTRO/package-lock.json" "$ASTRO/astro.config.mjs" "$ASTRO/tsconfig.json" "$TMP/astro/"
cp "$ASTRO/prebuild.mjs" "$TMP/astro/"

# _internal: the eight generators plus the data they read (province-data-*,
# hub-i18n, homepage-i18n, shell/, lib/, qa/). ~1,400 files, ~4 s.
echo "=== copying _internal + public (so prebuild's generators actually run) ==="
( cd "$REPO" && tar -cf - _internal ) | ( cd "$TMP" && tar -xf - )

# public: the 2,033 HTML snapshots, flags, css/js/fonts, data/ and feeds/.
# Bulk image dirs are excluded — no generator reads them and the deploy serves
# them from R2. gen-hubs DOES read public/images/flags/*.svg, so that stays.
( cd "$ASTRO" && tar -cf - \
    --exclude='public/images/hotels' --exclude='public/images/cm' \
    --exclude='public/images/food'   --exclude='public/images/gallery' \
    --exclude='public/images/_cards' --exclude='public/images/heroes' \
    --exclude='public/images/cities' \
    public ) | ( cd "$TMP/astro" && tar -xf - )

# ── gate helper ──────────────────────────────────────────────────────────────
# Gates run against the REPO, not the copy: they read generators, layouts,
# dictionaries and the committed snapshots, all of which live here.
skip_gate() { case ",${TA_SKIP_GATES:-}," in *",$1,"*) return 0;; *) return 1;; esac; }
run_gate() {   # run_gate <name> <exit-code> <headline> -- <command…>
  local name="$1" code="$2" head="$3"; shift 4
  if skip_gate "$name"; then
    echo "=== SKIPPED gate '$name' (TA_SKIP_GATES) — $head is NOT being checked this run ==="
    return 0
  fi
  echo "=== $head ==="
  ( cd "$REPO" && "$@" ) || { echo "ERROR: gate '$name' failed — see the message above for what to do"; exit "$code"; }
}

cd "$TMP/astro"
# install only when deps are missing or package-lock changed
if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  echo "=== npm ci ==="
  npm ci
fi
echo "=== dark-pattern lint (honesty guardrail — no manufactured urgency/scarcity/countdown) ==="
( cd "$REPO" && node "$SCRIPT_DIR/lint-dark-patterns.mjs" ) || { echo "ERROR: dark-pattern lint failed — rewrite as honest info before push"; exit 3; }

# ── static gates, before the 15-minute build ─────────────────────────────────
# Order is cheapest-first on purpose: none of these needs a build, and finding a
# changed tx() key in two seconds is worth more than finding it in twenty
# minutes. Each prints what broke and what to do; this script adds nothing to
# that but an exit code.
run_gate i18n 6 "i18n key guard — no tx() key may change (blueprint §2.6)" -- \
  node _internal/qa/check-i18n-keys.mjs
run_gate rtl 7 "RTL guard — logical CSS properties only (he + ar are live)" -- \
  node _internal/qa/check-rtl.mjs
run_gate snapshots 8 "snapshot freshness — no generated page older than its generator" -- \
  node _internal/qa/check-snapshots.mjs
run_gate coords 11 "coordinate guard — no invented, swapped or road-centre map pins" -- \
  node _internal/qa/check-coords.mjs
run_gate mapattr 12 "map attribution — ODbL requires the word 'contributors'" -- \
  node _internal/qa/check-map-attribution.mjs

echo "=== astro build ==="
# Site grew past ~3000 pages → Node's default ~2GB heap OOMs mid-build (exit 134,
# "FATAL ERROR: Reached heap limit"). The real fix lives in astro/package.json's
# build script (`node --max-old-space-size=8192 node_modules/astro/astro.js build`)
# so the SAME heap bump applies to the Cloudflare production build (`npm run build`),
# not just this local test. This export is a harmless fallback/override.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=8192}"
npm run build

echo "=== Booking→CJ revenue guard (see _internal/BOOKING-CJ-GUIDE.md) ==="
# guard resolves the repo content/hub dirs from cwd — must run from repo root,
# otherwise the content-canonical + hub checks pass vacuously on 0 files
(cd "$SCRIPT_DIR/.." && node _internal/qa/check-booking-cj.mjs "$TMP/astro/dist") || { echo "ERROR: Booking CJ guard failed — fix before push (revenue at risk)"; exit 4; }

# ── gates that need a real, image-complete dist ──────────────────────────────
# Both of these are measured against the repo's own astro/dist — the last FULL
# build — not against $TMP/astro/dist. The validation build deliberately omits
# ~16,750 image files, so counting its files would pass vacuously, and measuring
# its layout would measure a page whose images have no intrinsic size. prebuild
# already ran the file-count gate once inside $TMP; that run is the vacuous one,
# and this is the one that means something.
if [ -d "$REPO/astro/dist" ]; then
  run_gate filecount 9 "deploy file-count — Cloudflare rejects >20,000 static assets" -- \
    node _internal/qa/check-file-count.mjs astro/dist
  run_gate touch 5 "mobile gates — no h-scroll · targets ≥44px · booking CTA reachable" -- \
    node _internal/qa/check-touch-targets.mjs "${TA_QA_TOUCH_DOCROOT:-astro/dist}"
else
  echo "=== SKIPPED file-count + touch-target gates: no astro/dist in the repo ==="
  echo "    Both measure the last FULL build (this validation build has no images)."
  echo "    Run 'cd astro && npm run build' once, then re-run this script."
fi

echo ""
echo "BUILD OK — safe to push"
