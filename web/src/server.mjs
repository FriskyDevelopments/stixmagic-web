import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, resolve, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.WEB_PORT || 3000);
const distUrl = new URL('../dist', import.meta.url);
const srcUrl = new URL('..', import.meta.url);
const baseDir = existsSync(fileURLToPath(distUrl))
  ? fileURLToPath(distUrl)
  : fileURLToPath(srcUrl);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url || '/', `http://localhost`);
  const normalizedPathname = normalize(pathname);
  const fileName = normalizedPathname === '/' || normalizedPathname === '' ? 'index.html' : normalizedPathname.replace(/^\//, '');
  const filePath = resolve(baseDir, fileName);

  const rel = relative(baseDir, filePath);
  if (rel.startsWith('..') || resolve(filePath) === baseDir) {
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
