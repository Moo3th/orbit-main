/**
 * Database Initialization Script (CMS-first)
 * Requires local Next.js server running on http://localhost:3000
 *
 * Usage:
 *   npm run seed
 */

/* eslint-disable @typescript-eslint/no-require-imports */

const http = require('http');

const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;
const CLEANUP_PATH = '/api/cleanup';
const SEED_PATH = '/api/seed';

function request({ path, method = 'GET', timeout = 15000 }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path,
        method,
        headers: { 'Content-Type': 'application/json' },
        timeout,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode || 0, body });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`Request timed out: ${method} ${path}`));
    });
    req.end();
  });
}

async function checkServer() {
  try {
    const result = await request({ path: '/', method: 'GET', timeout: 3000 });
    return result.statusCode > 0;
  } catch {
    return false;
  }
}

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function callEndpoint(path, title) {
  console.log(`\n${title}`);
  console.log(`→ POST http://${SERVER_HOST}:${SERVER_PORT}${path}`);

  const response = await request({ path, method: 'POST' });
  const payload = parseJsonSafely(response.body);

  if (response.statusCode < 200 || response.statusCode >= 300) {
    console.error(`✖ Failed (${response.statusCode})`);
    if (payload) {
      console.error(JSON.stringify(payload, null, 2));
    } else {
      console.error(response.body.slice(0, 400));
    }
    process.exit(1);
  }

  console.log(`✓ Success (${response.statusCode})`);
  if (payload) {
    console.log(JSON.stringify(payload, null, 2));
  }
}

async function main() {
  console.log('Checking local server...');

  const running = await checkServer();
  if (!running) {
    console.error('\nServer is not running on http://localhost:3000');
    console.error('Start it first: npm run dev');
    process.exit(1);
  }

  await callEndpoint(CLEANUP_PATH, 'Step 1/2: Cleaning legacy collections');
  await callEndpoint(SEED_PATH, 'Step 2/2: Seeding active Site CMS data');

  console.log('\nDatabase reset/seed completed.');
  console.log('Admin panel: http://localhost:3000/admin');
}

main().catch((error) => {
  console.error('\nInitialization failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
