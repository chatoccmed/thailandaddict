# 🇹🇭 PROVINCE BUILD PLAYBOOK — autonomous loop to all 77 provinces

> Goal: build every Thai province to the **Chiang Mai gold-template** standard.
> CM (`chiang-mai`) is DONE — use it as the reference. Run this as an autonomous
> `/loop` (no asking) until `_internal/build-queue.md` is all checked.
> Site is LIVE: https://thailandaddict.chatmaliwan.workers.dev (auto-deploys on push to `main`).

## What "complete" means per province (like Chiang Mai)
- Province hub `city-<slug>.html` already exists (gen-hubs) — it auto-wires once content+images land.
- **Hotels**: `top10-hotels-<slug>` roundup (TH+EN) + **12 individual hotel reviews** (TH+EN) + self-hosted photos.
- **Food**: >10 articles (1 combined + ranked-by-cuisine for the province's signature dishes + cafe/street/etc).
- **Attractions**: >10 articles (1 combined + one per top attraction; nature + city + culture).
- **Itineraries**: >10 (1-day, 2D1N, 3D2N, themed: cafe/nature/photo/culture, cross-province with each neighbor, family, budget, first-timer).
- **Prep**: travel-tips + getting-around.
- **Images**: real licensed photo (hero) on the hub + every article + every hotel review, optimized.
- (EN articles are deferred — like CM, articles are TH-first; hotels already get EN. Do an EN translation pass later.)

## Per-province pipeline — Phases A→D
Province context = `_internal/province-data/<slug>.json` (th name, foodScene, attractions, itineraryIdeas, neighbors). READ it first to tailor topics.

### Phase A — Hotels (Workflow)
Base on `_internal/wf/province-hotels.template.js`. Adapt: `chiang-mai`→`<slug>`, `เชียงใหม่`→`<th>`, OVERRIDES city refs, neighbor slugs. Launch with the `Workflow` tool (inline `script`). Writes 12 reviews → `astro/src/content/reviews{,-en}/` + roundup `top10-hotels-<slug>`.

### Phase B — Articles (Workflow)
Read province-data, build ~30-38 tailored topics (food rankings for THIS province's dishes, attraction guides for its real places, the standard itinerary set incl. one cross-province plan per neighbor, prep). Base on `_internal/wf/province-articles.template.js`. Writes `astro/src/content/articles/*.json` (type food/eat-ranking/attraction/itinerary/prep, cluster=`<slug>`, crumbCity=`<th>`, crumbCityHref=`city-<slug>.html`).

### Phase C — Images (Workflow)
List the province's article slugs (fs) + city/hero. Base on `_internal/wf/province-images.template.js`. Downloads licensed images (Wikimedia for real places, Unsplash/Pexels for food/generic) → `astro/public/images/cm/<article-slug>.jpg` (yes, reuse the `cm/` folder — paths just need to match heroImg), `images/heroes/<slug>.jpg`, `images/cities/<slug>.jpg`.

### Phase D — Finalize (orchestrator — do these yourself, NOT a workflow)
```bash
export PATH="$HOME/nodejs:$PATH"; cd "C:\Users\Imac\Thailandaddict"
# 1. optimize NEW images (sharp via BUFFER — see gotcha #2). Reuse the snippet in gotcha #2.
# 2. set heroImg on articles that now have an image:
node _internal/set-hero.mjs
# 3. regenerate hubs (province hub gets hero banner + article thumbnails):
node _internal/gen-hubs.mjs
# 4. validate build:
bash _internal/build-test.sh        # must end "BUILD OK"
# 5. commit + push (auto-deploy):
git add -A
git -c user.name="chatoccmed" -c user.email="chatoccmed@users.noreply.github.com" commit -q -F - <<'EOF'
<slug> gold template: 12 reviews + roundup + N articles + images
EOF
git push
```
Then mark the province `[x]` in `_internal/build-queue.md` and move to the next.

## ⚠️ CRITICAL GOTCHAS (learned the hard way)
1. **Workflow agentType**: project `.claude/agents/*.md` are NOT valid `agentType` in workflows (only built-ins: claude/general-purpose/Explore/Plan...). Use default agent + put “อ่าน `.claude/agents/<name>.md` แล้วสวมบทบาททำตาม (ยกเว้น override ด้านล่าง)” in the prompt.
2. **sharp on this Windows box throws "UNKNOWN open" for `sharp(path)`** — MUST pass a Buffer. Install once: `npm --prefix astro install sharp --no-save`. Optimize script (run as `node astro/_optimize.mjs` so it resolves astro/node_modules; delete after):
   ```js
   import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
   for (const dir of ['astro/public/images/cm','astro/public/images/cities','astro/public/images/heroes','astro/public/images/hotels']) {
     if(!fs.existsSync(dir))continue;
     for (const f of fs.readdirSync(dir).filter(x=>/\.(jpg|jpeg|webp|png)$/i.test(x))) {
       const fp=path.join(dir,f); if(fs.statSync(fp).size<300*1024)continue;
       try{const out=await sharp(fs.readFileSync(fp),{failOn:'none'}).rotate().resize({width:1600,withoutEnlargement:true}).jpeg({quality:80,mozjpeg:true}).toBuffer(); if(out.length<fs.statSync(fp).size)fs.writeFileSync(fp,out);}catch(e){console.log('skip',f,e.message);}
     }
   }
   ```
   (Downloaded originals can be 8–18MB each — MUST optimize or the deploy bloats.)
3. **git commit in bash**: use `git commit -F - <<'EOF' … EOF`. Do NOT use `-m @'…'@` (that's PowerShell; breaks on apostrophes/parens).
4. **Node in bash**: `export PATH="$HOME/nodejs:$PATH"` first (PowerShell does not have node on PATH).
5. **Affiliate**: Agoda `cid=1965862` · Trip `Allianceid=6861268&SID=312919111` · Booking plain.
6. **Quality bar (LOCKED)**: v2-clean Thai (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก) · honesty "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · verify โรงแรม/ร้านมีจริง · Direction C design · images licensed (Wikimedia/Unsplash/Pexels) + optimized.
7. **Schemas/examples**: `astro/src/content.config.ts` + `_internal/templates/{review,roundup,article}.sample.json`.
8. Build-test builds content only (skips public/). That's expected; the production Cloudflare build runs full `npm run build` incl. public/images.
9. **Image workflow can HANG** (seen on Phuket: stalled at 19/38 for hours, no completion notification). Cause: an image agent runs `curl` with no timeout, waits forever on a stalled connection, and holds a concurrency slot → whole workflow wedges. **Fix (already in `province-images.template.js`): every curl MUST use `curl -m 60 --connect-timeout 20`, and agents try ≤3 sources then report SKIPPED.** Recovery if it still hangs: compute missing slugs via fs (file absent or <15KB), `TaskStop` the dead task if present, then launch a small recover-workflow scoped to just the missing slugs (see `_internal/wf/phuket-images-recover.js`).

## Throughput note
Each province ≈ 12 reviews + ~35 articles + ~45 images ≈ ~90 agents across 3 workflows. Run one province per loop iteration, finalize+commit, then next. Workflows run in background and notify on completion — chain phases on those notifications. Build in priority order (`build-queue.md`).
