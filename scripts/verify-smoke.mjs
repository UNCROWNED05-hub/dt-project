import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const ROUTES = [
  '/',
  '/ai-ml',
  '/cybersecurity',
  '/iot',
  '/cybersecurity/security-foundations-and-attack-lifecycle',
  '/ai-ml/what-ai-ml-really-are',
  '/iot/iot-architecture-and-physical-computing',
  '/my-desk',
  '/brand',
  '/sources',
  '/about',
  '/non-existent-page-slug',
];

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-375', width: 375, height: 667 },
];

async function runSmokeTest() {
  console.log('=== Automated Test Suite E1: Full Smoke Test ===\n');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  let totalChecks = 0;
  let totalErrors = 0;

  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      totalChecks++;
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const errors = [];
      const failedRequests = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          // If testing 404 route, ignore 404 console logs
          if (route === '/non-existent-page-slug' && msg.text().includes('404')) {
            return;
          }
          // Ignore external third-party CDN / youtube thumbnail errors
          const loc = (typeof msg.location === 'function' && msg.location()?.url) || '';
          if (msg.text().includes('ytimg.com') || loc.includes('ytimg.com') || msg.text().includes('favicon.ico')) {
            return;
          }
          errors.push(msg.text());
        }
      });

      page.on('requestfailed', (req) => {
        if (route === '/non-existent-page-slug') return;
        failedRequests.push(`${req.method()} ${req.url()}`);
      });

      const res = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
      if (route === '/non-existent-page-slug') {
        if (res && res.status() !== 404) {
          errors.push(`Expected 404 status for nonexistent page, got ${res.status()}`);
        }
      } else {
        if (res && res.status() >= 400) {
          errors.push(`Expected 200 OK status, got ${res.status()}`);
        }
      }
      await page.waitForTimeout(200);

      // Check horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        errors.push('Horizontal scroll detected (scrollWidth > clientWidth)');
      }

      if (errors.length > 0 || failedRequests.length > 0) {
        totalErrors += errors.length + failedRequests.length;
        console.error(`❌ [${route} @ ${vp.name}] Failed:`);
        errors.forEach((e) => console.error(`   Console/Layout Error: ${e}`));
        failedRequests.forEach((r) => console.error(`   Failed Request: ${r}`));
      } else {
        console.log(`✓ [${route} @ ${vp.name}] Clean: 0 errors, 0 failed requests, no horizontal overflow`);
      }

      await page.close();
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`Smoke Test E1 Summary: ${totalChecks} checks run, ${totalErrors} errors`);
  console.log(`======================================================\n`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

runSmokeTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
