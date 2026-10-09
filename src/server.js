import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const assets = {
  '/': ['../public/index.html', 'text/html; charset=utf-8'],
  '/index.html': ['../public/index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['../public/styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['../public/app.js', 'text/javascript; charset=utf-8']
};
const port = Number(process.env.PORT || 3000);

const server = createServer(async (request, response) => {
  const asset = assets[new URL(request.url, 'http://localhost').pathname];

  if (!asset) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  try {
    const content = await readFile(join(root, asset[0]));
    response.writeHead(200, {
      'Content-Type': asset[1],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    });
    response.end(content);
  } catch (error) {
    console.error(`Unable to serve ${asset[0]}:`, error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Unable to load this page');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Cinima gallery ready at http://localhost:${port}`);
});
