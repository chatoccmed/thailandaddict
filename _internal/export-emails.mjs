// Export newsletter emails collected in Cloudflare KV → CSV on stdout.
//   node _internal/export-emails.mjs            # print CSV to terminal
//   node _internal/export-emails.mjs > list.csv # save to a file
//
// The homepage newsletter form (astro/public/index.html .nl-form) POSTs to the
// Worker /api/email, which stores each address as KV key `email:<addr>` in the
// TRIPS namespace. Until an ESP is wired those addresses just sit in KV with no
// way to read them — this is that reader. Uses wrangler (already OAuth-logged-in);
// no extra creds needed.
import { execSync } from 'node:child_process';

const NS = 'fc95757f7ce54294a1b9af14f8f69c2f';  // TRIPS namespace (see wrangler.jsonc)
const sh = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });

let keys;
try {
  keys = JSON.parse(sh(`npx wrangler kv key list --namespace-id ${NS} --remote --prefix "email:"`))
    .map((k) => k.name).filter(Boolean);
} catch (e) {
  console.error('✗ could not list KV keys — is wrangler logged in? (npx wrangler whoami)');
  console.error(String(e.message || e).split('\n').slice(0, 3).join('\n'));
  process.exit(1);
}

if (!keys.length) { console.error('(no newsletter emails collected yet — key prefix email: is empty)'); process.exit(0); }
console.error(`${keys.length} email(s) in KV — fetching values…`);

// Defense-in-depth: the key is interpolated into a shell command below, so refuse any key that isn't a
// plain `email:<address>` with a safe charset. The Worker now enforces this (EMAIL_RE), but records stored
// before that fix could still carry shell metacharacters — skip them rather than execute them.
const SAFE_KEY = /^email:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
// Guard against CSV formula injection: a cell starting with = + - @ (or tab/CR) is executed as a formula by
// Excel/Sheets. Prefix such cells with a single quote so they render as text.
const csvCell = (c) => { let s = String(c == null ? '' : c); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };

const rows = [['email', 'source_province', 'trip_id', 'signed_up_utc']];
for (const key of keys) {
  if (!SAFE_KEY.test(key)) { console.error(`⚠ skipping key with unexpected characters (not exported): ${key.slice(0, 60)}`); continue; }
  let rec = {};
  try { rec = JSON.parse(sh(`npx wrangler kv key get "${key}" --namespace-id ${NS} --remote`)); } catch { /* keep bare email */ }
  const email = rec.email || key.replace(/^email:/, '');
  const ts = rec.ts ? new Date(rec.ts).toISOString() : '';
  rows.push([email, rec.province || '', rec.tripId || '', ts]);
}
// stable order: newest signups first
rows.splice(1, rows.length, ...rows.slice(1).sort((a, b) => String(b[3]).localeCompare(String(a[3]))));
process.stdout.write(rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n');
console.error('✓ done');
