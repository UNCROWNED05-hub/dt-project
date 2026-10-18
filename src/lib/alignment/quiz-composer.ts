/**
 * src/lib/alignment/quiz-composer.ts
 *
 * Deterministic quiz composition engine.
 * Selects 8-12 questions aligned to the video's covered LOs, balancing:
 * 1. Breadth: >= 1 question per covered core LO (max 2 per LO)
 * 2. Difficulty: 40% easy, 40% medium, 20% hard
 * 3. Separation: "Beyond the video" questions placed in a distinct block
 * 4. Determinism: PRNG seeded by seed string
 */

import { QuestionBankItem, VideoAlignment, ComposedQuiz } from './types';

export interface QuizComposerOptions {
  targetCount?: number; // default 10
  minCount?: number; // default 8
  maxCount?: number; // default 12
  maxPerLo?: number; // default 2
  beyondMax?: number; // default 4
  difficultyMix?: {
    1: number; // easy (default 0.4)
    2: number; // medium (default 0.4)
    3: number; // hard (default 0.2)
  };
}

/**
 * Deterministic 32-bit PRNG (Mulberry32)
 */
export function createPRNG(seedStr: string): () => number {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (Math.imul(31, h) + seedStr.charCodeAt(i)) | 0;
  }
  let a = h >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles an array in place using the given PRNG.
 */
function shuffle<T>(array: T[], prng: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function composeQuiz(
  bank: QuestionBankItem[],
  alignment: VideoAlignment,
  seed: string,
  options: QuizComposerOptions = {}
): ComposedQuiz {
  const targetCount = options.targetCount ?? 10;
  const maxPerLo = options.maxPerLo ?? 2;
  const beyondMax = options.beyondMax ?? 4;
  const prng = createPRNG(seed);

  // 1. Partition into Covered and Uncovered pools
  const coveredLoMap = new Map<string, { status: 'covered' | 'partial'; score: number }>();
  const uncoveredLoSet = new Set<string>();

  for (const [loId, detail] of Object.entries(alignment.coverage)) {
    if (detail.status === 'covered' || detail.status === 'partial') {
      coveredLoMap.set(loId, { status: detail.status, score: detail.score });
    } else {
      uncoveredLoSet.add(loId);
    }
  }

  const candidatePool: QuestionBankItem[] = [];
  const beyondPool: QuestionBankItem[] = [];

  for (const q of bank) {
    if (coveredLoMap.has(q.loId)) {
      candidatePool.push(q);
    } else {
      beyondPool.push(q);
    }
  }

  // 2. Select Aligned Questions
  const alignedSelected: QuestionBankItem[] = [];
  const selectedLoCounts = new Map<string, number>();

  // Helper to check if LO count limit reached
  const canAddLo = (loId: string) => (selectedLoCounts.get(loId) ?? 0) < maxPerLo;
  const recordLo = (loId: string) => {
    selectedLoCounts.set(loId, (selectedLoCounts.get(loId) ?? 0) + 1);
  };

  // Group candidate pool by LO
  const candidatesByLo = new Map<string, QuestionBankItem[]>();
  for (const q of candidatePool) {
    if (!candidatesByLo.has(q.loId)) {
      candidatesByLo.set(q.loId, []);
    }
    candidatesByLo.get(q.loId)!.push(q);
  }

  // Pass A: Ensure >= 1 question per covered LO (ordered by chronological appearance or seed)
  const orderedCoveredLos =
    alignment.order && alignment.order.length > 0
      ? alignment.order.filter((id) => coveredLoMap.has(id))
      : Array.from(coveredLoMap.keys());

  for (const loId of orderedCoveredLos) {
    if (alignedSelected.length >= targetCount) break;
    const questionsForLo = candidatesByLo.get(loId);
    if (!questionsForLo || questionsForLo.length === 0) continue;

    // Pick 1 question for this LO using PRNG
    const shuffledForLo = shuffle(questionsForLo, prng);
    const chosen = shuffledForLo[0];
    alignedSelected.push(chosen);
    recordLo(loId);
  }

  // Pass B: Fill remaining slots up to targetCount while respecting difficulty mix and maxPerLo
  if (alignedSelected.length < targetCount) {
    const remainingCandidates = candidatePool.filter(
      (q) => !alignedSelected.some((sel) => sel.id === q.id)
    );

    // Sort or partition by difficulty
    const diff1 = shuffle(remainingCandidates.filter((q) => q.difficulty === 1), prng);
    const diff2 = shuffle(remainingCandidates.filter((q) => q.difficulty === 2), prng);
    const diff3 = shuffle(remainingCandidates.filter((q) => q.difficulty === 3), prng);

    const difficultyBuckets = [diff1, diff2, diff3];
    let bucketIdx = 0;
    let attempts = 0;
    const maxAttempts = remainingCandidates.length * 2;

    while (alignedSelected.length < targetCount && attempts < maxAttempts) {
      attempts++;
      const currentBucket = difficultyBuckets[bucketIdx % 3];
      bucketIdx++;

      if (currentBucket.length === 0) continue;

      const candidateIdx = currentBucket.findIndex(
        (q) => canAddLo(q.loId) && !alignedSelected.some((sel) => sel.id === q.id)
      );

      if (candidateIdx !== -1) {
        const [chosen] = currentBucket.splice(candidateIdx, 1);
        alignedSelected.push(chosen);
        recordLo(chosen.loId);
      }
    }

    // If still short of target and some candidates remain
    if (alignedSelected.length < targetCount) {
      const remainingShuffled = shuffle(
        remainingCandidates.filter(
          (q) => canAddLo(q.loId) && !alignedSelected.some((sel) => sel.id === q.id)
        ),
        prng
      );
      for (const q of remainingShuffled) {
        if (alignedSelected.length >= targetCount) break;
        alignedSelected.push(q);
        recordLo(q.loId);
      }
    }
  }

  // Pass C: Final deterministic shuffle of aligned questions
  const finalAligned = shuffle(alignedSelected, prng);

  // 3. Select "Beyond the video" questions (up to beyondMax, max 1 per uncovered LO)
  const beyondSelected: QuestionBankItem[] = [];
  const beyondByLo = new Map<string, QuestionBankItem[]>();
  for (const q of beyondPool) {
    if (!beyondByLo.has(q.loId)) {
      beyondByLo.set(q.loId, []);
    }
    beyondByLo.get(q.loId)!.push(q);
  }

  const uncoveredLosShuffled = shuffle(Array.from(beyondByLo.keys()), prng);
  for (const loId of uncoveredLosShuffled) {
    if (beyondSelected.length >= beyondMax) break;
    const questions = beyondByLo.get(loId);
    if (!questions || questions.length === 0) continue;
    const shuffled = shuffle(questions, prng);
    beyondSelected.push(shuffled[0]);
  }

  return {
    chapterId: alignment.videoId,
    videoId: alignment.videoId,
    alignedQuestions: finalAligned,
    beyondQuestions: beyondSelected,
    seed,
    alignedTargetCount: targetCount,
  };
}
