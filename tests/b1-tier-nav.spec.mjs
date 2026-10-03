import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testB1() {
  console.log('Testing Bug B1 (Tier Navigation)...\n');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/cybersecurity', { waitUntil: 'networkidle' });

  // Find the tier button for Advanced
  const advBtn = page.locator('button:has-text("Advanced Tier"), a[href="#advanced"]');
  if (!(await advBtn.count())) {
    throw new Error('Advanced tier navigation trigger not found');
  }

  const initialScrollY = await page.evaluate(() => window.scrollY);

  // Click Advanced Tier
  await advBtn.first().click();
  await page.waitForTimeout(500);

  const newScrollY = await page.evaluate(() => window.scrollY);
  const hash = await page.evaluate(() => window.location.hash);
  const advHeading = page.locator('#advanced');
  const hasAdvId = (await advHeading.count()) > 0;

  console.log(`Initial Scroll Y: ${initialScrollY}`);
  console.log(`New Scroll Y: ${newScrollY}`);
  console.log(`URL Hash: "${hash}"`);
  console.log(`Has #advanced section element: ${hasAdvId}`);

  let failed = false;
  const failureReasons = [];

  // Check 1: Did page scroll down to Advanced tier?
  if (newScrollY <= initialScrollY + 50) {
    failed = true;
    failureReasons.push(`Page did NOT scroll to Advanced tier (scrollY remained ${newScrollY})`);
  }

  // Check 2: Did the URL hash update to #advanced?
  if (hash !== '#advanced') {
    failed = true;
    failureReasons.push(`URL hash was not updated to #advanced (current hash: "${hash}")`);
  }

  // Check 3: Does the section have id="advanced"?
  if (!hasAdvId) {
    failed = true;
    failureReasons.push('Target section does not have id="advanced" for anchor navigation');
  }

  await browser.close();

  if (failed) {
    console.error('\n❌ B1 Reproduction Confirmed! Failures:');
    failureReasons.forEach((r) => console.error(`  - ${r}`));
    process.exit(1);
  } else {
    console.log('\n✓ B1 Tier Navigation passed!');
    process.exit(0);
  }
}

testB1().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
