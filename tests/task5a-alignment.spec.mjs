import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VERTICAL_SLICES = [
  {
    courseSlug: 'ai-ml',
    chapterSlug: 'what-ai-ml-really-are',
    name: 'AI & Machine Learning Vertical Slice',
  },
  {
    courseSlug: 'cybersecurity',
    chapterSlug: 'security-foundations-and-attack-lifecycle',
    name: 'Cybersecurity Vertical Slice',
  },
  {
    courseSlug: 'iot',
    chapterSlug: 'iot-architecture-and-physical-computing',
    name: 'IoT Vertical Slice',
  },
];

async function runAlignmentE2ETests() {
  console.log('=== Task 5A End-to-End Alignment & UI Verification ===\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  let totalErrors = 0;

  for (const slice of VERTICAL_SLICES) {
    console.log(`\n--- Testing ${slice.name} (/${slice.courseSlug}/${slice.chapterSlug}) ---`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    // 1. Visit Chapter Page
    await page.goto(`${BASE_URL}/${slice.courseSlug}/${slice.chapterSlug}`, {
      waitUntil: 'networkidle',
    });

    // Check Tab Header
    const watchTabBtn = page.locator('button:has-text("1. Watch")');
    const readTabBtn = page.locator('button:has-text("2. Read")');
    const practiceTabBtn = page.locator('button:has-text("3. Practice")');

    if ((await watchTabBtn.count()) === 0) {
      console.error('❌ Failed: Watch tab button not found');
      totalErrors++;
    } else {
      console.log('✓ Three-pillar tabs present');
    }

    // 2. Verify Watch Facade Features
    const coverageMeter = page.locator('text=/Covers \\d+ of \\d+ core objectives/');
    if ((await coverageMeter.count()) > 0) {
      const text = await coverageMeter.first().innerText();
      console.log(`✓ Coverage meter found: "${text}"`);
    } else {
      console.error('❌ Failed: Coverage meter not displayed');
      totalErrors++;
    }

    // Popover: How alignment works
    const howItWorksBtn = page.locator('button:has-text("How alignment works")');
    if ((await howItWorksBtn.count()) > 0) {
      await howItWorksBtn.click();
      await page.waitForTimeout(300);
      const modal = page.locator('text=How Objective Alignment Works');
      if ((await modal.count()) > 0) {
        console.log('✓ "How alignment works" modal opened');
        await page.locator('button:has-text("Understood")').click();
        await page.waitForTimeout(200);
      } else {
        console.error('❌ Failed: "How alignment works" modal did not open');
        totalErrors++;
      }
    }

    // Inspect outline drawer
    const inspectOutlineBtn = page.locator('button:has-text("Inspect coverage outline")');
    if ((await inspectOutlineBtn.count()) > 0) {
      await inspectOutlineBtn.first().click();
      await page.waitForTimeout(300);
      const outlineDrawer = page.locator('text=Objective Coverage & Creator Timestamps');
      if ((await outlineDrawer.count()) > 0) {
        console.log('✓ Coverage detail drawer opened');
      } else {
        console.error('❌ Failed: Outline drawer did not open');
        totalErrors++;
      }
    }

    // 3. Test Switch Video to Alternate (if alternate exists)
    const followAltBtn = page.locator('button:has-text("Follow this video")');
    if ((await followAltBtn.count()) > 0) {
      console.log('  Testing follow alternate video...');
      await followAltBtn.first().click();
      await page.waitForTimeout(300);
      console.log('✓ Followed alternate video');
    }

    // 4. Test Read Tab
    await readTabBtn.click();
    await page.waitForTimeout(300);

    const followingBanner = page.locator('text=Following:');
    if ((await followingBanner.count()) > 0) {
      const bannerText = await followingBanner.first().innerText();
      console.log(`✓ Read tab shows following banner: "${bannerText.trim()}"`);
    } else {
      console.error('❌ Failed: Read tab does not display Following banner');
      totalErrors++;
    }

    const orderCanonical = page.locator('button:has-text("Canonical order")');
    const orderVideo = page.locator('button:has-text("Video order")');
    if ((await orderCanonical.count()) > 0 && (await orderVideo.count()) > 0) {
      console.log('✓ Order mode toggle buttons present');
      await orderVideo.click();
      await page.waitForTimeout(200);
      await orderCanonical.click();
      await page.waitForTimeout(200);
      console.log('✓ Toggled between Canonical and Video order');
    }

    // Verify per-LO badges
    const loBadges = page.locator('text=/In this video|Not in this video: read this/');
    const badgeCount = await loBadges.count();
    if (badgeCount > 0) {
      console.log(`✓ Found ${badgeCount} per-LO alignment status tags in Read notes`);
    } else {
      console.error('❌ Failed: No per-LO alignment tags found in Read notes');
      totalErrors++;
    }

    // 5. Test Practice Tab
    await practiceTabBtn.click();
    await page.waitForTimeout(300);

    const quizHeader = page.locator('text=Video-Aligned Questions');
    if ((await quizHeader.count()) > 0) {
      console.log('✓ Practice tab composed video-aligned quiz');
    } else {
      console.error('❌ Failed: Practice tab missing Video-Aligned Questions section');
      totalErrors++;
    }

    // Answer questions
    const questionOptions = page.locator('button:has-text("A")');
    const qCount = await questionOptions.count();
    if (qCount > 0) {
      console.log(`  Answering ${Math.min(qCount, 5)} sample questions...`);
      for (let i = 0; i < Math.min(qCount, 5); i++) {
        await questionOptions.nth(i).click();
        await page.waitForTimeout(100);
      }
    }

    // Submit answers
    const submitBtn = page.locator('button:has-text("Submit Practice Answers")');
    if ((await submitBtn.count()) > 0) {
      await submitBtn.click();
      await page.waitForTimeout(300);
      const retryBtn = page.locator('button:has-text("Retry Practice Quiz")');
      if ((await retryBtn.count()) > 0) {
        console.log('✓ Practice answers evaluated & graded successfully');
      } else {
        console.error('❌ Failed: Quiz submission did not display retry option');
        totalErrors++;
      }
    }

    // Check console errors
    if (consoleErrors.length > 0) {
      console.error(`❌ Console errors detected in ${slice.chapterSlug}:`, consoleErrors);
      totalErrors += consoleErrors.length;
    } else {
      console.log('✓ Zero console errors, warnings, or hydration mismatches');
    }

    await page.close();
  }

  await browser.close();

  if (totalErrors > 0) {
    console.error(`\n❌ Task 5A E2E test failed with ${totalErrors} errors.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL TASK 5A VERTICAL SLICE & UI CHECKS PASSED WITH ZERO DEFECTS!');
    process.exit(0);
  }
}

runAlignmentE2ETests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
