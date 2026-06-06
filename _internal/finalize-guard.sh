#!/usr/bin/env bash
# Pre-commit SAFETY GUARD for a province finalize (Phase D).
# Run AFTER `git add -A`, BEFORE the commit. Exits non-zero (blocks commit) if the
# staged change set contains anything a province build must NEVER produce:
#   1. file DELETIONS  — no build step legitimately deletes tracked files
#      (root cause of the chiang/chonburi wipe: an agent ran `rm -f c*.jpg`).
#   2. junk/temp files — _tmp_*, *-test.*, t.jpg, tmp.*, page.html, ta.html.
#
# On failure: review `git status`; restore deletions with `git checkout -- <file>`;
# unstage junk with `git rm --cached <file>` (and delete it); then re-run.
#
# Usage:  git add -A && bash _internal/finalize-guard.sh && git commit ...
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

del=$(git diff --cached --diff-filter=D --name-only || true)
junk=$(git diff --cached --name-only \
  | grep -iE '(^|/)(_tmp|tmp[._]|test-|[^/]*-test\.)|/(t|tmp|page|ta)\.(jpg|jpeg|png|html|bin)$' || true)

fail=0
if [ -n "$del" ]; then
  echo "❌ GUARD: staged DELETIONS detected ($(echo "$del" | grep -c .)) — a province build should delete nothing:"
  echo "$del" | sed 's/^/   - /'
  fail=1
fi
if [ -n "$junk" ]; then
  echo "❌ GUARD: staged JUNK/TEMP files detected:"
  echo "$junk" | sed 's/^/   - /'
  fail=1
fi
if [ "$fail" = 1 ]; then
  echo "→ Do NOT commit. Restore deletions (git checkout -- <f>) / remove junk (git rm --cached <f>), then re-run the guard."
  exit 1
fi
echo "✓ finalize-guard: no deletions, no junk staged — safe to commit"
