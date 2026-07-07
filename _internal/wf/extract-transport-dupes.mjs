import fs from 'node:fs';
const dir = 'astro/src/content/articles/';
const use = new Map();
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith('getting-around-') || !f.endsWith('.json')) continue;
  const s = fs.readFileSync(dir + f, 'utf8');
  for (const m of s.matchAll(/https:\/\/upload\.wikimedia\.org\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp)(?:\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp))?/gi)) {
    const u = m[0];
    if (!use.has(u)) use.set(u, new Set());
    use.get(u).add(f.replace('getting-around-', '').replace('.json', ''));
  }
}
const dupes = [...use.entries()].filter(([, s]) => s.size >= 4).sort((a, b) => b[1].size - a[1].size);
console.log('getting-around: Wikimedia images repeated across >=4 provinces:', dupes.length);
const payload = [];
for (const [u, provs] of dupes) {
  console.log('  x' + provs.size + '  ' + decodeURIComponent(u).split('/').pop().slice(0, 75));
  payload.push({ img: u, provinces: [...provs] });
}
fs.writeFileSync('_internal/wf/transport-dupes.json', JSON.stringify(payload, null, 1));
console.log('saved -> _internal/wf/transport-dupes.json');
