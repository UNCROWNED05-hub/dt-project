import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/cybersecurity', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const btn = document.querySelector('button.bg-accent');
    if (!btn) return 'No button.bg-accent found';
    
    // Check matched rules
    const sheets = Array.from(document.styleSheets);
    const matched = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (btn.matches(rule.selectorText)) {
            matched.push({ selector: rule.selectorText, cssText: rule.cssText });
          }
        }
      } catch (e) {}
    }

    const comp = window.getComputedStyle(btn);
    // Find all rules that match btn and define color
    const colorRules = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of sheet.cssRules) {
          if (btn.matches(rule.selectorText) && rule.style.color) {
            colorRules.push({ selector: rule.selectorText, color: rule.style.color });
          }
        }
      } catch (e) {}
    }

    return {
      classes: btn.className,
      color: comp.color,
      colorRules,
    };
  });

  console.log('Button info:', info);
  await browser.close();
}

main();
