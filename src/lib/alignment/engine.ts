/**
 * src/lib/alignment/engine.ts
 *
 * Pure, deterministic coverage engine (no network, no LLMs, zero transcript scraping).
 * Maps official YouTube Data API v3 metadata to Learning Objectives (LOs).
 */

import {
  LearningObjective,
  VideoAlignment,
  LoCoverageDetail,
  EvidenceItem,
  AlignmentConfidence,
  CreatorMarker,
} from './types';
import { parseCreatorTimestamps } from './timestamp-parser';
import { matchObjective, AcronymGuardConfig } from './matcher';

export interface AlignmentConfig {
  evidenceWeights: {
    creatorMarker: number;
    videoTitle: number;
    descriptionLine: number;
    tag: number;
    override: number;
  };
  coverageThresholds: {
    covered: number;
    partial: number;
  };
  confidenceRules: {
    highMinMarkers: number;
    highMinCoreFoundFraction: number;
    mediumMinMarkers: number;
    mediumMinDescLength: number;
    mediumMinLoHits: number;
  };
  gatesForTopPick: {
    minCoreCoverage: number;
    allowMissingMustHave: boolean;
    minConfidence: string;
    minComposableQuizQuestions: number;
    alternateMinCoreCoverage: number;
  };
  acronyms: AcronymGuardConfig;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  tags?: string[];
  duration?: string;
}

export interface MaintainerOverride {
  videoId: string;
  coreCoverage?: number;
  confidence?: 'confirmed';
  order?: string[];
  coverage?: Record<
    string,
    {
      status: 'covered' | 'partial' | 'none';
      score?: number;
      evidence?: EvidenceItem[];
    }
  >;
}

