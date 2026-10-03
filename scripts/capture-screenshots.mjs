import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public/screenshots/before');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '375px', width: 375, height: 667 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1440px', width: 1440, height: 900 },
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'course-ai', path: '/ai-ml' },
  { name: 'course-cyber', path: '/cybersecurity' },
  { name: 'course-iot', path: '/iot' },
  { name: 'chapter-cyber-watch', path: '/cybersecurity/security-foundations-and-attack-lifecycle', tab: 'watch' },
  { name: 'chapter-cyber-read', path: '/cybersecurity/security-foundations-and-attack-lifecycle', tab: 'read' },
  { name: 'chapter-cyber-practice', path: '/cybersecurity/security-foundations-and-attack-lifecycle', tab: 'practice' },
  { name: 'my-desk', path: '/my-desk' },
];

async function main() {
  console.log('Capturing "before" screenshots at 375px, 768px, and 1440px ...\n');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const p of PAGES) {
      const url = `http://localhost:3000${p.path}`;
      await page.goto(url, { waitUntil: 'networkidle' });

      if (p.tab === 'read') {
        const readBtn = page.locator('button:has-text("2. Read")');
        if (await readBtn.count()) await readBtn.click();
        await page.waitForTimeout(200);
      } else if (p.tab === 'practice') {
        const pracBtn = page.locator('button:has-text("3. Practice")');
        if (await pracBtn.count()) await pracBtn.click();
        await page.waitForTimeout(200);
      }

      const filename = `${p.name}-${vp.name}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: filepath, fullPage: false });
      console.log(`✓ Saved ${filename}`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\nAll before screenshots captured in public/screenshots/before/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
