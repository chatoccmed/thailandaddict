#!/usr/bin/env bash
# Local gate suite for the duplicate-merge rebuild, run against astro/dist before
# deploying. Every check runs even if an earlier one fails, so one run gives the
# whole picture; exit is non-zero if any failed.
export PATH="$HOME/nodejs:$PATH"
HERE=$(cd "$(dirname "$0")" && pwd)
S="$HERE"
R="$(cd "$HERE/../.." && pwd)"
failed=""
run() {
  label="$1"; dir="$2"; shift 2
  echo "=== $label"
  ( cd "$dir" && node "$@" ) > "$S/local-$label.log" 2>&1
  code=$?
  tail -3 "$S/local-$label.log"
  if [ $code != 0 ]; then
    failed="$failed $label($code)"
    echo "--- first failures:"
    grep '✗' "$S/local-$label.log" | head -8
  fi
  echo
}
# redirects now live in worker-redirects.js; this also gates _redirects at <=100 rules
run redirects   "$S" check-duplicate-redirects.mjs
run sweep       "$S" sweep-merged-links.mjs
# EVERY accuracy batch must be named, or its pins are never checked. Omitting
# one is silent: the suite still says "all passed", just with fewer checks
# (692 instead of 708 on 2026-09-16). Add the batch here the moment you add it
# to pin-fixes.json — run-prod-checks.sh needs the same line.
run moves       "$S" live-verify-moves.mjs --local --batch 2026-09-16-hotel-street-audit --batch 2026-09-16-hotel-soi-near-audit --batch 2026-09-16-hotel-locality-audit
run recluster   "$S" live-verify-recluster.mjs --local
run hotels      "$S" live-verify-hotels.mjs --local
run block-moves "$S" live-verify-block-moves.mjs --local
run lang-hubs   "$S" live-verify-lang-hubs.mjs --local
run eat         "$S" live-verify-eat.mjs --local
run twins       "$S" live-verify-twins.mjs --local
run areas       "$S" live-verify-areas.mjs --local
# the build's own gates, from the repo root. check-coords wants the feeds the
# prebuild just wrote (a stale derived file is its exit 11), and check-file-count
# matters this run because the merge deleted 130 pages from a capped deploy.
run coords      "$R" _internal/qa/check-coords.mjs
run attribution "$R" _internal/qa/check-map-attribution.mjs
run file-count  "$R" _internal/qa/check-file-count.mjs
run dark-pattern "$R" _internal/lint-dark-patterns.mjs
run booking-cj  "$R" _internal/qa/check-booking-cj.mjs
echo "======================================"
if [ -n "$failed" ]; then echo "FAILED:$failed"; exit 1; fi
echo "ALL LOCAL CHECKS PASSED"
