/**
 * tests/unit/fixtures-cases.test.mjs
 *
 * Task 5A Comprehensive Fixture Matrix Testing:
 * (a) Strong video with creator chapters (high confidence)
 * (b) Partial coverage (medium confidence, beyond block separation)
 * (c) No metadata / sparse info (low confidence)
 * (d) Off-topic video (0 coverage, rejected by gates)
 * (e) Challenger outranking #1 but missing must-have LO (gate blocked)
 * (f) Challenger qualifying on all gates and achieving 12% lead over 2 runs (promoted)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateVideoAlignment } from '../../src/lib/alignment/engine.js';
import { runAtomicPromotion } from '../../src/lib/alignment/promotion.js';
import { composeQuiz } from '../../src/lib/alignment/quiz-composer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

const config = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'alignment.config.json'), 'utf-8'));
const rankingConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'ranking.config.json'), 'utf-8'));

// Test standard objectives (8 core + 1 extension)
const sampleObjectives = [
  { id: 'lo-01', order: 1, title: 'Supervised vs Unsupervised Learning', bloom: 'understand', tier: 'core', mustHave: true, keywords: ['supervised', 'unsupervised'], estMinutes: 10 },
  { id: 'lo-02', order: 2, title: 'Features and Labels in Datasets', bloom: 'remember', tier: 'core', mustHave: true, keywords: ['features', 'labels'], estMinutes: 8 },
  { id: 'lo-03', order: 3, title: 'Weights and Biases in Neural Layers', bloom: 'understand', tier: 'core', mustHave: true, keywords: ['weights', 'biases'], estMinutes: 12 },
  { id: 'lo-04', order: 4, title: 'Loss Functions and Mean Squared Error', bloom: 'apply', tier: 'core', mustHave: true, keywords: ['loss', 'mse'], estMinutes: 15 },
  { id: 'lo-05', order: 5, title: 'Gradient Descent Optimization', bloom: 'apply', tier: 'core', mustHave: true, keywords: ['gradient descent', 'learning rate'], estMinutes: 15 },
  { id: 'lo-06', order: 6, title: 'Overfitting and Regularization', bloom: 'analyze', tier: 'core', mustHave: true, keywords: ['overfitting', 'regularization'], estMinutes: 14 },
  { id: 'lo-07', order: 7, title: 'Evaluation Metrics and F1-Score', bloom: 'evaluate', tier: 'core', mustHave: true, keywords: ['evaluation', 'f1-score'], estMinutes: 10 },
  { id: 'lo-08', order: 8, title: 'Ethics and Data Leakage Pitfalls', bloom: 'evaluate', tier: 'core', mustHave: true, keywords: ['ethics', 'data leakage'], estMinutes: 10 },
  { id: 'lo-09', order: 9, title: 'Transformer Foundations', bloom: 'create', tier: 'extension', mustHave: false, keywords: ['transformer', 'self-attention'], estMinutes: 20 },
];

test('Fixture Case A: Strong video with creator chapters -> High confidence & complete coverage', () => {
  const strongVideo = {
    videoId: 'fixture-strong-01',
    title: 'Machine Learning Masterclass: From Theory to Practice',
    description: `Complete guide to ML!
00:00 Introduction
02:15 Supervised vs Unsupervised Learning
08:30 Features and Labels in Datasets
15:00 Weights and Biases in Neural Layers
22:45 Loss Functions and Mean Squared Error
30:10 Gradient Descent Optimization
38:00 Overfitting and Regularization
45:20 Evaluation Metrics and F1-Score
52:10 Ethics and Data Leakage Pitfalls
1:02:00 Transformer Foundations`,
    tags: ['machine learning', 'supervised', 'weights', 'loss function', 'gradient descent'],
  };

  const align = evaluateVideoAlignment(strongVideo, sampleObjectives, config);
  assert.equal(align.confidence, 'high', 'Should be high confidence');
  assert.ok(align.coreCoverage >= 0.85, `Expected >= 85% coverage, got ${align.coreCoverage}`);
  assert.equal(align.mustHaveMissing.length, 0, 'No must-haves should be missing');
  assert.ok(align.signals.some((s) => s.startsWith('creator_chapters_')), 'Should detect creator chapters');
});

test('Fixture Case B: Partial coverage -> Medium confidence & beyond block separation', () => {
  const partialVideo = {
    videoId: 'fixture-partial-02',
    title: 'Deep Dive: Neural Network Weights & Gradient Descent',
    description: `We focus strictly on how weights update!
00:00 Introduction
03:00 Weights and Biases in Neural Layers
08:30 Loss Functions and Mean Squared Error
14:00 Gradient Descent Optimization`,
    tags: ['deep learning', 'weights', 'loss', 'gradient descent'],
  };

  const align = evaluateVideoAlignment(partialVideo, sampleObjectives, config);
  assert.equal(align.confidence, 'medium');
  assert.ok(align.coreCoverage > 0.3 && align.coreCoverage < 0.6);
  assert.ok(align.mustHaveMissing.length > 0, 'Should identify missing must-haves');

  // Verify quiz composer separates beyond block
  const mockBank = sampleObjectives.flatMap((lo) => [
    { id: `${lo.id}-q1`, loId: lo.id, type: 'single', difficulty: 1, stem: `Q1 ${lo.id}`, options: [{ id: 'a', text: 'A' }], answer: ['a'], explanation: '', noteRef: '', reviewed: true },
    { id: `${lo.id}-q2`, loId: lo.id, type: 'single', difficulty: 2, stem: `Q2 ${lo.id}`, options: [{ id: 'a', text: 'A' }], answer: ['a'], explanation: '', noteRef: '', reviewed: true },
  ]);

  const composed = composeQuiz(mockBank, align, 'seed-b');
  assert.ok(composed.alignedQuestions.length > 0);
  assert.ok(composed.beyondQuestions.length > 0, 'Should have beyond questions');

  // Aligned questions must NOT contain missing must-have LOs
  for (const q of composed.alignedQuestions) {
    assert.ok(!align.mustHaveMissing.includes(q.loId), `Aligned question tests missing mustHave ${q.loId}`);
  }
});

test('Fixture Case C: No metadata / sparse info -> Low confidence', () => {
  const sparseVideo = {
    videoId: 'fixture-sparse-03',
    title: 'ML quick recap',
    description: 'Quick talk.',
    tags: [],
  };

  const align = evaluateVideoAlignment(sparseVideo, sampleObjectives, config);
  assert.equal(align.confidence, 'low', 'Sparse metadata must yield low confidence');
  assert.ok(align.coreCoverage < 0.2);
});

test('Fixture Case D: Off-topic video -> 0 coverage & rejected by gates', () => {
  const offTopicVideo = {
    videoId: 'fixture-offtopic-04',
    title: 'Making Authentic Neapolitan Pizza at Home',
    description: 'Proofing dough for 48 hours with 00 flour and san marzano tomatoes.',
    tags: ['pizza', 'cooking', 'italian food'],
  };

  const align = evaluateVideoAlignment(offTopicVideo, sampleObjectives, config);
  assert.equal(align.coreCoverage, 0);
  assert.equal(align.confidence, 'low');
  assert.equal(align.mustHaveMissing.length, 8);
});

test('Fixture Case E: Challenger outranking #1 on engagement but failing must-have gate is rejected', () => {
  const challengerAlign = {
    videoId: 'viral-challenger',
    objectivesVersion: 1,
    confidence: 'medium',
    signals: [],
    coreCoverage: 0.60, // below 70% threshold
    mustHaveMissing: ['lo-01', 'lo-02'],
    coverage: {},
    order: [],
  };

  const champAlign = {
    videoId: 'current-champ',
    objectivesVersion: 1,
    confidence: 'high',
    signals: [],
    coreCoverage: 0.88,
    mustHaveMissing: [],
    coverage: {},
    order: [],
  };

  const result = runAtomicPromotion({
    chapterSlug: 'test-ch',
    currentTopPickId: 'current-champ',
    candidates: [
      {
        videoId: 'current-champ',
        title: 'Solid Champion',
        channelTitle: 'Good Channel',
        duration: '15:00',
        publishedAt: '2026-01-01',
        thumbnailUrl: '',
        metrics: { engagement: 0.85, traction: 0.85, authority: 0.85, freshness: 0.85 },
      },
      {
        videoId: 'viral-challenger',
        title: 'Viral Video with Poor Coverage',
        channelTitle: 'Viral Channel',
        duration: '10:00',
        publishedAt: '2026-02-01',
        thumbnailUrl: '',
        metrics: { engagement: 0.99, traction: 0.99, authority: 0.95, freshness: 0.99 },
      },
    ],
    alignmentMap: {
      'current-champ': champAlign,
      'viral-challenger': challengerAlign,
    },
    quizCounts: {
      'current-champ': 10,
      'viral-challenger': 4, // below minComposableQuizQuestions 8
    },
    consecutiveWinsMap: {},
    dethroningThreshold: 1.12,
    requiredConsecutiveChecks: 2,
    weights: rankingConfig.weights,
    config,
  });

  assert.equal(result.promoted, false);
  assert.equal(result.topPickId, 'current-champ', 'Champion should remain undefeated');
});

test('Fixture Case F: Challenger passing all gates with 12% lead over 2 runs is promoted', () => {
  const champAlign = {
    videoId: 'champ-a',
    objectivesVersion: 1,
    confidence: 'high',
    signals: [],
    coreCoverage: 0.80,
    mustHaveMissing: [],
    coverage: {},
    order: [],
  };

  const challengerAlign = {
    videoId: 'challenger-b',
    objectivesVersion: 1,
    confidence: 'high',
    signals: [],
    coreCoverage: 1.0,
    mustHaveMissing: [],
    coverage: {},
    order: [],
  };

  const baseState = {
    chapterSlug: 'test-ch-promo',
    currentTopPickId: 'champ-a',
    candidates: [
      {
        videoId: 'champ-a',
        title: 'Old Champion',
        channelTitle: 'Channel A',
        duration: '10:00',
        publishedAt: '2026-01-01',
        thumbnailUrl: '',
        metrics: { engagement: 0.70, traction: 0.70, authority: 0.70, freshness: 0.70 },
      },
      {
        videoId: 'challenger-b',
        title: 'Superior Challenger',
        channelTitle: 'Channel B',
        duration: '12:00',
        publishedAt: '2026-02-01',
        thumbnailUrl: '',
        metrics: { engagement: 0.95, traction: 0.95, authority: 0.95, freshness: 0.95 },
      },
    ],
    alignmentMap: {
      'champ-a': champAlign,
      'challenger-b': challengerAlign,
    },
    quizCounts: {
      'champ-a': 10,
      'challenger-b': 12,
    },
    consecutiveWinsMap: { 'challenger-b': 0 },
    dethroningThreshold: 1.12,
    requiredConsecutiveChecks: 2,
    weights: rankingConfig.weights,
    config,
  };

  // Run 1: Should hold back on first run (hysteresis check 1)
  const run1 = runAtomicPromotion(baseState);
  assert.equal(run1.promoted, false);
  assert.equal(run1.updatedConsecutiveWins?.['challenger-b'], 1);

  // Run 2: Consecutive check confirms superiority -> Promoted!
  const run2 = runAtomicPromotion({
    ...baseState,
    consecutiveWinsMap: run1.updatedConsecutiveWins,
  });
  assert.equal(run2.promoted, true);
  assert.equal(run2.topPickId, 'challenger-b');
  assert.ok(run2.changelogEntry, 'Changelog entry should be generated');
});
