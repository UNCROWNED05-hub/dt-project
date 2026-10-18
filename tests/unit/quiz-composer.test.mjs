/**
 * tests/unit/quiz-composer.test.mjs
 *
 * Unit tests for composeQuiz: determinism, LO coverage, constraints, beyond-video separation.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { composeQuiz } from '../../src/lib/alignment/quiz-composer.js';

// Mock question bank (4 questions per LO across 8 LOs = 32 questions)
function generateMockBank() {
  const bank = [];
  const loIds = [
    'aiml-01-lo01',
    'aiml-01-lo02',
    'aiml-01-lo03',
    'aiml-01-lo04',
    'aiml-01-lo05',
    'aiml-01-lo06',
    'aiml-01-lo07',
    'aiml-01-lo08',
  ];

  for (const loId of loIds) {
    for (let i = 1; i <= 4; i++) {
      const diff = i === 1 ? 1 : i === 2 ? 1 : i === 3 ? 2 : 3;
      bank.push({
        id: `${loId}-q0${i}`,
        loId,
        type: 'single',
        difficulty: diff,
        stem: `Question ${i} for ${loId}`,
        options: [
          { id: 'a', text: 'Opt A' },
          { id: 'b', text: 'Opt B' },
        ],
        answer: ['a'],
        explanation: 'Explanation',
        noteRef: `${loId}.mdx`,
        reviewed: true,
      });
    }
  }
  return bank;
}

// Partial coverage alignment: covers lo01, lo02, lo03, lo04, lo05 (5 covered, 3 uncovered)
const partialAlignment = {
  videoId: 'test-vid-01',
  objectivesVersion: 1,
  confidence: 'high',
  signals: ['creator_chapters_5'],
  coreCoverage: 0.62,
  mustHaveMissing: ['aiml-01-lo06', 'aiml-01-lo07'],
  coverage: {
    'aiml-01-lo01': { status: 'covered', score: 1.0, evidence: [] },
    'aiml-01-lo02': { status: 'covered', score: 1.0, evidence: [] },
    'aiml-01-lo03': { status: 'covered', score: 0.8, evidence: [] },
    'aiml-01-lo04': { status: 'partial', score: 0.45, evidence: [] },
    'aiml-01-lo05': { status: 'covered', score: 0.9, evidence: [] },
    'aiml-01-lo06': { status: 'none', score: 0, evidence: [] },
    'aiml-01-lo07': { status: 'none', score: 0, evidence: [] },
    'aiml-01-lo08': { status: 'none', score: 0, evidence: [] },
  },
  order: ['aiml-01-lo01', 'aiml-01-lo02', 'aiml-01-lo03', 'aiml-01-lo04', 'aiml-01-lo05'],
};

test('Quiz Composer: Determinism with same seed', () => {
  const bank = generateMockBank();
  const res1 = composeQuiz(bank, partialAlignment, 'seed-alpha-123', { targetCount: 10 });
  const res2 = composeQuiz(bank, partialAlignment, 'seed-alpha-123', { targetCount: 10 });

  assert.equal(res1.alignedQuestions.length, res2.alignedQuestions.length);
  for (let i = 0; i < res1.alignedQuestions.length; i++) {
    assert.equal(res1.alignedQuestions[i].id, res2.alignedQuestions[i].id);
  }
  assert.equal(res1.beyondQuestions.length, res2.beyondQuestions.length);
  for (let i = 0; i < res1.beyondQuestions.length; i++) {
    assert.equal(res1.beyondQuestions[i].id, res2.beyondQuestions[i].id);
  }
});

test('Quiz Composer: Never includes uncovered LOs in aligned questions', () => {
  const bank = generateMockBank();
  const res = composeQuiz(bank, partialAlignment, 'seed-beta-456', { targetCount: 10 });

  const uncovered = ['aiml-01-lo06', 'aiml-01-lo07', 'aiml-01-lo08'];
  for (const q of res.alignedQuestions) {
    assert.ok(
      !uncovered.includes(q.loId),
      `Aligned question ${q.id} belongs to uncovered LO ${q.loId}`
    );
  }

  // Beyond questions must come ONLY from uncovered LOs
  for (const bq of res.beyondQuestions) {
    assert.ok(
      uncovered.includes(bq.loId),
      `Beyond question ${bq.id} does not belong to an uncovered LO`
    );
  }
});

test('Quiz Composer: Core coverage guarantee (>= 1 question per covered LO)', () => {
  const bank = generateMockBank();
  const res = composeQuiz(bank, partialAlignment, 'seed-gamma-789', { targetCount: 10 });

  const coveredLos = ['aiml-01-lo01', 'aiml-01-lo02', 'aiml-01-lo03', 'aiml-01-lo04', 'aiml-01-lo05'];
  const presentLoIds = new Set(res.alignedQuestions.map((q) => q.loId));

  for (const loId of coveredLos) {
    assert.ok(presentLoIds.has(loId), `Covered LO ${loId} missing from composed quiz`);
  }
});

test('Quiz Composer: Diversity constraint (max 2 questions per LO)', () => {
  const bank = generateMockBank();
  const res = composeQuiz(bank, partialAlignment, 'seed-delta-101', { targetCount: 10 });

  const loCounts = {};
  for (const q of res.alignedQuestions) {
    loCounts[q.loId] = (loCounts[q.loId] || 0) + 1;
    assert.ok(loCounts[q.loId] <= 2, `LO ${q.loId} exceeded max 2 questions (count=${loCounts[q.loId]})`);
  }
  assert.equal(res.alignedQuestions.length, 10);
});

test('Quiz Composer: Beyond the video block separation (up to 4 questions)', () => {
  const bank = generateMockBank();
  const res = composeQuiz(bank, partialAlignment, 'seed-epsilon-202', { beyondMax: 4 });

  assert.ok(res.beyondQuestions.length > 0, 'Beyond questions should be populated');
  assert.ok(res.beyondQuestions.length <= 4, 'Beyond questions should not exceed max 4');
  assert.equal(res.beyondQuestions.length, 3); // 3 uncovered LOs in partialAlignment
});
