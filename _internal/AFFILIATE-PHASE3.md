# 💰 Phase 3 Affiliate Stack — research decision (2026-06-22)

21-agent web research + adversarial verification (full raw output in the workflow transcript). Question: where do Thai-domestic + inbound-foreign travelers actually book **car rental / eSIM / travel insurance**, and which have an affiliate program a **Thailand-based publisher** can join.

## 🎯 The headline finding
**The Klook account we ALREADY hold (aid=121442) monetizes the ENTIRE booking step with ZERO new signups:**
| Klook category | Commission | Note |
|---|---|---|
| eSIM (AIS-powered) | **~20%** | best rate in the whole stack · foreign-tourist only |
| Activities / tours / tickets | ~6.5% | already in use |
| Car rental (self-drive) | ~5% | private **car-charter** = listed as activity → ~6.5% + suits Thai users |
| Airport transfer | ~5% | auto-pair to arrival airport |
| Travel insurance (Chubb TH) | ~5% | best as a post-booking bundle add-on |
> ⚠️ Klook car-rental/hotel cookie = **7 days** (write immediate-booking copy, not "research later"). Other categories 30 days.

## 🥇 Best NEW signup (one account, biggest unlock)
**Travelpayouts** (travelpayouts.com — TH-HQ, joinable from Thailand, $50 payout, **bank transfer** not PayPal). Unlocks the best economics in 2 verticals from one dashboard:
- **DiscoverCars** (car rental) — **~58-60% rev-share**, 365-day cookie (vs Klook 5%) · real Thailand airport+city inventory, lists local Thai chains too.
- **EKTA** (travel insurance) — **20%** of policy, Thailand a top GEO · for inbound foreigners.
- Also carries Airalo eSIM (12%), Rentalcars, Localrent, 12Go.

## 🇹🇭 Best for Thai-DOMESTIC audience
**AccessTrade Thailand** (THB payout to Thai bank, 500 THB threshold) — the local brands Thais want: **Drivehub** (car rental, confirmed live campaign — the #1 Thai-language aggregator), **AXA/MSIG domestic insurance**. No eSIM.

## ✂️ Honest skip-calls (don't waste effort)
- **eSIM for Thai-domestic users → SKIP/HIDE.** Thais already own a Thai SIM. Show the eSIM row **only in the EN/foreign flow.**
- **Domestic travel insurance as a headline → SKIP.** Low intent, tiny AOV (10-135 THB). Small optional nudge at most (AXA domestic ~9.1% via AccessTrade).
- **Direct car chains (Avis/Sixt/Hertz/Budget), Thai Rent A Car/Bizcar direct → SKIP.** Low/no joinable program → capture indirectly via DiscoverCars/Localrent (which list them).
- **CJ/Awin/Impact, Holafly, QEEQ-as-primary → low priority.**

## 📋 Owner signup checklist (in priority order)
| Pri | Provider | Why | Link |
|---|---|---|---|
| **P0 (have it)** | **Klook** aid=121442 | monetizes all 5 lines now, eSIM 20% | affiliate.klook.com/home |
| **P1** | **Travelpayouts** | DiscoverCars (car ~58%) + EKTA (insurance 20%) + Airalo | travelpayouts.com |
| **P1** | **AccessTrade Thailand** | Drivehub + AXA/MSIG domestic (THB payout) | publisher.accesstrade.in.th |
| P2 | SafetyWing (Ambassador) | ~10% recurring, 364-day cookie, long-stay foreigners | safetywing.com/ambassador |
| P3 | Involve Asia | SEA network, Airalo+DirectAsia+Expedia in one | involve.asia |
> Before flipping any provider LIVE: confirm the real % + the exact tracked URL inside that provider's dashboard (all % here are network/3rd-party sourced, drift over time).

## 🏗️ Integration plan (planner booking step)
New section **"🎒 บริการเดินทาง (จองเพิ่ม)"**, every row **gated by audience** (Thai-domestic vs EN/foreign) + a **per-provider LIVE flag** (PENDING providers hidden until their link+rate are filled):
- **🚗 เช่ารถ** (both): Klook car-rental/charter search (LIVE now) · DiscoverCars via Travelpayouts (PENDING) · Drivehub via AccessTrade (PENDING, Thai).
- **✈️ รถรับส่งสนามบิน** (both): Klook transfer search (LIVE).
- **📶 eSIM** (FOREIGN/EN only — hidden for Thai): Klook eSIM 20% (LIVE) · Airalo via Travelpayouts (PENDING).
- **🛡️ ประกันเดินทาง** (FOREIGN primary; Thai = de-emphasized/skip): EKTA via Travelpayouts (PENDING) · SafetyWing (PENDING) · Klook Chubb bundle (LIVE).
- Order by commission: eSIM(foreign) → activities → car → transfer → insurance.
- Engineering: one `klook()` link helper (append aid + sub-id); `AFF` config with LIVE flags; audience gate `foreign = prefs.lang==='en'`.
- **Sequence: ship Klook rows now (zero signup) → add Travelpayouts rows after that account clears → AccessTrade rows for Thai-domestic brands.**
