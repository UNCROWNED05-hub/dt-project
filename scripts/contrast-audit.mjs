import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const TEST_ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Course AI', path: '/ai-ml' },
  { name: 'Course Cyber', path: '/cybersecurity' },
  { name: 'Course IoT', path: '/iot' },
  { name: 'Chapter Cyber (Watch)', path: '/cybersecurity/security-foundations-and-attack-lifecycle', tab: 'watch' },
  { name: 'Chapter Cyber (Read)', path: '/cybersecurity/security-foundations-and-attack-lifecycle', tab: 'read' },
  { name: 'Chapter Cyber (Practice)', path: '/cybersecurity/security-foundations-and-attack-lifecycle', tab: 'practice' },
  { name: 'Chapter AI (Read)', path: '/ai-ml/what-ai-ml-really-are', tab: 'read' },
  { name: 'Chapter IoT (Read)', path: '/iot/iot-architecture-and-physical-computing', tab: 'read' },
  { name: 'My Desk', path: '/my-desk' },
  { name: 'Search Modal', path: '/', openSearch: true },
  { name: '404 Page', path: '/non-existent-page-slug' },
];

async function main() {
  console.log('=== Automated WCAG 2.2 AA Contrast Audit Engine ===\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  let totalElementsChecked = 0;
  let totalFailures = 0;
  const failureLog = [];

  for (const route of TEST_ROUTES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:3000${route.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);

    if (route.tab === 'read') {
      const btn = page.locator('button:has-text("2. Read")');
      if (await btn.count()) await btn.click();
      await page.waitForTimeout(300);
    } else if (route.tab === 'practice') {
      const btn = page.locator('button:has-text("3. Practice")');
      if (await btn.count()) await btn.click();
      await page.waitForTimeout(300);
    } else if (route.openSearch) {
      await page.keyboard.press('Control+k');
      await page.waitForTimeout(300);
    }

    // Evaluate in page context
    const results = await page.evaluate(() => {
      function parseColor(str) {
        if (!str || str === 'transparent' || str === 'inherit') return null;
        const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!match) return null;
        return {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10),
          a: match[4] !== undefined ? parseFloat(match[4]) : 1.0,
        };
      }

      function blend(top, bottom) {
        const a = top.a + bottom.a * (1 - top.a);
        if (a === 0) return { r: 255, g: 255, b: 255, a: 1 };
        const r = Math.round((top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / a);
        const g = Math.round((top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / a);
        const b = Math.round((top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / a);
        return { r, g, b, a };
      }

      function getEffectiveBackground(el) {
        let current = el;
        let color = { r: 255, g: 255, b: 255, a: 0 }; // default empty

        while (current && current !== document.documentElement) {
          const style = window.getComputedStyle(current);
          const bg = parseColor(style.backgroundColor);
          if (bg && bg.a > 0) {
            color = blend(color, bg);
            if (color.a >= 0.99) break;
          }
          current = current.parentElement;
        }

        // If still transparent, check root html / body
        if (color.a < 0.99) {
          const bodyBg = parseColor(window.getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
          color = blend(color, bodyBg);
        }

        return color;
      }

      function getLuminance(c) {
        const a = [c.r, c.g, c.b].map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function getContrast(fg, bg) {
        const l1 = getLuminance(fg);
        const l2 = getLuminance(bg);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      const issues = [];
      const textNodes = [];

      // Collect elements containing direct text
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent) continue;
        const text = node.textContent?.trim();
        if (!text || text.length < 2) continue;

        // Skip non-visible
        const rect = parent.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const style = window.getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

        const fg = parseColor(style.color);
        if (!fg) continue;

        const bg = getEffectiveBackground(parent);
        const ratio = getContrast(fg, bg);

        // Large text definition: >= 24px (18pt) or >= 18.66px (14pt) bold
        const fontSize = parseFloat(style.fontSize);
        const isBold = parseInt(style.fontWeight, 10) >= 700 || style.fontWeight === 'bold';
        const isLarge = fontSize >= 24 || (fontSize >= 18.66 && isBold);
        const threshold = isLarge ? 3.0 : 4.5;

        textNodes.push({ text: text.slice(0, 30), ratio });

        if (ratio < threshold) {
          issues.push({
            selector: `${parent.tagName.toLowerCase()}.${parent.className.split(' ').slice(0, 2).join('.')}`,
            text: text.slice(0, 40),
            fontSize: `${fontSize}px`,
            fg: `rgb(${fg.r},${fg.g},${fg.b})`,
            bg: `rgb(${bg.r},${bg.g},${bg.b})`,
            ratio: ratio.toFixed(2),
            threshold,
          });
        }
      }

      return { total: textNodes.length, issues };
    });

    totalElementsChecked += results.total;
    if (results.issues.length > 0) {
      totalFailures += results.issues.length;
      console.log(`❌ ${route.name}: Found ${results.issues.length} contrast failures`);
      results.issues.slice(0, 5).forEach((iss) => {
        console.log(`   [${iss.ratio}:1 < ${iss.threshold}:1] "${iss.text}" on ${iss.selector} | FG: ${iss.fg} vs BG: ${iss.bg}`);
      });
      failureLog.push({ route: route.name, issues: results.issues });
    } else {
      console.log(`✓ ${route.name}: All ${results.total} text nodes passed WCAG AA!`);
    }

    await page.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`Total Text Elements Audited: ${totalElementsChecked}`);
  console.log(`Total Failures: ${totalFailures}`);
  console.log(`======================================================\n`);

  if (totalFailures > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
