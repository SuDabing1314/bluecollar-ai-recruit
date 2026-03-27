const { createServer } = require('http');
const next = require('next');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '9000', 10);
const DIR = path.join(__dirname);
const LOG = '/tmp/srv.log';

fs.appendFileSync(LOG, `server.js starting...\n`);
fs.appendFileSync(LOG, `__dirname: ${__dirname}\n`);
fs.appendFileSync(LOG, `DIR: ${DIR}\n`);
fs.appendFileSync(LOG, `cwd: ${process.cwd()}\n`);

const dev = process.env.NODE_ENV !== 'production';
fs.appendFileSync(LOG, `dev: ${dev}, PORT: ${PORT}\n`);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  fs.appendFileSync(LOG, 'Next.js prepared, creating server...\n');
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, '0.0.0.0', (err) => {
    if (err) {
      fs.appendFileSync(LOG, `Listen error: ${err.message}\n`);
      console.error('Failed to start:', err);
      process.exit(1);
    }
    fs.appendFileSync(LOG, `Ready on http://0.0.0.0:${PORT}\n`);
    console.log(`> Ready on http://0.0.0.0:${PORT}`);
  });
}).catch((e) => {
  fs.appendFileSync(LOG, `Prepare error: ${e.message}\n`);
  console.error('Prepare error:', e);
  process.exit(1);
});
