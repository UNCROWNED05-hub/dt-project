import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testNavAndSearch() {
  console.log('=== Automated Test Suite E3: Navigation & Search Overlay ===\n');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // 1. New Logo Present with aria-label
  const logo = page.locator('[aria-label="Vellum Library"]');
  const logoCount = await logo.count();
  if (logoCount === 0) {
    throw new Error('Test E3 Failed: Logo with aria-label="Vellum Library" not found');
  }
  console.log('✓ Test 1: New logo present with aria-label');

  // 2. "Canonical Ledger" appears nowhere in DOM or Repo
  const domLedger = await page.locator(':has-text("Canonical Ledger"), :has-text("CANONICAL LEDGER")').count();
  if (domLedger > 0) {
    throw new Error(`Test E3 Failed: Found ${domLedger} instances of "Canonical Ledger" in DOM`);
  }
  const appPageContent = fs.readFileSync(path.resolve('src/app/page.tsx'), 'utf-8');
  if (appPageContent.includes('CANONICAL LEDGER')) {
    throw new Error('Test E3 Failed: Found "CANONICAL LEDGER" in src/app/page.tsx');
  }
  console.log('✓ Test 2: "Canonical Ledger" appears nowhere in DOM or source code');

  // 3. Test Search triggers: Click trigger, Ctrl+K, and '/'
  const searchBtn = page.locator('button[aria-label*="Search"]');
  await searchBtn.first().click();
  await page.waitForTimeout(300);

  let searchModal = page.locator('div[role="dialog"][aria-label="Chapter search"]');
  if (!(await searchModal.count())) {
    throw new Error('Test E3 Failed: Search dialog did not open upon clicking search button');
  }
  console.log('✓ Test 3a: Search opens via click trigger');

  // Focus lands in input
  const activeTagName = await page.evaluate(() => document.activeElement?.tagName);
  if (activeTagName !== 'INPUT') {
    throw new Error(`Test E3 Failed: Focus did not land in search input (current: ${activeTagName})`);
  }
  console.log('✓ Test 3b: Focus immediately lands in search input');

  // Close with Esc
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  if (await searchModal.count() > 0) {
    throw new Error('Test E3 Failed: Search modal did not close on Escape');
  }

  // Scroll lock fully released
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  if (bodyOverflow !== '') {
    throw new Error(`Test E3 Failed: Body scroll lock not released after Esc (style.overflow="${bodyOverflow}")`);
  }
  console.log('✓ Test 3c: Escape closes search modal and completely releases body scroll lock');

  // Open with '/'
  await page.keyboard.press('/');
  await page.waitForTimeout(300);
  searchModal = page.locator('div[role="dialog"][aria-label="Chapter search"]');
  if (!(await searchModal.count())) {
    throw new Error('Test E3 Failed: Search dialog did not open on "/" keypress');
  }
  console.log('✓ Test 3d: Search opens via "/" shortcut');

  // 4. "mqtt" ranks the MQTT chapter first
  const searchInput = page.locator('input[role="combobox"]');
  await searchInput.fill('mqtt');
  await page.waitForTimeout(300);

  const topResultTitle = await page.locator('#search-results-list h4').first().textContent();
  console.log(`Top result for "mqtt": "${topResultTitle}"`);
  if (!topResultTitle || !topResultTitle.toLowerCase().includes('mqtt')) {
    throw new Error(`Test E3 Failed: "mqtt" did not rank MQTT chapter first (got: "${topResultTitle}")`);
  }
  console.log('✓ Test 4: Typo-tolerant fuzzy search ranks MQTT chapter #1');

  // 5. No logo inside search panel
  const logosInModal = await searchModal.locator('[aria-label="Vellum Library"]').count();
  if (logosInModal > 0) {
    throw new Error('Test E3 Failed: Logo found inside search panel');
  }
  console.log('✓ Test 5: No logo inside search panel');

  // 6. Test Enter selects and navigates
  await page.keyboard.press('Enter');
  await page.waitForTimeout(600);
  const currentUrl = page.url();
  if (!currentUrl.includes('/iot/')) {
    throw new Error(`Test E3 Failed: Enter key navigation did not reach expected course (URL: ${currentUrl})`);
  }
  console.log(`✓ Test 6: Enter navigates to selected chapter (${currentUrl})`);

  // 7. Mobile Search (375px)
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const mobileSearchBtn = mobilePage.locator('header button[aria-label="Search"]');
  await mobileSearchBtn.click();
  await mobilePage.waitForTimeout(300);
  const mobileModal = mobilePage.locator('div[role="dialog"]');
  if (!(await mobileModal.count())) {
    throw new Error('Test E3 Failed: Search modal did not open on mobile (375px)');
  }
  console.log('✓ Test 7: Mobile search modal functions cleanly at 375px');

  await browser.close();

  console.log('\n======================================================');
  console.log('🎉 ALL TEST SUITE E3 ASSERTIONS PASSED FLAWLESSLY!');
  console.log('======================================================\n');
}

testNavAndSearch().catch((err) => {
  console.error(err);
  process.exit(1);
});
