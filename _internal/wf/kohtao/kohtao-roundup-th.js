export const meta = {
  name: 'kohtao-roundup-th',
  description: 'Generate the Koh Tao hotel roundup (TH, top 8) grounded in the verified Koh Tao reviews',
  phases: [{ title: 'Generate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TEMPLATE = REPO + '\\astro\\src\\content\\roundups\\top9-koh-lanta-hotels-krabi.json'
const POOLDIR = REPO + '\\_internal\\wf\\roundup-pools'
const OUTDIR = REPO + '\\astro\\src\\content\\roundups'
const REVDIR = REPO + '\\astro\\src\\content\\reviews'

phase('Generate')
const s = {
  slug: 'top8-koh-tao-hotels-surat-thani', cityTH: 'สุราษฎร์ธานี', cityHub: 'city-surat-thani.html', zoneTH: 'เกาะเต่า (Koh Tao)', n: 8,
  angle: 'โรงแรมเกาะเต่า สุราษฎร์ธานี ครบทุกหาดและทุกงบ — เกาะเต่าคือเมกกะการดำน้ำของไทย เกาะเล็กบรรยากาศชิลๆ ที่พักส่วนใหญ่เป็นบังกะโล/dive resort งบไม่แพง มีหรูอยู่บ้างประปราย · ตั้งแต่พูลวิลล่าบนเนินเขาและ dive resort หรูอย่าง Jamahkiri ไปจนถึงบังกะโลริมอ่าวเงียบดำน้ำดูปะการังหน้าห้อง — เรียงอันดับตามคะแนนรีวิวจริงของผู้เข้าพัก',
  transport: 'เกาะเต่าเข้าถึงด้วยเรือ catamaran (Lomprayah/Songserm) จากชุมพร (~1.5-2 ชม.) สุราษฎร์ธานี เกาะสมุย หรือเกาะพะงัน มาลงที่ท่าเรือแม่หาด แล้วต่อสองแถว/แท็กซี่/เรือไปยังหาดของคุณ · หาดหลักๆ: หาดทรายรี (Sairee — หาดยาวหลัก คึกคัก ร้าน/บาร์/dive เยอะ) · อ่าวโฉลกบ้านเก่า (Chalok — ใต้เกาะ เงียบกว่า) · แม่หาด (ท่าเรือ/หมู่บ้าน เดินสะดวก) · อ่าวตาโหนด (Tanote — ดำน้ำตื้นสวยสุด ห่างไกล) · หาดเทียน/อ่าวฉลาม (Haad Tien/Shark Bay — ส่วนตัวสุด) · อ่าวห่างไกลต้องต่อเรือ/รถ · หน้ามรสุม (ต.ค.-ธ.ค.) เรืออาจงดเดิน เช็กก่อน',
}
const out = await agent(
  `You are an expert Thai hotel-roundup writer for thailandaddict.com. Produce ONE complete, schema-valid Thai roundup JSON.

STEP 1 — Read (your ONLY hotel sources; do NOT invent):
  • FORMAT TEMPLATE (mirror EVERY key exactly — a proven island roundup): ${TEMPLATE}
  • YOUR VERIFIED POOL (${s.n} hotels, pre-sorted by guest score): ${POOLDIR}\\${s.slug}.json
Optionally read 2-3 source reviews in ${REVDIR}\\<reviewSlug>.json for authentic detail.

STEP 2 — Write finished JSON to: ${OUTDIR}\\${s.slug}.json

IDENTITY: slug=${s.slug} · เมือง ${s.cityTH} · city hub href ${s.cityHub} · ย่าน ${s.zoneTH} · จำนวน ${s.n} · มุม: ${s.angle} · การเดินทาง(mrtHtml): ${s.transport}

REQUIREMENTS:
1. Every top-level key the template has + quickAnswerHtml. entries[]: one per pool hotel (all ${s.n}), COPY VERBATIM from pool: name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig. Map pool rooms {name,price,full}→{type,price}. Set id/rank/rankColor/type/revCount/mrtTag/priceSub/tags/addr/storyHtml(70-110 words)/tipHtml/pros(3-4)/cons(2-3)/dividerText.
2. RANKING: order entries by the pool's guest-score order (highest first). FRAME HONESTLY with clear BEST-FOR signposting: Jamahkiri = signature LUXURY dive resort (Michelin Guide, private cove); Koh Tao Heights = top private-POOL-VILLA / couples splurge; The Haad Tien = most secluded flagship BEACHFRONT (Shark Bay); Ban's Diving Resort = the ICONIC big dive base on Sairee (learn to dive + stay); Crystal Dive = value dive base by the Mae Haad pier; Chintakiri = polished NON-dive hillside boutique (Chalok sea views); Sairee Cottage = best VALUE bungalows in the heart of Sairee; Mountain Reef = best SNORKELING bay (Tanote), budget beachfront. Each storyHtml states who it's best for + honest drawbacks (ferry access, fan-only rooms, remote bays, dive-camp vibe / party noise on Sairee, steep hillside). toc[] + compareRows[] SAME order as entries.
3. title/meta: natural Thai, include เกาะเต่า + สุราษฎร์ธานี + "เทียบราคา 3 เว็บ" + "อัปเดต 2026" + "ที่เรารีวิวไว้แล้ว". heroImg+image = #1 hotel's img.
4. breadcrumb: ThailandAddict → 🇹🇭 ไทย (country-thailand.html) → สุราษฎร์ธานี (city-surat-thani.html) → this roundup. navReviewHref=${s.slug}.html.
5. faq 4-5 (how to get to Koh Tao / ferry, which beach — Sairee action vs quiet bays, do you need to dive to stay, best time / monsoon, is Koh Tao worth it for non-divers), advice 3-4, quickAnswerHtml 40-60 words.
Tone v2-clean เพื่อนเล่าให้เพื่อน; avoid AI clichés (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก); no dark patterns; honesty "เสียงจากรีวิวจริง", never "ไปพักเอง".

Write the file. Return {"slug":"${s.slug}","entryCount":N,"top1":"<name>"}.`,
  { label: `gen:${s.slug}`, phase: 'Generate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { out }
