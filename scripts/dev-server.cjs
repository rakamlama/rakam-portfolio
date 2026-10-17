const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 8080);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method not allowed');
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.split('/').some(part => part.startsWith('.'))) {
      res.writeHead(404);
      return res.end('Not found');
    }
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    const stat = await fs.stat(file);
    if (stat.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { Location: url.pathname + '/' + url.search });
        return res.end();
      }
      file = path.join(file, 'index.html');
    }
    const data = await fs.readFile(file);
    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (error instanceof URIError) {
      res.writeHead(400);
      return res.end('Invalid URL');
    }
    const page = await fs.readFile(path.join(root, '404.html')).catch(() => null);
    res.writeHead(404, {'Content-Type': page ? types['.html'] : 'text/plain; charset=utf-8'});
    res.end(req.method === 'HEAD' ? undefined : page || 'Not found');
  }
});
server.on('error', error => {
  console.error(`Could not start server: ${error.message}`);
  process.exitCode = 1;
});
if (require.main === module) server.listen(port, '127.0.0.1', () => {
  console.log(`\n  Portfolio: http://localhost:${port}\n  Dashboard: http://localhost:${port}/dashboard/\n\n  Press Ctrl+C to stop.\n`);
});

module.exports = server;
