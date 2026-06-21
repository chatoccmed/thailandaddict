# 🚀 DEPLOY & CUTOVER RUNBOOK — WordPress → Astro (thailandaddict.com)

> สร้าง 2026-06-21 · เป้าหมาย: เอาเว็บ Astro (11,001 หน้า, TH+EN) ขึ้นแทนเว็บ WordPress เดิมบนโดเมน `thailandaddict.com` โดยไม่เสีย SEO
> source of truth = โค้ดจริง + Cloudflare dashboard (อย่าเชื่อ doc ถ้าขัดของจริง)

## 🔴 สถานะปัจจุบัน (ตรวจสด 2026-06-21)
- `thailandaddict.com` ยังเป็น **WordPress + WooCommerce** (ธีม TravelWP demo · ยังมีทัวร์ demo Rome Colosseum)
- DNS อยู่ที่ **Hostatom** (nameserver `th33.hostatom.com` / `th34.hostatom.com`) · A record → `147.50.255.17` (เซิร์ฟเวอร์ WP)
- เว็บ Astro ยัง **ไม่ได้ deploy ที่ไหนเลย** (ลอง `thailandaddict.pages.dev` ไม่ตอบ) · deploy เป็นแบบ **manual** (ไม่มี CI)
- ⇒ ต้อง: (1) build → (2) deploy ขึ้น Cloudflare → (3) ย้ายโดเมนเข้า Cloudflare + ผูก domain → (4) เปิด 301 redirect จาก URL เก่า

## 🧭 สถาปัตยกรรม deploy (ของจริงในrepo)
- **Cloudflare Workers Static Assets** · config = `wrangler.jsonc` (root): `name="thailandaddict"`, `assets.directory="./astro/dist"`, `not_found_handling="404-page"`
- build: `cd astro && npm install && npm run build` → ออกที่ `astro/dist` (heap 8GB ตั้งใน package.json แล้ว) · `prebuild.mjs` รัน gen-home + gen-sitemap + gen-search-index อัตโนมัติ
- `astro/public/**` (รวม `_redirects`, `_headers`, `llms.txt`, `robots.txt`, `sitemap.xml`, รูป, hub HTML, `/en/**`) ถูก copy ตรงเข้า `dist/` ตอน build
- deploy: `npx wrangler deploy` (จาก root) → อัป `astro/dist` เป็น Worker ชื่อ `thailandaddict`
- ⚠️ Workers custom domain **ต้องให้โดเมนอยู่บน Cloudflare ก่อน** (zone active) — นี่คือเหตุผลที่ต้องย้าย NS

## 👤 ใครทำอะไร
| งาน | ผม (Claude) | เจ้าของ (ต้อง login/สิทธิ์) |
|---|---|---|
| build + verify dist | ✅ | |
| `_redirects` จาก URL เก่า | ✅ (ทำแล้ว 428 rules) | |
| สมัคร/ตั้งค่า Cloudflare account | | ✅ |
| เปลี่ยน nameserver ที่ registrar | | ✅ |
| `wrangler login` + `wrangler deploy` | (รันให้ได้ถ้ามี API token) | ✅ (อนุมัติ/ให้ token) |
| ผูก custom domain + DNS record | | ✅ (dashboard) |
| verify หลัง launch (curl) | ✅ | |
| ส่ง sitemap เข้า Google/Bing | | ✅ |

---

## 🖼️ Phase R — R2 image migration (⛔ BLOCKER — content ไม่ขึ้นจนกว่าจะทำ)
**ทำไม:** dist ≈ 22,400 ไฟล์ > ลิมิต Cloudflare 20,000 ไฟล์/deploy → build ตัด content ทิ้ง (ตอนนี้ content 0/15 ขึ้น) · รูป = ตัวถ่วง (11,161 ไฟล์) → ย้ายขึ้น R2 → static เหลือ ~11,400 < 20,000 ✓
**โค้ดพร้อมแล้ว (push เป็น inert ไม่กระทบจนกว่าจะ activate):** layout ทุกตัวเติม `IMG_BASE` จาก env `PUBLIC_IMG_BASE` (ว่าง = พฤติกรรมเดิม) ครอบรูป content ทั้งหมดผ่าน `asset()`

