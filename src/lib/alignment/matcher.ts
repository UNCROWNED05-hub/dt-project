/**
 * src/lib/alignment/matcher.ts
 *
 * Text normalization, stemming, alias expansion, and keyword matching
 * with strict acronym co-occurrence guards.
 */

import { LearningObjective } from './types';

// Simple, fast deterministic English stemmer for technical education
export function simpleStem(word: string): string {
  const w = word.toLowerCase().trim();
  if (w.length <= 3) return w;

  return w
    .replace(/(?:ing|tion|tions|tional|ed|ies|es|s|al|ic|ive|ment|izer|izers|ize|ise)$/, '')
    .replace(/(?:ity|ities|ous|ness|able|ible)$/, '');
}

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return normalizeText(text).split(' ').filter(Boolean);
}

export function tokenizeAndStem(text: string): string[] {
  return tokenize(text).map(simpleStem);
}

export interface MatchResult {
  matched: boolean;
  score: number;
  matchedTerms: string[];
}

export interface AcronymGuardConfig {
  [acronym: string]: string[];
}

/**
 * Checks if a candidate text matches a Learning Objective:
 * 1. Checks exact/stemmed match for LO keywords and aliases on word boundaries.
 * 2. If matching an acronym, verifies that a required co-occurring term is present nearby.
 */
export function matchObjective(
  targetText: string,
  lo: LearningObjective,
  acronymGuards: AcronymGuardConfig = {}
): MatchResult {
  if (!targetText) {
    return { matched: false, score: 0, matchedTerms: [] };
  }

  const rawLower = targetText.toLowerCase();
  const normalizedTarget = normalizeText(targetText);
  const targetStems = new Set(tokenizeAndStem(targetText));

  const matchedTerms: string[] = [];
  let scoreSum = 0;

  // 1. Check aliases (highest precision)
  if (lo.aliases && lo.aliases.length > 0) {
    for (const alias of lo.aliases) {
      const normAlias = normalizeText(alias);
      if (normAlias.length > 0) {
        const regex = new RegExp(`\\b${normAlias}\\b`, 'i');
        if (regex.test(normalizedTarget)) {
          // Check if alias is an acronym that requires co-occurrence
          const upperAlias = alias.toUpperCase();
          if (acronymGuards[upperAlias]) {
            const requiredContext = acronymGuards[upperAlias];
            const hasContext = requiredContext.some((term) =>
              new RegExp(`\\b${normalizeText(term)}\\b`, 'i').test(normalizedTarget)
            );
            if (!hasContext) {
              continue; // Guard failed, do not match as acronym
            }
          }

          matchedTerms.push(alias);
          scoreSum += 1.0;
        }
      }
    }
  }

  // 2. Check LO Title key phrase match
  const normTitle = normalizeText(lo.title);
  if (normTitle && normalizedTarget.includes(normTitle)) {
    matchedTerms.push(lo.title);
    scoreSum += 1.0;
  }

  // 3. Check LO Keywords
  if (lo.keywords && lo.keywords.length > 0) {
    for (const kw of lo.keywords) {
      const normKw = normalizeText(kw);
      if (!normKw) continue;

      const upperKw = kw.toUpperCase();
      // Acronym guard check
      if (acronymGuards[upperKw]) {
        const regex = new RegExp(`\\b${normKw}\\b`, 'i');
        if (regex.test(normalizedTarget)) {
          const requiredContext = acronymGuards[upperKw];
          const hasContext = requiredContext.some((term) =>
            new RegExp(`\\b${normalizeText(term)}\\b`, 'i').test(normalizedTarget)
          );
          if (hasContext) {
            matchedTerms.push(kw);
            scoreSum += 0.8;
          }
        }
        continue;
      }

      // Multi-word keyword
      if (normKw.includes(' ')) {
        const regex = new RegExp(`\\b${normKw}\\b`, 'i');
        if (regex.test(normalizedTarget)) {
          matchedTerms.push(kw);
          scoreSum += 0.8;
        } else {
          // Check if all stemmed words appear in target
          const kwStems = normKw.split(' ').map(simpleStem);
          if (kwStems.every((st) => targetStems.has(st))) {
            matchedTerms.push(kw);
            scoreSum += 0.6;
          }
        }
      } else {
        // Single-word keyword: match word boundary or stem
        const regex = new RegExp(`\\b${normKw}\\b`, 'i');
        if (regex.test(normalizedTarget)) {
          matchedTerms.push(kw);
          scoreSum += 0.5;
        } else if (targetStems.has(simpleStem(normKw))) {
          matchedTerms.push(kw);
          scoreSum += 0.35;
        }
      }
    }
  }

  const uniqueTerms = Array.from(new Set(matchedTerms));
  const matched = uniqueTerms.length > 0;
  // Normalized score clamped between 0 and 1
  const finalScore = matched ? Math.min(1.0, scoreSum) : 0;

  return {
    matched,
    score: finalScore,
    matchedTerms: uniqueTerms,
  };
}
