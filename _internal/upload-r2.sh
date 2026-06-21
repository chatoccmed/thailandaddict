#!/usr/bin/env bash
# Upload astro/public/images/** to a Cloudflare R2 bucket (S3-compatible).
# Objects are keyed images/... so they serve at <R2-public-or-custom-domain>/images/...
# which matches the IMG_BASE the layouts prepend (asset() → IMG_BASE + /images/...).
#
# SETUP (one time, by owner — secrets stay on the machine, never in chat):
#   1) Cloudflare dashboard → R2 → Create bucket: thailandaddict-images
#   2) R2 → Manage R2 API Tokens → Create (Object Read & Write) → copy the
#      Access Key ID + Secret + your Account ID
#   3) Create ~/.r2-creds (NOT committed) with:
#        R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#        R2_ACCESS_KEY_ID=xxxxxxxx
#        R2_SECRET_ACCESS_KEY=xxxxxxxx
#        R2_BUCKET=thailandaddict-images
#   4) Bucket → Settings → enable public access (r2.dev) OR add custom domain
#      img.thailandaddict.com (needs the domain on Cloudflare first).
#      Whatever the public base is → set it as PUBLIC_IMG_BASE in the Worker build env.
#
# REQUIRES rclone (https://rclone.org/downloads — Windows: winget install Rclone.Rclone).
# Run:  bash _internal/upload-r2.sh
set -euo pipefail
CRED="$HOME/.r2-creds"
[ -f "$CRED" ] || { echo "✗ missing $CRED — create it (see header of this script)"; exit 1; }
# shellcheck disable=SC1090
source "$CRED"
: "${R2_ACCOUNT_ID:?}" "${R2_ACCESS_KEY_ID:?}" "${R2_SECRET_ACCESS_KEY:?}" "${R2_BUCKET:?}"
command -v rclone >/dev/null 2>&1 || { echo "✗ rclone not installed — https://rclone.org/downloads (winget install Rclone.Rclone)"; exit 1; }

SRC="$(cd "$(dirname "$0")/.." && pwd)/astro/public/images"
[ -d "$SRC" ] || { echo "✗ no images dir at $SRC"; exit 1; }
REMOTE=":s3,provider=Cloudflare,access_key_id=${R2_ACCESS_KEY_ID},secret_access_key=${R2_SECRET_ACCESS_KEY},endpoint=https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com:${R2_BUCKET}/images"

echo "Uploading $(find "$SRC" -type f | wc -l) files → r2://${R2_BUCKET}/images  (parallel, resumable) ..."
rclone copy "$SRC" "$REMOTE" --transfers=32 --checkers=64 --size-only --progress --s3-no-check-bucket
echo ""
echo "✓ done. Sanity-check a few objects are public, e.g.:"
echo "    <PUBLIC_IMG_BASE>/images/heroes/bangkok.jpg"
echo "    <PUBLIC_IMG_BASE>/images/hotels/  (any file you know exists)"
echo "Then set PUBLIC_IMG_BASE in the Cloudflare Worker build env + activate _internal/assetsignore.for-cutover."
