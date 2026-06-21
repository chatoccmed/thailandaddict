// Generate astro/public/logo.png — the brand logo referenced by Organization/publisher JSON-LD
// (Article/Review/Roundup). Pure-Node PNG encoder (no image libs): teal #06B6D4 square with a
// white "T", matching the favicon. 512×512, RGB. Idempotent. Usage: node _internal/gen-logo.mjs
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'astro', 'public', 'logo.png');
const W = 512, H = 512;
const TEAL = [6, 182, 212], WHITE = [255, 255, 255];

// "T" geometry (centered): top bar + vertical stem
const barX0 = 104, barX1 = 408, barY0 = 132, barY1 = 206;   // horizontal bar
const stemX0 = 226, stemX1 = 286, stemY0 = 132, stemY1 = 392; // vertical stem
const inT = (x, y) => (y >= barY0 && y < barY1 && x >= barX0 && x < barX1) || (y >= stemY0 && y < stemY1 && x >= stemX0 && x < stemX1);

// raw RGB rows, each prefixed with filter byte 0
const raw = Buffer.alloc(H * (1 + W * 3));
let o = 0;
for (let y = 0; y < H; y++) {
  raw[o++] = 0; // filter: none
  for (let x = 0; x < W; x++) {
    const c = inT(x, y) ? WHITE : TEAL;
    raw[o++] = c[0]; raw[o++] = c[1]; raw[o++] = c[2];
  }
}

// CRC32
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = (buf) => { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2; // bitDepth 8, colorType 2 (RGB)
const idat = zlib.deflateSync(raw, { level: 9 });
const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
fs.writeFileSync(OUT, png);
console.log(`wrote ${OUT} (${png.length} bytes, ${W}x${H})`);
