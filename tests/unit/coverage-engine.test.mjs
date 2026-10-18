import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateVideoAlignment } from '../../src/lib/alignment/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');

const config = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'alignment.config.json'), 'utf-8'));

console.log('=== Running Coverage Engine Unit Tests ===\n');

const mockObjectives = [
  {
    id: 'lo-01',
    order: 1,
    title: 'Supervised Learning',
    bloom: 'understand',
    tier: 'core',
    mustHave: true,
    keywords: ['supervised learning', 'labeled data', 'ground truth'],
    aliases: [],
    estMinutes: 10,
  },
  {
    id: 'lo-02',
    order: 2,
    title: 'Unsupervised Learning',
    bloom: 'understand',
    tier: 'core',
    mustHave: true,
    keywords: ['unsupervised learning', 'clustering', 'unlabeled'],
    aliases: [],
    estMinutes: 10,
  },
  {
    id: 'lo-03',
    order: 3,
    title: 'Loss Functions and Cost Calculation',
    bloom: 'apply',
    tier: 'core',
    mustHave: false,
    keywords: ['loss function', 'mean squared error', 'cost function'],
    aliases: ['MSE'],
    estMinutes: 12,
  },
  {
    id: 'lo-04',
    order: 4,
    title: 'Advanced Regularization Techniques',
    bloom: 'analyze',
    tier: 'extension',
    mustHave: false,
    keywords: ['dropout', 'l2 regularization', 'weight decay'],
    aliases: [],
    estMinutes: 15,
  },
];

// Test Case 1: Video with High Confidence and Creator Chapter Markers
const richVideo = {
  videoId: 'VID_RICH_01',
  title: 'Complete Intro to Machine Learning in 20 Minutes',
  description: `
Welcome to our ML course!
Chapters:
0:00 Introduction & Overview
2:30 Supervised Learning Foundations
7:45 Unsupervised Learning and Clustering
14:10 Loss Functions and Mean Squared Error Calculation
19:00 Next Steps and Review
  `,
  tags: ['machine learning', 'supervised learning', 'loss function'],
};

const resultRich = evaluateVideoAlignment(richVideo, mockObjectives, config);

assert.strictEqual(resultRich.confidence, 'high'); // Has 5 markers, 100% of core LOs in markers -> High confidence
assert.strictEqual(resultRich.coverage['lo-01'].status, 'covered');
assert.strictEqual(resultRich.coverage['lo-02'].status, 'covered');
assert.strictEqual(resultRich.coverage['lo-03'].status, 'covered');
assert.strictEqual(resultRich.coverage['lo-04'].status, 'none'); // extension LO not covered
assert.strictEqual(resultRich.mustHaveMissing.length, 0);
assert.strictEqual(resultRich.coreCoverage, 1.0); // 3 of 3 core LOs covered
assert.deepStrictEqual(resultRich.order, ['lo-01', 'lo-02', 'lo-03']);
console.log('✓ High/Medium confidence video with creator markers evaluated accurately');

// Test Case 2: Description-only rule: cannot exceed "partial"
const descOnlyVideo = {
  videoId: 'VID_DESC_ONLY',
  title: 'General Computer Science Lecture 42',
  description: `
In this broad lecture we briefly mention supervised learning and labeled data in our overview of algorithms.
  `,
};

const resultDescOnly = evaluateVideoAlignment(descOnlyVideo, mockObjectives, config);
assert.strictEqual(resultDescOnly.coverage['lo-01'].status, 'partial', 'Description-only match must NOT exceed partial');
assert.ok(resultDescOnly.coverage['lo-01'].score < config.coverageThresholds.covered);
console.log('✓ Description-only evidence capped at "partial" as required');

// Test Case 3: Missing MustHave LO detection
const missingMustHaveVideo = {
  videoId: 'VID_MISSING_MUSTHAVE',
  title: 'Supervised Learning and Cost Functions Only',
  description: `
0:00 Welcome
2:00 Supervised Learning with labeled datasets
8:00 Loss Functions and Mean Squared Error
15:00 Summary
  `,
};

const resultMissingMustHave = evaluateVideoAlignment(missingMustHaveVideo, mockObjectives, config);
assert.ok(resultMissingMustHave.mustHaveMissing.includes('lo-02'), 'Must-have lo-02 should be flagged as missing');
console.log('✓ Missing mustHave LO flagged correctly in mustHaveMissing');

// Test Case 4: Maintainer Override
const override = {
  videoId: 'VID_OVERRIDE',
  confidence: 'confirmed',
  coreCoverage: 1.0,
  order: ['lo-02', 'lo-01', 'lo-03'],
  coverage: {
    'lo-01': { status: 'covered', score: 1.0 },
    'lo-02': { status: 'covered', score: 1.0 },
    'lo-03': { status: 'covered', score: 1.0 },
  },
};

const resultOverride = evaluateVideoAlignment({ videoId: 'VID_OVERRIDE', title: '', description: '' }, mockObjectives, config, override);
assert.strictEqual(resultOverride.confidence, 'confirmed');
assert.strictEqual(resultOverride.coreCoverage, 1.0);
assert.deepStrictEqual(resultOverride.order, ['lo-02', 'lo-01', 'lo-03']);
console.log('✓ Maintainer override respected and confirmed');

console.log('\n🎉 ALL COVERAGE ENGINE UNIT TESTS PASSED!\n');
