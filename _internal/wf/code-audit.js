export const meta = {
  name: 'code-audit',
  description: 'Full-codebase audit of thailandaddict (Astro static + Cloudflare Worker). Fan out over 4 dimensions the owner asked for — (1) security ranked by severity, (2) duplication/dead files, (3) performance, (4) usability — then adversarially verify every security finding before reporting.',
  phases: [{ title: 'Audit', detail: 'parallel auditors per dimension' }, { title: 'Verify', detail: 'adversarially verify each security finding' }],
}

const FIND = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['severity', 'title', 'file', 'detail', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          title: { type: 'string' },
          file: { type: 'string', description: 'repo-relative path (+ line if known)' },
          detail: { type: 'string', description: 'what it is + concrete exploit/impact scenario' },
          fix: { type: 'string', description: 'specific remediation' },
        },
      },
    },
  },
}
const VERDICT = {
  type: 'object',
  required: ['title', 'verdict', 'reason'],
  properties: {
    title: { type: 'string' },
    verdict: { type: 'string', enum: ['CONFIRMED', 'FALSE_POSITIVE', 'OVERSTATED'] },
    reason: { type: 'string' },
    adjustedSeverity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'none'] },
  },
}

const ROOT = 'thailandaddict repo root (worker.js, worker-provinces.js, wrangler.jsonc, package.json at root; astro/ subdir; _internal/ scripts)'

const AUDITS = [
  ['sec-worker', `SECURITY audit #1 — the Cloudflare Worker runtime (the real attack surface). Read: worker.js, worker-provinces.js, wrangler.jsonc. Hunt for: denial-of-wallet / unmetered Workers-AI abuse, unauthenticated KV writes (saveTrip/saveEmail/saveContact/collabAction) → KV flooding/quota exhaustion, stored XSS via /t/:id (serveSharedTrip injects og title/desc + trip id into HTML — check escAttr covers all sinks incl the JSON.stringify into <script>), SSRF via loadFeeds/ASSETS.fetch with request-derived URL, missing security headers on dynamic Worker responses (json()/serveSharedTrip don't set X-Frame-Options/CSP/nosniff — only static _headers does), rate-limit bypass (fails OPEN, keyed on CF-Connecting-IP which is spoofable? no—CF sets it), input validation gaps, prototype pollution via JSON.parse spread ({...d}). Rank by real-world severity. Be concrete about the exploit.`],
  ['sec-frontend', `SECURITY audit #2 — client + build + secrets. Read: astro/public/trip.html (the shared-trip renderer — the comment in worker.js says it interpolates day.day/prefs/item.type RAW and drops urls into href; verify the client actually escapes name/title/note as claimed, and that worker sanitizeItin/safeUrl fully covers what trip.html renders — any gap = stored XSS), astro/public/js/currency.js, and grep the Astro layouts (astro/src/layouts/*.astro) for set:html on any value that could contain unescaped user/remote data. Also audit _internal/ scripts that touch secrets/network: setup-redirects-api.mjs, upload-r2-api.mjs, export-emails.mjs, submit-indexnow.mjs — check for secret leakage (tokens logged/committed), and whether ~/.r2-creds or CLOUDFLARE_API_TOKEN could be exposed. Check astro/public/_headers for missing CSP. Rank by severity with concrete impact.`],
  ['dup-dead', `DUPLICATION & DEAD CODE audit. The repo has ~40 _internal/*.mjs scripts + worker + layouts. Find: (a) duplicated logic (e.g. the same slug/normalize/escape helpers reimplemented across worker.js, gen-*.mjs, layouts), (b) dead/superseded files safe to delete (one-off migration scripts, superseded planning docs, stray root files like d-*.jpg, backup files, unused gates/workflows in _internal/wf), (c) near-identical gen-* or validate-* scripts that could be unified. List each with a path and why it's dup/dead. Do NOT recommend deleting content JSON or anything referenced by the build. Use Glob/Grep to confirm references before calling something dead.`],
  ['perf', `PERFORMANCE audit. Read worker.js (hot path: /api/plan, /api/suggest, loadFeeds), the Astro build (astro/package.json, prebuild.mjs, gen-hubs.mjs), and layouts. Find real bottlenecks: repeated JSON.parse of large feeds, O(n^2) loops over reviews/hotels, synchronous heavy work on the request path, the 8GB-heap build (why so heavy — 16k pages), large client payloads (search-index 1.18MB, trip.html 85KB), missing caching, images. Rank by user-facing impact. Concrete fix each.`],
  ['ux', `USABILITY / DX audit. Look at: error handling + user-facing error messages in worker.js (are failures graceful?), the contact/email forms (astro/public — validation/feedback), accessibility of the planner (trip.html), the _headers caching correctness, and developer experience (build time, how brittle the manual deploy is, missing docs). Suggest concrete usability + maintainability improvements. Rank by impact.`],
]

phase('Audit')
const raw = await parallel(AUDITS.map(([label, prompt]) => () =>
  agent(`You are a senior security+quality auditor reviewing the thailandaddict codebase (${ROOT}). ${prompt}\n\nRead the actual files (don't guess). Return findings with concrete file paths and exploit/impact scenarios — no generic advice.`,
    { label, phase: 'Audit', schema: FIND }).then(r => ({ label, findings: (r && r.findings) || [] })).catch(e => ({ label, findings: [], error: String(e) }))
))

// verify only the security findings adversarially (the owner acts on #1 first, so precision matters most there)
const secFindings = raw.filter(Boolean).filter(r => r.label.startsWith('sec-')).flatMap(r => r.findings)
phase('Verify')
const verdicts = await parallel(secFindings.map(f => () =>
  agent(`Adversarially verify this claimed SECURITY finding against the actual thailandaddict code. Read the file(s) named. Decide if it is a real, exploitable issue or a false positive / overstated. Consider mitigations already present (rate limiting, escAttr, safeUrl/sanitizeItin, CF-set headers, the fact content JSON is author-controlled not user input).\n\nFINDING: ${f.severity.toUpperCase()} — ${f.title}\nFILE: ${f.file}\nDETAIL: ${f.detail}\n\nBe skeptical. If the exploit doesn't actually work or is already mitigated, say FALSE_POSITIVE. If real but lower impact than claimed, OVERSTATED with the true severity.`,
    { label: `verify:${f.title.slice(0, 30)}`, phase: 'Verify', schema: VERDICT }).then(v => ({ f, v })).catch(() => ({ f, v: null }))
))

const allOther = raw.filter(Boolean).filter(r => !r.label.startsWith('sec-'))
return {
  security: verdicts.filter(Boolean).map(({ f, v }) => ({ ...f, verify: v })),
  duplication: (allOther.find(r => r.label === 'dup-dead') || {}).findings || [],
  performance: (allOther.find(r => r.label === 'perf') || {}).findings || [],
  usability: (allOther.find(r => r.label === 'ux') || {}).findings || [],
  errors: raw.filter(Boolean).filter(r => r.error).map(r => ({ label: r.label, error: r.error })),
}
