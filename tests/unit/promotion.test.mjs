import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  validateTopPickGates,
  calculateCompositeScore,
  runAtomicPromotion,
} from '../../src/lib/alignment/promotion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

const config = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'alignment.config.json'), 'utf-8'));
const rankingConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'ranking.config.json'), 'utf-8'));

console.log('=== Running Atomic Promotion & Gates Unit Tests ===\n');

// 1. Gate validation tests
const passingAlignment = {
  videoId: 'VID_PASS',
  objectivesVersion: 1,
  confidence: 'high',
  signals: [],
  coreCoverage: 0.85,
  mustHaveMissing: [],
  coverage: {},
  order: [],
};
assert.strictEqual(validateTopPickGates(passingAlignment, 10, config).passed, true);
console.log('✓ Video meeting all criteria passes gates');

// Failing gate: coverage < 0.70
const lowCoverageAlignment = { ...passingAlignment, coreCoverage: 0.65 };
const gateLowCov = validateTopPickGates(lowCoverageAlignment, 10, config);
assert.strictEqual(gateLowCov.passed, false);
assert.ok(gateLowCov.reasons.some((r) => r.includes('Core coverage')));
console.log('✓ Gate rejects core coverage below 70%');

// Failing gate: missing must-have
const missingMustHaveAlignment = { ...passingAlignment, mustHaveMissing: ['aiml-01-lo02'] };
const gateMissing = validateTopPickGates(missingMustHaveAlignment, 10, config);
assert.strictEqual(gateMissing.passed, false);
assert.ok(gateMissing.reasons.some((r) => r.includes('must-have')));
console.log('✓ Gate rejects missing must-have objective');

// Failing gate: low confidence
const lowConfidenceAlignment = { ...passingAlignment, confidence: 'low' };
const gateLowConf = validateTopPickGates(lowConfidenceAlignment, 10, config);
assert.strictEqual(gateLowConf.passed, false);
assert.ok(gateLowConf.reasons.some((r) => r.includes('Confidence')));
console.log('✓ Gate rejects low confidence');

// Failing gate: composable quiz < 8
const lowQuizAlignment = { ...passingAlignment };
const gateLowQuiz = validateTopPickGates(lowQuizAlignment, 6, config);
assert.strictEqual(gateLowQuiz.passed, false);
assert.ok(gateLowQuiz.reasons.some((r) => r.includes('composable quiz')));
console.log('✓ Gate rejects quiz question count below 8');

// 2. Score calculation with new coverage weight (0.25)
const metrics = { engagement: 0.8, traction: 0.9, authority: 0.8, freshness: 0.8 };
const { score } = calculateCompositeScore(metrics, 0.9, rankingConfig.weights);
// 0.8*0.25 (0.2) + 0.9*0.20 (0.18) + 0.8*0.15 (0.12) + 0.8*0.15 (0.12) + 0.9*0.25 (0.225) = 0.845
assert.strictEqual(score, 0.845);
console.log('✓ Composite score correctly weights coverage at 25%');

// 3. Hysteresis promotion across 2 consecutive runs
const candidateA = {
  videoId: 'VID_A',
  title: 'Video A',
  channelTitle: 'Channel A',
  duration: '10:00',
  publishedAt: '2026-01-01',
  thumbnailUrl: '',
  metrics: { engagement: 0.7, traction: 0.7, authority: 0.7, freshness: 0.7 },
};

const candidateB = {
  videoId: 'VID_B',
  title: 'Challenger Video B',
  channelTitle: 'Channel B',
  duration: '12:00',
  publishedAt: '2026-02-01',
  thumbnailUrl: '',
  metrics: { engagement: 0.95, traction: 0.95, authority: 0.95, freshness: 0.95 },
};

const alignmentMap = {
  VID_A: { ...passingAlignment, videoId: 'VID_A', coreCoverage: 0.75 },
  VID_B: { ...passingAlignment, videoId: 'VID_B', coreCoverage: 0.95 },
};

