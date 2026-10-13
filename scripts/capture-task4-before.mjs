import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'screenshots/before');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'home-375', width: 375, height: 812 },
  { name: 'home-768', width: 768, height: 1024 },
  { name: 'home-1440', width: 1440, height: 900 },
];

async function capture() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Full page screenshot
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}-full.png`), fullPage: true });

    // Section specific screenshot (Chapter System if present)
    const section = await page.$('#three-part-system, [data-section="three-part-system"], section:has-text("Three-Part")');
    if (section) {
      await section.screenshot({ path: path.join(OUTPUT_DIR, `${vp.name}-chapter-system.png`) });
    }

    console.log(`✓ Captured ${vp.name}`);
    await page.close();
  }

  await browser.close();
  console.log('Done capturing before screenshots.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
