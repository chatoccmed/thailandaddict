import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared schema for hotel-review JSON files (Thai + English share the same shape).
const reviewSchema = z.object({
  slug: z.string(),                 // URL slug, e.g. "review-star-hostel-taipei"
  name: z.string(),                 // hotel name
  cluster: z.enum(['taipei', 'cingjing', 'hualien', 'kenting', 'alishan', 'kaohsiung', 'taichung', 'tainan', 'jiufen', 'sun-moon-lake', 'yilan', 'chiayi', 'hsinchu', 'lukang', 'penghu', 'green-island', 'orchid-island', 'matsu', 'kinmen', 'taoyuan', 'tokyo', 'osaka', 'kyoto', 'sapporo', 'nagoya', 'fukuoka', 'okinawa', 'new-york', 'los-angeles', 'miami', 'dallas', 'atlanta', 'houston', 'boston', 'philadelphia', 'kansas-city', 'san-francisco', 'seattle', 'toronto', 'vancouver', 'ottawa', 'mexico-city', 'guadalajara', 'monterrey', 'yokohama', 'nara', 'kobe', 'hakone', 'kamakura', 'nikko', 'kanazawa', 'takayama', 'hiroshima', 'hakodate', 'sendai', 'otaru', 'kawaguchiko', 'beppu', 'kumamoto', 'nagasaki', 'shirakawa-go', 'shanghai', 'matsumoto', 'ise', 'karuizawa', 'kurashiki', 'matsuyama', 'koyasan', 'chiang-mai', 'chiang-rai', 'phuket', 'krabi', 'samui', 'pattaya', 'chonburi', 'bangkok', 'ayutthaya', 'kanchanaburi', 'huahin', 'phetchaburi', 'sukhothai', 'pai', 'mae-hong-son', 'surat-thani', 'koh-phangan', 'koh-tao', 'koh-lanta', 'phang-nga', 'rayong', 'trat', 'chanthaburi', 'nakhon-ratchasima', 'nakhon-si-thammarat', 'prachuap-khiri-khan', 'loei', 'nan', 'lampang', 'lamphun', 'phitsanulok', 'phetchabun', 'khon-kaen', 'udon-thani', 'nong-khai', 'bueng-kan', 'nakhon-phanom', 'mukdahan', 'sakon-nakhon', 'ubon-ratchathani', 'buriram', 'surin', 'sisaket', 'chaiyaphum', 'songkhla', 'trang', 'satun', 'chumphon', 'ranong', 'nonthaburi', 'pathum-thani', 'samut-prakan', 'nakhon-pathom', 'ratchaburi', 'samut-songkhram', 'samut-sakhon', 'suphan-buri', 'ang-thong', 'lopburi', 'saraburi', 'chai-nat', 'sing-buri', 'nakhon-nayok', 'phrae', 'phayao', 'uttaradit', 'tak', 'kamphaeng-phet', 'phichit', 'nakhon-sawan', 'uthai-thani', 'kalasin', 'chachoengsao', 'prachinburi', 'maha-sarakham', 'roi-et', 'yasothon', 'amnat-charoen', 'nong-bua-lamphu', 'sa-kaeo', 'phatthalung', 'pattani', 'yala', 'narathiwat', 'hat-yai', 'khao-yai', 'koh-chang', 'koh-lipe', 'koh-kood', 'koh-mak', 'koh-larn', 'beijing', 'chengdu', 'xian', 'hangzhou', 'guangzhou', 'chongqing']),
  score: z.number(),
  starRating: z.number(),
  ratingCount: z.number(),
  type: z.string(),                 // Thai short type, e.g. "โฮสเทล"
  typeEn: z.string(),               // schema.org / english type
  typeFull: z.string(),             // sidebar "ประเภท" value
  // SEO / head
  title: z.string(),
  metaDesc: z.string(),
  keywords: z.string(),
  ogTitle: z.string(),
  ogDesc: z.string(),
  twDesc: z.string(),
  image: z.string(),                // og:image + schema image (absolute-less path)
  schemaDesc: z.string(),
  streetAddress: z.string(),
  addressLocality: z.string(),
  addressCountry: z.string().default('TH'),
  priceRange: z.string(),
  // breadcrumb / cluster nav
  parentName: z.string(),           // e.g. "12 อันดับ Hostel ไทเป"
  parentShort: z.string(),          // breadcrumb short, e.g. "12 Hostel ไทเป"
  parentHref: z.string(),           // e.g. "top12-hostel-taipei.html"
  parentCrumbName: z.string(),      // schema BreadcrumbList name
  parentCrumbUrl: z.string(),
  navReviewLabel: z.string(),       // nav middle link label
  // optional breadcrumb position-2 override (defaults to Taiwan in layout — back-compat)
  crumbCityName: z.string().optional(),
  crumbCityHref: z.string().optional(),
  // optional region/country nav+footer overrides (default to Asia/Taiwan in layout — back-compat)
  regionHref: z.string().optional(),
  regionLabel: z.string().optional(),
  countryHref: z.string().optional(),
  countryLabel: z.string().optional(),
  countryGuideLabel: z.string().optional(),
  // hero
  heroImg: z.string(),
  heroSub1: z.string(),
  heroSub2: z.string(),
  heroSub2Href: z.string(),
  badgeMid: z.string(),
  badgeLoc: z.string(),
  hiLoc: z.string(),
  hiTag: z.string(),
  // quick bar
  qiType: z.string(),
  qiPrice: z.string(),
  qiPriceUnit: z.string().default('/คืน'),
  qiRooms: z.string(),
  qiCol5Label: z.string(),
  qiCol5Value: z.string(),
  qiCol5Small: z.string().default(''),
  // intro
  h1: z.string(),                   // may contain <em>
  intro: z.string(),                // may contain <strong>
  // gallery (3 secondary images; main = heroImg)
  gallery: z.array(z.string()).length(3),
  galleryAlts: z.array(z.string()).length(3),
  // review body — ordered blocks
  body: z.array(z.object({ kind: z.enum(['p', 'quote']), html: z.string() })),
  // highlights
  highlights: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })).length(3),
  // rating
  ratingBars: z.array(z.object({ label: z.string(), value: z.string(), width: z.number() })).length(6),
  // platform reviews
  booking: z.object({ score: z.string(), pros: z.array(z.string()), cons: z.array(z.string()) }),
  agoda: z.object({ score: z.string(), pros: z.array(z.string()), cons: z.array(z.string()) }),
  // honest take
  honestSummary: z.string(),        // may contain <strong>
  honestChecks: z.array(z.string()).length(3),  // each may contain <strong>
  // price widget
  rooms: z.array(z.object({ name: z.string(), price: z.string(), full: z.string() })),
  bookingAgoda: z.string(),
  bookingBooking: z.string(),
  bookingTrip: z.string(),
  // tips
  tips: z.array(z.object({ icon: z.string(), title: z.string(), body: z.string() })).length(4),
  // sidebar
  info: z.array(z.object({ k: z.string(), v: z.string() })),
  mapImg: z.string(),
  mapAddr: z.string(),
  nearby: z.array(z.object({ n: z.string(), d: z.string() })),
  relatedTitle: z.string(),
  related: z.array(z.object({ href: z.string(), img: z.string(), name: z.string(), loc: z.string(), price: z.string() })),
  // article footer prev / next
  prevHref: z.string(),
  prevLabel: z.string(),
  prevName: z.string(),
  nextHref: z.string(),
  nextLabel: z.string(),
  nextName: z.string(),
  // FAQ — optional · back-compat with existing reviews.
  // When present, ReviewLayout renders a FAQ accordion + FAQPage JSON-LD for SEO.
  faqTitle: z.string().optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
});

