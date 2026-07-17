export const meta = {
  name: 'subzone-roundup-th',
  description: 'Generate 2 sub-zone hotel roundups (TH) from existing reviews: Klong Muang/Tubkaak (Krabi) + Mae Rim/Mae Sa (Chiang Mai)',
  phases: [{ title: 'Generate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TEMPLATE = REPO + '\\astro\\src\\content\\roundups\\top8-khao-sok-hotels-surat-thani.json'
const POOLDIR = REPO + '\\_internal\\wf\\roundup-pools'
const OUTDIR = REPO + '\\astro\\src\\content\\roundups'
const REVDIR = REPO + '\\astro\\src\\content\\reviews'

const SPECS = [
  {
    slug: 'top6-klong-muang-tubkaak-hotels-krabi', cityTH: 'กระบี่', cityHub: 'city-krabi.html', zoneTH: 'หาดคลองม่วง–ทับแขก (Klong Muang & Tubkaak)', n: 6,
    parentName: '10 โรงแรมกระบี่ยอดนิยม', parentHref: 'top10-hotels-krabi.html',
    angle: 'โรงแรมหรูหาดคลองม่วง–ทับแขก กระบี่ — แนวหาดทรายขาวเงียบสงบทางตะวันตกของอ่าวนาง (ย่านหนองทะเล) ที่รวมรีสอร์ต 5 ดาวระดับโลกไว้มากที่สุดของกระบี่ ตั้งแต่ Ritz-Carlton Reserve, Banyan Tree ไปจนถึง Dusit Thani และ Sofitel · เหมาะฮันนีมูน ครอบครัว และคนที่อยากได้ความหรูริมทะเลแบบไม่พลุกพล่านเหมือนอ่าวนาง — เรียงตามคะแนนรีวิวจริง',
    transport: 'หาดคลองม่วง–ทับแขก อยู่ทางตะวันตกของอ่าวนาง ย่านตำบลหนองทะเล อำเภอเมืองกระบี่ · จากสนามบินกระบี่ (KBV) ~40–45 นาทีรถ · จากตัวเมือง/อ่าวนาง ~20–30 นาทีรถ · เป็นหาดเงียบ น้ำใส เหมาะพักผ่อน มีเรือออกไปเกาะห้อง (Hong Islands) และป่าโกงกางอ่าวท่าเลนใกล้ๆ · ไม่มีถนนคนเดินคึกคักเหมือนอ่าวนาง — เน้นความสงบส่วนตัว ควรมีรถ/เรียกแท็กซี่เวลาออกไปกินข้าวนอกรีสอร์ต',
  },
  {
    slug: 'top8-mae-rim-mae-sa-hotels-chiang-mai', cityTH: 'เชียงใหม่', cityHub: 'city-chiang-mai.html', zoneTH: 'แม่ริม–แม่สา (Mae Rim & Mae Sa Valley)', n: 8,
    parentName: '10 โรงแรมเชียงใหม่ยอดนิยม', parentHref: 'top10-hotels-chiang-mai.html',
    angle: 'ที่พักแม่ริม–หุบเขาแม่สา เชียงใหม่ — โซนรีสอร์ตธรรมชาติบนดอยทางเหนือของตัวเมือง อากาศเย็นสบาย วิวภูเขาและนาขั้นบันได ตั้งแต่รีสอร์ตหรูระดับตำนานอย่าง Four Seasons และ Raya Heritage ไปจนถึงคาเฟ่-ที่พักวิวม่อนแจ่มอย่าง Onsen @ Moncham และฟาร์มสเตย์ · เหมาะหนีเมืองมาพักผ่อน สายธรรมชาติ ครอบครัว และฮันนีมูน — เรียงตามคะแนนรีวิวจริง',
    transport: 'แม่ริม–หุบเขาแม่สา อยู่ทางเหนือของตัวเมืองเชียงใหม่ ~30–45 นาทีรถ (บางที่บนดอยม่อนแจ่ม/โป่งแยงไกลกว่านั้น) · จากสนามบินเชียงใหม่ (CNX) ~40–60 นาที · โซนนี้เย็นและเขียวกว่าตัวเมือง มีน้ำตกแม่สา ปางช้าง สวนพฤกษศาสตร์สมเด็จพระนางเจ้าสิริกิติ์ และจุดชมวิวม่อนแจ่ม · ควรมีรถส่วนตัว/เช่ารถ เพราะที่พักกระจายบนดอยและห่างจากร้านอาหาร/ตัวเมือง — ไม่เหมาะถ้าอยากเดินเที่ยวถนนคนเดิน/นิมมานตอนกลางคืน',
  },
]

phase('Generate')
const results = await parallel(SPECS.map(s => () =>
  agent(
    `You are an expert Thai hotel-roundup writer for thailandaddict.com. Produce ONE complete, schema-valid Thai roundup JSON.

STEP 1 — Read (your ONLY hotel sources; do NOT invent):
  • FORMAT TEMPLATE (mirror EVERY key exactly): ${TEMPLATE}
  • YOUR VERIFIED POOL (${s.n} hotels, pre-sorted by guest score): ${POOLDIR}\\${s.slug}.json
Optionally read 2-3 source reviews in ${REVDIR}\\<reviewSlug>.json for authentic detail.

STEP 2 — Write finished JSON to: ${OUTDIR}\\${s.slug}.json

IDENTITY: slug=${s.slug} · เมือง ${s.cityTH} · city hub href ${s.cityHub} · ย่าน ${s.zoneTH} · จำนวน ${s.n} · มุม: ${s.angle} · การเดินทาง(mrtHtml): ${s.transport}

REQUIREMENTS:
1. Every top-level key the template has + quickAnswerHtml. entries[]: one per pool hotel (all ${s.n}), COPY VERBATIM from pool: name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig. Map pool rooms {name,price,full}->{type,price}. Set id/rank/rankColor/type/revCount/mrtTag/priceSub/tags/addr/storyHtml(70-110 words)/tipHtml/pros(3-4)/cons(2-3)/dividerText.
2. RANKING: order entries by the pool's guest-score order (highest first). Each storyHtml states who each is best for + honest drawbacks (remote/quiet, need a car, price). toc[] + compareRows[] SAME order as entries.
3. title/meta: natural Thai, include the zone name + ${s.cityTH} + "เทียบราคา 3 เว็บ" + "อัปเดต 2026" + "ที่เรารีวิวไว้แล้ว". heroImg+image = #1 hotel's img.
4. breadcrumb: ThailandAddict -> 🇹🇭 ไทย (country-thailand.html) -> ${s.cityTH} (${s.cityHub}) -> this roundup. navReviewHref=${s.slug}.html. parentName="${s.parentName}", parentHref="${s.parentHref}".
5. faq 4-5 (where the zone is / how to get there, why choose it vs the main tourist area, best for whom, best time, do you need a car), advice 3-4, quickAnswerHtml 40-60 words.
Tone v2-clean เพื่อนเล่าให้เพื่อน; avoid AI clichés (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก); no dark patterns; honesty "เสียงจากรีวิวจริง", never "ไปพักเอง".

Write the file. Return {"slug":"${s.slug}","entryCount":N,"top1":"<name>"}.`,
    { label: `gen:${s.slug.slice(0,26)}`, phase: 'Generate', effort: 'high' }
  ).catch(e => ({ err: String(e), slug: s.slug }))
))
return { results }
