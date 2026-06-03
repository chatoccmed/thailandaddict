// Minimal static file server for astro/public — local preview only.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), 'astro', 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
const port = Number(process.argv[3]) || Number(process.env.PORT) || 4399;

http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  let fp = path.join(root, u);
  if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html');
  if (!fs.existsSync(fp) && !path.extname(fp)) fp += '.html';
  if (!fs.existsSync(fp)) { res.statusCode = 404; fp = path.join(root, '404.html'); }
  if (!fs.existsSync(fp)) { res.statusCode = 404; res.end('not found'); return; }
  res.setHeader('Content-Type', types[path.extname(fp)] || 'application/octet-stream');
  fs.createReadStream(fp).pipe(res);
}).listen(port, () => console.log('preview on http://localhost:' + port));
