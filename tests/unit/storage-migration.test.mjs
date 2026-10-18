/**
 * tests/unit/storage-migration.test.mjs
 *
 * Unit tests for migrateV1ToV2, ensuring backward compatibility,
 * streak preservation, score conversions, and per-LO tracking.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrateV1ToV2 } from '../../src/lib/storage.js';

test('Storage Migration: Migrates v1 state to v2 structure', () => {
  const v1State = {
    streak: {
      currentCount: 5,
      lastActiveDate: '2026-10-15',
    },
    chapters: {
      'what-ai-ml-really-are': {
        completed: true,
        lastVisited: '2026-10-15T10:00:00Z',
        quizBestScore: 85,
        earnedStamp: true,
        incorrectQuestionIds: ['q1'],
        notesRead: true,
        watchedVideo: true,
      },
      'python-numpy-and-pandas': {
        completed: false,
        lastVisited: '2026-10-14T10:00:00Z',
        quizBestScore: 60,
        earnedStamp: false,
        incorrectQuestionIds: ['q2', 'q3'],
        notesRead: false,
        watchedVideo: true,
      },
    },
    recentlyWatchedVideos: [
      {
        videoId: 'aircAruvnKk',
        title: 'But what is a neural network?',
        courseSlug: 'ai-ml',
        chapterSlug: 'what-ai-ml-really-are',
        watchedAt: '2026-10-15T09:30:00Z',
      },
    ],
    settings: {
      reducedMotion: true,
    },
  };

  const v2 = migrateV1ToV2(v1State);

  assert.equal(v2.version, 2);
  assert.equal(v2.streak.currentCount, 5);
  assert.equal(v2.streak.lastActiveDate, '2026-10-15');
  assert.equal(v2.settings.reducedMotion, true);
  assert.equal(v2.recentlyWatchedVideos.length, 1);
  assert.equal(v2.recentlyWatchedVideos[0].videoId, 'aircAruvnKk');

  // Chapter 1 check
  const ch1 = v2.chapters['what-ai-ml-really-are'];
  assert.ok(ch1);
  assert.equal(ch1.completed, true);
  assert.equal(ch1.earnedStamp, true);
  assert.equal(ch1.bestScore, 85);
  assert.equal(ch1.notesRead, true);
  assert.equal(ch1.orderMode, 'canonical');

  // Chapter 2 check
  const ch2 = v2.chapters['python-numpy-and-pandas'];
  assert.ok(ch2);
  assert.equal(ch2.completed, false);
  assert.equal(ch2.earnedStamp, false);
  assert.equal(ch2.bestScore, 60);

  // Objectives map initialized
  assert.ok(typeof v2.objectives === 'object');
});

test('Storage Migration: Idempotent when given v2 state', () => {
  const v2Initial = {
    version: 2,
    streak: { currentCount: 2, lastActiveDate: '2026-10-18' },
    chapters: {},
    objectives: {
      'aiml-01-lo01': { mastered: true, timesTested: 3, timesCorrect: 3 },
    },
    recentlyWatchedVideos: [],
    settings: { reducedMotion: false },
  };

  const res = migrateV1ToV2(v2Initial);
  assert.equal(res.version, 2);
  assert.equal(res.objectives['aiml-01-lo01'].mastered, true);
});

test('Storage Migration: Handles null or empty state cleanly', () => {
  const res = migrateV1ToV2(null);
  assert.equal(res.version, 2);
  assert.equal(res.streak.currentCount, 1);
  assert.deepEqual(res.chapters, {});
  assert.deepEqual(res.objectives, {});
});