const quizCounts = { VID_A: 10, VID_B: 12 };

// Run 1: Challenger has 1 win, required is 2 -> Keep VID_A
const run1 = runAtomicPromotion({
  chapterSlug: 'test-chapter',
  currentTopPickId: 'VID_A',
  candidates: [candidateA, candidateB],
  alignmentMap,
  quizCounts,
  consecutiveWinsMap: { VID_B: 0 },
  dethroningThreshold: 1.12,
  requiredConsecutiveChecks: 2,
  weights: rankingConfig.weights,
  config,
});

assert.strictEqual(run1.topPickId, 'VID_A', 'Challenger must not promote on run 1 of 2');
assert.strictEqual(run1.promoted, false);
console.log('✓ Hysteresis: Challenger held back on check 1');

// Run 2: Challenger has check 2 -> Promoted!
const run2 = runAtomicPromotion({
  chapterSlug: 'test-chapter',
  currentTopPickId: 'VID_A',
  candidates: [candidateA, candidateB],
  alignmentMap,
  quizCounts,
  consecutiveWinsMap: { VID_B: 1 }, // had 1 prior win
  dethroningThreshold: 1.12,
  requiredConsecutiveChecks: 2,
  weights: rankingConfig.weights,
  config,
});

assert.strictEqual(run2.topPickId, 'VID_B', 'Challenger promoted after 2 consecutive checks');
assert.strictEqual(run2.promoted, true);
assert.ok(run2.changelogEntry);
assert.strictEqual(run2.changelogEntry.from, 'VID_A');
assert.strictEqual(run2.changelogEntry.to, 'VID_B');
console.log('✓ Hysteresis: Challenger cleanly promoted on check 2 with changelog entry');

// 4. Low-confidence winner routed to review queue
const alignmentMapLowConf = {
  VID_A: { ...passingAlignment, videoId: 'VID_A', coreCoverage: 0.75 },
  VID_B: { ...passingAlignment, videoId: 'VID_B', coreCoverage: 0.95, confidence: 'low' },
};

const runLowConf = runAtomicPromotion({
  chapterSlug: 'test-chapter',
  currentTopPickId: 'VID_A',
  candidates: [candidateA, candidateB],
  alignmentMap: alignmentMapLowConf,
  quizCounts,
  consecutiveWinsMap: { VID_B: 1 },
  dethroningThreshold: 1.12,
  requiredConsecutiveChecks: 2,
  weights: rankingConfig.weights,
  config,
});

assert.strictEqual(runLowConf.topPickId, 'VID_A', 'Low confidence challenger must NOT be promoted to #1');
assert.ok(runLowConf.reviewQueueItem, 'Low confidence challenger must be routed to review queue');
assert.strictEqual(runLowConf.reviewQueueItem.videoId, 'VID_B');
console.log('✓ Low confidence challenger routed to review queue and blocked from #1');

// 5. Demotion when current #1 fails gates
const alignmentMapDemote = {
  VID_A: { ...passingAlignment, videoId: 'VID_A', coreCoverage: 0.50 }, // dropped below 70%
  VID_B: { ...passingAlignment, videoId: 'VID_B', coreCoverage: 0.85 },
};

const runDemote = runAtomicPromotion({
  chapterSlug: 'test-chapter',
  currentTopPickId: 'VID_A',
  candidates: [candidateA, candidateB],
  alignmentMap: alignmentMapDemote,
  quizCounts,
  consecutiveWinsMap: {},
  dethroningThreshold: 1.12,
  requiredConsecutiveChecks: 2,
  weights: rankingConfig.weights,
  config,
});

assert.strictEqual(runDemote.topPickId, 'VID_B', 'VID_B promoted immediately when current #1 fails gates');
assert.strictEqual(runDemote.promoted, true);
console.log('✓ Current #1 demoted when failing gates, next eligible video promoted');

console.log('\n🎉 ALL ATOMIC PROMOTION & GATES UNIT TESTS PASSED!\n');
