// Copy every key of the TRIPS KV namespace from account A (chatmaliwan) to account B (chatoccmed)
// for the zone move — runbook _internal/CF-ZONE-MOVE-RUNBOOK.md step P10 (and C1, the final sweep).
//
// The KV key IS the public share id (worker.js writes/reads 'trip:' + id from the /t/:id URL), and
// email:/contact: keys are captured leads, so names are copied byte-for-byte and `expiration` is
// copied as the ABSOLUTE epoch (never expiration_ttl, which would restart the clock).
// Avoid `wrangler kv key …` for this: v4 may read/write local miniflare state and "succeed" moving nothing.
//
// Token: CF_MOVE_TOKEN (environment or ~/.r2-creds), else the `wrangler login` OAuth token. Never printed.
// Run:   node _internal/kv-copy.mjs                 → list A's keys only (dry run)
//        NS_B=<B namespace id> node _internal/kv-copy.mjs --write   → copy, then diff key names
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const cred = Object.fromEntries(fs.readFileSync(path.join(os.homedir(), '.r2-creds'), 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const clean = v => String(v || '').replace(/^[<"'\s]+|[>"'\s]+$/g, '');
// Fallback: the OAuth token `wrangler login` stored (valid ~1 h after login; re-run wrangler whoami to refresh).
const wranglerToml = path.join(process.env.APPDATA || '', 'xdg.config/.wrangler/config/default.toml');
const oauth = fs.existsSync(wranglerToml) ? (fs.readFileSync(wranglerToml, 'utf8').match(/^oauth_token\s*=\s*"([^"]+)"/m) || [])[1] : '';
const T = clean(process.env.CF_MOVE_TOKEN || cred.CF_MOVE_TOKEN || oauth);
const A = '46cdce4b7061ce5424b187cf9353ba92', B = '2dd73a8e73f3df114fe87b1c159a2bfd';
const NS_A = clean(process.env.NS_A || 'fc95757f7ce54294a1b9af14f8f69c2f'), NS_B = clean(process.env.NS_B);
const WRITE = process.argv.includes('--write');
if (!T) { console.error('No CF_MOVE_TOKEN and no wrangler login'); process.exit(1); }
if (WRITE && !NS_B) { console.error('--write needs NS_B=<namespace id on account B>'); process.exit(1); }

const api = (p, o = {}) => fetch('https://api.cloudflare.com/client/v4' + p,
  { ...o, headers: { Authorization: 'Bearer ' + T, ...(o.headers || {}) } });

async function keysOf(acc, ns) {
  const keys = []; let cursor = '';
  do {
    const r = await (await api(`/accounts/${acc}/storage/kv/namespaces/${ns}/keys?limit=1000${cursor ? '&cursor=' + cursor : ''}`)).json();
    if (!r.success) throw new Error(`keys ${acc}/${ns}: ` + JSON.stringify(r.errors));
    keys.push(...r.result); cursor = r.result_info?.cursor || '';
  } while (cursor);
  return keys;
}

const keys = await keysOf(A, NS_A);
console.log('keys on A:', keys.length);
for (const k of keys) console.log('  ', k.name, k.expiration ? '(exp ' + new Date(k.expiration * 1000).toISOString() + ')' : '(no TTL)');
if (!WRITE) { console.log('\ndry run — add --write and NS_B=… to copy'); process.exit(0); }

const bulk = [];
for (const k of keys) {
  const res = await api(`/accounts/${A}/storage/kv/namespaces/${NS_A}/values/${encodeURIComponent(k.name)}`);
  if (!res.ok) throw new Error(`read ${k.name}: HTTP ${res.status}`);
  const item = { key: k.name, value: await res.text() };
  if (k.expiration) item.expiration = k.expiration;
  if (k.metadata) item.metadata = k.metadata;
  bulk.push(item);
}
const put = await (await api(`/accounts/${B}/storage/kv/namespaces/${NS_B}/bulk`,
  { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bulk) })).json();
if (!put.success) { console.error('write failed:', JSON.stringify(put.errors)); process.exit(1); }

const onB = new Set((await keysOf(B, NS_B)).map(k => k.name));
const missing = keys.map(k => k.name).filter(n => !onB.has(n));
console.log(`wrote ${bulk.length}; B now has ${onB.size} key(s); missing on B: ${missing.length}`);
if (missing.length) { missing.forEach(n => console.error('  missing:', n)); process.exit(1); }
console.log('✓ every key on A exists on B with the same name');
