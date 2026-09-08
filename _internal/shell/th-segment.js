/* =============================================================================
   th-segment.js — Thai word segmentation shim
   Blueprint §5.6 item 1

   Thai is written without spaces, so a substring scan cannot find
   "ที่พัก" inside "ที่พักติดทะเล". Intl.Segmenter carries ICU's Thai
   dictionary in every modern engine — no library, no dictionary download.

   Applied at BOTH index time and query time, and the caller ORs the result
   with the raw string, because ICU mis-splits proper nouns.
   ========================================================================== */

const taSegmentThai = function (str) {
  const s = String(str == null ? '' : str).trim();
  if (!s) return [];
  if (!/[฀-๿]/.test(s) || typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
    return s.split(/\s+/).filter(Boolean);            /* graceful fallback */
  }
  try {
    return [...new Intl.Segmenter('th', { granularity: 'word' }).segment(s)]
      .filter(x => x.isWordLike).map(x => x.segment.trim()).filter(Boolean);
  } catch (e) {
    return s.split(/\s+/).filter(Boolean);
  }
};

/* Query expansion: segmented words OR-ed with the raw query, so a proper
   noun that ICU splits badly still matches. Returns a string. */
const taSegmentQuery = function (str) {
  const words = taSegmentThai(str).join(' ');
  return words ? words + ' ' + String(str) : String(str);
};

if (typeof globalThis !== 'undefined') {
  const g = (globalThis.TA = globalThis.TA || {});
  g.segmentThai = taSegmentThai;
  g.segmentQuery = taSegmentQuery;
}

export { taSegmentThai as segmentThai, taSegmentQuery as segmentQuery };
export default taSegmentThai;
