import assert from 'assert';
import { parseCreatorTimestamps, parseSeconds, formatSeconds } from '../../src/lib/alignment/timestamp-parser.js';

console.log('=== Running Timestamp Parser Unit Tests ===\n');

// 1. parseSeconds and formatSeconds
assert.strictEqual(parseSeconds('0:00'), 0);
assert.strictEqual(parseSeconds('1:23'), 83);
assert.strictEqual(parseSeconds('12:45'), 765);
assert.strictEqual(parseSeconds('1:02:03'), 3723);

assert.strictEqual(formatSeconds(0), '0:00');
assert.strictEqual(formatSeconds(83), '1:23');
assert.strictEqual(formatSeconds(3723), '1:02:03');
console.log('✓ Time conversion helpers passed');

// 2. Standard timestamp markers with various formatting
const cleanDesc = `
TIMESTAMPS:
0:00 Introduction
2:15 What is Machine Learning
5:30 Supervised vs Unsupervised Learning
11:45 Gradient Descent Step-by-Step
18:20 Summary & Next Steps
`;

const markersClean = parseCreatorTimestamps(cleanDesc);
assert.strictEqual(markersClean.length, 5);
assert.strictEqual(markersClean[0].seconds, 0);
assert.strictEqual(markersClean[0].title, 'Introduction');
assert.strictEqual(markersClean[1].seconds, 135);
assert.strictEqual(markersClean[1].title, 'What is Machine Learning');
assert.strictEqual(markersClean[3].seconds, 705);
assert.strictEqual(markersClean[3].title, 'Gradient Descent Step-by-Step');
console.log('✓ Standard formatted markers parsed correctly');

// 3. Messy real-world formats (brackets, bullets, dashes, colons, hours)
const messyDesc = `
Hey everyone, thanks for watching! Support me on Patreon.
Chapters for this deep dive:
• [00:00] - Overview and Motivation
- (04:12) : Loss Functions & Mean Squared Error
[12:35] - Numerical Optimization Routine
• 1:05:20 : Deep Neural Network Architecture
1:25:00 - Q&A Session

Leave a comment below!
`;

const markersMessy = parseCreatorTimestamps(messyDesc);
assert.strictEqual(markersMessy.length, 5);
assert.strictEqual(markersMessy[0].seconds, 0);
assert.strictEqual(markersMessy[0].title, 'Overview and Motivation');
assert.strictEqual(markersMessy[1].seconds, 252);
assert.strictEqual(markersMessy[1].title, 'Loss Functions & Mean Squared Error');
assert.strictEqual(markersMessy[3].seconds, 3920);
assert.strictEqual(markersMessy[3].title, 'Deep Neural Network Architecture');
console.log('✓ Messy real-world brackets/bullets/hours markers parsed correctly');

// 4. Ignoring timestamps inside narrative sentences
const sentenceDesc = `
In our experiment we started running the model at 4:30 pm yesterday.
We waited for 2:15 hours until convergence was reached.
Call me at 12:00 if you have any questions about the assignment.
`;

const markersSentence = parseCreatorTimestamps(sentenceDesc);
assert.strictEqual(markersSentence.length, 0, 'Times in conversational sentences must be ignored');
console.log('✓ Conversational sentence times successfully ignored');

// 5. Require at least 3 markers in strictly increasing order
const twoMarkers = `
0:00 Intro
5:00 Conclusion
`;
assert.strictEqual(parseCreatorTimestamps(twoMarkers).length, 0, 'Fewer than 3 markers must return empty');

const outOfOrder = `
0:00 Part 1
10:00 Part 2
5:00 Part 3 (Out of order)
`;
assert.strictEqual(parseCreatorTimestamps(outOfOrder).length, 0, 'Non-increasing timestamps must not form a valid chapter set');
console.log('✓ Minimum 3 strictly increasing markers threshold enforced');

console.log('\n🎉 ALL TIMESTAMP PARSER UNIT TESTS PASSED!\n');
