import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const COURSES = ['/cybersecurity', '/ai-ml', '/iot'];
const TIERS = [
  { name: 'Beginner', slug: 'beginner' },
  { name: 'Intermediate', slug: 'intermediate' },
  { name: 'Advanced', slug: 'advanced' },
];
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-375', width: 375, height: 667 },
];

async function testTierNav() {
  console.log('=== Automated Test Suite E2: Tier Navigation ===\n');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  let totalTests = 0;
  let passedTests = 0;

  for (const coursePath of COURSES) {
    for (const vp of VIEWPORTS) {
      console.log(`Testing Course: ${coursePath} @ ${vp.name}`);
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(`http://localhost:3000${coursePath}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      for (const tier of TIERS) {
        totalTests++;
        // Find tier navigation link
        const linkSelector = `nav[aria-label="Curriculum Tiers"] a[href="#${tier.slug}"]`;
        const link = page.locator(linkSelector);
        
        if (!(await link.count())) {
          console.error(`❌ Link not found for tier ${tier.name}: ${linkSelector}`);
          continue;
        }

        // Click the tier link
        await link.first().click();
        await page.waitForTimeout(1400);

        // Verify URL hash
        const hash = await page.evaluate(() => window.location.hash);
        const hashOk = hash === `#${tier.slug}`;

        // Verify aria-current
        const ariaCurrent = await link.first().getAttribute('aria-current');
        const ariaOk = ariaCurrent === 'page';

        // Verify target heading position relative to sticky nav
        const positionMetrics = await page.evaluate(({ slug }) => {
          const nav = document.querySelector('nav[aria-label="Curriculum Tiers"]');
          const target = document.getElementById(slug);
          if (!nav || !target) return null;
          const navRect = nav.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          return {
            navBottom: navRect.bottom,
            targetTop: targetRect.top,
            distance: targetRect.top - navRect.bottom,
          };
        }, { slug: tier.slug });

        // Target should sit within 24px below sticky bar (per spec E2)
        const distanceOk = positionMetrics && Math.abs(positionMetrics.distance - 16) <= 24;

        if (hashOk && ariaOk && distanceOk) {
          passedTests++;
          console.log(`  ✓ [${tier.name}] Hash: ${hash} | aria-current: ${ariaCurrent} | distance: ${positionMetrics?.distance.toFixed(0)}px`);
        } else {
          console.error(`  ❌ [${tier.name}] Failed: Hash: ${hash} (expected #${tier.slug}), aria-current: ${ariaCurrent}, distance: ${positionMetrics?.distance}`);
        }
      }

      // Test deep linking directly with hash
      totalTests++;
      await page.goto(`http://localhost:3000${coursePath}#advanced`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1600);
      const deepLinkScrollY = await page.evaluate(() => window.scrollY);
      const deepLinkAdvPos = await page.evaluate(() => {
        const adv = document.getElementById('advanced');
        const nav = document.querySelector('nav[aria-label="Curriculum Tiers"]');
        return adv && nav ? adv.getBoundingClientRect().top - nav.getBoundingClientRect().bottom : null;
      });

      if (deepLinkScrollY > 100 && deepLinkAdvPos !== null && Math.abs(deepLinkAdvPos) <= 24) {
        passedTests++;
        console.log(`  ✓ Deep Link #advanced: Scrolled to ${deepLinkScrollY}px (offset: ${deepLinkAdvPos?.toFixed(0)}px)`);
      } else {
        console.error(`  ❌ Deep link #advanced failed: scrollY=${deepLinkScrollY}, offset=${deepLinkAdvPos}`);
      }

      await page.close();
    }
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`E2 Tier Navigation: ${passedTests} / ${totalTests} assertions passed!`);
  console.log(`======================================================\n`);

  if (passedTests < totalTests) {
    process.exit(1);
  }
}

testTierNav().catch((err) => {
  console.error(err);
  process.exit(1);
});
