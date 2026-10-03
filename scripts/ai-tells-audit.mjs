import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-375', width: 375, height: 667 },
];

const DEFAULT_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Course AI', path: '/ai-ml' },
  { name: 'Course Cyber', path: '/cybersecurity' },
  { name: 'Course IoT', path: '/iot' },
  { name: 'My Desk', path: '/my-desk' },
];

export async function runAiTellsAudit(options = {}) {
  const enforceGate = options.enforceGate || false;
  const targetPages = options.pages || DEFAULT_PAGES;

  console.log('=== AI-Tells Audit Engine ===');
  console.log(`Auditing ${targetPages.length} pages across 3 viewports...\n`);

  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const results = [];
  let gateFailed = false;

  for (const pageDef of targetPages) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(`http://localhost:3000${pageDef.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      // Measure total scroll height
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const viewportHeight = vp.height;
      const steps = Math.ceil(scrollHeight / viewportHeight);

      let maxMonoInViewport = 0;
      let maxPillsInViewport = 0;
      let serifItalicCount = 0;

      // Count total serif-italic on page
      serifItalicCount = await page.evaluate(() => {
        const italicEls = document.querySelectorAll('.font-accent, [class*="italic"]');
        let visibleCount = 0;
        italicEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
            visibleCount++;
          }
        });
        return visibleCount;
      });

      for (let s = 0; s < steps; s++) {
        const scrollY = s * viewportHeight;
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(100);

        const metrics = await page.evaluate(({ vpHeight }) => {
          function isInView(el) {
            const rect = el.getBoundingClientRect();
            return (
              rect.top < vpHeight &&
              rect.bottom > 0 &&
              rect.width > 0 &&
              rect.height > 0 &&
              window.getComputedStyle(el).display !== 'none' &&
              window.getComputedStyle(el).visibility !== 'hidden'
            );
          }

          // 1. Uppercase mono labels (excluding buttons and nav items)
          const allElements = Array.from(document.querySelectorAll('*'));
          let monoCount = 0;
          let pillCount = 0;

          for (const el of allElements) {
            if (!isInView(el)) continue;
            const style = window.getComputedStyle(el);
            const isButtonOrNav = el.closest('button, nav, a, [role="button"]');

            // Uppercase mono
            const isMono = style.fontFamily.includes('Mono') || el.classList.contains('font-mono');
            const isUpper = style.textTransform === 'uppercase' || (el.textContent && el.textContent === el.textContent.toUpperCase() && /[A-Z]/.test(el.textContent));
            const isDirectTextNode = Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 1);

            if (isMono && isUpper && isDirectTextNode && !isButtonOrNav) {
              monoCount++;
            }

            // Pill-shaped chips (excluding buttons & nav)
            const isPill = el.classList.contains('rounded-pill') || (parseInt(style.borderRadius, 10) >= 999);
            if (isPill && !isButtonOrNav) {
              pillCount++;
            }
          }

          return { monoCount, pillCount };
        }, { vpHeight: viewportHeight });

        if (metrics.monoCount > maxMonoInViewport) maxMonoInViewport = metrics.monoCount;
        if (metrics.pillCount > maxPillsInViewport) maxPillsInViewport = metrics.pillCount;
      }

      await page.close();

      const passMono = maxMonoInViewport <= 3;
      const passPills = maxPillsInViewport <= 4;
      const passSerif = serifItalicCount <= 1;
      const isPass = passMono && passPills && passSerif;

      if (!isPass && enforceGate) {
        gateFailed = true;
      }

      results.push({
        page: pageDef.name,
        viewport: vp.name,
        maxMonoInViewport,
        maxPillsInViewport,
        serifItalicCount,
        pass: isPass,
      });

      console.log(`[${pageDef.name} @ ${vp.name}]`);
      console.log(`  - Max Uppercase Mono Labels in view: ${maxMonoInViewport} (limit: 3) ${passMono ? '✓' : '⚠️'}`);
      console.log(`  - Max Pill Chips in view: ${maxPillsInViewport} (limit: 4) ${passPills ? '✓' : '⚠️'}`);
      console.log(`  - Page Serif-Italic Accents: ${serifItalicCount} (limit: 1) ${passSerif ? '✓' : '⚠️'}`);
    }
  }

  await browser.close();

  console.log('\n=== Summary of AI-Tells Audit ===');
  console.table(results);

  if (enforceGate && gateFailed) {
    console.error('\n❌ Gate Failed: AI-tells exceeded limits on one or more gated pages.');
    process.exit(1);
  }

  return results;
}

// Direct execution from CLI
const isDirectCall = process.argv[1]?.endsWith('ai-tells-audit.mjs');
if (isDirectCall) {
  const enforce = process.argv.includes('--enforce');
  runAiTellsAudit({ enforceGate: enforce }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
