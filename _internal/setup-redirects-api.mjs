// Set up Cloudflare Bulk Redirects entirely via API (reliable; dashboard CSV upload mis-parsed targets).
// Reads _internal/bulk-redirects.csv → fills a redirect list → creates the account redirect rule.
// Needs CLOUDFLARE_API_TOKEN with Account Filter Lists:Edit + Account Rulesets:Edit (+ in ~/.r2-creds).
// Run: node _internal/setup-redirects-api.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const cred = Object.fromEntries(fs.readFileSync(path.join(os.homedir(), '.r2-creds'), 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const clean = v => String(v || '').replace(/^[<"'\s]+|[>"'\s]+$/g, '');
const ACC = clean(cred.R2_ACCOUNT_ID), TOKEN = clean(cred.CLOUDFLARE_API_TOKEN);
const API = 'https://api.cloudflare.com/client/v4';
const LIST_NAME = 'thailandaddict';

const cf = async (method, pathh, body) => {
  const r = await fetch(API + pathh, {
    method, headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!j.success) throw new Error(method + ' ' + pathh + ' → ' + r.status + ' ' + JSON.stringify(j.errors || j).slice(0, 300));
  return j.result;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1) parse CSV → items
const rows = fs.readFileSync(path.resolve(import.meta.dirname, 'bulk-redirects.csv'), 'utf8').split(/\r?\n/).filter(Boolean).slice(1);
const items = rows.map(line => {
  const [src, tgt] = line.split(',');
  return { redirect: { source_url: src.replace(/^https?:\/\//, ''), target_url: tgt, status_code: 301, preserve_query_string: true } };
});
console.log(`parsed ${items.length} redirects from CSV`);

// 2) find or create the list
const lists = await cf('GET', `/accounts/${ACC}/rules/lists`);
let list = lists.find(l => l.name === LIST_NAME && l.kind === 'redirect');
if (!list) { list = await cf('POST', `/accounts/${ACC}/rules/lists`, { name: LIST_NAME, kind: 'redirect', description: 'WP old-URL 301s' }); console.log('created list ' + list.id); }
else console.log('using existing list ' + list.id + ' (items:' + (list.num_items || 0) + ')');

// 3) replace items (PUT = set exact contents) → async op → poll
const op = await cf('PUT', `/accounts/${ACC}/rules/lists/${list.id}/items`, items);
console.log('items PUT, operation ' + op.operation_id + ' — polling...');
for (let i = 0; i < 30; i++) {
  await sleep(2000);
  const st = await cf('GET', `/accounts/${ACC}/rules/lists/bulk_operations/${op.operation_id}`);
  if (st.status === 'completed') { console.log('✓ items committed'); break; }
  if (st.status === 'failed') throw new Error('bulk op failed: ' + (st.error || ''));
  if (i === 29) throw new Error('bulk op timeout (status ' + st.status + ')');
}
const after = await cf('GET', `/accounts/${ACC}/rules/lists/${list.id}`);
console.log('list now has ' + after.num_items + ' items');

// 4) set the account http_request_redirect rule to use this list (PUT entrypoint = replace rules)
const rule = {
  rules: [{
    expression: `http.request.full_uri in $${LIST_NAME}`,
    action: 'redirect',
    action_parameters: { from_list: { name: LIST_NAME, key: 'http.request.full_uri' } },
    enabled: true,
    description: 'WP old-URL 301s',
  }],
};
const rs = await cf('PUT', `/accounts/${ACC}/rulesets/phases/http_request_redirect/entrypoint`, rule);
console.log('✓ redirect rule deployed (ruleset ' + rs.id + ', rules: ' + rs.rules.length + ')');
console.log('\nDONE — verify a few URLs now.');