// Shared schema for roundup ("Top N" list) JSON files.
const roundupSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaDesc: z.string(),
  ogTitle: z.string(),
  ogDesc: z.string(),
  image: z.string(),
  heroImg: z.string(),
  heroEyebrow: z.string(),
  h1: z.string(),                   // raw HTML (may contain <br>, <span class="hi">)
  heroSub: z.string(),
  heroStats: z.array(z.string()),   // each = inner HTML of a stat pill
  breadcrumb: z.array(z.object({ name: z.string(), href: z.string().optional() })),
  breadcrumbSchema: z.array(z.object({ name: z.string(), item: z.string() })),
  navReviewLabel: z.string(),
  navReviewHref: z.string(),
  introH2: z.string(),
  introHtml: z.string(),
  mrtHtml: z.string(),
  secLabel: z.string(),
  toc: z.array(z.object({ n: z.string(), color: z.string(), name: z.string(), price: z.string() })),
  entries: z.array(z.object({
    id: z.string(),
    rank: z.string(),
    rankColor: z.string(),
    type: z.string(),
    name: z.string(),
    score: z.union([z.string(), z.number()]),
    stars: z.string(),
    revCount: z.string(),
    badge: z.string().optional(),
    badgeColor: z.string().optional(),
    img: z.string(),
    mrtTag: z.string(),
    priceBig: z.string(),
    priceSub: z.string(),
    rooms: z.array(z.object({ type: z.string(), price: z.string() })),
    agodaUrl: z.string(),
    bookingUrl: z.string(),
    tripUrl: z.string(),
    reviewUrl: z.string(),
    tags: z.array(z.string()),
    addr: z.string(),
    storyHtml: z.string(),
    tipHtml: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    dividerText: z.string(),
    // Optional fields for skill-compliant roundups (Wave 2026+):
    verification: z.any().optional(),     // 8-step verification audit trail per hotel
    image_source: z.any().optional(),     // Trip.com tier / official site tier / license info
  })).transform(arr => arr.map(e => ({...e, score: String(e.score)}))),
  compareTitle: z.string(),
  compareCols: z.array(z.string()),
  compareRows: z.array(z.object({
    rank: z.string(), rankColor: z.string(), name: z.string(), type: z.string(),
    score: z.string(), price: z.string(), access: z.string(),
    badge: z.string().optional(), badgeStyle: z.string().optional(),
  })),
  adviceTitle: z.string(),
  advice: z.array(z.object({ icon: z.string(), head: z.string(), bodyHtml: z.string() })),
  noteHtml: z.string(),
  faqTitle: z.string(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
  // Optional fields for skill-compliant roundups (Wave 2026+):
  // Renderable in RoundupLayout when present; safely ignored when absent (back-compat with old roundups).
  author: z.any().optional(),                 // Doctor Chat byline info
  publishedDate: z.string().optional(),
  modifiedDate: z.string().optional(),
  readTime: z.string().optional(),
  methodologyHtml: z.string().optional(),     // EEAT methodology box (how we picked)
  lastVerifiedHtml: z.string().optional(),    // EEAT last-verified date
  disclosureHtml: z.string().optional(),      // affiliate disclosure
  quickAnswerH2: z.string().optional(),       // P4 direct-answer block header
  quickAnswerHtml: z.string().optional(),     // P4 direct-answer block 40-60 words
  compareTitleTop: z.string().optional(),     // P2 comparison table (top of page)
  compareTopCols: z.array(z.string()).optional(),
  compareTopRows: z.array(z.any()).optional(),
  compareInsightsTitle: z.string().optional(),
  compareInsightsHtml: z.string().optional(), // P4 comparison sentences for AI extraction
  personaClosingTitle: z.string().optional(),
  personaClosingHtml: z.string().optional(),  // Dr Chat persona-based closing
  sourcesAndCitations: z.any().optional(),    // bottom-of-article sources list
  jsonLd: z.any().optional(),                 // custom JSON-LD block (Person + ItemList + FAQPage + Hotel + AggregateRating · in addition to template-generated schema)
});