ลำดับ activate (ไม่มีช่วงรูปเสีย — R2 ต้องพร้อมก่อนตัดรูปออก static):
1. 👤 Cloudflare → **R2 → Create bucket** `thailandaddict-images` → เปิด public access (ได้ URL `https://pub-xxxx.r2.dev`) *หรือ* ผูก custom domain `img.thailandaddict.com` (ต้องย้ายโดเมนเข้า Cloudflare ก่อน — ดู Phase 1)
2. 👤 R2 → **Manage R2 API Tokens** → Object Read & Write → เซฟลง `~/.r2-creds` (ดูหัว `_internal/upload-r2.sh`) *ไม่ต้องพิมพ์ในแชต*
3. ผม/👤 `bash _internal/upload-r2.sh` → อัปรูป 11,161 ไฟล์ขึ้น R2 (keys = `images/...`) · ต้องมี rclone
4. 👤 Worker → **Settings → Variables/Build → เพิ่ม env** `PUBLIC_IMG_BASE` = ค่า public base ของ R2 (เช่น `https://pub-xxxx.r2.dev` หรือ `https://img.thailandaddict.com`)
5. ผม **activate .assetsignore:** `cp _internal/assetsignore.for-cutover astro/public/.assetsignore` → commit + push
6. build ใหม่จะ: static < 20,000 (content ขึ้นครบ) + รูปเสิร์ฟจาก R2 ✓ — verify ด้วย Phase 5
> หมายเหตุ: `heroes/` + `cities/` เก็บไว้ static (ให้ hub) + อัปขึ้น R2 ด้วย (ให้ content ที่อ้าง heroes ทำงาน) — .assetsignore ตัดเฉพาะ hotels/cm/food/gallery
> ทำ Phase R ได้ทันทีบน workers.dev (ใช้ r2.dev URL) ไม่ต้องรอย้ายโดเมน — content จะขึ้นครบบน workers.dev ให้ดูก่อน cutover

---

## Phase 0 — Pre-flight (ทำบนเครื่อง ก่อน deploy) ✅ ผมทำได้
```bash
cd /c/Users/Imac/Thailandaddict/thailandaddict
export PATH="$HOME/nodejs:$PATH"
git fetch origin && git rebase origin/main          # sync ก่อน (มี parallel session)
node _internal/migration/audit-all.mjs              # errors=0
node _internal/gen-redirects.mjs                    # refresh _redirects จาก manifest
bash _internal/build-test.sh                        # BUILD OK (ยืนยันคอมไพล์ผ่าน)
```
- [x] `_redirects` generate แล้ว (195 โพสต์เก่า → หน้าใหม่ + 14 demo → home + WooCommerce patterns · 0 target พัง)
- [x] `llms.txt` + `robots.txt` (AI bots) + `sitemap.xml` (auto ทุก build) พร้อม
- [x] build-test = **BUILD OK** (11,001 หน้า · audit errors=0 · ตรวจสด 2026-06-21)

## Phase 1 — ย้ายโดเมนเข้า Cloudflare 👤 เจ้าของ
> ทำไมต้องย้าย: Workers Static Assets ผูก custom domain ได้เฉพาะโดเมนที่อยู่บน Cloudflare · ได้ของแถม: CDN, SSL ฟรี, Redirect Rules, cache
1. สมัคร/ล็อกอิน Cloudflare (Free plan พอ) → **Add a site** → `thailandaddict.com`
2. Cloudflare สแกน DNS เดิมจาก Hostatom → **ตรวจให้ครบ** (A/MX/TXT — โดยเฉพาะ **MX/อีเมล** ถ้าใช้อีเมล @thailandaddict.com ต้องคงไว้ ไม่งั้นอีเมลล่ม!)
3. Cloudflare ให้ nameserver 2 ตัว (เช่น `xxx.ns.cloudflare.com`)
4. ไป registrar ที่จดโดเมน (น่าจะ Hostatom) → เปลี่ยน NS จาก `th33/th34.hostatom.com` → ของ Cloudflare
5. รอ propagation (ปกติ < 1 ชม. บางที 24-48 ชม.) · สถานะใน Cloudflare จะขึ้น **Active**
> 🟢 ช่วงนี้เว็บ WP เดิม **ยังเปิดได้ปกติ** (ยังไม่ตัด) จนกว่าจะถึง Phase 3

## Phase 2 — Deploy Astro ขึ้น Cloudflare (ยังไม่ผูกโดเมน) 👤+ผม
```bash
cd /c/Users/Imac/Thailandaddict/thailandaddict
export PATH="$HOME/nodejs:$PATH"
cd astro && npm install && npm run build && cd ..   # → astro/dist (รวม public/)
npx wrangler login                                   # เปิด browser auth (เจ้าของอนุมัติ) — หรือใช้ CLOUDFLARE_API_TOKEN
npx wrangler deploy                                  # อ่าน wrangler.jsonc → อัป astro/dist เป็น Worker "thailandaddict"
```
- ได้ URL ทดสอบ `https://thailandaddict.<account>.workers.dev` (เปิด workers.dev subdomain ใน dashboard ถ้ายังไม่เปิด)
- **ทดสอบบน workers.dev ก่อน** (เว็บจริงยังไม่กระทบ) — ดู Phase 5

## Phase 3 — Cutover: ผูก thailandaddict.com → Worker 👤 เจ้าของ
> ทำเมื่อ Phase 1 (zone Active) + Phase 2 (deploy + ทดสอบ workers.dev ผ่าน) เรียบร้อย
1. Cloudflare → **Workers & Pages** → `thailandaddict` → **Settings → Domains & Routes → Add → Custom Domain** → `thailandaddict.com` (+ `www.thailandaddict.com`)
2. Cloudflare สร้าง/แทนที่ DNS record อัตโนมัติ → โดเมนชี้มาที่ Worker (แทน IP WP เดิม) + ออก SSL ให้
3. **นี่คือจุด cutover** — ทันทีที่ proxy ชี้มา Worker เว็บ Astro จะ live แทน WP
4. www → non-www: Cloudflare → **Rules → Redirect Rules** → `www.thailandaddict.com/*` → `https://thailandaddict.com/$1` (301)

