/**
 * scripts/align-videos.mjs
 *
 * Autonomous Objective-Alignment & Ranking Pipeline.
 * Pure and deterministic (no network by default).
 *
 * 1. Reads objectives from content/<course>/<chapter>/objectives.json
 * 2. Aligns each stored video using pure metadata (markers, title, description, tags)
 * 3. Applies maintainer overrides from data/videos/overrides/<chapter>.json
 * 4. Writes computed alignments to data/alignment/<course>/<chapter>.json
 * 5. Evaluates gates and atomic ranking promotions against data/videos/<course>.json
 * 6. Logs changelog and review queue entries
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateVideoAlignment } from '../src/lib/alignment/engine.js';
import { runAtomicPromotion } from '../src/lib/alignment/promotion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const COURSES = ['ai-ml', 'cybersecurity', 'iot'];
const CONFIG_PATH = path.join(ROOT_DIR, 'alignment.config.json');
const RANKING_CONFIG_PATH = path.join(ROOT_DIR, 'ranking.config.json');
const REVIEW_QUEUE_PATH = path.join(ROOT_DIR, 'data', 'videos', 'review-queue.json');
const CHANGELOG_PATH = path.join(ROOT_DIR, 'data', 'videos', 'changelog.json');
const OVERRIDES_DIR = path.join(ROOT_DIR, 'data', 'videos', 'overrides');

export function runAlignmentPipeline(options = { dryRun: false }) {
  console.log('=== Vellum Objective-Alignment & Ranking Pipeline ===\n');

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const rankingConfig = JSON.parse(fs.readFileSync(RANKING_CONFIG_PATH, 'utf-8'));

  if (!fs.existsSync(OVERRIDES_DIR)) {
    fs.mkdirSync(OVERRIDES_DIR, { recursive: true });
  }

  let totalVideosProcessed = 0;
  let totalPromotions = 0;
  const reviewQueue = fs.existsSync(REVIEW_QUEUE_PATH)
    ? JSON.parse(fs.readFileSync(REVIEW_QUEUE_PATH, 'utf-8'))
    : [];
  const changelog = fs.existsSync(CHANGELOG_PATH)
    ? JSON.parse(fs.readFileSync(CHANGELOG_PATH, 'utf-8'))
    : [];

  for (const courseSlug of COURSES) {
    const courseContentDir = path.join(ROOT_DIR, 'content', courseSlug);
    const videoManifestPath = path.join(ROOT_DIR, 'data', 'videos', `${courseSlug}.json`);

    if (!fs.existsSync(videoManifestPath)) continue;
    const videoManifest = JSON.parse(fs.readFileSync(videoManifestPath, 'utf-8'));

    if (!fs.existsSync(courseContentDir)) continue;
    const chapters = fs.readdirSync(courseContentDir, { withFileTypes: true });

    for (const chapterEntry of chapters) {
      if (!chapterEntry.isDirectory()) continue;
      const chapterSlug = chapterEntry.name;
      const objectivesPath = path.join(courseContentDir, chapterSlug, 'objectives.json');

      if (!fs.existsSync(objectivesPath)) {
        // Legacy Mode: chapter does not have objectives.json yet
        continue;
      }

      const objectivesData = JSON.parse(fs.readFileSync(objectivesPath, 'utf-8'));
      const objectives = objectivesData.objectives;

      // Check for question bank
      const bankPath = path.join(courseContentDir, chapterSlug, 'quiz', 'bank.json');
      const questionBank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath, 'utf-8')) : [];

      // Check for maintainer override
      const overridePath = path.join(OVERRIDES_DIR, `${chapterSlug}.json`);
      const overrides = fs.existsSync(overridePath) ? JSON.parse(fs.readFileSync(overridePath, 'utf-8')) : {};

      const chapterVideos = videoManifest[chapterSlug];
      if (!chapterVideos) continue;

      const candidates = [
        chapterVideos.topPick,
        ...(chapterVideos.alternates || []),
      ].filter(Boolean);

      const alignmentMap = {};
      const quizCounts = {};

      for (const video of candidates) {
        totalVideosProcessed += 1;
        const videoOverride = overrides[video.videoId];

        // Format metadata for alignment engine
        const videoMeta = {
          videoId: video.videoId,
          title: video.title,
          description: video.description || video.whyTopPick || video.title,
          tags: video.tags || [],
          duration: video.duration,
          markers: video.markers || [],
        };

        const alignment = evaluateVideoAlignment(videoMeta, objectives, config, videoOverride);
        alignmentMap[video.videoId] = alignment;

        // Count how many questions in the bank are covered by this video
        const coveredLoIds = Object.keys(alignment.coverage).filter(
          (id) => alignment.coverage[id].status !== 'none'
        );
        const composableQuestions = questionBank.filter((q) => coveredLoIds.includes(q.loId));
        quizCounts[video.videoId] = composableQuestions.length;
      }

      // Save alignment output to data/alignment/<course>/<chapter>.json
      const alignmentDir = path.join(ROOT_DIR, 'data', 'alignment', courseSlug);
      if (!options.dryRun && !fs.existsSync(alignmentDir)) {
        fs.mkdirSync(alignmentDir, { recursive: true });
      }

      const alignmentFilePath = path.join(alignmentDir, `${chapterSlug}.json`);
      if (!options.dryRun) {
        fs.writeFileSync(alignmentFilePath, JSON.stringify(alignmentMap, null, 2), 'utf-8');
      }

      // Run atomic ranking promotion
      const promotionState = {
        chapterSlug,
        currentTopPickId: chapterVideos.topPick?.videoId || null,
        candidates: candidates.map((c) => ({
          ...c,
          metrics: {
            engagement: c.scoreBreakdown?.engagement ?? 0.8,
            traction: c.scoreBreakdown?.traction ?? 0.8,
            authority: c.scoreBreakdown?.authority ?? 0.8,
            freshness: c.scoreBreakdown?.freshness ?? 0.8,
          },
        })),
        alignmentMap,
        quizCounts,
        consecutiveWinsMap: chapterVideos.consecutiveWins || {},
        dethroningThreshold: rankingConfig.dethroningThreshold || 1.12,
        requiredConsecutiveChecks: rankingConfig.requiredConsecutiveChecks || 2,
        weights: rankingConfig.weights,
        config,
      };

      const promoResult = runAtomicPromotion(promotionState);

      if (promoResult.reviewQueueItem) {
        const exists = reviewQueue.some(
          (q) => q.chapter === chapterSlug && q.videoId === promoResult.reviewQueueItem.videoId
        );
        if (!exists) {
          reviewQueue.push(promoResult.reviewQueueItem);
        }
      }

      if (promoResult.promoted && promoResult.topPickId) {
        totalPromotions += 1;
        console.log(`🚀 [PROMOTION] Chapter '${chapterSlug}': New #1 -> ${promoResult.topPickId}`);
        console.log(`   Reason: ${promoResult.promotionReason}`);

        if (promoResult.changelogEntry) {
          changelog.unshift(promoResult.changelogEntry);
        }

        if (!options.dryRun) {
          // Update top pick and alternates in manifest
          const newTop = candidates.find((c) => c.videoId === promoResult.topPickId);
          const newAlternates = candidates.filter((c) => c.videoId !== promoResult.topPickId);

          videoManifest[chapterSlug].topPick = newTop;
          videoManifest[chapterSlug].alternates = newAlternates;
          videoManifest[chapterSlug].lastChecked = new Date().toISOString();
        }
      }
    }

    if (!options.dryRun) {
      fs.writeFileSync(videoManifestPath, JSON.stringify(videoManifest, null, 2), 'utf-8');
    }
  }

  if (!options.dryRun) {
    fs.writeFileSync(REVIEW_QUEUE_PATH, JSON.stringify(reviewQueue, null, 2), 'utf-8');
    fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(changelog, null, 2), 'utf-8');
  }

  console.log(`\n✅ Pipeline complete: ${totalVideosProcessed} videos aligned. ${totalPromotions} promotions enacted.`);
  return {
    totalVideosProcessed,
    totalPromotions,
    reviewQueueLength: reviewQueue.length,
  };
}

if (process.argv[1] && process.argv[1].endsWith('align-videos.mjs')) {
  runAlignmentPipeline();
}
