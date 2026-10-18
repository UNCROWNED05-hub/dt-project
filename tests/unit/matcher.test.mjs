import assert from 'assert';
import { matchObjective, simpleStem, normalizeText } from '../../src/lib/alignment/matcher.js';

console.log('=== Running Matcher & Acronym Guard Unit Tests ===\n');

// 1. Stemming & Normalization
assert.strictEqual(simpleStem('networks'), 'network');
assert.strictEqual(simpleStem('learning'), 'learn');
assert.strictEqual(simpleStem('optimizers'), 'optim');
assert.strictEqual(normalizeText("What's a Neural-Network?"), 'whats a neural network');
console.log('✓ Normalization and stemming verified');

// 2. Acronym guard: CNN news vs CNN convolutional neural network
const cnnObjective = {
  id: 'aiml-01',
  order: 1,
  title: 'Convolutional Neural Networks',
  bloom: 'understand',
  tier: 'core',
  mustHave: true,
  keywords: ['convolutional', 'layers', 'filters'],
  aliases: ['CNN', 'ConvNet'],
  estMinutes: 10,
};

const acronymGuards = {
  CNN: ['neural', 'network', 'convolution', 'vision', 'deep learning', 'image'],
  XSS: ['scripting', 'web', 'security', 'vulnerability', 'injection', 'cross-site'],
};

// Case A: News mention (no co-occurring keywords) -> Must NOT match
const newsText = 'Interview broadcasted on CNN today at noon with the political correspondent.';
const newsResult = matchObjective(newsText, cnnObjective, acronymGuards);
assert.strictEqual(newsResult.matched, false, 'CNN without neural network context must NOT match');
console.log('✓ Acronym guard prevented false positive on news media CNN');

// Case B: Neural network mention with CNN -> Must match
const techText = 'Building a fast CNN image classifier with deep learning';
const techResult = matchObjective(techText, cnnObjective, acronymGuards);
assert.strictEqual(techResult.matched, true, 'CNN with deep learning / image context must match');
assert.ok(techResult.matchedTerms.includes('CNN'));
console.log('✓ Acronym guard correctly approved CNN in deep learning image context');

// 3. Multi-word phrase matching with word boundaries
const gdObjective = {
  id: 'aiml-02',
  order: 2,
  title: 'Explain Gradient Descent optimization',
  bloom: 'understand',
  tier: 'core',
  mustHave: true,
  keywords: ['gradient descent', 'learning rate', 'loss minimization'],
  aliases: ['steepest descent'],
  estMinutes: 10,
};

const titleMatch = matchObjective('A First Principles Guide to Gradient Descent', gdObjective, acronymGuards);
assert.strictEqual(titleMatch.matched, true);
assert.ok(titleMatch.matchedTerms.includes('gradient descent'));

const aliasMatch = matchObjective('Convergence properties of steepest descent in convex functions', gdObjective, acronymGuards);
assert.strictEqual(aliasMatch.matched, true);
assert.ok(aliasMatch.matchedTerms.includes('steepest descent'));
console.log('✓ Multi-word keyword and alias matching verified');

console.log('\n🎉 ALL MATCHER & ACRONYM UNIT TESTS PASSED!\n');
