// Affiliate tagging, applied at render time.
//
// Why here and not in the data: the partner ids used to live only inside the URLs stored in each
// review's booking fields, so any URL that reached the page from somewhere else (heroSub2Href, a
// card href, a hand-written link) went out untagged and earned nothing. Stamping at render means a
// bare OTA URL anywhere in the content is monetized by construction, and the ids stay in one file.
//
// Booking.com is deliberately absent: it is monetized through CJ via the /go/b worker route
// (see worker.js), not through a query parameter. See CLAUDE.md.
const PARTNERS: { host: RegExp; params: Record<string, string> }[] = [
  { host: /(^|\.)agoda\.com$/i, params: { cid: '1965862' } },
  { host: /(^|\.)trip\.com$/i, params: { Allianceid: '6861268', SID: '312919111' } },
  { host: /(^|\.)klook\.com$/i, params: { aid: '121442' } },
];

/** Add our partner ids to an OTA url that is missing them. Anything else passes through untouched. */
export function stampAffiliate(u: string): string {
  if (!u || typeof u !== 'string') return u;
  if (!/^https?:\/\//i.test(u)) return u; // relative / mailto / tel / already-wrapped worker route
  let url: URL;
  try {
    url = new URL(u);
  } catch {
    return u;
  }
  const partner = PARTNERS.find((p) => p.host.test(url.hostname));
  if (!partner) return u;
  let changed = false;
  for (const [k, v] of Object.entries(partner.params)) {
    // Respect an id that is already on the url — a campaign-specific tag beats the default.
    if (!url.searchParams.has(k)) {
      url.searchParams.set(k, v);
      changed = true;
    }
  }
  return changed ? url.toString() : u;
}
