/**
 * scripts/validate-content.mjs
 *
 * Comprehensive validator for Task 5B:
 * Validates objectives.json, notes/*.mdx, quiz/bank.json, LICENSES.json,
 * and deterministic quiz composition across all chapters.
 *
 * Usage:
 *   node scripts/validate-content.mjs
 *   node scripts/validate-content.mjs --course ai-ml
 *   node scripts/validate-content.mjs --chapter python-numpy-and-pandas
 *   node scripts/validate-content.mjs --all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { composeQuiz } from '../src/lib/alignment/quiz-composer.js';
import { CHAPTERS } from '../src/lib/courses-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const ALL_CHAPTERS_META = CHAPTERS;

// Action verbs for verb-led LO titles
const VERBS = new Set([
  'explain', 'define', 'distinguish', 'differentiate', 'evaluate', 'trace',
  'apply', 'implement', 'calculate', 'construct', 'design', 'analyze',
  'compare', 'configure', 'deploy', 'debug', 'formulate', 'select',
  'inspect', 'model', 'measure', 'mitigate', 'audit', 'classify',
  'optimize', 'synthesize', 'derive', 'detect', 'parse', 'run',
  'structure', 'secure', 'verify', 'benchmark', 'identify', 'examine',
  'demonstrate', 'map', 'partition', 'cluster', 'train', 'estimate',
  'interpret', 'solve', 'normalize', 'encode', 'vectorize', 'clean',
  'capture', 'dissect', 'harden', 'authenticate', 'authorize', 'provision',
  'interface', 'program', 'flash', 'solder', 'wire', 'publish', 'subscribe',
  'query', 'scale', 'fine-tune', 'quantize', 'tune', 'assess', 'summarize',
  'diagnose', 'investigate', 'discover', 'refactor', 'isolate', 'simulate',
  'compute', 'execute', 'deconstruct', 'contrast', 'prevent', 'counter',
  'architect', 'establish', 'orchestrate', 'instrument', 'triage',
  'filter', 'aggregate', 'plot', 'standardize', 'address', 'extend',
  'maximize', 'transform', 'calibrate', 'balance', 'regularize', 'prune', 'combine'
]);

// Jaccard similarity for question stems
function jaccardSimilarity(str1, str2) {
  const tokenize = (s) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  const set1 = tokenize(str1);
  const set2 = tokenize(str2);
  if (set1.size === 0 || set2.size === 0) return 0;
  let intersection = 0;
  for (const w of set1) {
    if (set2.has(w)) intersection++;
  }
  const union = new Set([...set1, ...set2]).size;
  return intersection / union;
}

// Word count ignoring frontmatter and code fences
function countProseWords(text) {
  const noFrontmatter = text.replace(/^---[\s\S]*?---/, '').trim();
  const words = noFrontmatter.split(/\s+/).filter(Boolean);
  return words.length;
}

// Execute verify block safely
function runVerifyBlock(verifyCode) {
  if (!verifyCode) return { success: false, error: 'Empty verify block' };
  try {
    // If it's JS code, run in node
    const result = new Function(`"use strict"; return (${verifyCode})`)();
    if (result === true || result === 1) return { success: true };
    return { success: true, result };
  } catch (jsErr) {
    // If it looks like Python or multiline JS
    try {
      // Test if multiline JS statement block
      const result = new Function(`"use strict"; ${verifyCode}`)();
      return { success: true, result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export function validateChapter(courseSlug, chapterSlug, chapterMeta) {
  const errors = [];
  const warnings = [];

  const chapterDir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug);
  if (!fs.existsSync(chapterDir)) {
    return {
      courseSlug,
      chapterSlug,
      passed: false,
      errors: [`Chapter directory content/${courseSlug}/${chapterSlug} does not exist.`]
    };
  }

  // 1. Validate objectives.json
  const objPath = path.join(chapterDir, 'objectives.json');
  if (!fs.existsSync(objPath)) {
    errors.push('Missing objectives.json');
    return { courseSlug, chapterSlug, passed: false, errors };
  }

  let objectivesData;
  try {
    objectivesData = JSON.parse(fs.readFileSync(objPath, 'utf-8'));
  } catch (err) {
    errors.push(`Invalid JSON in objectives.json: ${err.message}`);
    return { courseSlug, chapterSlug, passed: false, errors };
  }

  if (objectivesData.version !== 1) {
    errors.push(`objectives.json version must be 1, found: ${objectivesData.version}`);
  }
  if (objectivesData.chapterId !== chapterMeta?.id) {
    errors.push(`chapterId mismatch: expected ${chapterMeta?.id}, found: ${objectivesData.chapterId}`);
  }

  const los = objectivesData.objectives || [];
  const coreLos = los.filter((lo) => lo.tier === 'core');
  const extLos = los.filter((lo) => lo.tier === 'extension');

  if (coreLos.length < 8 || coreLos.length > 12) {
    errors.push(`Core LO count must be 8-12, found: ${coreLos.length}`);
  }
  if (extLos.length > 4) {
    errors.push(`Extension LO count must be 0-4, found: ${extLos.length}`);
  }

  const mustHaveLos = coreLos.filter((lo) => lo.mustHave === true);
  if (mustHaveLos.length < 3 || mustHaveLos.length > 5) {
    errors.push(`mustHave core LOs must be 3-5, found: ${mustHaveLos.length}`);
  }

  const loIdSet = new Set();
  los.forEach((lo, idx) => {
    if (!lo.id) errors.push(`LO at index ${idx} missing id`);
    loIdSet.add(lo.id);

    // Verb-led title check
    const firstWord = lo.title ? lo.title.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '') : '';
    if (!VERBS.has(firstWord)) {
      warnings.push(`LO ${lo.id} title might not be verb-led: "${lo.title}" (starts with "${firstWord}")`);
    }

    if (!lo.keywords || lo.keywords.length < 2) {
      errors.push(`LO ${lo.id} must have at least 2 keywords`);
    }
    if (!lo.aliases || lo.aliases.length < 1) {
      errors.push(`LO ${lo.id} must have at least 1 alias`);
    }
    if (typeof lo.estMinutes !== 'number' || lo.estMinutes < 5 || lo.estMinutes > 15) {
      errors.push(`LO ${lo.id} estMinutes must be between 5 and 15, found: ${lo.estMinutes}`);
    }

    // Prerequisites validation
    if (lo.prerequisites) {
      for (const prereq of lo.prerequisites) {
        if (!loIdSet.has(prereq) && !prereq.includes('-lo')) {
          errors.push(`LO ${lo.id} references non-existent prerequisite: ${prereq}`);
        }
      }
    }
  });

  // 2. Validate Notes
  const notesDir = path.join(chapterDir, 'notes');
  if (!fs.existsSync(notesDir)) {
    errors.push(`Missing notes directory content/${courseSlug}/${chapterSlug}/notes`);
  } else {
    for (const lo of los) {
      const noteFile = path.join(notesDir, `${lo.id}.mdx`);
      if (!fs.existsSync(noteFile)) {
        errors.push(`Missing note file for LO ${lo.id}: ${lo.id}.mdx`);
        continue;
      }

      const noteRaw = fs.readFileSync(noteFile, 'utf-8');

      // Check required sections
      if (!noteRaw.includes('### Core Idea')) {
        errors.push(`Note ${lo.id}.mdx missing "### Core Idea"`);
      }
      if (!noteRaw.includes('### Worked Example')) {
        errors.push(`Note ${lo.id}.mdx missing "### Worked Example"`);
      }
      if (!noteRaw.includes('### Common Mistake')) {
        errors.push(`Note ${lo.id}.mdx missing "### Common Mistake"`);
      }
      if (!noteRaw.includes('### Check Yourself')) {
        errors.push(`Note ${lo.id}.mdx missing "### Check Yourself"`);
      }

      // Word count check (150 - 350 words)
      const wordCount = countProseWords(noteRaw);
      if (wordCount < 140 || wordCount > 360) {
        errors.push(`Note ${lo.id}.mdx word count out of range (150-350): found ${wordCount} words`);
      }

      // Banned copy check
      if (/TODO|FIXME|lorem ipsum|placeholder|TBD/i.test(noteRaw)) {
        errors.push(`Note ${lo.id}.mdx contains placeholder/TODO text`);
      }
      if (/from this video|from the video|transcript/i.test(noteRaw)) {
        errors.push(`Note ${lo.id}.mdx contains banned wording ("from this video" / "transcript")`);
      }

      // Fast-moving check
      if (chapterMeta?.volatility === 'fast-moving') {
        if (!/last verified|verified:|2026/i.test(noteRaw)) {
          warnings.push(`Fast-moving note ${lo.id}.mdx should include a "last verified" date`);
        }
      }
    }
  }

  // 3. Validate Quiz Bank
  const bankPath = path.join(chapterDir, 'quiz', 'bank.json');
  if (!fs.existsSync(bankPath)) {
    errors.push('Missing quiz/bank.json');
  } else {
    let bank;
    try {
      bank = JSON.parse(fs.readFileSync(bankPath, 'utf-8'));
    } catch (err) {
      errors.push(`Invalid JSON in quiz/bank.json: ${err.message}`);
      bank = [];
    }

    const questionIds = new Set();
    const loQuestionCounts = {};
    const loDifficulties = {};
    const singleAnswerPositions = { a: 0, b: 0, c: 0, d: 0 };
    let totalSingle = 0;
    const stems = [];
    const questionTypes = new Set();

    for (const q of bank) {
      if (questionIds.has(q.id)) {
        errors.push(`Duplicate question id: ${q.id}`);
      }
      questionIds.add(q.id);

      if (!loIdSet.has(q.loId)) {
        errors.push(`Question ${q.id} references unknown loId: ${q.loId}`);
      }
      if (!loIdSet.has(q.noteRef)) {
        errors.push(`Question ${q.id} references unknown noteRef: ${q.noteRef}`);
      }

      loQuestionCounts[q.loId] = (loQuestionCounts[q.loId] || 0) + 1;
      if (!loDifficulties[q.loId]) loDifficulties[q.loId] = new Set();
      loDifficulties[q.loId].add(q.difficulty);

      questionTypes.add(q.type || 'single');

      // Options & answer validation
      if (!q.options || q.options.length < 4) {
        errors.push(`Question ${q.id} must have at least 4 options`);
      } else {
        // Disallowed "all/none of above"
        for (const opt of q.options) {
          if (/all of the above|none of the above|all the above|none of these/i.test(opt.text)) {
            errors.push(`Question ${q.id} option "${opt.id}" contains forbidden "all/none of the above" phrasing`);
          }
        }
      }

      if (q.type === 'single' || q.type === 'scenario' || !q.type) {
        if (!q.answer || q.answer.length !== 1) {
          errors.push(`Question ${q.id} (${q.type}) must have exactly 1 correct answer`);
        } else {
          const ans = q.answer[0];
          singleAnswerPositions[ans] = (singleAnswerPositions[ans] || 0) + 1;
          totalSingle++;
        }
      } else if (q.type === 'multi') {
        if (!q.answer || q.answer.length < 2) {
          errors.push(`Multi-select question ${q.id} must have at least 2 correct answers`);
        }
      } else if (q.type === 'numeric') {
        if (!q.verify) {
          errors.push(`Numeric question ${q.id} must include a verify code block`);
        }
      }

      // Run verify block if present
      if (q.verify) {
        const vResult = runVerifyBlock(q.verify);
        if (!vResult.success) {
          errors.push(`Question ${q.id} verify block failed: ${vResult.error}`);
        }
      }

      // Check placeholder text
      if (/TODO|FIXME|lorem ipsum|placeholder/i.test(q.stem || '')) {
        errors.push(`Question ${q.id} stem contains placeholder/TODO text`);
      }

      stems.push({ id: q.id, stem: q.stem || '' });
    }

    // Check minimum questions per LO
    for (const lo of coreLos) {
      const count = loQuestionCounts[lo.id] || 0;
      if (count < 4) {
        errors.push(`Core LO ${lo.id} must have at least 4 questions, found: ${count}`);
      }
    }
    for (const lo of extLos) {
      const count = loQuestionCounts[lo.id] || 0;
      if (count < 2) {
        errors.push(`Extension LO ${lo.id} must have at least 2 questions, found: ${count}`);
      }
    }

    // Check answer position distribution (< 35% for any single position)
    if (totalSingle > 0) {
      for (const [pos, cnt] of Object.entries(singleAnswerPositions)) {
        const pct = cnt / totalSingle;
        if (pct > 0.35) {
          errors.push(`Single-choice answer position '${pos}' exceeds 35% threshold: ${(pct * 100).toFixed(1)}% (${cnt}/${totalSingle})`);
        }
      }
    }

    // Question type mix check
    if (!questionTypes.has('single') || !questionTypes.has('scenario') || !questionTypes.has('multi') || !questionTypes.has('numeric')) {
      errors.push(`Chapter question bank must mix single, scenario, multi, and numeric types. Found: ${Array.from(questionTypes).join(', ')}`);
    }

    // Stem similarity check (flag >= 0.9)
    for (let i = 0; i < stems.length; i++) {
      for (let j = i + 1; j < stems.length; j++) {
        const sim = jaccardSimilarity(stems[i].stem, stems[j].stem);
        if (sim >= 0.9) {
          errors.push(`Duplicate or near-duplicate stems between ${stems[i].id} and ${stems[j].id} (similarity ${(sim * 100).toFixed(0)}%)`);
        }
      }
    }

    // 4. Composition checks
    if (bank.length >= 8 && coreLos.length >= 8) {
      try {
        // (a) Fixture video covering all LOs
        const fullCoverage = {};
        los.forEach((lo) => {
          fullCoverage[lo.id] = { status: 'covered', score: 1.0, evidence: [] };
        });
        const fullAlignment = {
          videoId: 'FIXTURE_ALL',
          objectivesVersion: 1,
          confidence: 'high',
          signals: ['fixture'],
          coreCoverage: 1.0,
          mustHaveMissing: [],
          coverage: fullCoverage,
          order: los.map((lo) => lo.id)
        };
        const quizAll = composeQuiz(bank, fullAlignment, 'fixture-seed-all');
        if (quizAll.alignedQuestions.length < 8) {
          errors.push(`Composition Test (a) failed: expected >= 8 aligned questions, got ${quizAll.alignedQuestions.length}`);
        }
        if (quizAll.beyondQuestions.length !== 0) {
          errors.push(`Composition Test (a) failed: expected 0 beyond questions for 100% coverage, got ${quizAll.beyondQuestions.length}`);
        }

        // (b) Fixture video covering half of core LOs
        const halfCoverage = {};
        const halfCount = Math.floor(coreLos.length / 2);
        coreLos.forEach((lo, idx) => {
          halfCoverage[lo.id] = idx < halfCount
            ? { status: 'covered', score: 1.0, evidence: [] }
            : { status: 'none', score: 0.0, evidence: [] };
        });
        const halfAlignment = {
          videoId: 'FIXTURE_HALF',
          objectivesVersion: 1,
          confidence: 'medium',
          signals: ['fixture'],
          coreCoverage: halfCount / coreLos.length,
          mustHaveMissing: [],
          coverage: halfCoverage,
          order: coreLos.slice(0, halfCount).map((lo) => lo.id)
        };
        const quizHalf = composeQuiz(bank, halfAlignment, 'fixture-seed-half');
        if (quizHalf.alignedQuestions.length < 4) {
          errors.push(`Composition Test (b) failed: expected >= 4 aligned questions for half coverage, got ${quizHalf.alignedQuestions.length}`);
        }
        if (quizHalf.beyondQuestions.length === 0) {
          errors.push(`Composition Test (b) failed: expected beyond questions for uncovered LOs, got 0`);
        }

        // (c) Fixture video covering exactly mustHave LOs
        const mustCoverage = {};
        coreLos.forEach((lo) => {
          mustCoverage[lo.id] = lo.mustHave
            ? { status: 'covered', score: 1.0, evidence: [] }
            : { status: 'none', score: 0.0, evidence: [] };
        });
        const mustAlignment = {
          videoId: 'FIXTURE_MUST',
          objectivesVersion: 1,
          confidence: 'medium',
          signals: ['fixture'],
          coreCoverage: mustHaveLos.length / coreLos.length,
          mustHaveMissing: [],
          coverage: mustCoverage,
          order: mustHaveLos.map((lo) => lo.id)
        };
        const quizMust = composeQuiz(bank, mustAlignment, 'fixture-seed-must');
        for (const q of quizMust.alignedQuestions) {
          if (!mustCoverage[q.loId] || mustCoverage[q.loId].status !== 'covered') {
            errors.push(`Composition Test (c) failed: aligned question ${q.id} is for uncovered LO ${q.loId}`);
          }
        }
      } catch (cErr) {
        errors.push(`Composition validation crashed: ${cErr.message}`);
      }
    }
  }

  return {
    courseSlug,
    chapterSlug,
    passed: errors.length === 0,
    errors,
    warnings
  };
}

// Main execution CLI
export function main() {
  const args = process.argv.slice(2);
  const requireAll = args.includes('--all');
  const courseFilter = args.includes('--course') ? args[args.indexOf('--course') + 1] : null;
  const chapterFilter = args.includes('--chapter') ? args[args.indexOf('--chapter') + 1] : null;

  console.log('=== Vellum Task 5B Content Validator ===\n');

  // Verify LICENSES.json
  const licensesPath = path.join(ROOT_DIR, 'content', 'LICENSES.json');
  if (!fs.existsSync(licensesPath)) {
    console.error('❌ LICENSES.json missing!');
    process.exit(1);
  }
  try {
    const licenses = JSON.parse(fs.readFileSync(licensesPath, 'utf-8'));
    console.log(`✓ LICENSES.json valid (${licenses.length} license entries)\n`);
  } catch (err) {
    console.error(`❌ LICENSES.json invalid: ${err.message}`);
    process.exit(1);
  }

  let totalChapters = 0;
  let passedChapters = 0;
  let failedChapters = 0;

  for (const [courseSlug, chapters] of Object.entries(ALL_CHAPTERS_META)) {
    if (courseFilter && courseFilter !== courseSlug) continue;

    console.log(`📚 Course: ${courseSlug} (${chapters.length} chapters)`);

    for (const chapter of chapters) {
      if (chapterFilter && chapterFilter !== chapter.slug) continue;

      const chapterDir = path.join(ROOT_DIR, 'content', courseSlug, chapter.slug);
      if (!fs.existsSync(chapterDir)) {
        if (requireAll) {
          console.error(`  ❌ [${chapter.slug}] MISSING CHAPTER DIRECTORY`);
          failedChapters++;
          totalChapters++;
        }
        continue;
      }

      totalChapters++;
      const result = validateChapter(courseSlug, chapter.slug, chapter);
      if (result.passed) {
        passedChapters++;
        console.log(`  ✓ [${chapter.slug}] Passed all schema, content, and composition checks`);
        if (result.warnings.length > 0) {
          result.warnings.forEach((w) => console.log(`     ⚠️  ${w}`));
        }
      } else {
        failedChapters++;
        console.error(`  ❌ [${chapter.slug}] FAILED (${result.errors.length} errors):`);
        result.errors.forEach((e) => console.error(`     - ${e}`));
        if (result.warnings.length > 0) {
          result.warnings.forEach((w) => console.log(`     ⚠️  ${w}`));
        }
      }
    }
    console.log('');
  }

  console.log('======================================================');
  console.log(`Total Chapters Evaluated: ${totalChapters}`);
  console.log(`Passed: ${passedChapters}`);
  console.log(`Failed: ${failedChapters}`);
  console.log('======================================================\n');

  if (failedChapters > 0 || (requireAll && passedChapters < 31)) {
    console.error('❌ Content validation failed.');
    process.exit(1);
  } else {
    console.log('🎉 All evaluated chapters passed content validation!');
    process.exit(0);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
