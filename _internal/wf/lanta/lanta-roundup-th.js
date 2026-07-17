export const meta = {
  name: 'lanta-roundup-th',
  description: 'Generate the Koh Lanta hotel roundup (TH, top 9) grounded in the verified Koh Lanta reviews',
  phases: [{ title: 'Generate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TEMPLATE = REPO + '\\astro\\src\\content\\roundups\\top8-phi-phi-hotels-krabi.json'
const POOLDIR = REPO + '\\_internal\\wf\\roundup-pools'
const OUTDIR = REPO + '\\astro\\src\\content\\roundups'
const REVDIR = REPO + '\\astro\\src\\content\\reviews'

phase('Generate')
const s = {
  slug: 'top9-koh-lanta-hotels-krabi', cityTH: 'กระบี่', cityHub: 'city-krabi.html', zoneTH: 'เกาะลันตา (Koh Lanta)', n: 9,
  angle: 'โรงแรมเกาะลันตา กระบี่ ครบทุกหาดและทุกงบ — ตั้งแต่รีสอร์ตหรูระดับตำนานอย่าง Pimalai และ Layana (ผู้ใหญ่เท่านั้น) ที่อ่าวกันเตียง/หาดยาว ไปจนถึงบังกะโลไม้ริมหาดคุ้มราคาที่คลองจาก · เกาะลันตาเป็นเกาะยาวบรรยากาศชิลๆ สายชิลมากกว่าปาร์ตี้ เข้าถึงด้วยรถ+เรือเฟอร์รี่หรือสะพาน หาดเรียงจากเหนือ(ครอบครัว)ลงใต้(เงียบ/หรู) — เรียงอันดับตามคะแนนรีวิวจริงของผู้เข้าพัก',
  transport: 'เกาะลันตาเข้าถึงด้วยรถ ไม่ต้องนั่งเรือโดยสารเหมือนพีพี — นั่งรถ/minivan จากตัวเมืองกระบี่หรือสนามบินกระบี่ (~2-2.5 ชม.) ข้ามเรือเฟอร์รี่หรือใช้สะพานสิริลันตาข้ามเกาะลันตาน้อยไปเกาะลันตาใหญ่ · หาดเรียงจากเหนือลงใต้: คลองดาว (ใกล้ท่าเรือสะลาดาน เงียบ/ครอบครัว) · หาดยาว-พระแอ (ยาว ร้านเยอะ) · คลองโขง-คลองนิน-คลองโตบ (ฝั่งตะวันตก เงียบ ดูพระอาทิตย์ตก) · อ่าวกันเตียง (หรู ห่างไกล) · คลองจาก (เงียบสุด) — ยิ่งลงใต้ยิ่งไกล ควรมีรถ/มอเตอร์ไซค์ · หลายรีสอร์ตปิดหน้าฝน พ.ค.-ต.ค. เช็กก่อนจอง',
}
const out = await agent(
  `You are an expert Thai hotel-roundup writer for thailandaddict.com. Produce ONE complete, schema-valid Thai roundup JSON.

STEP 1 — Read (your ONLY hotel sources; do NOT invent):
  • FORMAT TEMPLATE (mirror EVERY key exactly — a proven Krabi/island roundup): ${TEMPLATE}
  • YOUR VERIFIED POOL (${s.n} hotels, pre-sorted by guest score): ${POOLDIR}\\${s.slug}.json
Optionally read 2-3 source reviews in ${REVDIR}\\<reviewSlug>.json for authentic detail.

STEP 2 — Write finished JSON to: ${OUTDIR}\\${s.slug}.json

IDENTITY: slug=${s.slug} · เมือง ${s.cityTH} · city hub href ${s.cityHub} · ย่าน ${s.zoneTH} · จำนวน ${s.n} · มุม: ${s.angle} · การเดินทาง(mrtHtml): ${s.transport}

REQUIREMENTS:
1. Every top-level key the template has + quickAnswerHtml. entries[]: one per pool hotel (all ${s.n}), COPY VERBATIM from pool: name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig. Map pool rooms {name,price,full}→{type,price}. Set id/rank/rankColor/type/revCount/mrtTag/priceSub/tags/addr/storyHtml(70-110 words)/tipHtml/pros(3-4)/cons(2-3)/dividerText.
2. RANKING: order entries by the pool's guest-score order (highest first). FRAME HONESTLY with clear BEST-FOR signposting: Pimalai = top all-round LUXURY / iconic flagship (Kantiang Bay); Layana + The Houben = ADULTS-ONLY couples/honeymoon (18+); Rawi Warin = best luxury-VALUE + family (west coast); SriLanta = quiet Klong Nin sunset; Southern Lanta = best FAMILY value on Klong Dao (waterslide/kids); Lanta Castaway = top-rated boutique BUNGALOWS on Long Beach; Klong Jark Bungalows = cheapest quiet-beach pick; Avani+ = modern beachfront near town. Each storyHtml states who it's best for + honest drawbacks (seasonal closure, remote beaches need a scooter, steep hillside rooms). toc[] + compareRows[] SAME order as entries.
3. title/meta: natural Thai, include เกาะลันตา + กระบี่ + "เทียบราคา 3 เว็บ" + "อัปเดต 2026" + "ที่เรารีวิวไว้แล้ว". heroImg+image = #1 hotel's img.
4. breadcrumb: ThailandAddict → 🇹🇭 ไทย (country-thailand.html) → กระบี่ (city-krabi.html) → this roundup. navReviewHref=${s.slug}.html.
5. faq 4-5 (how to get to Koh Lanta / car+ferry+bridge, which beach to pick — family north vs quiet south, best time / green-season closures, luxury vs budget, is a scooter needed), advice 3-4, quickAnswerHtml 40-60 words.
Tone v2-clean เพื่อนเล่าให้เพื่อน; avoid AI clichés (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก); no dark patterns; honesty "เสียงจากรีวิวจริง", never "ไปพักเอง".

Write the file. Return {"slug":"${s.slug}","entryCount":N,"top1":"<name>"}.`,
  { label: `gen:${s.slug}`, phase: 'Generate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { out }
