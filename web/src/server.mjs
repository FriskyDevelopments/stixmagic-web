import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.WEB_PORT || 3000);
const distDir = fileURLToPath(new URL('../dist', import.meta.url));
const srcDir = fileURLToPath(new URL('..', import.meta.url));
const baseDir = existsSync(distDir) ? distDir : srcDir;
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || '/', `http://localhost`).pathname;
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = resolve(join(baseDir, normalize(requested)));

  if (!filePath.startsWith(baseDir + sep)) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const body = readFileSync(filePath);
    res.writeHead(200, { 'content-type': contentTypes[extname(filePath)] || 'text/plain; charset=utf-8' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Landing page available on http://localhost:${port}`);
});
