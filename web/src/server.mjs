import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';

const port = Number(process.env.WEB_PORT || 3000);
const baseDir = existsSync(new URL('../dist', import.meta.url)) ? new URL('../dist', import.meta.url) : new URL('..', import.meta.url);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const requested = req.url === '/' ? '/index.html' : req.url || '/index.html';
  const filePath = join(baseDir.pathname, requested.replace(/^\//, ''));

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
