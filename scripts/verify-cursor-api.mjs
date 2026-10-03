import http from 'http';

const CURSORS = [
  '/cursors/pencil.svg',
  '/cursors/nib.svg',
  '/cursors/highlighter.svg',
  '/cursors/pencil-sunrise.svg',
  '/cursors/nib-sunrise.svg',
  '/cursors/highlighter-sunrise.svg',
  '/cursors/pencil-midnight.svg',
  '/cursors/nib-midnight.svg',
  '/cursors/highlighter-midnight.svg',
  '/cursors/pencil-blueprint.svg',
  '/cursors/nib-blueprint.svg',
  '/cursors/highlighter-blueprint.svg',
];

async function checkUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          has32Dimensions: data.includes('width="32"') && data.includes('height="32"'),
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing all 12 cursor SVGs on http://localhost:3000 ...\n');
  let allPassed = true;
  for (const c of CURSORS) {
    const result = await checkUrl(c);
    const pass = result.statusCode === 200 && 
                 result.contentType?.includes('image/svg+xml') && 
                 result.has32Dimensions;
    if (!pass) allPassed = false;
    console.log(`${pass ? '✓' : '✗'} ${c} | Status: ${result.statusCode} | Content-Type: ${result.contentType} | 32x32: ${result.has32Dimensions}`);
  }

  if (allPassed) {
    console.log('\n✅ All cursor SVGs respond 200 with image/svg+xml and 32x32 dimensions!');
  } else {
    console.error('\n❌ Some cursor SVGs failed validation.');
    process.exit(1);
  }
}

run();