// Thai collections (served at site root).
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/reviews' }),
  schema: reviewSchema,
});
const roundups = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/roundups' }),
  schema: roundupSchema,
});

// English collections (served under /en/).
const reviewsEn = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/reviews-en' }),
  schema: reviewSchema,
});
const roundupsEn = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/roundups-en' }),
  schema: roundupSchema,
});

// Flexible "article" schema — powers food / attraction / itinerary / prep / guide pages.
// One layout (ArticleLayout) renders all of them from a typed list of content blocks.
const articleBlock = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('h2'), text: z.string(), id: z.string().optional() }),
  z.object({ kind: z.literal('p'), html: z.string() }),
  // Inline credited image (e.g. per-restaurant photo). Additive · back-compat (no existing article uses it).
  z.object({ kind: z.literal('image'), src: z.string(), alt: z.string(),
    caption: z.string().optional(), credit: z.string().optional(), creditHref: z.string().optional() }),
  // Rich editorial restaurant card (award-winning roundup layout). Additive · back-compat.
  z.object({ kind: z.literal('restaurant'),
    rank: z.union([z.string(), z.number()]).transform(String),
    name: z.string(), nameEn: z.string().optional(), area: z.string().optional(), cuisine: z.string().optional(),
    signature: z.string().optional(), priceRange: z.string().optional(), score: z.string().optional(),
    img: z.string(), alt: z.string(), credit: z.string().optional(), creditHref: z.string().optional(),
    descHtml: z.string(), mustOrder: z.array(z.string()).optional(), tags: z.array(z.string()).optional(),
    mapHref: z.string().optional(), fbHref: z.string().optional(),
    stayHref: z.string().optional(), stayLabel: z.string().optional(),
    // Global-tourist info layer (badges) + geo for the map. All optional · back-compat.
    hours: z.string().optional(), priceUsd: z.string().optional(), spice: z.string().optional(),
    halal: z.boolean().optional(), veg: z.boolean().optional(), englishMenu: z.boolean().optional(),
    lat: z.number().optional(), lng: z.number().optional() }),
  // Hotel-booking conversion module (drives readers → accommodation pages). Additive · back-compat.
  z.object({ kind: z.literal('staycta'), title: z.string(), text: z.string().optional(), img: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string(), note: z.string().optional() })),
    ctaLabel: z.string().optional(), ctaHref: z.string().optional() }),
  // Food-experience monetization module (food tours / cooking classes — Klook/affiliate). Additive · back-compat.
  z.object({ kind: z.literal('foodexp'), title: z.string(), text: z.string().optional(),
    items: z.array(z.object({ label: z.string(), note: z.string().optional(), href: z.string(), provider: z.string().optional(), emoji: z.string().optional() })),
    ctaLabel: z.string().optional(), ctaHref: z.string().optional() }),
  z.object({ kind: z.literal('list'), items: z.array(z.string()) }),
  z.object({ kind: z.literal('tip'), title: z.string().optional(), html: z.string() }),
  z.object({ kind: z.literal('ranked'), items: z.array(z.object({
    rank: z.union([z.string(), z.number()]).transform(String),
    name: z.string(), blurb: z.string(),
    meta: z.string().optional(), price: z.string().optional(),
    tags: z.array(z.string()).optional(), href: z.string().optional(),
  })) }),
  z.object({ kind: z.literal('cards'), items: z.array(z.object({
    name: z.string(), blurb: z.string(), tag: z.string().optional(), href: z.string().optional(),
  })) }),
  z.object({ kind: z.literal('day'), label: z.string(), title: z.string().optional(), items: z.array(z.object({
    time: z.string().optional(), activity: z.string(), note: z.string().optional(),
  })) }),
  z.object({ kind: z.literal('cta'), text: z.string(), href: z.string(), label: z.string().optional() }),
]);

