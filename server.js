const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  try {
    let cleanPath = decodeURIComponent(req.url.split('?')[0]);
    if (cleanPath === '/' || cleanPath === '') {
      cleanPath = '/index.html';
    }

    const safePath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT, safePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + cleanPath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': mime,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} in use, trying http://localhost:${nextPort}`);
    server.listen(nextPort);
  } else {
    console.error('Server error:', err);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

server.listen(PORT, () => {
  console.log(`⚡ Portfolio Server is RUNNING at http://localhost:${PORT}`);
});
