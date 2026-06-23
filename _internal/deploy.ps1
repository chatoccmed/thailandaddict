# Non-interactive production deploy for thailandaddict.com (Cloudflare Workers).
# Builds the FULL local Astro dist (every page) then `wrangler deploy` — no browser OAuth, no prompts.
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
  Write-Host "› Building full dist (astro)…" -ForegroundColor Cyan
  Set-Location "$repo\astro"
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { Write-Host "✗ Build failed — NOT deploying." -ForegroundColor Red; exit 1 }
}

# Sanity: dist must look complete before we ship it (guards against a partial/empty build going live).
$distPages = (Get-ChildItem "$repo\astro\dist" -Filter *.html -File -ErrorAction SilentlyContinue).Count
Write-Host "› astro/dist has $distPages top-level .html pages" -ForegroundColor Cyan
if ($distPages -lt 5000) { Write-Host "✗ dist looks partial ($distPages pages) — refusing to deploy. Run a full build first." -ForegroundColor Red; exit 1 }

Write-Host "› Deploying to Cloudflare (account $ACCOUNT_ID)…" -ForegroundColor Cyan
Set-Location $repo
& npx.cmd --yes wrangler deploy
if ($LASTEXITCODE -ne 0) { Write-Host "✗ wrangler deploy failed." -ForegroundColor Red; exit 1 }
Write-Host ""
Write-Host "✅ Deployed to production — https://thailandaddict.com" -ForegroundColor Green
