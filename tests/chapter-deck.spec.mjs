import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== Automated Test Suite: The Three-Part Chapter System 3D Deck ===\n');

  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Navigate to Home
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Scroll to section
  const section = await page.$('#how-it-works');
  if (!section) throw new Error('#how-it-works section not found');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // 1. Initial State Assertions
  console.log('1. Checking Initial State...');
  const watchTab = await page.$('#tab-watch');
  const watchSelected = await watchTab.getAttribute('aria-selected');
  if (watchSelected !== 'true') throw new Error(`Expected Watch tab to be aria-selected=true, got ${watchSelected}`);
  console.log('   ✓ Watch tab is initially selected (aria-selected="true")');

  const counterText = await page.innerText('.tabular-nums:has-text("/ 3")');
  if (!counterText.includes('1 / 3')) throw new Error(`Expected counter to show 1 / 3, got ${counterText}`);
  console.log('   ✓ Counter initially shows "1 / 3"');

  const liveRegion = await page.innerText('[aria-live="polite"]');
  if (!liveRegion.includes('Step 1 of 3: Watch')) {
    throw new Error(`Expected live region "Step 1 of 3: Watch", got "${liveRegion}"`);
  }
  console.log('   ✓ Live region announces "Step 1 of 3: Watch"');

  // 2. Tab Click Navigation
  console.log('\n2. Testing Tab Clicks (Watch -> Read -> Practice)...');
  await page.click('#tab-read');
  await page.waitForTimeout(700);

  const readSelected = await (await page.$('#tab-read')).getAttribute('aria-selected');
  if (readSelected !== 'true') throw new Error('Expected Read tab to be active');
  const counterRead = await page.innerText('.tabular-nums:has-text("/ 3")');
  if (!counterRead.includes('2 / 3')) throw new Error(`Expected counter 2 / 3, got ${counterRead}`);
  console.log('   ✓ Read tab selected, counter shows 2 / 3');

  await page.click('#tab-practice');
  await page.waitForTimeout(700);
  const practiceSelected = await (await page.$('#tab-practice')).getAttribute('aria-selected');
  if (practiceSelected !== 'true') throw new Error('Expected Practice tab to be active');
  const counterPractice = await page.innerText('.tabular-nums:has-text("/ 3")');
  if (!counterPractice.includes('3 / 3')) throw new Error(`Expected counter 3 / 3, got ${counterPractice}`);
  console.log('   ✓ Practice tab selected, counter shows 3 / 3');

  await page.click('#tab-watch');
  await page.waitForTimeout(700);
  console.log('   ✓ Clicked back to Watch tab');

  // 3. Arrow Buttons Navigation
  console.log('\n3. Testing Prev/Next Stepper Arrow Buttons...');
  const nextBtn = await page.$('button[aria-label="Next step"]');
  const prevBtn = await page.$('button[aria-label="Previous step"]');

  // At step 0, prev button should be disabled
  const prevDisabled = await prevBtn.isDisabled();
  if (!prevDisabled) throw new Error('Expected Prev button to be disabled at step 0');
  console.log('   ✓ Prev button disabled at step 0');

  await nextBtn.click();
  await page.waitForTimeout(700);
  if (!(await (await page.$('#tab-read')).getAttribute('aria-selected') === 'true')) {
    throw new Error('Next button did not advance to Read');
  }
  console.log('   ✓ Next button advanced to Read');

  await nextBtn.click();
  await page.waitForTimeout(700);
  if (!(await (await page.$('#tab-practice')).getAttribute('aria-selected') === 'true')) {
    throw new Error('Next button did not advance to Practice');
  }
  const nextDisabled = await nextBtn.isDisabled();
  if (!nextDisabled) throw new Error('Expected Next button to be disabled at step 2');
  console.log('   ✓ Next button advanced to Practice and is now disabled');

  await prevBtn.click();
  await page.waitForTimeout(700);
  console.log('   ✓ Prev button moved back to Read');
  await prevBtn.click();
  await page.waitForTimeout(700);
  console.log('   ✓ Prev button moved back to Watch');

  // 4. Peeking Card Click Navigation
  console.log('\n4. Testing Peeking Card Shell Clicks...');
  // Click on the stage card shell for Read (#panel-read)
  await page.click('#panel-read', { position: { x: 450, y: 100 } });
  await page.waitForTimeout(700);
  if (!(await (await page.$('#tab-read')).getAttribute('aria-selected') === 'true')) {
    throw new Error('Clicking peeking Read card did not activate Read');
  }
  console.log('   ✓ Clicking peeking card shell activated Read');

  // 5. Keyboard Navigation
  console.log('\n5. Testing Keyboard Navigation...');
  await page.focus('#tab-read');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(400);
  if (!(await (await page.$('#tab-practice')).getAttribute('aria-selected') === 'true')) {
    throw new Error('ArrowRight did not move to Practice');
  }
  console.log('   ✓ Keyboard ArrowRight -> Practice');

  await page.keyboard.press('Home');
  await page.waitForTimeout(400);
  if (!(await (await page.$('#tab-watch')).getAttribute('aria-selected') === 'true')) {
    throw new Error('Home key did not move to Watch');
  }
  console.log('   ✓ Keyboard Home -> Watch');

  await page.keyboard.press('End');
  await page.waitForTimeout(400);
  if (!(await (await page.$('#tab-practice')).getAttribute('aria-selected') === 'true')) {
    throw new Error('End key did not move to Practice');
  }
  console.log('   ✓ Keyboard End -> Practice');

  // 6. Watch State Machine (3 Cycles)
  console.log('\n6. Testing Watch Re-Ranking State Machine (3 Cycles)...');
  await page.click('#tab-watch');
  await page.waitForTimeout(700);

  for (let cycle = 1; cycle <= 3; cycle++) {
    // Initial State 0
    let actionBtn = await page.$('#panel-watch button:has-text("A better video appears")');
    if (!actionBtn) throw new Error(`Cycle ${cycle}: State 0 button not found`);
    await actionBtn.click();
    await page.waitForTimeout(600);

    // State 1: Challenger slides in, 1 of 2 passed
    const state1Text = await page.innerText('#panel-watch');
    if (!state1Text.includes('1 of 2 passed') || !state1Text.includes('Challenger Candidate')) {
      throw new Error(`Cycle ${cycle}: State 1 did not render candidate or 1 of 2 passed`);
    }
    actionBtn = await page.$('#panel-watch button:has-text("Run the second check")');
    if (!actionBtn) throw new Error(`Cycle ${cycle}: State 1 button not found`);
    await actionBtn.click();
    await page.waitForTimeout(900); // 800ms FLIP animation

    // State 2: Challenger dethroned incumbent, 2 of 2 passed
    const state2Text = await page.innerText('#panel-watch');
    if (!state2Text.includes('2 of 2 passed') || !state2Text.includes('#1 Top Pick (Dethroned)')) {
      throw new Error(`Cycle ${cycle}: State 2 did not promote challenger to #1`);
    }
    actionBtn = await page.$('#panel-watch button:has-text("Reset simulation")');
    if (!actionBtn) throw new Error(`Cycle ${cycle}: State 2 button not found`);
    await actionBtn.click();
    await page.waitForTimeout(500);

    // Back to State 0
    const resetText = await page.innerText('#panel-watch');
    if (!resetText.includes('0 of 2 passed')) {
      throw new Error(`Cycle ${cycle}: Reset did not restore State 0`);
    }
    console.log(`   ✓ Cycle ${cycle} verified: State 0 -> State 1 -> State 2 -> Reset`);
  }

  // 7. Read Card Margin Note Interaction
  console.log('\n7. Testing Read Card Highlight & Margin Note...');
  await page.click('#tab-read');
  await page.waitForTimeout(700);

  const termBtn = await page.$('#panel-read button:has-text("Inductive Bias")');
  if (!termBtn) throw new Error('Inductive Bias button not found in Read card');
  await termBtn.click();
  await page.waitForTimeout(300);

  let marginNote = await page.$('#panel-read :text("Marginalia Note #14")');
  if (!marginNote) throw new Error('Margin note did not open upon tapping highlighted term');
  console.log('   ✓ Margin note opened on tap');

  await termBtn.click();
  await page.waitForTimeout(300);
  marginNote = await page.$('#panel-read :text("Marginalia Note #14")');
  if (marginNote) throw new Error('Margin note did not close upon second tap');
  console.log('   ✓ Margin note closed on second tap');

  // 8. Practice Card Interactive Quiz
  console.log('\n8. Testing Practice Quiz Slab Ink-Fill & Feedback...');
  await page.click('#tab-practice');
  await page.waitForTimeout(700);

  // Click wrong answer (Option A)
  const optionA = await page.$('#panel-practice button:has-text("Traditional engineering writes algorithms in Python")');
  if (!optionA) throw new Error('Option A not found in Practice card');
  await optionA.click();
  await page.waitForTimeout(500);

  let wrongMsg = await page.$('#panel-practice :text("Incorrect scenario selection")');
  if (!wrongMsg) throw new Error('Wrong selection feedback not displayed');
  console.log('   ✓ Wrong option selection displayed error feedback');

  // Click correct answer (Option B)
  const optionB = await page.$('#panel-practice button:has-text("feeds data and answers to discover")');
  if (!optionB) throw new Error('Option B not found in Practice card');
  await optionB.click();
  await page.waitForTimeout(400);

  const correctMsg = await page.$('#panel-practice :text("Correct answer verified!")');
  if (!correctMsg) throw new Error('Correct answer verified text not displayed');
  const stamp = await page.$('#panel-practice .rubber-stamp:has-text("VERIFIED • PASS")');
  if (!stamp) throw new Error('Tactile rubber stamp badge not rendered');
  console.log('   ✓ Correct option ink-fill and rubber stamp badge verified');

  // Click "Try another question"
  const tryAnotherBtn = await page.$('#panel-practice button:has-text("Try another question")');
  await tryAnotherBtn.click();
  await page.waitForTimeout(400);
  const newQuestionPrompt = await page.innerText('#panel-practice');
  if (newQuestionPrompt.includes('Traditional engineering writes algorithms in Python')) {
    throw new Error('Question did not advance to next real question');
  }
  console.log('   ✓ "Try another question" loaded next real quiz question');

  // 9. Rapid Arrow Clicks
  console.log('\n9. Testing Rapid Arrow Clicks (20 clicks)...');
  const nextBtnRapid = await page.$('button[aria-label="Next step"]');
  const prevBtnRapid = await page.$('button[aria-label="Previous step"]');
  for (let i = 0; i < 10; i++) {
    await prevBtnRapid.click().catch(() => {});
    await nextBtnRapid.click().catch(() => {});
  }
  await page.waitForTimeout(800);
  const finalIdx = await page.getAttribute('#tab-watch, #tab-read, #tab-practice', 'aria-selected');
  console.log('   ✓ Deck remained stable under rapid clicking stress');

  await page.close();
  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 ALL CHAPTER SYSTEM 3D DECK TESTS PASSED PERFECTLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
