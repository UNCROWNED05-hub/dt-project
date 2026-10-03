import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/screenshots/p1-shell');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  // 1. Home desktop 1440px - top transparent bar
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'home-top-1440.png') });
    console.log('✓ Captured home-top-1440.png');

    // Scroll down to activate floating dock
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'home-scrolled-dock-1440.png') });
    console.log('✓ Captured home-scrolled-dock-1440.png');
    await page.close();
  }

  // 2. Course page desktop 1440px - left rail
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000/ai-ml', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'course-left-rail-1440.png') });
    console.log('✓ Captured course-left-rail-1440.png');

    // Tier nav sticky state
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'course-tier-nav-sticky-1440.png') });
    console.log('✓ Captured course-tier-nav-sticky-1440.png');
    await page.close();
  }

  // 3. Search overlay 1440px
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.keyboard.press('Control+k');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'search-overlay-empty-1440.png') });
    console.log('✓ Captured search-overlay-empty-1440.png');

    // Type query "neural"
    await page.keyboard.type('neural');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'search-overlay-results-1440.png') });
    console.log('✓ Captured search-overlay-results-1440.png');
    await page.close();
  }

  // 4. Brand page 1440px
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000/brand', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'brand-page-1440.png') });
    console.log('✓ Captured brand-page-1440.png');
    await page.close();
  }

  // 5. Mobile 375px - bottom dock
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await page.goto('http://localhost:3000/ai-ml', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'course-mobile-bottom-dock-375.png') });
    console.log('✓ Captured course-mobile-bottom-dock-375.png');
    await page.close();
  }

  // 6. Tablet 768px
  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await page.goto('http://localhost:3000/cybersecurity', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'course-cyber-768.png') });
    console.log('✓ Captured course-cyber-768.png');
    await page.close();
  }

  await browser.close();
  console.log('All Phase P1 screenshots successfully captured in public/screenshots/p1-shell/');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