function isPromoOrJunkLine(line: string): boolean {
  const lower = line.toLowerCase();
  // Hashtag dump
  if ((line.match(/#/g) || []).length >= 3) return true;
  // Social promo / sponsorship / affiliate links
  if (
    /\b(?:patreon|instagram|twitter|tiktok|discord|affiliate|sponsor|merch|discount code|paypal|buymeacoffee|follow me|subscribe to|all rights reserved)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  // Generic URL lines
  if (/^https?:\/\//i.test(line.trim())) return true;
  return false;
}

export function evaluateVideoAlignment(
  video: VideoMetadata,
  objectives: LearningObjective[],
  config: AlignmentConfig,
  override?: MaintainerOverride
): VideoAlignment {
  const coverageMap: Record<string, LoCoverageDetail> = {};
  const earliestAppearance: Record<string, number> = {};
  const coreLOs = objectives.filter((lo) => lo.tier === 'core');

  // 1. Check for Maintainer Override
  if (override && override.coverage) {
    let coveredCoreCount = 0;
    let partialCoreCount = 0;
    const mustHaveMissing: string[] = [];

    for (const lo of objectives) {
      const ov = override.coverage[lo.id];
      if (ov) {
        coverageMap[lo.id] = {
          status: ov.status,
          score: ov.score ?? (ov.status === 'covered' ? 1.0 : ov.status === 'partial' ? 0.5 : 0),
          evidence: ov.evidence || [{ kind: 'override', text: 'Maintainer confirmed alignment' }],
        };
      } else {
        coverageMap[lo.id] = { status: 'none', score: 0, evidence: [] };
      }

      if (lo.tier === 'core') {
        if (coverageMap[lo.id].status === 'covered') coveredCoreCount += 1;
        else if (coverageMap[lo.id].status === 'partial') partialCoreCount += 1;

        if (lo.mustHave && coverageMap[lo.id].status !== 'covered') {
          mustHaveMissing.push(lo.id);
        }
      }
    }

    const coreCoverage =
      coreLOs.length > 0 ? (coveredCoreCount + 0.5 * partialCoreCount) / coreLOs.length : 1.0;

    return {
      videoId: video.videoId,
      objectivesVersion: 1,
      confidence: 'confirmed',
      signals: ['maintainer_override'],
      coreCoverage: Math.round(coreCoverage * 100) / 100,
      mustHaveMissing,
      coverage: coverageMap,
      order: override.order || objectives.map((o) => o.id),
    };
  }

  // 2. Parse creator chapter markers from description
  const markers: CreatorMarker[] = parseCreatorTimestamps(video.description);
  const signals: string[] = [];
  if (markers.length >= 3) {
    signals.push(`creator_chapters_${markers.length}`);
  }

  // Pre-process description lines
  const descLines = (video.description || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 5 && !isPromoOrJunkLine(l));

  const tags = video.tags || [];

  let coreFoundInMarkers = 0;
  let totalLoHits = 0;

  // 3. Evaluate each Learning Objective
  for (const lo of objectives) {
    let score = 0;
    const evidence: EvidenceItem[] = [];
    let hasMarkerEvidence = false;
    let hasTitleEvidence = false;
    let hasTagEvidence = false;
    let hasDescEvidence = false;

    // A. Check Creator Markers (Highest weight: 1.0)
    for (const marker of markers) {
      const match = matchObjective(marker.title, lo, config.acronyms);
      if (match.matched) {
        score += match.score * config.evidenceWeights.creatorMarker;
        hasMarkerEvidence = true;
        evidence.push({
          kind: 'marker',
          text: marker.title,
          t: marker.seconds,
        });
        if (earliestAppearance[lo.id] === undefined || marker.seconds < earliestAppearance[lo.id]) {
          earliestAppearance[lo.id] = marker.seconds;
        }
      }
    }

    // B. Check Video Title (Weight: 0.8)
    if (video.title) {
      const match = matchObjective(video.title, lo, config.acronyms);
      if (match.matched) {
        score += match.score * config.evidenceWeights.videoTitle;
        hasTitleEvidence = true;
        evidence.push({
          kind: 'title',
          text: video.title,
          t: 0,
        });
        if (earliestAppearance[lo.id] === undefined) {
          earliestAppearance[lo.id] = 0;
        }
      }
    }

    // C. Check Description lines (Weight: 0.5)
    for (let i = 0; i < descLines.length; i++) {
      const line = descLines[i];
      const match = matchObjective(line, lo, config.acronyms);
      if (match.matched) {
        score += match.score * config.evidenceWeights.descriptionLine;
        hasDescEvidence = true;
        evidence.push({
          kind: 'description',
          text: line.length > 80 ? `${line.slice(0, 77)}...` : line,
        });
        if (earliestAppearance[lo.id] === undefined) {
          // Use synthetic order index after markers
          earliestAppearance[lo.id] = 10000 + i * 10;
        }
        break; // Only count best description hit per LO to prevent dumping
      }
    }

    // D. Check Video Tags (Weight: 0.4)
    for (const tag of tags) {
      const match = matchObjective(tag, lo, config.acronyms);
      if (match.matched) {
        score += match.score * config.evidenceWeights.tag;
        hasTagEvidence = true;
        evidence.push({
          kind: 'tag',
          text: tag,
        });
        break;
      }
    }

    // Normalize score to max 1.0
    let finalScore = Math.min(1.0, score);

    // Hard Rule: Description-only evidence cannot exceed "partial"
    const onlyDescription = hasDescEvidence && !hasMarkerEvidence && !hasTitleEvidence && !hasTagEvidence;
    if (onlyDescription && finalScore >= config.coverageThresholds.covered) {
      finalScore = config.coverageThresholds.covered - 0.05; // Cap below covered threshold
    }

    // Determine status
    let status: 'covered' | 'partial' | 'none' = 'none';
    if (finalScore >= config.coverageThresholds.covered) {
      status = 'covered';
    } else if (finalScore >= config.coverageThresholds.partial) {
      status = 'partial';
    }

    if (status !== 'none') {
      totalLoHits += 1;
      if (hasMarkerEvidence && lo.tier === 'core') {
        coreFoundInMarkers += 1;
      }
    }

    coverageMap[lo.id] = {
      status,
      score: Math.round(finalScore * 100) / 100,
      evidence,
    };
  }

  // 4. Compute Core Coverage & Missing Must-Haves
  let coveredCoreCount = 0;
  let partialCoreCount = 0;
  const mustHaveMissing: string[] = [];

  for (const lo of coreLOs) {
    const cov = coverageMap[lo.id];
    if (cov.status === 'covered') {
      coveredCoreCount += 1;
    } else if (cov.status === 'partial') {
      partialCoreCount += 1;
    }

    if (lo.mustHave && cov.status !== 'covered') {
      mustHaveMissing.push(lo.id);
    }
  }

  const rawCoreCoverage =
    coreLOs.length > 0 ? (coveredCoreCount + 0.5 * partialCoreCount) / coreLOs.length : 1.0;
  const coreCoverage = Math.round(rawCoreCoverage * 100) / 100;

  // 5. Determine Confidence
  // high: >= 5 creator markers and >= 60% of core LOs found in them
  // medium: >= 3 markers, OR rich description (300+ chars) with >= 3 LO hits
  // low: anything else
  let confidence: AlignmentConfidence = 'low';
  const descLength = (video.description || '').length;

  const coreMarkerFraction = coreLOs.length > 0 ? coreFoundInMarkers / coreLOs.length : 0;

  if (
    markers.length >= config.confidenceRules.highMinMarkers &&
    coreMarkerFraction >= config.confidenceRules.highMinCoreFoundFraction
  ) {
    confidence = 'high';
  } else if (
    markers.length >= config.confidenceRules.mediumMinMarkers ||
    (descLength >= config.confidenceRules.mediumMinDescLength &&
      totalLoHits >= config.confidenceRules.mediumMinLoHits)
  ) {
    confidence = 'medium';
  }

  // 6. Compute Chronological Order
  // Sort covered/partial LOs by earliestAppearance timestamp
  const orderedLoinVideo = Object.keys(earliestAppearance).sort(
    (a, b) => earliestAppearance[a] - earliestAppearance[b]
  );

  return {
    videoId: video.videoId,
    objectivesVersion: 1,
    confidence,
    signals,
    coreCoverage,
    mustHaveMissing,
    coverage: coverageMap,
    order: orderedLoinVideo,
  };
}