const articleSchema = z.object({
  slug: z.string(),
  type: z.string(),                       // food | eat-ranking | attraction | itinerary | prep | guide
  cluster: z.string(),                    // province slug, e.g. "chiang-mai"
  title: z.string(),
  metaDesc: z.string(),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDesc: z.string().optional(),
  image: z.string().optional(),
  crumbCity: z.string(),                  // "เชียงใหม่" / "Chiang Mai"
  crumbCityHref: z.string(),              // "city-chiang-mai.html"
  regionLabel: z.string().optional(),
  regionHref: z.string().optional(),
  eyebrow: z.string(),
  h1: z.string(),
  heroEmoji: z.string().optional(),
  heroImg: z.string().optional(),
  intro: z.string(),                      // may contain HTML
  chips: z.array(z.string()).optional(),
  readTime: z.string().optional(),
  publishedDate: z.string().optional(),
  modifiedDate: z.string().optional(),
  blocks: z.array(articleBlock),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  related: z.array(z.object({ href: z.string(), title: z.string() })).optional(),
  // Sticky right-rail of featured hotel roundups (desktop only; hidden on mobile). Additive · back-compat.
  rail: z.array(z.object({ title: z.string(), href: z.string(), note: z.string().optional(), img: z.string().optional() })).optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/articles' }),
  schema: articleSchema,
});
const articlesEn = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/articles-en' }),
  schema: articleSchema,
});

export const collections = { reviews, roundups, reviewsEn, roundupsEn, articles, articlesEn };
