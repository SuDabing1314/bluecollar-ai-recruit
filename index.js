const { createServer } = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '9000', 10);
const DEV = process.env.NODE_ENV !== 'production';
const LOCK_FILE = '/tmp/installed.lock';

let nextApp = null;
let nextHandler = null;
let installing = false;
let installDone = false;

// Check if already installed
if (fs.existsSync(LOCK_FILE) || fs.existsSync('/code/node_modules/next')) {
  console.log('Dependencies already present, loading Next.js...');
  const next = require('next');
  nextApp = next({ dev: DEV });
  nextHandler = nextApp.getRequestHandler();
  installDone = true;
} else if (!installing) {
  installing = true;
  console.log('Running npm install...');
  const npm = spawn('npm', ['install', '--prefer-offline'], {
    cwd: '/code',
    stdio: 'pipe',
    shell: true
  });
  let stdout = '';
  let stderr = '';
  npm.stdout.on('data', (d) => { stdout += d; });
  npm.stderr.on('data', (d) => { stderr += d; });
  npm.on('close', (code) => {
    if (code === 0) {
      console.log('npm install succeeded');
      fs.writeFileSync(LOCK_FILE, '1');
      const next = require('next');
      nextApp = next({ dev: DEV });
      nextHandler = nextApp.getRequestHandler();
      installDone = true;
    } else {
      console.error('npm install failed: ' + code);
      console.error('stdout: ' + stdout);
      console.error('stderr: ' + stderr);
    }
  });
}

setTimeout(() => {
  if (!installDone) {
    console.log('Waiting for npm install to finish...');
  }
}, 5000);

exports.handler = (req, res) => {
  if (!installDone || !nextHandler) {
    res.writeHead(503);
    res.end('Still starting up, please retry...');
    return;
  }
  nextHandler(req, res);
};
