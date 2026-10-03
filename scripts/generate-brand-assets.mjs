import { chromium } from 'playwright-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();

  // 1. Apple Touch Icon (180x180)
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`
    <style>
      body { margin: 0; background: #17161A; display: flex; align-items: center; justify-content: center; width: 180px; height: 180px; overflow: hidden; }
      svg { width: 110px; height: 110px; }
    </style>
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 7 L16 26 L26 7" stroke="#FAF6EF" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10 7 L16 19 L22 7" stroke="#FAF6EF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.45" />
      <circle cx="16" cy="26" r="2" fill="#D97706" />
      <line x1="6" y1="7" x2="26" y2="7" stroke="rgba(250,246,239,0.3)" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  `);
  await page.screenshot({ path: path.resolve('public/apple-touch-icon.png') });
  console.log('✓ Generated public/apple-touch-icon.png');

  // 2. 32px PNG Favicon
  await page.setViewportSize({ width: 32, height: 32 });
  await page.setContent(`
    <style>
      body { margin: 0; background: #17161A; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; overflow: hidden; }
      svg { width: 22px; height: 22px; }
    </style>
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 7 L16 26 L26 7" stroke="#FAF6EF" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="16" cy="26" r="2" fill="#D97706" />
    </svg>
  `);
  await page.screenshot({ path: path.resolve('public/favicon-32x32.png') });
  console.log('✓ Generated public/favicon-32x32.png');

  // 3. OpenGraph Social Image (1200x630)
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=Instrument+Sans:wght@500;600&family=JetBrains+Mono:wght@600&display=swap');
      body {
        margin: 0;
        width: 1200px;
        height: 630px;
        background: #F3EEE6;
        color: #17161A;
        font-family: 'Instrument Sans', sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 80px;
        box-sizing: border-box;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 6px 14px;
        background: #FAF6EF;
        border: 1px solid rgba(23, 22, 26, 0.15);
        border-radius: 999px;
        width: fit-content;
      }
      .dot { width: 8px; height: 8px; border-radius: 50%; background: #D97706; }
      h1 {
        font-family: 'Bricolage Grotesque', sans-serif;
        font-size: 72px;
        line-height: 0.95;
        font-weight: 800;
        margin: 24px 0 16px 0;
        letter-spacing: -0.03em;
      }
      p {
        font-size: 24px;
        color: #5B5761;
        max-width: 800px;
        line-height: 1.4;
        margin: 0;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(23, 22, 26, 0.15);
        padding-top: 32px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        color: #5B5761;
      }
      .logo-row { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #17161A; }
    </style>
    <div>
      <div class="badge"><span class="dot"></span> Open Technical Library • CC BY-SA 4.0</div>
      <h1>Stop hoarding tabs.<br>Start learning.</h1>
      <p>Master AI & Machine Learning, Cybersecurity, and IoT from first principles—guided by auto-ranked YouTube lectures, verified notes, and scenario quizzes.</p>
    </div>
    <div class="footer">
      <div class="logo-row">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M6 7 L16 26 L26 7" stroke="#17161A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="16" cy="26" r="2" fill="#D97706"/>
        </svg>
        <span>VELLUM LIBRARY</span>
      </div>
      <div>3 TRACKS • 31 CHAPTERS • ZERO ADS</div>
    </div>
  `);
  await page.screenshot({ path: path.resolve('public/og-image.png') });
  console.log('✓ Generated public/og-image.png');

  await browser.close();
  console.log('\nAll brand identity assets generated successfully!');
}

main().catch(console.error);
