# Non-interactive production deploy for thailandaddict.com (Cloudflare Workers).
# Builds the FULL local Astro dist (every page), runs the SAME gates as `npm run verify`, then
# `wrangler deploy` — no browser OAuth, no prompts. Equivalent to `npm run deploy` from the repo
# root; this variant exists for the token-based, non-interactive path.
#
# AUTH: reads CLOUDFLARE_API_TOKEN. Set it ONCE (persists in your Windows user profile / registry):
#         setx CLOUDFLARE_API_TOKEN "<your-cloudflare-api-token>"
#       (use the "Edit Cloudflare Workers" token template at https://dash.cloudflare.com/profile/api-tokens)
#       After that, this script — and Claude running it for you — works forever with no manual steps.
#
# USAGE:
#   powershell -ExecutionPolicy Bypass -File _internal\deploy.ps1            # build + deploy
#   powershell -ExecutionPolicy Bypass -File _internal\deploy.ps1 -SkipBuild # deploy the existing astro/dist as-is
param([switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot   # repo root (this script lives in _internal/)
$ACCOUNT_ID = '46cdce4b7061ce5424b187cf9353ba92'   # non-sensitive (same value hardcoded in deploy.yml)

# Node v24 lives in ~/nodejs and PowerShell doesn't add it to PATH automatically.
$env:Path = "$HOME\nodejs;$env:Path"

# Pull the API token from the persistent User environment (registry) into THIS process, so a shell that
# was started before `setx` ran still sees it (setx updates the registry, not already-running processes).
if (-not $env:CLOUDFLARE_API_TOKEN) {
  $env:CLOUDFLARE_API_TOKEN = [Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'User')
}
if (-not $env:CLOUDFLARE_API_TOKEN) {
  $env:CLOUDFLARE_API_TOKEN = [Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'Machine')
}
if (-not $env:CLOUDFLARE_API_TOKEN) {
  Write-Host ""
  Write-Host "  CLOUDFLARE_API_TOKEN is not set." -ForegroundColor Red
  Write-Host "  One-time setup (then never again):" -ForegroundColor Yellow
  Write-Host '    1) Create a token: https://dash.cloudflare.com/profile/api-tokens  →  "Edit Cloudflare Workers" template'
  Write-Host '    2) setx CLOUDFLARE_API_TOKEN "<paste-token>"'
  Write-Host '    3) re-run this script'
  exit 1
}
$env:CLOUDFLARE_ACCOUNT_ID = $ACCOUNT_ID
$env:WRANGLER_SEND_METRICS = 'false'

if (-not $SkipBuild) {
  # Clear dist and the Astro cache before a prod build. The stale-data-store hazard this used to guard
  # against is gone as of 2026-09-09 — content collections were retired and the routes read JSON from
  # disk per page (astro/src/lib/content-fs.ts), so there is no content store to go stale. Clearing is
  # kept because a leftover dist would let deleted pages ship, and because it is cheap.
  Write-Host "› Clearing astro cache + dist…" -ForegroundColor Cyan
  Remove-Item -Recurse -Force "$repo\astro\.astro", "$repo\astro\node_modules\.astro", "$repo\astro\dist" -ErrorAction SilentlyContinue
  Write-Host "› Building full dist (astro)…" -ForegroundColor Cyan
  Set-Location "$repo\astro"
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { Write-Host "✗ Build failed — NOT deploying." -ForegroundColor Red; exit 1 }
}

# THE GATES. Identical to `npm run verify`: check-page-coverage (the FLOOR — every content JSON must
# have produced a real page over 2,048 bytes, and every content directory must have produced at least
# one) then check-file-count (the CEILING — deployable files under Cloudflare's cap).
#
# This replaced a `-lt 5000 top-level .html` heuristic on 2026-09-09. That heuristic counted only the
# repo ROOT of dist, so it passed a tree with every /zh/, /ru/ and /ko/ page missing — the exact partial
# deploy it was meant to stop. Do not put a page-count threshold back here; the expected set comes from
# the content on disk.
Write-Host "› Verifying dist (page coverage + deployable file count)…" -ForegroundColor Cyan
Set-Location $repo
& npm.cmd run verify
if ($LASTEXITCODE -ne 0) { Write-Host "✗ Verify gate failed — NOT deploying. A partial deploy is worse than no deploy." -ForegroundColor Red; exit 1 }

# wrangler is PINNED as a root devDependency (^4.34.0, lockfile 4.130.0). npx would happily fetch
# an unpinned latest from the registry if it is missing, which is the thing the pin exists to stop —
# and >= 4.34.0 is the floor for Cloudflare's 100,000-file static-asset limit. So require it.
if (-not (Test-Path "$repo
ode_moduleswranglerpackage.json")) {
  Write-Host "✗ Pinned wrangler is not installed. Run `npm install` in the repo root first." -ForegroundColor Red
  Write-Host "  (deploying through an unpinned npx-fetched wrangler is not allowed here)" -ForegroundColor Yellow
  exit 1
}

Write-Host "› Deploying to Cloudflare (account $ACCOUNT_ID)…" -ForegroundColor Cyan
Set-Location $repo
& npx.cmd --yes wrangler deploy
if ($LASTEXITCODE -ne 0) { Write-Host "✗ wrangler deploy failed." -ForegroundColor Red; exit 1 }
Write-Host ""
Write-Host "✅ Deployed to production — https://thailandaddict.com" -ForegroundColor Green
