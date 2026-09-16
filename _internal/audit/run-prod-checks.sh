#!/usr/bin/env bash
# Production check suite for the duplicate-merge deploy. Every check runs even
# if an earlier one fails, so one run gives the whole picture; the exit code is
# non-zero if any failed.
export PATH="$HOME/nodejs:$PATH"
HERE=$(cd "$(dirname "$0")" && pwd)
S="$HERE"
cd "$S" || exit 1
failed=""
run() {
  label="$1"; shift
  echo "=== $label"
  node "$@" > "$S/prod-$label.log" 2>&1
  code=$?
  tail -3 "$S/prod-$label.log"
  if [ $code != 0 ]; then
    failed="$failed $label"
    echo "--- first failures:"
    grep '✗' "$S/prod-$label.log" | head -8
  fi
  echo
}
run redirects      live-verify-redirects.mjs
run hub-counts     live-verify-hub-counts.mjs
run hub-counts-en  live-verify-hub-counts.mjs --loc en
# every accuracy batch must be named here, or its pins are never checked live.
# live-verify-moves.mjs has a built-in BATCHES set for the first four; anything
# later needs --batch, and omitting one shows up as a suite that passes without
# testing the batch at all (692 vs 708 checks locally, and nothing visible live).
run moves          live-verify-moves.mjs --batch 2026-09-16-hotel-street-audit --batch 2026-09-16-hotel-soi-near-audit --batch 2026-09-16-hotel-locality-audit
run recluster      live-verify-recluster.mjs
run hotels         live-verify-hotels.mjs
run block-moves    live-verify-block-moves.mjs
run lang-hubs      live-verify-lang-hubs.mjs
run eat            live-verify-eat.mjs
run twins          live-verify-twins.mjs
run areas          live-verify-areas.mjs
run base           live-verify.mjs
echo "======================================"
if [ -n "$failed" ]; then echo "FAILED:$failed"; exit 1; fi
echo "ALL PRODUCTION CHECKS PASSED"
