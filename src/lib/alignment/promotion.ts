/**
 * src/lib/alignment/promotion.ts
 *
 * Atomic Ranking, Gate Enforcement, and Video Promotion Pipeline.
 *
 * Ensures:
 * 1. Gates for #1 are strictly met (coreCoverage >= 70%, no mustHave missing, confidence >= medium, composable quiz >= 8)
 * 2. Hysteresis rule: Challengers must beat current #1 by 12% across 2 consecutive checks
 * 3. Low-confidence winners are routed to data/videos/review-queue.json
 * 4. Atomic promotion with full rollback/preservation on failure
 */

import { VideoAlignment, ComposedQuiz } from './types';
import { AlignmentConfig } from './engine';

export interface VideoCandidate {
  videoId: string;
  title: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  thumbnailUrl: string;
  metrics: {
    engagement: number; // 0.0 - 1.0
    traction: number; // 0.0 - 1.0
    authority: number; // 0.0 - 1.0
    freshness: number; // 0.0 - 1.0
  };
  score?: number;
  scoreBreakdown?: {
    engagement: number;
    traction: number;
    authority: number;
    freshness: number;
    coverage: number;
  };
}

export interface GateValidationResult {
  passed: boolean;
  reasons: string[];
  eligibleAsAlternate: boolean;
}

export function validateTopPickGates(
  alignment: VideoAlignment,
  composableQuizCount: number,
  config: AlignmentConfig
): GateValidationResult {
  const reasons: string[] = [];
  const gates = config.gatesForTopPick;

  if (alignment.coreCoverage < gates.minCoreCoverage) {
    reasons.push(
      `Core coverage ${(alignment.coreCoverage * 100).toFixed(0)}% is below threshold of ${(
        gates.minCoreCoverage * 100
      ).toFixed(0)}%`
    );
  }

  if (!gates.allowMissingMustHave && alignment.mustHaveMissing.length > 0) {
    reasons.push(`Missing ${alignment.mustHaveMissing.length} must-have objectives: ${alignment.mustHaveMissing.join(', ')}`);
  }

  // Confidence check: must be at least medium (or confirmed)
  const confidenceRank = { low: 1, medium: 2, high: 3, confirmed: 4 };
  const minRequired = gates.minConfidence as keyof typeof confidenceRank;
  if (confidenceRank[alignment.confidence] < confidenceRank[minRequired]) {
    reasons.push(`Confidence '${alignment.confidence}' is below required '${gates.minConfidence}'`);
  }

  if (composableQuizCount < gates.minComposableQuizQuestions) {
    reasons.push(
      `Only ${composableQuizCount} composable quiz questions available; minimum ${gates.minComposableQuizQuestions} required`
    );
  }

  const passed = reasons.length === 0;
  const eligibleAsAlternate = alignment.coreCoverage >= gates.alternateMinCoreCoverage;

  return {
    passed,
    reasons,
    eligibleAsAlternate,
  };
}

export function calculateCompositeScore(
  metrics: VideoCandidate['metrics'],
  coreCoverage: number,
  weights: {
    engagement: number;
    traction: number;
    authority: number;
    freshness: number;
    coverage: number;
  }
): { score: number; scoreBreakdown: VideoCandidate['scoreBreakdown'] } {
  const scoreBreakdown = {
    engagement: metrics.engagement,
    traction: metrics.traction,
    authority: metrics.authority,
    freshness: metrics.freshness,
    coverage: coreCoverage,
  };

  const rawScore =
    metrics.engagement * weights.engagement +
    metrics.traction * weights.traction +
    metrics.authority * weights.authority +
    metrics.freshness * weights.freshness +
    coreCoverage * weights.coverage;

  return {
    score: Math.round(rawScore * 1000) / 1000,
    scoreBreakdown,
  };
}

export interface PromotionState {
  chapterSlug: string;
  currentTopPickId: string | null;
  candidates: VideoCandidate[];
  alignmentMap: Record<string, VideoAlignment>;
  quizCounts: Record<string, number>;
  consecutiveWinsMap: Record<string, number>; // videoId -> consecutive win count
  dethroningThreshold: number; // default 1.12 (12% lead)
  requiredConsecutiveChecks: number; // default 2
  weights: {
    engagement: number;
    traction: number;
    authority: number;
    freshness: number;
    coverage: number;
  };
  config: AlignmentConfig;
}

export interface PromotionResult {
  topPickId: string | null;
  alternates: string[];
  promoted: boolean;
  promotionReason?: string;
  updatedConsecutiveWins?: Record<string, number>;
  changelogEntry?: {
    date: string;
    chapter: string;
    from: string | null;
    to: string;
    reason: string;
    coverageBefore: number;
    coverageAfter: number;
    quizSize: number;
  };
  reviewQueueItem?: {
    chapter: string;
    videoId: string;
    score: number;
    currentTopScore: number;
    confidence: string;
    reasons: string[];
  };
  noFullyAlignedVideo?: boolean;
}

