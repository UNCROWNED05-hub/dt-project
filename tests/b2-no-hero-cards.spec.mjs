import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testB2() {
  console.log('Testing Bug B2 (No floating/tilted CANONICAL LEDGER cards on hero)...\n');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // 1. Check DOM on Home page for "CANONICAL LEDGER"
  const textMatches = await page.locator(':has-text("CANONICAL LEDGER")').count();

  // 2. Check for floating tilted cards in the hero container
  const heroTiltedCards = await page.evaluate(() => {
    const hero = document.querySelector('section');
    if (!hero) return 0;
    const tilted = hero.querySelectorAll('[class*="rotate-"], [class*="-rotate-"]');
    return tilted.length;
  });

  // 3. Search codebase for "CANONICAL LEDGER"
  const srcFiles = ['src/app/page.tsx', 'src/components/layout/Navbar.tsx'];
  let codeMentions = 0;
  for (const f of srcFiles) {
    const fullPath = path.resolve(f);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('CANONICAL LEDGER')) {
        codeMentions++;
      }
    }
  }

  await browser.close();

  console.log(`DOM text instances of "CANONICAL LEDGER": ${textMatches}`);
  console.log(`Hero tilted/floating card elements: ${heroTiltedCards}`);
  console.log(`Code occurrences of "CANONICAL LEDGER": ${codeMentions}`);

  if (textMatches > 0 || heroTiltedCards > 0 || codeMentions > 0) {
    console.error('\n❌ B2 Reproduction Confirmed: "CANONICAL LEDGER" or tilted hero cards are present!');
    process.exit(1);
  } else {
    console.log('\n✓ B2 Passed: No CANONICAL LEDGER or tilted hero cards found.');
    process.exit(0);
  }
}

testB2().catch((err) => {
  console.error(err);
  process.exit(1);
});
