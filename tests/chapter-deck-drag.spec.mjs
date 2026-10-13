import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function runDragTests() {
  console.log('=== Automated Test Suite: 3D Deck Pointer Drag & Touch Swiping ===\n');

  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  // 1. Desktop Mouse Drag (1440px)
  {
    console.log('1. Testing Desktop Pointer Drag (1440px)...');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    const section = await page.$('#how-it-works');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const stage = await page.$('#how-it-works div[style*="perspective"]');
    if (!stage) throw new Error('Deck stage not found');
    const box = await stage.boundingBox();
    if (!box) throw new Error('Stage bounding box not available');

    // Drag Left by 120px (> 48px threshold) from Watch -> Read
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Move across several steps
    await page.mouse.move(startX - 60, startY, { steps: 5 });
    await page.mouse.move(startX - 120, startY, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(800);

    const readSelected = await (await page.$('#tab-read')).getAttribute('aria-selected');
    if (readSelected !== 'true') throw new Error('Mouse drag left (120px) did not advance deck to Read');
    console.log('   ✓ Mouse drag left (120px) advanced deck from Watch to Read');

    // Drag Right by 120px (> 48px threshold) from Read -> Watch
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY, { steps: 5 });
    await page.mouse.move(startX + 120, startY, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(800);

    const watchSelected = await (await page.$('#tab-watch')).getAttribute('aria-selected');
    if (watchSelected !== 'true') throw new Error('Mouse drag right (120px) did not move deck back to Watch');
    console.log('   ✓ Mouse drag right (120px) moved deck back to Watch');

    // Short drag (20px < 48px threshold, slow speed) -> springs back
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.waitForTimeout(50);
    await page.mouse.move(startX - 20, startY, { steps: 5 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(800);

    const stillWatch = await (await page.$('#tab-watch')).getAttribute('aria-selected');
    if (stillWatch !== 'true') throw new Error('Short drag (20px) should have sprung back to Watch');
    console.log('   ✓ Short drag (20px) correctly sprung back to current card');

    await page.close();
  }

  // 2. Mobile Touch Swiping (375px)
  {
    console.log('\n2. Testing Mobile Touch Context (375px)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await mobileContext.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    const section = await page.$('#how-it-works');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const stage = await page.$('#how-it-works div[style*="perspective"]');
    const box = await stage.boundingBox();
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Simulate mobile swipe using CDP touch events
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y: startY }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: startX - 50, y: startY }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: startX - 100, y: startY }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await page.waitForTimeout(800);

    const readSelectedMobile = await (await page.$('#tab-read')).getAttribute('aria-selected');
    if (readSelectedMobile !== 'true') {
      throw new Error('Mobile touch swipe did not advance deck to Read');
    }
    console.log('   ✓ Mobile touch swipe advanced deck from Watch to Read');

    await mobileContext.close();
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 ALL DRAG & TOUCH SWIPING ASSERTIONS PASSED!');
  console.log('======================================================\n');
}

runDragTests().catch((err) => {
  console.error('❌ Drag test failed:', err);
  process.exit(1);
});
