# Runbook — Move `thailandaddict.com` from Cloudflare account A → B

**A** = `chatmaliwan@gmail.com` · `46cdce4b7061ce5424b187cf9353ba92` (Workers FREE, 20,000-asset cap)
**B** = `chatoccmed@gmail.com` · `2dd73a8e73f3df114fe87b1c159a2bfd` (Workers PAID, 100,000-asset cap)
Registrar: **name.com**. Zone type: full. DNSSEC: off. Current NS: `aisha` / `greg`.

---

## 1. Expected downtime — the honest number

| Scenario | Outage | Condition |
|---|---|---|
| **Target** | **0–60 seconds** | TLS certificate already issued on B *before* the nameserver change, and the Worker route pre-created on B's Pending zone |
| **Realistic** | **1–3 minutes** | Certificate pre-issued; route created by a scripted `curl` the moment B goes Active |
| Acceptable ceiling | 15 minutes | Certificate pre-issued; you fall back to a dashboard Custom Domain and its Advanced Certificate has to issue |
| **Do not accept** | **15 min – 24 hours of hard failure** | No certificate on B at cutover |

**One variable drives all of it: does a valid TLS certificate for `thailandaddict.com` exist on account B before you touch name.com.** Everything else in this runbook is bookkeeping.

Why the last row is catastrophic rather than merely bad: `astro/public/_headers` ships `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Every browser that visited in the last 365 days has a pinned HSTS entry. During a TLS gap those browsers do not show an interstitial with a "proceed" link — they **hard-fail** with `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` and no way through. A 20-minute certificate gap is a 20-minute total outage for your entire returning audience.

Three findings that make the fast path real:

1. **The 48-hour `.com` delegation TTL is not an outage window.** Cloudflare's authoritative DNS is one shared anycast cluster keyed by zone name — the "assigned pair" is an activation token, not a data partition. Prior measurement confirmed that nameservers belonging to a completely unrelated zone return correct records for `thailandaddict.com`. So a resolver still holding the old `aisha`/`greg` delegation gets **B's** records the instant B activates. The cutover is atomic at Cloudflare's control plane. (Step **C6** verifies this in the field.)
2. **R2 does not move.** No `r2_buckets` binding in `wrangler.jsonc`, no `r2.dev` reference in `worker.js` — pages point browsers straight at `https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/...`. Images keep serving from A throughout, uninterrupted. See §7.
3. **You can build B completely while A keeps serving.** Adding the domain to B puts it in `Pending`; A stays Active and serving. Zone Holds — the only thing that could block a second-account add — are Enterprise-only and cannot exist on your Free zone.

**Do not touch HSTS.** You are not on the preload list (verified), so only per-browser pins apply, and reducing `max-age` now only reaches visitors who return between the deploy and the cutover — the stale-pin long tail is structurally unreachable at any lead time short of 365 days. Worse, reducing it costs you a rebuild-and-deploy on account A, which has **199 files of headroom**. Pre-issuing the certificate removes the failure mode that HSTS amplifies. That is the fix.

---

## 2. Two things that will bite you, found in the repo this session

**(a) `npm run deploy` is RED right now.** `_internal/qa/check-file-count.mjs` sets `MAX_DEPLOY_FILES = 19_000`; the real deployable count is **19,801**. `npm run deploy` = `build && verify && wrangler deploy`, and `verify` throws. Your first deploy to B needs `TA_MAX_DEPLOY_FILES=95000` (step **P8**). Fix the threshold properly after the move (step **D3**).

**(b) The 472 legacy WordPress 301 redirects do NOT move with the zone.** `_internal/setup-redirects-api.mjs` writes to `/accounts/{ACC}/rules/lists` and `/accounts/{ACC}/rulesets/phases/http_request_redirect/entrypoint` — **account-level** resources on A. Zone-scoped config moves; account-scoped config does not. If you skip step **P12**, 472 old indexed URLs start 404-ing the moment you cut over, silently. Note also that this script reads `R2_ACCOUNT_ID` as its account id — which is A's — so it must be re-pointed, and `R2_ACCOUNT_ID` itself must stay on A for the image uploader.

Also in the zone and easy to lose: `MX 10 mail.thailandaddict.com` → `147.50.255.17` (hostatom), the `mail` and `ftp` A records, `v=spf1 …`, and a live `google-site-verification=RKQ…` TXT. Email dies silently if the MX is dropped, and dropping the verification TXT un-verifies the Search Console Domain property and loses its history. Step **P5** protects all of them.

---

## 3. Roles

**Owner personally** (needs account ownership, billing, or a login the assistant does not have): create the API token (**P1**), buy ACM if needed (**P10b**), the name.com nameserver change (**C3**), Search Console (**P16**), and the go/no-go call at **C2**.

**Assistant**: everything else — API calls, KV copy, deploys, verification.

Set up the shared shell once (Git Bash):

```bash
export CF_TOKEN='<the new dual-account token from P1>'
export ACC_A=46cdce4b7061ce5424b187cf9353ba92
export ACC_B=2dd73a8e73f3df114fe87b1c159a2bfd
cf() { curl -s -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" "$@"; }
```

---

# PREPARATION — fully reversible, do it now

Nothing in this section can take the site down. Run it over a normal week.

### P0 — Freeze content · assistant
**Do:** stop publishing until the migration lands. Do not run `npm run deploy` against account A.
**Why:** 199 files of headroom; a content batch makes A un-deployable, and any deploy to A during preparation is risk with no upside.
**Verify:** `node _internal/qa/check-file-count.mjs astro/dist` — note the number.
**Rollback:** n/a.

### P1 — Create one dual-account API token · **owner**
**Do:** cloudflare.com → **My Profile → API Tokens → Create Token → Custom token**.
Permissions:
- Account · Workers Scripts · **Edit**
- Account · Workers KV Storage · **Edit**
- Account · Account Rulesets · **Edit**
- Account · Account Filter Lists · **Edit**
- Zone · Zone · **Edit** · Zone · DNS · **Edit** · Zone · SSL and Certificates · **Edit** · Zone · Workers Routes · **Edit**

Account Resources: **Include → account A *and* account B** (both, in the same token).
Zone Resources: **Include → All zones from account A**, **All zones from account B**.
Give it to the assistant. Keep the existing token untouched until **D2**.

**Verify:**
```bash
cf "https://api.cloudflare.com/client/v4/user/tokens/verify"
cf "https://api.cloudflare.com/client/v4/accounts" | grep -o '"name":"[^"]*"'   # both accounts listed
```
**Rollback:** delete the token in the dashboard.

### P2 — Capture the "before" baseline · assistant
```bash
echo | openssl s_client -connect thailandaddict.com:443 -servername thailandaddict.com 2>/dev/null \
  | openssl x509 -noout -serial -issuer -dates
curl -s https://thailandaddict.com/sitemap.xml | grep -c "<loc>"          # expect 16505
curl -s https://rdap.verisign.com/com/v1/domain/thailandaddict.com | tr ',' '\n' | grep -i ldhName
```
Save the output. The certificate serial is your single cleanest "am I on A or B" signal during the window.
**Rollback:** n/a, read-only.

### P3 — Record what the Worker is bound by on A · assistant
```bash
ZONE_A=$(cf "https://api.cloudflare.com/client/v4/zones?name=thailandaddict.com&account.id=$ACC_A" | grep -o '"id":"[a-f0-9]\{32\}"' | head -1 | cut -d'"' -f4)
echo "ZONE_A=$ZONE_A"
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_A/workers/routes"
cf "https://api.cloudflare.com/client/v4/accounts/$ACC_A/workers/domains?zone_name=thailandaddict.com"
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_A/dns_records?per_page=100" > dns-A.json
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_A/settings" > settings-A.json
```
**Verify:** you now know whether A uses a **route** or a **Custom Domain**, and you have the DNS + settings snapshot.
**Rollback:** n/a.

### P4 — Snapshot A's DNS in BIND form · assistant
```bash
curl -s -H "Authorization: Bearer $CF_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_A/dns_records/export" -o dns-A.bind
cat dns-A.bind
```
**Verify:** the file contains apex `A`, `www`, `mail` → `147.50.255.17`, `ftp`, `MX 10 mail.thailandaddict.com`, `TXT v=spf1 …`, `TXT google-site-verification=RKQ…`.
Do **not** rely on Cloudflare's DNS scan when adding the domain to B — it cannot read from Cloudflare and will silently miss records.
**Rollback:** n/a.

### P5 — Add the domain to account B · assistant
**Do:** Cloudflare dashboard, logged in as B → **Add a site** → `thailandaddict.com` → **Free** plan → skip the record scan.
Or:
```bash
cf -X POST "https://api.cloudflare.com/client/v4/zones" \
  --data "{\"name\":\"thailandaddict.com\",\"account\":{\"id\":\"$ACC_B\"},\"type\":\"full\"}"
ZONE_B=<id from the response>
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_B" | grep -o '"name_servers":\[[^]]*\]'
```
**Verify:** zone B status is `pending`; **write down B's assigned nameserver pair** — it will not be `aisha`/`greg`, and setting the wrong pair at name.com leaves the zone Pending forever. Confirm `thailandaddict.com` is still Active on A and the site still loads.
**Rollback:** delete the zone from B (`DELETE /zones/$ZONE_B`). A is untouched.
**If the add is refused** (error 1061, or a zone-hold message) — stop, do not delete anything, and jump to §8 branch (i).

### P6 — Import DNS into B, unproxied · assistant
```bash
awk '$4!="NS" && $4!="SOA"' dns-A.bind > dns-B.bind    # strip apex NS + SOA → avoids error 9221
cat dns-B.bind                                          # ~15 records, eyeball it
curl -s -X POST -H "Authorization: Bearer $CF_TOKEN" \
  -F "file=@dns-B.bind" -F "proxied=false" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_B/dns_records/import"
```
Then turn the orange cloud on for **apex and `www` only**, in the dashboard or by `PATCH`ing those two records with `"proxied":true`.

**Verify:**
```bash
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_B/dns_records?per_page=100" \
  | tr '}' '\n' | grep -o '"name":"[^"]*","type":"[^"]*"' | sort
```
Diff against `dns-A.json`. Confirm `mail` and `ftp` are **grey-cloud** — proxying `mail` breaks SMTP — and that the `google-site-verification` TXT is present.
**Rollback:** re-import or edit records; B is Pending and serves nothing.

### P7 — Point wrangler at account B, deterministically · assistant
**Do:** first preserve an emergency config:
```bash
cd C:/Users/Imac/Thailandaddict/thailandaddict
cp wrangler.jsonc wrangler.A.jsonc
```
Add `"account_id": "46cdce4b7061ce5424b187cf9353ba92"` to `wrangler.A.jsonc` (that is your one-flag path back to A).
Then edit `wrangler.jsonc`: add `"account_id": "2dd73a8e73f3df114fe87b1c159a2bfd"` and `"workers_dev": true`. Do **not** add a `routes` key yet — `wrangler deploy` would try to create the route on a Pending zone and abort the whole deploy.

**Why this matters:** wrangler here authenticates purely by `CLOUDFLARE_API_TOKEN` (no OAuth config on this machine). The new token reaches two accounts, so without an explicit `account_id` wrangler cannot infer a target and will either prompt or fail. Pinning it also makes it *impossible* to accidentally deploy to A.
**Verify:** `npx wrangler whoami`
**Rollback:** `git checkout wrangler.jsonc`.

### P8 — Deploy the Worker to B · assistant
```bash
TA_MAX_DEPLOY_FILES=95000 npm run deploy
```
This builds, runs both gates, and uploads to B. `workers_dev: true` gives you a permanent staging URL.

**Bindings — what actually happens:**
- `assets` / `ASSETS` → 19,801 files, well under B's 100,000 cap. This is the entire point of the migration.
- `ai` / `AI` → account-level, works on B as-is. One honest note: `/api/plan` consumes Workers AI neurons and on a paid account usage beyond the daily free allocation is billable. Behaviour is identical; the bill is not.
- `kv_namespaces` / `TRIPS` → **id must change** in **P9**. Leave the old id in place for this first deploy; the Worker only reads KV on `/api/*` and `/t/:id`, which nothing is calling on the staging URL yet.
- `ratelimits` / `RL_PLAN` (15/60s) and `RL_WRITE` (40/60s) → **nothing to migrate.** `namespace_id` `2001` / `2002` are script-local labels declared inline, not account resources; they are created by the deploy itself.
- `compatibility_date`, `not_found_handling: "404-page"` → unchanged.

**Verify:**
```bash
curl -sI https://thailandaddict.<B-subdomain>.workers.dev/ | head -3
curl -s https://thailandaddict.<B-subdomain>.workers.dev/sitemap.xml | grep -c "<loc>"   # 16505
```
**Rollback:** none needed — this Worker is invisible to the public. Account A is untouched and still serving.

### P9 — Create the KV namespace on B · assistant
```bash
npx wrangler kv namespace create TRIPS      # prints the new id
```
Put the new id in `wrangler.jsonc`, redeploy (**P8** command again).
**Verify:** `npx wrangler kv namespace list` shows it under B.
**Rollback:** delete the namespace; restore the old id.

### P10 — Copy the 14 KV keys · assistant

**Why the key names must be byte-identical:** `worker.js:521` writes `env.TRIPS.put('trip:' + id, …)` and `worker.js:591` reads `env.TRIPS.get('trip:' + id)` where `id` comes straight out of the `/t/:id` URL. **The KV key *is* the public share ID.** Rename or re-generate a key and that shared trip link 404s forever. The same applies to `email:` and `contact:` — 10 real captured leads with no TTL.

Write `_internal/kv-copy.mjs`:

```js
const T = process.env.CF_TOKEN, A = process.env.ACC_A, B = process.env.ACC_B;
const NS_A = process.env.NS_A, NS_B = process.env.NS_B;
const api = (p, o = {}) => fetch('https://api.cloudflare.com/client/v4' + p,
  { ...o, headers: { Authorization: 'Bearer ' + T, ...(o.headers || {}) } });

const keys = []; let cursor = '';
do {
  const r = await (await api(`/accounts/${A}/storage/kv/namespaces/${NS_A}/keys?limit=1000${cursor ? '&cursor=' + cursor : ''}`)).json();
  if (!r.success) throw new Error(JSON.stringify(r.errors));
  keys.push(...r.result); cursor = r.result_info?.cursor || '';
} while (cursor);
console.log('keys on A:', keys.length);
keys.forEach(k => console.log('  ', k.name, k.expiration ? '(exp ' + new Date(k.expiration * 1000).toISOString() + ')' : '(no TTL)'));

const bulk = [];
for (const k of keys) {
  const value = await (await api(`/accounts/${A}/storage/kv/namespaces/${NS_A}/values/${encodeURIComponent(k.name)}`)).text();
  const item = { key: k.name, value };
  if (k.expiration) item.expiration = k.expiration;   // ABSOLUTE epoch: preserves the original expiry, does not restart the clock
  if (k.metadata) item.metadata = JSON.stringify(k.metadata);
  bulk.push(item);
}
const put = await (await api(`/accounts/${B}/storage/kv/namespaces/${NS_B}/bulk`,
  { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bulk) })).json();
console.log('write success:', put.success, put.errors || '');
```

```bash
NS_A=fc95757f7ce54294a1b9af14f8f69c2f NS_B=<new id> node _internal/kv-copy.mjs
```

`expiration` (absolute epoch) is copied verbatim, so the four `trip:` keys keep their **original** 1-year expiry rather than getting a fresh one, and the ten `email:`/`contact:` keys — which carry no `expiration` field — are written permanent. Do not substitute `expiration_ttl`; that silently restarts the clock.

**Verify:**
```bash
cf "https://api.cloudflare.com/client/v4/accounts/$ACC_B/storage/kv/namespaces/<NS_B>/keys" \
  | tr ',' '\n' | grep -o '"name":"[^"]*"' | sort > kv-B.txt
wc -l kv-B.txt        # expect 14: 5 contact:, 5 email:, 4 trip:
```
Diff the sorted key names against A. They must match character for character.
**Rollback:** re-run; it is idempotent. Or delete the namespace and redo.

*Avoid `wrangler kv key …` for this.* Wrangler v4 changed KV commands' local/remote default, and a copy that silently reads or writes local miniflare state looks like success and moves nothing.

### P11 — Get a TLS certificate onto B **before** the cutover · assistant, then **owner** if it needs money

This is the step the whole migration turns on. Try the free path first; it costs two minutes.

**P11a — free path.** Dashboard (as B) → `thailandaddict.com` → **SSL/TLS → Edge Certificates**, or:
```bash
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_B/ssl/certificate_packs?status=all"
```
If a pack appears with `validation_records` containing a `txt_name` / `txt_value`, **add that exact TXT record into zone A's live DNS** (A is authoritative right now, so the CA resolves it immediately):
```bash
cf -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_A/dns_records" \
  --data '{"type":"TXT","name":"<txt_name>","content":"<txt_value>","ttl":300}'
```
Re-poll the pack until `"status":"active"`.

**P11b — $10 path, if P11a shows no validation records.** The two research passes disagreed on whether Universal SSL exposes DCV tokens on a Pending full-setup zone, so treat P11a as a test, not a plan. If it comes up empty: **owner** adds **Advanced Certificate Manager** ($10/month, available on Free plans) to zone B, then:
```bash
cf -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_B/ssl/certificate_packs/order" \
  --data '{"type":"advanced","hosts":["thailandaddict.com","www.thailandaddict.com"],
           "validation_method":"txt","validity_days":90,
           "certificate_authority":"lets_encrypt","cloudflare_branding":false}'
```
Take the returned TXT tokens, add them to zone A exactly as above, poll to `active`. Cancel ACM after **D6** if you want the $10 back.

**Verify — this is a hard gate:**
```bash
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_B/ssl/certificate_packs?status=all" \
  | tr ',' '\n' | grep -o '"status":"[^"]*"'
```
**You do not proceed to CUTOVER until this reads `active`.** No certificate, no cutover — that is the difference between 60 seconds and 24 hours.
**Rollback:** delete the DCV TXT records from zone A (300s TTL, they affect nothing else).

### P12 — Recreate the 472 Bulk Redirects on account B · assistant
**Do:** edit `_internal/setup-redirects-api.mjs` line 12 so the account id comes from a new `CF_ACCOUNT_ID` variable rather than `R2_ACCOUNT_ID` — `R2_ACCOUNT_ID` must keep pointing at A for `upload-r2-api.mjs`. Add `CF_ACCOUNT_ID=2dd73a8e73f3df114fe87b1c159a2bfd` to `~/.r2-creds`. Then run it. It creates a `thailandaddict` redirect list on B and sets B's account-level `http_request_redirect` entrypoint.

**Verify:**
```bash
cf "https://api.cloudflare.com/client/v4/accounts/$ACC_B/rules/lists" | grep -o '"name":"[^"]*","kind":"[^"]*"'
cf "https://api.cloudflare.com/client/v4/accounts/$ACC_B/rulesets/phases/http_request_redirect/entrypoint" | grep -o '"expression":"[^"]*"'
```
Item count must be 472.
**Caution:** that endpoint is `PUT entrypoint` = **replace all rules**. Account B has 12 other domains. Before running, `GET` B's existing entrypoint and confirm it is empty or that you have merged whatever is there — otherwise you wipe redirect rules belonging to another site.
**Rollback:** restore the previous entrypoint ruleset from your `GET` snapshot; delete the list.

### P13 — Copy the zone settings that matter · assistant
Diff `settings-A.json` against B's and match at minimum: **SSL/TLS mode** (set **Full (strict)**), **Always Use HTTPS = On**, **Automatic HTTPS Rewrites**, **Brotli**, **Minimum TLS version**, caching level, security level.
**Verify:** `cf ".../zones/$ZONE_B/settings" > settings-B.json` and diff the two files.
**Rollback:** re-PATCH any setting.

### P14 — Optional but recommended: rehearse on a domain B already owns · assistant
Bind a throwaway hostname on one of B's 12 **active** zones (e.g. `ta-rehearsal.<some-b-domain>`) to this Worker. This proves, on a real hostname on account B: 19,801 assets serve, KV reads work, `/api/plan` reaches the AI binding, the rate-limit bindings instantiate, and — the valuable part — **how many minutes a certificate takes to issue on account B**. That number is your worst-case tail if P11 somehow regresses. Delete the hostname afterwards.
**Rollback:** delete the custom domain / route. Zero effect on `thailandaddict.com`.

### P15 — Set up an external uptime monitor · assistant
UptimeRobot free, 5-minute interval, `https://thailandaddict.com/sitemap.xml`, keyword match on `<loc>`. Five minutes of setup buys you an independent vantage point and a timestamped record of the window. Do this before, not after.

### P16 — Check Search Console · **owner**
The premise that GSC is unset is wrong: `google-site-verification=RKQnFealCiw74qJ8HFWpNlgVNp18v02d2ba7C7UKpKs` is live in the zone right now — that is a **Domain property** token someone already completed.
**Do:** sign in to Search Console and look for a Domain property for `thailandaddict.com`. If it is verified, you already have up to 16 months of history and a real before/after baseline. If the token is orphaned under an unused Google account, re-verifying takes ~60 seconds because the TXT record is already published.
**Verify:** the property is verified under an account you control, and the sitemap is submitted.
**Expectation management:** GSC will tell you **nothing during the window** — Crawl Stats lag 2–3 days, Page Indexing 3–7 days, Performance ~2 days. It is a post-mortem instrument. Your real-time detector is §6 plus the P15 monitor. And do **not** file a Change of Address — this is a same-URL migration; that tool is for domain changes and using it here would actively hurt.

### P17 — Final pre-flight · assistant
```bash
# 1. Certificate on B is active
cf ".../zones/$ZONE_B/ssl/certificate_packs?status=all" | grep -o '"status":"[^"]*"'
# 2. DNSSEC is off at the parent (no DS record to strand the zone in Pending)
curl -s -H 'accept: application/dns-json' "https://dns.google/resolve?name=thailandaddict.com&type=DS&do=1" | grep -o '"Status":[0-9]*'
# 3. Site still healthy on A
curl -s -o /dev/null -w "%{http_code}\n" https://thailandaddict.com/
# 4. B's Worker healthy on workers.dev
curl -s https://thailandaddict.<B-subdomain>.workers.dev/sitemap.xml | grep -c "<loc>"
# 5. KV: 14 keys on B
# 6. Redirect list on B: 472 items
```
All six green, or you do not open the window.

---

# ⛔ POINT OF NO RETURN

> **The point of no return is step C3 — the nameserver change at name.com — which triggers C4 within minutes.**
>
> **Reverting the nameservers at name.com afterwards is NOT a rollback.** Every Cloudflare nameserver answers for every Cloudflare zone; once Cloudflare's control plane marks zone B authoritative for `thailandaddict.com`, pointing the delegation back at `aisha`/`greg` routes to exactly the same place and changes nothing. The old nameserver names are aliases for one cluster, not a fallback path.
>
> **After C3 the only fast recovery is to roll forward** — fix the route on B. That is 1–3 minutes, and it is why steps P1–P17 exist: so that the only thing that can go wrong at that moment is one API call, not a Worker you have never run.
>
> Everything before C3 rolls back in about a minute. Nothing before C3 can take the site down.

---

# CUTOVER — the window

**When:** 04:00–06:00 ICT (trough for a Thai-audience site), Tuesday–Thursday (Cloudflare and name.com support staffed). Budget 45 minutes; expect to use 5.

Two people, one call open. Owner at name.com. Assistant at the terminal.

### C1 — Final KV delta sweep · assistant
Re-run `_internal/kv-copy.mjs`. Any lead captured since P10 is now on B. Idempotent.
**Verify:** key count on B ≥ key count on A.

### C2 — Go / no-go · **owner**
Confirm out loud: certificate on B is `active`; 14+ KV keys on B; 472 redirects on B; `workers.dev` serving 16,505 sitemap entries; monitor running.
**Rollback:** say no. Nothing has happened yet.

### C3 — ⛔ Change the nameservers at name.com · **owner**
**Do:** name.com → `thailandaddict.com` → Nameservers → replace `aisha.ns.cloudflare.com` and `greg.ns.cloudflare.com` with **B's assigned pair** (from P5). Save.
**Verify:** poll the registry directly — this bypasses every cache:
```bash
while true; do date +%H:%M:%S; \
  curl -s https://rdap.verisign.com/com/v1/domain/thailandaddict.com | tr ',' '\n' | grep -i ldhName; \
  sleep 30; done
```
When `AISHA`/`GREG` disappear and B's pair appears, name.com has done its job (5–60 min). Only then go to C4 — earlier attempts just fail and burn rate limit.
**Rollback:** none that works. See the banner above.

### C4 — Force activation · assistant
```bash
cf -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_B/activation_check"
cf "https://api.cloudflare.com/client/v4/zones/$ZONE_B" | grep -o '"status":"[^"]*"'
```
Repeat every 60 seconds until `"status":"active"`. Do not wait for Cloudflare's passive check — that is where a 24-hour tail comes from.
**Verify:** zone B `active`. Zone A will flip to `moved`. That is expected and correct.

### C5 — Attach the Worker · assistant — **run this the second C4 goes green**
Have this typed and ready before C3:
```bash
cf -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_B/workers/routes" \
  --data '{"pattern":"thailandaddict.com/*","script":"thailandaddict"}'
cf -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_B/workers/routes" \
  --data '{"pattern":"www.thailandaddict.com/*","script":"thailandaddict"}'
```
**Try creating these routes during P17 as well** — a route on a Pending zone is inert and costs nothing, and if the API accepts it, your outage collapses to zero because there is nothing left to do at C5.

**Use a route, not a Custom Domain.** A route is a config row on B's own zone — it does not mint a per-hostname certificate, does not collide with whatever A holds, relies on the zone certificate you already pre-issued at P11, and can be declared in `wrangler.jsonc` later. A Custom Domain requires an *active* zone and orders its own Advanced Certificate at creation time, which serializes a cert issuance into your outage. Custom Domain is the fallback only if routes are rejected.

**Verify:** `curl -sI https://thailandaddict.com/ | head -3` → `200`.
**Rollback:** `DELETE /zones/$ZONE_B/workers/routes/{id}` and create a Custom Domain instead.

### C6 — Confirm the flip is global, not TTL-spread · assistant
```powershell
foreach ($ns in 'aisha.ns.cloudflare.com','greg.ns.cloudflare.com') {
  "--- $ns ---"
  Resolve-DnsName -Name thailandaddict.com -Type A -Server $ns -DnsOnly -NoHostsFile |
    Select-Object Name,TTL,IPAddress | Format-Table -AutoSize
}
```
If the **old** nameservers still return correct records, the 48-hour delegation TTL is confirmed harmless and every stale resolver on the internet is already being served by B. If they return `SERVFAIL` or `REFUSED`, that assumption failed — see §8 branch (iv).

### C7 — Run the verification script · assistant
§6, in full. Every line must pass.

### C8 — Announce green · assistant → owner
Report: certificate serial changed, all §6 checks pass, monitor green.

---

# 6. Post-cutover verification script

Save as `_internal/verify-cutover.sh`, run in Git Bash immediately after C5, then again at +1h and +24h.

```bash
#!/usr/bin/env bash
# verify-cutover.sh — run immediately after the Worker route goes live on account B
H=https://thailandaddict.com
fail=0
chk() { # chk <label> <url> <expected-code>
  c=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$2")
  if [ "$c" = "$3" ]; then printf "  OK   %-42s %s\n" "$1" "$c"
  else printf "  FAIL %-42s %s (want %s)\n" "$1" "$c" "$3"; fail=$((fail+1)); fi
}

echo "== 1. TLS =="
echo | openssl s_client -connect thailandaddict.com:443 -servername thailandaddict.com 2>/dev/null \
  | openssl x509 -noout -serial -issuer -dates
# Serial 3837D7FE95E82DCD13E420BCF23FF86A = STILL ON ACCOUNT A. Any other serial = you are on B.
curl -s -o /dev/null -w "  chain verify result: %{ssl_verify_result} (0 = valid)\n" "$H/"

echo "== 2. Locale homepages (9) =="
for l in "" en zh ru ko ja hi he ar; do
  [ -z "$l" ] && chk "/ (th)" "$H/" 200 || chk "/$l/" "$H/$l/" 200
done

echo "== 3. Content types =="
chk "review"        "$H/review-koh-yao-yai-village-phang-nga" 200
chk "review (en)"   "$H/en/review-koh-yao-yai-village-phang-nga" 200
chk "roundup"       "$H/top10-hotels-pattaya" 200
chk "article"       "$H/best-of-thailand-2026" 200
chk "activity hub"  "$H/activities-krabi" 200
chk "sitemap"       "$H/sitemap.xml" 200
chk "robots"        "$H/robots.txt" 200
chk "404 handling"  "$H/this-page-does-not-exist-xyz" 404
echo -n "  sitemap <loc> count: "; curl -s "$H/sitemap.xml" | grep -c "<loc>"   # MUST be 16505

echo "== 4. Planner + prototype =="
chk "/trip"          "$H/trip" 200
chk "/my-list"       "$H/my-list" 200
chk "/_proto/"       "$H/_proto/" 200
chk "/_proto/review" "$H/_proto/review.html" 200
echo -n "  POST /api/plan → "
curl -s -o /dev/null -w "%{http_code}\n" --max-time 40 -X POST "$H/api/plan" \
  -H 'Content-Type: application/json' --data '{"province":"krabi","days":2}'   # 200 = AI binding live

echo "== 5. Shared trip (KV key == public share id) =="
# TRIP_ID = a 'trip:' key from KV with the prefix stripped. Set it before running.
chk "/t/$TRIP_ID" "$H/t/$TRIP_ID" 200
curl -s "$H/t/$TRIP_ID" | grep -qi "<title" && echo "  OK   shared trip renders" || { echo "  FAIL shared trip empty"; fail=$((fail+1)); }

echo "== 6. Affiliate links =="
echo -n "  /go/b 302 → "
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  "$H/go/b?u=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fth%2Fkoh-yao-yai-village.html&sid=review-koh-yao-yai-village-phang-nga"
# expect: 302 https://www.anrdoezrs.net/click-101809619-17293139?sid=review-koh-...&url=...
curl -s "$H/review-koh-yao-yai-village-phang-nga" | grep -qc "cid=1965862" \
  && echo "  OK   Agoda cid=1965862 present" || { echo "  FAIL Agoda cid missing"; fail=$((fail+1)); }
curl -s "$H/activities-krabi" | grep -qc "aid=121442" \
  && echo "  OK   Klook aid=121442 present" || { echo "  FAIL Klook aid missing"; fail=$((fail+1)); }

echo "== 7. Images still served from R2 on account A =="
IMG=$(curl -s "$H/review-koh-yao-yai-village-phang-nga" \
  | grep -o "https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/[^\"']*" | head -1)
chk "R2 image" "$IMG" 200

echo "== 8. Redirects =="
echo -n "  bulk redirect (account-level, recreated on B) → "
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$H/the-best-hotel-wordpress-theme-2017"   # want 301 → /
echo -n "  _redirects splat (ships with the Worker)     → "
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$H/shop"                                  # want 301 → /

echo "== 9. Headers =="
curl -sI "$H/" | grep -iE "strict-transport|content-security|cache-control|x-frame"

echo; [ "$fail" -eq 0 ] && echo "ALL PASS" || { echo "$fail FAILURES"; exit 1; }
```

Then, independently: check from a phone on Thai mobile data, and ask one person outside Thailand. Your ISP's cache is not the internet.

---

# 7. What stays on account A — and what that costs you

**The R2 bucket stays on account A. Permanently. Do not touch it during this migration.**

Verified: `wrangler.jsonc` has no `r2_buckets` binding; `worker.js` contains no `r2.dev` reference; built pages hand the browser an absolute `https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/...` URL and the browser fetches it straight from the public bucket. The Worker is not in that path at all. So the bucket is completely decoupled from the migration — nothing about the cutover can break images, and moving it would have forced a re-upload, a URL rewrite across 569 content files, and a full rebuild you do not need.

**The consequence, stated plainly: account A must stay open and in good standing indefinitely, or every image on 16,505 pages breaks.** The `pub-<hash>.r2.dev` hostname is bound to account A's bucket and cannot be transferred to B. There is no "move a bucket" operation any more than there is a "move a zone" one.

**Verdict: leave it, and do not close account A.** Keep the `R2_*` credentials in `~/.r2-creds` pointing at A; `upload-r2-api.mjs` keeps working unchanged for future image batches.

**What would break if account A were closed or suspended:** every hotel, restaurant, activity and city photo on the site — 16,750 files' worth — 404s at once, on every page, in every locale. The pages still render; they render bare. That is the single dependency this migration leaves behind, so treat account A as production infrastructure, not as an old account to tidy up.

**The proper long-term fix — schedule it 2–4 weeks after the migration, never during.** You cannot attach `img.thailandaddict.com` to A's bucket, because an R2 custom domain requires the bucket and the zone to be in the *same* account and the zone will be on B. So the sequence is: create a new bucket on B → copy the objects (use the REST API path, as `upload-r2-api.mjs` already does — this ISP blocks the R2 S3 endpoint) → attach `img.thailandaddict.com` as a custom domain on B → set `PUBLIC_IMG_BASE=https://img.thailandaddict.com` → rebuild → deploy. That also retires a real weakness: `r2.dev` public URLs are rate-limited by Cloudflare and explicitly not intended for production traffic. Only after that is account A genuinely disposable.

**Also staying behind, deliberately:** the Worker deployment on A (leave it deployed and unrouted — it is your rollback asset) and the zone on A in `Moved` state. **Do not delete the zone from A to tidy up.** It ages out on its own — 7 days in `Moved`, then 7 days in `Deleted` during which Cloudflare still answers DNS for it — and that 14-day clock is free insurance you cannot buy back.

---

# 8. If it goes wrong mid-window — in priority order

**First rule: the certificate gate at P17 means you should never be in a TLS gap. If `%{ssl_verify_result}` is non-zero, that is the emergency; everything else can wait.**

**(i) Cloudflare refuses to add the domain to B (P5), error 1061 or a hold.**
Nothing has broken; you are still fully on A. Do not delete the zone from A to force it — that is an irreversible step taken under pressure. Open a Cloudflare support ticket, and be explicit that you want to add an existing domain to a second account you own, not a "DNS zone transfer" (AXFR) — support chat conflates these. Interim pressure valve: upgrade **account A** to Workers Paid. That lifts the 20,000 cap with zero DNS change and zero downtime and buys you unlimited time to sort the move out.

**(ii) Zone B will not go Active after C3 (stuck Pending).**
The site is still up — old delegations still resolve, A is still serving. Check, in order: (1) the registry actually shows B's pair (`rdap.verisign.com`, C3); (2) you set the *right* pair from P5, not `aisha`/`greg`; (3) no DS record at the parent (`type=DS`); (4) `PUT /activation_check` is returning success, not a rate-limit error. Give it 30 minutes of polling before escalating. This state is safe — you can sit in it.

**(iii) B is Active but the site 404s / 522s / shows Cloudflare error 1001.**
This is the expected failure and the one you rehearsed. **Roll forward, do not touch name.com.** In order: (1) confirm the route exists — `GET /zones/$ZONE_B/workers/routes`; (2) re-POST it; (3) confirm apex + `www` DNS records exist on B and are **proxied** (orange); (4) if routes are being rejected, create a **Custom Domain** in the dashboard as fallback (Workers → thailandaddict → Settings → Domains & Routes → Add Custom Domain) and accept the certificate wait. Budget: 3 minutes to try all four.

**(iv) TLS fails — `ERR_SSL_*`, `ssl_verify_result` non-zero.**
Highest severity: HSTS turns this into a hard block for every returning visitor. (1) `GET /zones/$ZONE_B/ssl/certificate_packs?status=all` — is the pack still `active`? (2) Is the SSL mode on B set to something odd (P13)? (3) If the cert is genuinely missing, this means P11 regressed — the only fast fix is a **Custom Domain**, which mints its own certificate; create it immediately and expect the wait you measured in P14. (4) Post a plain-HTTP status note somewhere findable and tell the owner the honest expected duration. Do **not** reduce HSTS now — the header change only reaches browsers that can already complete a TLS handshake, so it fixes nothing during the incident.

**(v) The old nameservers stop answering (C6 returns SERVFAIL/REFUSED).**
The shared-anycast assumption failed and you are draining over the parent TTL instead of instantly. Nothing you can do accelerates it — registry TTL is Verisign policy, and no registrar can change it. Confirm B is serving correctly for anyone on the new delegation, tell the owner traffic will ramp back over up to 48 hours rather than instantly, and open a Cloudflare ticket. Do not thrash the delegation; that only lengthens it.

**(vi) Images 404 site-wide.**
Not this migration. Check account A's R2 bucket status and the `pub-…r2.dev` hostname directly. §7.

**(vii) Email stops.**
Check the `MX`, `mail` A record and SPF `TXT` on B, and confirm `mail` is **grey-cloud**. A proxied `mail` record is the usual cause. Fix in DNS; 300s TTL.

**(viii) Nuclear option — restore service on account A.**
Only if B is unrecoverable and you have burned 30+ minutes. Zone A is recoverable for ~14 days (7 `Moved` + 7 `Deleted`). It requires re-adding the zone on A, pointing name.com back at A's newly assigned pair, waiting on a fresh Universal SSL issuance, and redeploying with `npx wrangler deploy -c wrangler.A.jsonc` — and it lands you back on a Free plan with 199 files of headroom. This is an hours-scale operation with a TLS gap of its own. It is a fire escape, not a plan; roll forward instead in almost every case.

---

# 9. After the dust settles

| # | Who | Step | Verify |
|---|---|---|---|
| **D1** | assistant | +1h and +24h: re-run §6 in full. Run a final KV delta sweep A→B, **adding only keys that do not already exist on B** (never overwrite a newer B value with an older A one). | 0 failures; key counts reconcile |
| **D2** | **owner** | Delete the old single-account API token. Confirm `~/.r2-creds` now holds: `CLOUDFLARE_API_TOKEN` (new, B-scoped), `CF_ACCOUNT_ID` (B), and `R2_*` still pointing at **A**. | `npx wrangler whoami` → account B |
| **D3** | assistant | Own commit: raise `MAX_DEPLOY_FILES` to `95_000` and `CLOUDFLARE_HARD_CAP` to `100_000` in `_internal/qa/check-file-count.mjs`, with a message saying the paid plan bought the headroom. Correct the stale "≈11,615 … ~8k headroom" comment in both `.assetsignore` files — the real number is 19,801. | `npm run deploy` is green with no `TA_MAX_DEPLOY_FILES` override |
| **D4** | assistant | Add the routes to `wrangler.jsonc` so they are version-controlled, keeping `workers_dev: true` as a permanent staging URL. Lift the P0 content freeze. | A normal `npm run deploy` reaches production |
| **D5** | assistant | Delete the DCV TXT records from zone A. Leave zone A alone otherwise — let it age out. | Records gone; site unaffected |
| **D6** | **owner** | Days 2–3: Search Console → Crawl Stats → Host status green. Days 3–7: Page Indexing shows no step change in `Server error (5xx)`. Days 7–14: Performance flat week-over-week — a same-URL, same-content account move should be invisible. Then cancel ACM if you bought it. | No step change across 16,505 URLs |
| **D7** | assistant | Housekeeping, not urgent: drop the `preload` token from the HSTS header (you advertise an enrollment you do not have), and reconsider `includeSubDomains` — it currently covers `mail.thailandaddict.com`, which is a hostatom box, not a Cloudflare host. | Header reads as intended |
| **D8** | assistant | Schedule the R2 migration to account B (§7), 2–4 weeks out, as its own project. | — |