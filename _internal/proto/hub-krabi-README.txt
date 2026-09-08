Destination-hub prototype generator — Krabi (TH + EN)
Outputs: astro/public/_proto/krabi.html and astro/public/_proto/en/krabi.html

Run, in order, from the repo root, passing a scratch directory:

  node _internal/proto/hub-krabi-1-stays.mjs  <scratch>/krabi-rows.json
  node _internal/proto/hub-krabi-2-guides.mjs <scratch>
  node _internal/proto/hub-krabi-3-render.mjs <scratch>

Step 1 reads astro/src/content/reviews{,-en}/*.json where cluster === 'krabi'
and derives the zone / price-band / star facets plus the price quantiles.
Step 2 indexes astro/src/content/{articles,roundups}{,-en} for the same cluster.
Step 3 renders both locales from those two files plus
_internal/province-data{,-en}/krabi.json and astro/src/data/editorial.json.

Nothing is hard-coded: change the content JSON and re-run to regenerate.
To port the page to another province, change the cluster string in steps 1-2
and the ZONES table in step 1 (zone rules are matched on the Thai loc string).