## Phase 4 — SEO handoff (กัน ranking ตก) ✅ ผมเตรียมแล้ว / 👤 verify
- `_redirects` (ใน dist) จัดการ 301 ของ **URL เก่า 195 อัน → หน้าใหม่** + WooCommerce/tours → home อัตโนมัติเมื่อ deploy
- **Google Search Console:** เพิ่ม property `thailandaddict.com` (ถ้ายังไม่มี) → **ส่ง `https://thailandaddict.com/sitemap.xml`** (อันใหม่ของ Astro 11,211 URLs) → ลบ/แทน sitemap WP เดิม
- **Bing Webmaster Tools:** เพิ่ม + ส่ง sitemap เช่นกัน
- ถ้ามี GSC เดิมของ WP: ใช้ **Removals/Change of Address ไม่ต้อง** (โดเมนเดิม) — แค่ให้ Google ไต่ 301 ใหม่ (จะ re-index ภายในไม่กี่สัปดาห์)
- llms.txt (`/llms.txt`) จะ live เอง → AI engines เริ่มอ้างอิงได้

## Phase 5 — Verify หลัง launch ✅ ผมรันให้ได้ (curl)
```bash
# หน้าเนื้อหา + hub + EN + รูป (ควรได้ 200)
for u in "" city-bangkok top10-popular-restaurants-chiang-mai en/ en/city-bangkok review-137-pillars-house-chiang-mai; do
  curl -s -o /dev/null -w "%{http_code}  /$u\n" "https://thailandaddict.com/$u"; done
# 301 redirect จาก URL เก่า (ควรได้ 301 → หน้าใหม่)
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "https://thailandaddict.com/topfive-hotels-bts/"
# WooCommerce เก่า (ควร 301 → /)
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" "https://thailandaddict.com/cart"
# infra
for f in sitemap.xml robots.txt llms.txt; do curl -s -o /dev/null -w "%{http_code}  /$f\n" "https://thailandaddict.com/$f"; done
```
เช็ก: clean URL (ไม่มี .html) ใช้ได้ · TH/EN สลับได้ · รูปโหลด · ไม่มีหน้า WP เก่าหลุด (`/wp-admin`, `/?p=`) · 404 page สวย

## Phase 6 — Monitoring & หลังบ้าน 👤
- ติด **GA4** (จาก DEVELOPMENT-PLAN งานแรก) ก่อน/หลัง launch เพื่อวัด traffic ทันที
- ดู Cloudflare Analytics (request, cache hit, error rate) วันแรก ๆ
- เฝ้า GSC Coverage 2-4 สัปดาห์: 301 ถูกตามไหม, 404 พุ่งไหม, index ขึ้นไหม

## ↩️ Rollback (ถ้าพัง)
- เร็วสุด: Cloudflare → ลบ custom domain ออกจาก Worker / หรือชี้ DNS A record `thailandaddict.com` กลับ `147.50.255.17` (WP เดิม) → กลับเป็น WP ใน ~นาที
- **อย่าเพิ่งลบ/ปิดเซิร์ฟเวอร์ WP** จนกว่าเว็บใหม่นิ่ง ~1-2 สัปดาห์
- เก็บ NS เดิม (Hostatom) ไว้จดไว้ เผื่อย้อน

## ⚠️ จุดเสี่ยงที่ต้องระวัง
1. **อีเมล @thailandaddict.com** — ถ้ามี ต้อง copy MX/TXT(SPF/DKIM) มา Cloudflare ให้ครบ ไม่งั้นอีเมลล่มตอนย้าย NS
2. **โดเมน registrar** — ต้องรู้ว่าจดที่ไหนเพื่อเปลี่ยน NS (Hostatom จัดการ DNS อยู่ อาจเป็นที่จดด้วย)
3. **wrangler auth** — ผมรัน `wrangler deploy` ได้ถ้ามี `CLOUDFLARE_API_TOKEN` (เจ้าของสร้างใน dashboard: My Profile → API Tokens → "Edit Cloudflare Workers") ไม่งั้นเจ้าของรันเองตามคำสั่ง Phase 2
4. **workers.dev limit** — ถ้า assets เยอะมาก deploy ครั้งแรกอาจนาน (อัป ~10k ไฟล์)

---
## สถานะ build (ตรวจสด 2026-06-21)
- ✅ **build-test = BUILD OK · 11,001 หน้า** · migration audit `errors=0 warns=0` · git clean + synced (origin/main)
- ✅ `_redirects` 428 rules (209 posts · 0 target พัง) · `llms.txt` · `robots.txt` · `sitemap.xml` 11,211 URLs (auto ทุก build) · `search-index.json` 5,599/locale
- ✅ Pre-flight (Phase 0) ครบทุกข้อในฝั่ง Claude — เหลือเฉพาะงานเจ้าของ (Cloudflare account · เปลี่ยน NS · wrangler deploy · ผูก custom domain · ส่ง sitemap GSC/Bing)