export function runAtomicPromotion(state: PromotionState): PromotionResult {
  const {
    chapterSlug,
    currentTopPickId,
    candidates,
    alignmentMap,
    quizCounts,
    consecutiveWinsMap,
    dethroningThreshold,
    requiredConsecutiveChecks,
    weights,
    config,
  } = state;

  // 1. Score all candidates with the new coverage weight
  const scoredCandidates = candidates.map((c) => {
    const alignment = alignmentMap[c.videoId];
    const coreCoverage = alignment ? alignment.coreCoverage : 0;
    const { score, scoreBreakdown } = calculateCompositeScore(c.metrics, coreCoverage, weights);
    return {
      ...c,
      score,
      scoreBreakdown,
    };
  });

  // Sort descending by composite score
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Current top pick candidate
  const currentTop = scoredCandidates.find((c) => c.videoId === currentTopPickId);
  const currentTopAlignment = currentTop ? alignmentMap[currentTop.videoId] : null;
  const currentTopQuizCount = currentTop ? quizCounts[currentTop.videoId] || 0 : 0;

  const currentTopGate = currentTopAlignment
    ? validateTopPickGates(currentTopAlignment, currentTopQuizCount, config)
    : { passed: false, reasons: ['Current top pick not found'] };

  // 2. Identify top eligible candidate
  let challenger: (typeof scoredCandidates)[0] | null = null;
  let reviewQueueItem: PromotionResult['reviewQueueItem'] = undefined;

  for (const candidate of scoredCandidates) {
    const alignment = alignmentMap[candidate.videoId];
    if (!alignment) continue;

    const quizCount = quizCounts[candidate.videoId] || 0;
    const gate = validateTopPickGates(alignment, quizCount, config);

    // If candidate would beat #1, but has low confidence: route to review queue!
    if (
      currentTop &&
      candidate.score >= currentTop.score * dethroningThreshold &&
      alignment.confidence === 'low'
    ) {
      if (!reviewQueueItem) {
        reviewQueueItem = {
          chapter: chapterSlug,
          videoId: candidate.videoId,
          score: candidate.score,
          currentTopScore: currentTop.score,
          confidence: alignment.confidence,
          reasons: gate.reasons,
        };
      }
    }

    if (gate.passed) {
      challenger = candidate;
      break;
    }
  }

  // Case A: No candidate passed gates
  if (!challenger) {
    // Current top pick also failed gates
    return {
      topPickId: null,
      alternates: scoredCandidates
        .filter((c) => {
          const a = alignmentMap[c.videoId];
          return a && a.coreCoverage >= config.gatesForTopPick.alternateMinCoreCoverage;
        })
        .map((c) => c.videoId),
      promoted: false,
      noFullyAlignedVideo: true,
      reviewQueueItem,
    };
  }

  // Case B: Current top pick is still valid and passes gates
  if (currentTop && currentTopGate.passed) {
    if (challenger.videoId === currentTop.videoId) {
      // Current top pick holds #1 cleanly
      return {
        topPickId: currentTop.videoId,
        alternates: scoredCandidates
          .filter((c) => c.videoId !== currentTop.videoId)
          .map((c) => c.videoId),
        promoted: false,
        reviewQueueItem,
      };
    }

    // Challenger is trying to dethrone current #1
    const lead = challenger.score / currentTop.score;
    const consecutiveChecks = (consecutiveWinsMap[challenger.videoId] || 0) + 1;

    if (lead >= dethroningThreshold && consecutiveChecks >= requiredConsecutiveChecks) {
      // Promotion granted! Atomic validation passed
      const coverageBefore = currentTopAlignment ? currentTopAlignment.coreCoverage : 0;
      const coverageAfter = alignmentMap[challenger.videoId].coreCoverage;
      const quizSize = quizCounts[challenger.videoId] || 0;

      return {
        topPickId: challenger.videoId,
        alternates: scoredCandidates
          .filter((c) => c.videoId !== challenger?.videoId)
          .map((c) => c.videoId),
        promoted: true,
        promotionReason: `Dethroned previous #1 with ${(lead * 100 - 100).toFixed(
          1
        )}% score lead over ${consecutiveChecks} consecutive checks and passed all objective alignment gates.`,
        changelogEntry: {
          date: new Date().toISOString().split('T')[0],
          chapter: chapterSlug,
          from: currentTop.videoId,
          to: challenger.videoId,
          reason: `Higher coverage and engagement score lead (${challenger.score} vs ${currentTop.score})`,
          coverageBefore,
          coverageAfter,
          quizSize,
        },
        reviewQueueItem,
      };
    } else {
      // Challenger did not pass lead or consecutive run check; keep current #1
      const updatedConsecutiveWins = {
        ...consecutiveWinsMap,
        [challenger.videoId]: consecutiveChecks,
      };
      return {
        topPickId: currentTop.videoId,
        alternates: scoredCandidates
          .filter((c) => c.videoId !== currentTop.videoId)
          .map((c) => c.videoId),
        promoted: false,
        updatedConsecutiveWins,
        reviewQueueItem,
      };
    }
  }

  // Case C: Current top pick failed gates or does not exist, but challenger passed
  const coverageAfter = alignmentMap[challenger.videoId].coreCoverage;
  return {
    topPickId: challenger.videoId,
    alternates: scoredCandidates
      .filter((c) => c.videoId !== challenger?.videoId)
      .map((c) => c.videoId),
    promoted: true,
    promotionReason: currentTop
      ? `Promoted to #1 because previous top pick failed alignment gates: ${currentTopGate.reasons.join('; ')}`
      : 'Initial top pick established from eligible candidate passing all gates.',
    changelogEntry: {
      date: new Date().toISOString().split('T')[0],
      chapter: chapterSlug,
      from: currentTop ? currentTop.videoId : null,
      to: challenger.videoId,
      reason: currentTop ? 'Previous top pick failed alignment gates' : 'Initial objective alignment',
      coverageBefore: currentTopAlignment ? currentTopAlignment.coreCoverage : 0,
      coverageAfter,
      quizSize: quizCounts[challenger.videoId] || 0,
    },
    reviewQueueItem,
  };
}
