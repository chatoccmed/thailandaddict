#!/usr/bin/env bash
# Local Astro build test (pre-push check). Portable across machines.
#
# Why a temp dir: the repo lives in a Google-Drive-synced folder; building in
# place risks EBADF (Drive locking files mid-build) and would drop a huge
# node_modules into the synced tree. So we build a copy OUTSIDE the repo.
# This is a VALIDATION build (does every page + content-collection compile?) —
# it skips public/ for speed, so dist has no images, that's expected.
#
# Why a lock: TMP is deliberately REUSED across runs (node_modules is ~600MB —
# a fresh dir per run would mean an npm ci every time and several GB of disk we
# do not have). That makes two concurrent runs actively dangerous, not merely
# slow: run B's `rm -rf $TMP/src` deletes run A's sources mid-build, and both
# write $TMP/dist. Worse than any crash, A can silently validate B's sources and
# report a PASS for a tree that was never tested. So the critical section is
# serialised. (Two sessions do share this machine — the hazard is not
# hypothetical — though no failure has yet been traced to it: the `async write`
# crashes of 2026-07-17 turned out to be ENOSPC, not this.)
#
# Usage:  bash _internal/build-test.sh
#   exit 0 = build OK (safe to push)   exit non-zero = build broke (fix first)
#
# Env:
#   TA_BUILD_TMP        build dir (default ~/ta-build-temp). Point two sessions
#                       at different dirs to genuinely build in parallel — costs
#                       a full node_modules each.
#   TA_BUILD_LOCK_WAIT  seconds to wait for the lock (default 1800; 0 = fail now)
#   TA_BUILD_LOCK_STALE seconds before a held lock is presumed abandoned (default 3600)
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

echo "=== Booking→CJ revenue guard (see _internal/BOOKING-CJ-GUIDE.md) ==="
# guard resolves the repo content/hub dirs from cwd — must run from repo root,
# otherwise the content-canonical + hub checks pass vacuously on 0 files
(cd "$SCRIPT_DIR/.." && node _internal/qa/check-booking-cj.mjs "$TMP/dist") || { echo "ERROR: Booking CJ guard failed — fix before push (revenue at risk)"; exit 4; }
echo ""
echo "BUILD OK — safe to push"
