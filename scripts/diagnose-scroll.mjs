import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const b = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:3000/cybersecurity', { waitUntil: 'networkidle' });

  await p.evaluate(() => {
    document.documentElement.style.overflowX = 'clip';
    document.body.style.overflowX = 'clip';
  });

  const debug = await p.evaluate(() => {
    const el = document.getElementById('advanced');
    const n = document.querySelector('nav[aria-label="Curriculum Tiers"]');
    return {
      initialScrollY: window.scrollY,
      advRect: el ? el.getBoundingClientRect() : null,
      navRect: n ? n.getBoundingClientRect() : null,
    };
  });
  console.log('Initial positions:', debug);

  await b.close();
}

main();
