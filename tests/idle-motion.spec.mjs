import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const PAGES_TO_TEST = ['/', '/ai-ml', '/cybersecurity', '/iot', '/my-desk'];
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-375', width: 375, height: 667 },
];

// MOTION_AUDIT.md allow-list for infinite animations
const ALLOWED_INFINITE_ANIMATIONS = ['hero-ribbon-sway'];

async function runIdleTest() {
  console.log('=== Automated Idle Motion & Manual-Only Policy Test ===\n');
  console.log('Rule: 0 text changes, 0 aria state changes over 20 seconds of zero user input.\n');

  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  for (const pagePath of PAGES_TO_TEST) {
    for (const vp of VIEWPORTS) {
      console.log(`Testing ${pagePath} @ ${vp.name}...`);
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' });

      // Scroll through the page so any intersection/entrance triggers activate
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      // Wait 3s so one-time entrance transitions complete
      console.log('  Waiting 3s for entrance transitions to settle...');
      await page.waitForTimeout(3000);

      // Check document.getAnimations() for infinite iterations
      const infiniteAnimations = await page.evaluate(() => {
        const anims = document.getAnimations();
        const flagged = [];
        anims.forEach((a) => {
          const timing = a.effect?.getTiming ? a.effect.getTiming() : null;
          if (timing && (timing.iterations === Infinity || timing.iterations === -1)) {
            const name = a.animationName || (a.effect?.target ? a.effect.target.className : 'unknown');
            flagged.push(name);
          }
        });
        return flagged;
      });

      const disallowedAnims = infiniteAnimations.filter(
        (name) => !ALLOWED_INFINITE_ANIMATIONS.some((allowed) => name.includes(allowed))
      );

      if (disallowedAnims.length > 0) {
        throw new Error(
          `Disallowed infinite animations detected on ${pagePath} @ ${vp.name}: ${JSON.stringify(
            disallowedAnims
          )}`
        );
      }
      console.log('  ✓ Infinite animations check: 0 disallowed infinite animations');

      // Take Baseline snapshot
      const baseline = await page.evaluate(() => {
        const text = document.body.innerText;
        const ariaSelected = Array.from(document.querySelectorAll('[aria-selected]')).map((el) => ({
          tag: el.tagName,
          id: el.id,
          val: el.getAttribute('aria-selected'),
        }));
        const ariaCurrent = Array.from(document.querySelectorAll('[aria-current]')).map((el) => ({
          tag: el.tagName,
          id: el.id,
          val: el.getAttribute('aria-current'),
        }));
        return { text, ariaSelected, ariaCurrent };
      });

      // Make NO input for 20 seconds
      console.log('  Waiting 20 seconds with ZERO input (Idle period)...');
      await page.waitForTimeout(20000);

      // Take Post-Idle snapshot
      const postIdle = await page.evaluate(() => {
        const text = document.body.innerText;
        const ariaSelected = Array.from(document.querySelectorAll('[aria-selected]')).map((el) => ({
          tag: el.tagName,
          id: el.id,
          val: el.getAttribute('aria-selected'),
        }));
        const ariaCurrent = Array.from(document.querySelectorAll('[aria-current]')).map((el) => ({
          tag: el.tagName,
          id: el.id,
          val: el.getAttribute('aria-current'),
        }));
        return { text, ariaSelected, ariaCurrent };
      });

      // Assert zero text changes
      if (baseline.text !== postIdle.text) {
        throw new Error(`Visible text changed autonomously during idle period on ${pagePath} @ ${vp.name}!`);
      }
      console.log('  ✓ 0 text changes over 20s idle');

      // Assert zero aria-selected changes
      if (JSON.stringify(baseline.ariaSelected) !== JSON.stringify(postIdle.ariaSelected)) {
        throw new Error(
          `aria-selected state changed autonomously during idle on ${pagePath} @ ${vp.name}! Expected ${JSON.stringify(
            baseline.ariaSelected
          )} but got ${JSON.stringify(postIdle.ariaSelected)}`
        );
      }
      console.log('  ✓ 0 aria-selected state changes over 20s idle');

      // Assert zero aria-current changes
      if (JSON.stringify(baseline.ariaCurrent) !== JSON.stringify(postIdle.ariaCurrent)) {
        throw new Error(
          `aria-current state changed autonomously during idle on ${pagePath} @ ${vp.name}!`
        );
      }
      console.log('  ✓ 0 aria-current state changes over 20s idle');

      await page.close();
    }
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 IDLE MOTION POLICY AUDIT PASSED 100%!');
  console.log('Zero unsolicited content changes across the entire site.');
  console.log('======================================================\n');
}

runIdleTest().catch((err) => {
  console.error('❌ Idle test failed:', err);
  process.exit(1);
});
