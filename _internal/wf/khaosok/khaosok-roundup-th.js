export const meta = {
  name: 'khaosok-roundup-th',
  description: 'Generate the Khao Sok stays roundup (TH, top 8) grounded in the verified Khao Sok reviews',
  phases: [{ title: 'Generate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TEMPLATE = REPO + '\\astro\\src\\content\\roundups\\top8-koh-tao-hotels-surat-thani.json'
const POOLDIR = REPO + '\\_internal\\wf\\roundup-pools'
const OUTDIR = REPO + '\\astro\\src\\content\\roundups'
const REVDIR = REPO + '\\astro\\src\\content\\reviews'

phase('Generate')
const s = {
  slug: 'top8-khao-sok-hotels-surat-thani', cityTH: 'สุราษฎร์ธานี', cityHub: 'city-surat-thani.html', zoneTH: 'เขาสก (Khao Sok)', n: 8,
  angle: 'ที่พักเขาสก สุราษฎร์ธานี — ป่าฝนที่เก่าแก่ที่สุดของไทยกับทะเลสาบเชี่ยวหลานวิวเขาหินปูนกลางน้ำแบบกุ้ยหลินเมืองไทย · ที่พักแบ่งเป็นสองแบบชัดเจน: แพลอยน้ำกลางทะเลสาบเชี่ยวหลาน (ต้องต่อเรือ วิวสวยสุด) กับลอดจ์ในป่าริมแม่น้ำสกที่หมู่บ้านคลองสก (นั่งรถถึง เดินเข้าอุทยานได้) — เรียงอันดับตามคะแนนรีวิวจริงของผู้เข้าพัก',
  transport: 'เขาสกเข้าถึงด้วยรถ — นั่งรถตู้/แท็กซี่จากสุราษฎร์ธานี (~1.5 ชม.) หรือภูเก็ต/กระบี่/เขาหลัก (~2.5-3 ชม.) มาที่หมู่บ้านคลองสก (ประตูอุทยาน) · ลอดจ์ในป่าริมแม่น้ำสก = นั่งรถถึงหน้าที่พักเลย เดินเข้าอุทยาน/ล่องแก่ง/ห่วงยางได้ · แพทะเลสาบเชี่ยวหลาน = ต้องนั่งรถต่อไปท่าเรือเขื่อนรัชชประภาอีก ~1 ชม. แล้วต่อเรือหางยาว ~1-1.5 ชม. ไปแพ (หลายที่ต้องมากับทัวร์/แพ็กเกจ) ไฟ/แอร์/wifi มีจำกัดบางช่วง แต่วิวและความเงียบคุ้มมาก · ช่วงแนะนำ: ฤดูแล้ง ธ.ค.-เม.ย. แต่ป่าฝนก็สวยเขียวทั้งปี เตรียมใจเรื่องฝน/ยุง/ความชื้น',
}
const out = await agent(
  `You are an expert Thai travel-roundup writer for thailandaddict.com. Produce ONE complete, schema-valid Thai roundup JSON.

STEP 1 — Read (your ONLY sources; do NOT invent):
  • FORMAT TEMPLATE (mirror EVERY key exactly — a proven Surat Thani roundup): ${TEMPLATE}
  • YOUR VERIFIED POOL (${s.n} stays, pre-sorted by guest score): ${POOLDIR}\\${s.slug}.json
Optionally read 2-3 source reviews in ${REVDIR}\\<reviewSlug>.json for authentic detail.

STEP 2 — Write finished JSON to: ${OUTDIR}\\${s.slug}.json

IDENTITY: slug=${s.slug} · เมือง ${s.cityTH} · city hub href ${s.cityHub} · ย่าน ${s.zoneTH} · จำนวน ${s.n} · มุม: ${s.angle} · การเดินทาง(mrtHtml): ${s.transport}

REQUIREMENTS:
1. Every top-level key the template has + quickAnswerHtml. entries[]: one per pool stay (all ${s.n}), COPY VERBATIM from pool: name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig. Map pool rooms {name,price,full}->{type,price}. Set id/rank/rankColor/type/revCount/mrtTag/priceSub/tags/addr/storyHtml(70-110 words)/tipHtml/pros(3-4)/cons(2-3)/dividerText.
2. RANKING: order entries by the pool's guest-score order (highest first). FRAME HONESTLY with clear LAKE-vs-JUNGLE + best-for signposting: label each as แพทะเลสาบเชี่ยวหลาน (lake floating raft, need a boat) OR ลอดจ์ในป่าคลองสก (Khlong Sok jungle lodge, drive up). Lake rafts (Panvaree, Praiwan, 500 Rai) = for the once-in-a-lifetime float-on-the-lake view (note boat/tour access + limited power); jungle lodges (Our Jungle House=iconic eco-pioneer, Anurak=community/sustainability, Las Orquideas=best-value bungalows, Montania=pool+hot springs comfort, Khao Sok Rafthouse=budget riverside) = for exploring the park by day, drive-up convenience. Each storyHtml states who it's best for + honest drawbacks (boat/tour access + limited electricity for lake rafts; heat/rain/insects/no-beach for all). toc[] + compareRows[] SAME order as entries.
3. title/meta: natural Thai, include เขาสก + สุราษฎร์ธานี + "เทียบราคา 3 เว็บ" + "อัปเดต 2026" + "ที่เรารีวิวไว้แล้ว". heroImg+image = #1 stay's img.
4. breadcrumb: ThailandAddict -> 🇹🇭 ไทย (country-thailand.html) -> สุราษฎร์ธานี (city-surat-thani.html) -> this roundup. navReviewHref=${s.slug}.html.
5. faq 4-5 (how to get to Khao Sok, lake raft vs jungle lodge which to pick, do you need a tour to sleep on the lake, best time / rainy season, is it worth 1 or 2 nights), advice 3-4, quickAnswerHtml 40-60 words.
Tone v2-clean เพื่อนเล่าให้เพื่อน; avoid AI clichés (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก); no dark patterns; honesty "เสียงจากรีวิวจริง", never "ไปพักเอง".

Write the file. Return {"slug":"${s.slug}","entryCount":N,"top1":"<name>"}.`,
  { label: `gen:${s.slug}`, phase: 'Generate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { out }
