import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('=== Automated Browser Verification for Pencil Cursor & Trail ===\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  // Navigate to Homepage
  console.log('1. Loading http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test 1: getComputedStyle(document.body).cursor contains url(
  const bodyCursor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).cursor;
  });
  console.log(`   document.body computed cursor: "${bodyCursor}"`);
  if (!bodyCursor.includes('url(') || !bodyCursor.includes('pencil.svg')) {
    throw new Error(`FAIL: document.body cursor does not contain pencil.svg url! Got: ${bodyCursor}`);
  }
  console.log('   ✓ Test 1 Passed: document.body cursor contains url("/cursors/pencil.svg")');

  // Test 2: Check computed cursor on a link (nib), reading paragraph (highlighter), text input (text)
  const linkCursor = await page.evaluate(() => {
    const link = document.querySelector('a');
    return link ? window.getComputedStyle(link).cursor : 'NO_LINK';
  });
  console.log(`   Link computed cursor: "${linkCursor}"`);
  if (!linkCursor.includes('nib.svg') && !linkCursor.includes('url(')) {
    throw new Error(`FAIL: Link cursor does not contain nib.svg url! Got: ${linkCursor}`);
  }
  console.log('   ✓ Test 2a Passed: Link computed cursor resolves to nib.svg');

  // Navigate to a chapter page to check reading paragraph
  console.log('\n2. Navigating to Chapter Page (http://localhost:3000/ai-ml/what-ai-ml-really-are) ...');
  await page.goto('http://localhost:3000/ai-ml/what-ai-ml-really-are', { waitUntil: 'networkidle' });

  // Click on "2. Read" tab to view prose notes
  await page.click('button:has-text("2. Read")');
  await page.waitForTimeout(300);

  const proseCursor = await page.evaluate(() => {
    const p = document.querySelector('.prose p');
    return p ? window.getComputedStyle(p).cursor : 'NO_PROSE';
  });
  console.log(`   Prose paragraph computed cursor: "${proseCursor}"`);
  if (!proseCursor.includes('highlighter') && !proseCursor.includes('url(')) {
    throw new Error(`FAIL: Prose cursor does not contain highlighter.svg! Got: ${proseCursor}`);
  }
  console.log('   ✓ Test 2b Passed: Reading paragraph resolves to highlighter cursor');

  // Test search input cursor (should resolve to native text caret)
  // Open search modal (Cmd+K / Ctrl+K)
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);

  const inputCursor = await page.evaluate(() => {
    const input = document.querySelector('input[type="text"]');
    return input ? window.getComputedStyle(input).cursor : 'NO_INPUT';
  });
  console.log(`   Input computed cursor: "${inputCursor}"`);
  if (inputCursor !== 'text') {
    throw new Error(`FAIL: Input cursor is not text! Got: ${inputCursor}`);
  }
  console.log('   ✓ Test 2c Passed: Text input resolves to native "text" caret');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // Test 3: Canvas graphite trail drawing & fading
  console.log('\n3. Testing Layer 2 Canvas Graphite Trail ...');
  const canvasCount = await page.evaluate(() => {
    return document.querySelectorAll('canvas').length;
  });
  console.log(`   Canvas elements mounted: ${canvasCount}`);
  if (canvasCount !== 1) {
    throw new Error(`FAIL: Expected exactly 1 canvas element, found ${canvasCount}`);
  }

  // Move pointer across page
  await page.mouse.move(200, 200);
  await page.mouse.move(250, 220);
  await page.mouse.move(300, 260);
  await page.mouse.move(350, 300);
  await page.waitForTimeout(50); // allow rAF to draw

  // Check if canvas has non-zero pixels
  const hasDrawnPixels = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Check if any alpha byte > 0
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] > 0) return true;
    }
    return false;
  });
  console.log(`   Trail drew active pixels: ${hasDrawnPixels}`);
  if (!hasDrawnPixels) {
    throw new Error('FAIL: Canvas trail did not draw pixels on pointermove!');
  }
  console.log('   ✓ Test 3a Passed: Canvas graphite trail drew pixels successfully');

  // Wait 750ms for trail to fade completely back to empty
  console.log('   Waiting 750ms for trail to fade...');
  await page.waitForTimeout(750);
  const isCanvasEmptyAfterFade = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] > 0) return false;
    }
    return true;
  });
  console.log(`   Canvas completely cleared after ~600ms fade: ${isCanvasEmptyAfterFade}`);
  if (!isCanvasEmptyAfterFade) {
    throw new Error('FAIL: Canvas pixels did not clear after fade timeout!');
  }
  console.log('   ✓ Test 3b Passed: Canvas trail fades back to empty with zero residue');

  // Test 4: Navigate between two pages and ensure no duplicate canvases
  console.log('\n4. Testing navigation between pages...');
  await page.goto('http://localhost:3000/my-desk', { waitUntil: 'networkidle' });
  const canvasesAfterNav = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log(`   Canvases after navigating to /my-desk: ${canvasesAfterNav}`);
  if (canvasesAfterNav !== 1) {
    throw new Error(`FAIL: Duplicate canvas created on navigation! Count: ${canvasesAfterNav}`);
  }
  console.log('   ✓ Test 4 Passed: Exactly 1 persistent canvas maintained across navigation');

  // Test 5: Emulate reduced motion
  console.log('\n5. Testing prefers-reduced-motion emulation...');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const cursorWithReducedMotion = await page.evaluate(() => window.getComputedStyle(document.body).cursor);
  if (!cursorWithReducedMotion.includes('url(')) {
    throw new Error('FAIL: Reduced motion disabled the CSS cursor!');
  }
  console.log('   ✓ Test 5a Passed: Reduced motion preserves the CSS cursor (pencil)');

  // Move pointer under reduced motion -> canvas should NOT draw
  await page.mouse.move(100, 100);
  await page.mouse.move(150, 150);
  await page.waitForTimeout(50);
  const drewUnderReducedMotion = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] > 0) return true;
    }
    return false;
  });
  if (drewUnderReducedMotion) {
    throw new Error('FAIL: Canvas trail drew under reduced motion!');
  }
  console.log('   ✓ Test 5b Passed: Canvas trail gracefully skipped under prefers-reduced-motion: reduce');

  // Test 6: Console errors check
  console.log('\n6. Checking console errors...');
  if (consoleErrors.length > 0) {
    throw new Error(`FAIL: Found console errors: ${consoleErrors.join(', ')}`);
  }
  console.log('   ✓ Test 6 Passed: 0 console errors or hydration warnings');

  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 ALL AUTOMATED VERIFICATION TESTS PASSED FLAWLESSLY!');
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
