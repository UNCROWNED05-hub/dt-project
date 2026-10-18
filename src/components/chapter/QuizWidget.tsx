'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  Check,
  Award,
  BookOpen,
  Flag,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { QuizQuestion } from '@/lib/types';
import { QuestionBankItem, VideoAlignment, LearningObjective } from '@/lib/alignment/types';
import { composeQuiz } from '@/lib/alignment/quiz-composer';
import {
  recordAlignedQuizScore,
  updateQuizScore,
  getStudentProgressV2,
} from '@/lib/storage';
import { TallyMarks, RubberStampBadge } from '@/components/illustrations/Kit';

interface QuizWidgetProps {
  chapterId: string;
  courseSlug: string;
  chapterSlug: string;
  questions: QuizQuestion[];
  alignment?: VideoAlignment | null;
  objectives?: LearningObjective[] | null;
  questionBank?: QuestionBankItem[] | null;
  followedVideoTitle?: string;
}

export function QuizWidget({
  chapterId,
  courseSlug,
  chapterSlug,
  questions,
  alignment,
  objectives = [],
  questionBank,
  followedVideoTitle,
}: QuizWidgetProps) {
  const [userAnswers, setUserAnswers] = useState<Record<string, number | number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [earnedStamp, setEarnedStamp] = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);

  // Initialize student progress
  useEffect(() => {
    const state = getStudentProgressV2();
    const ch = state.chapters[chapterId];
    if (ch) {
      setBestScore(ch.bestScore);
      setEarnedStamp(ch.earnedStamp);
    }
  }, [chapterId]);

  // Determine whether we are in modular alignment mode or legacy mode
  const isAlignedMode = Boolean(alignment && questionBank && questionBank.length > 0);

  // Deterministically compose quiz for followed video
  const composedQuiz = useMemo(() => {
    if (!isAlignedMode || !questionBank || !alignment) return null;
    const seed = `${chapterSlug}-${alignment.videoId}`;
    return composeQuiz(questionBank, alignment, seed, { targetCount: 10 });
  }, [isAlignedMode, questionBank, alignment, chapterSlug]);

  // If in aligned mode, convert question bank items to uniform renderable items
  const alignedItems = useMemo(() => {
    if (!composedQuiz) return [];
    return composedQuiz.alignedQuestions;
  }, [composedQuiz]);

  const beyondItems = useMemo(() => {
    if (!composedQuiz) return [];
    return composedQuiz.beyondQuestions;
  }, [composedQuiz]);

  // Legacy fallback questions
  const legacyQuestions = questions || [];

  if (!isAlignedMode && legacyQuestions.length === 0) {
    return (
      <div className="p-8 rounded-card bg-surface border border-line text-center">
        <p className="text-fg-muted font-body">Quiz questions for this chapter are currently in editorial review.</p>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIndex: number, isMulti: boolean) => {
    if (submitted) return;
    setUserAnswers((prev) => {
      if (isMulti) {
        const current = (prev[questionId] as number[]) || [];
        const exists = current.includes(optionIndex);
        const updated = exists ? current.filter((i) => i !== optionIndex) : [...current, optionIndex];
        return { ...prev, [questionId]: updated };
      }
      return { ...prev, [questionId]: optionIndex };
    });
  };

  // Evaluation for Aligned Mode QuestionBankItem
  const isBankQuestionCorrect = (q: QuestionBankItem): boolean => {
    const userAns = userAnswers[q.id];
    if (userAns === undefined) return false;

    if (q.type === 'multi') {
      const userSelected = (userAns as number[]) || [];
      const correctOptionIds = q.answer.map((a) => String(a));
      const userSelectedOptionIds = userSelected.map((idx) => q.options[idx]?.id);

      if (userSelectedOptionIds.length !== correctOptionIds.length) return false;
      return correctOptionIds.every((id) => userSelectedOptionIds.includes(id));
    }

    // Single choice: compare option ID
    const selectedOption = q.options[userAns as number];
    if (!selectedOption) return false;
    return q.answer.includes(selectedOption.id);
  };

  // Evaluation for Legacy Question
  const isLegacyQuestionCorrect = (q: QuizQuestion): boolean => {
    const ans = userAnswers[q.id];
    if (q.type === 'multi') {
      const userList = (ans as number[]) || [];
      const correctList = q.correctIndices || [];
      if (userList.length !== correctList.length) return false;
      return correctList.every((val) => userList.includes(val));
    }
    return ans === q.correctIndex;
  };

  const handleGradeQuiz = () => {
    if (isAlignedMode && composedQuiz && alignment) {
      let correctAligned = 0;
      const loResults: Array<{ loId: string; correct: boolean }> = [];

      for (const q of alignedItems) {
        const correct = isBankQuestionCorrect(q);
        if (correct) correctAligned++;
        loResults.push({ loId: q.loId, correct });
      }

      // Check beyond questions too for LO tracking
      for (const bq of beyondItems) {
        const correct = isBankQuestionCorrect(bq);
        loResults.push({ loId: bq.loId, correct });
      }

      const scorePercent =
        alignedItems.length > 0
          ? Math.round((correctAligned / alignedItems.length) * 100)
          : 0;

      setSubmitted(true);
      const newlyEarned = recordAlignedQuizScore(chapterId, alignment.videoId, scorePercent, loResults);

      if (newlyEarned || scorePercent >= 70) {
        setEarnedStamp(true);
      }
      if (scorePercent > bestScore) {
        setBestScore(scorePercent);
      }
    } else {
      // Legacy Mode grading
      let correctCount = 0;
      const incorrectIds: string[] = [];

      for (const q of legacyQuestions) {
        if (isLegacyQuestionCorrect(q)) {
          correctCount++;
        } else {
          incorrectIds.push(q.id);
        }
      }

      const percent = Math.round((correctCount / legacyQuestions.length) * 100);
      setSubmitted(true);

      const newlyEarned = updateQuizScore(chapterId, percent, incorrectIds);
      if (newlyEarned || percent >= 70) {
        setEarnedStamp(true);
      }
      if (percent > bestScore) {
        setBestScore(percent);
      }
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  // Score stats
  const totalAlignedCount = isAlignedMode ? alignedItems.length : legacyQuestions.length;
  const currentCorrectCount = isAlignedMode
    ? alignedItems.filter(isBankQuestionCorrect).length
    : legacyQuestions.filter(isLegacyQuestionCorrect).length;
  const currentPercent = totalAlignedCount > 0 ? Math.round((currentCorrectCount / totalAlignedCount) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-200 text-fg">
      {/* Top Banner: Video Alignment Context */}
      {followedVideoTitle && (
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
              Aligned to this video&apos;s outline
            </span>
            <h3 className="font-display font-bold text-base sm:text-lg text-fg line-clamp-1 mt-0.5">
              Testing material from: {followedVideoTitle}
            </h3>
            <p className="text-xs text-fg-muted font-body mt-1">
              Questions test only concepts covered in your selected video. Concepts not covered are placed in the separate &ldquo;Beyond the video&rdquo; section below.
            </p>
          </div>

          <button
            onClick={() => setShowReportModal(chapterId)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-pill border border-line bg-surface hover:bg-bg text-xs font-mono text-fg-muted hover:text-fg transition-all shrink-0 self-start sm:self-center"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report mismatch</span>
          </button>
        </div>
      )}

      {/* Progress & Stamp Header */}
      <div className="p-6 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-fg-muted uppercase">Verification Requirement</span>
            <span className="font-display font-bold text-base text-fg">
              Score &ge; 70% on video-aligned questions
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {earnedStamp && (
            <RubberStampBadge text="VERIFIED" className="text-accent scale-90" />
          )}

          <div className="text-right">
            <span className="text-xs font-mono text-fg-muted block">Best Score</span>
            <span className="font-mono font-bold text-lg text-accent">
              {bestScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Video-Aligned Questions Section */}
      <div className="space-y-6">
        <div className="border-b border-line pb-2 flex items-center justify-between">
          <h3 className="font-display font-bold text-xl text-fg flex items-center space-x-2">
            <span>Video-Aligned Questions</span>
            <span className="text-xs font-mono font-normal text-fg-muted">
              ({totalAlignedCount} questions)
            </span>
          </h3>

          {submitted && (
            <span className="font-mono text-xs font-bold text-accent">
              Result: {currentCorrectCount}/{totalAlignedCount} ({currentPercent}%)
            </span>
          )}
        </div>

        {isAlignedMode ? (
          alignedItems.map((q, qIndex) => {
            const isMulti = q.type === 'multi';
            const userAns = userAnswers[q.id];
            const isCorrect = isBankQuestionCorrect(q);

            return (
              <div
                key={q.id}
                className="p-6 sm:p-7 rounded-2xl border border-line bg-surface space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
                    <span className="font-bold text-fg">Question {qIndex + 1}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-bg border border-line">
                      {q.loId}
                    </span>
                    <span>•</span>
                    <span className="text-[10px]">
                      {q.difficulty === 1 ? 'Foundational' : q.difficulty === 2 ? 'Applied' : 'Advanced'}
                    </span>
                  </div>

                  {submitted && (
                    <span
                      className={`text-xs font-mono font-bold flex items-center space-x-1 ${
                        isCorrect ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <p className="font-body text-base sm:text-lg text-fg font-medium leading-relaxed">
                  {q.stem}
                </p>

                {/* Option Buttons */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = isMulti
                      ? ((userAns as number[]) || []).includes(optIdx)
                      : userAns === optIdx;
                    const isAnswerKey = q.answer.includes(opt.id);

                    let optionBorder = 'border-line hover:border-accent/60';
                    let optionBg = 'bg-bg/40 hover:bg-bg';

                    if (submitted) {
                      if (isAnswerKey) {
                        optionBorder = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200';
                        optionBg = '';
                      } else if (isSelected && !isAnswerKey) {
                        optionBorder = 'border-red-500/80 bg-red-500/10 text-red-800 dark:text-red-200';
                        optionBg = '';
                      }
                    } else if (isSelected) {
                      optionBorder = 'border-accent bg-accent/10';
                      optionBg = '';
                    }

                    return (
                      <button
                        key={opt.id}
                        data-testid="quiz-option"
                        onClick={() => handleSelectOption(q.id, optIdx, isMulti)}
                        disabled={submitted}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm font-body transition-all duration-150 flex items-start space-x-3 ${optionBorder} ${optionBg}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-line text-fg-muted'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 text-fg">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && (
                  <div className="mt-4 p-4 rounded-xl border border-line bg-bg text-xs font-body leading-relaxed text-fg-muted space-y-2 animate-in fade-in">
                    <p className="font-semibold text-fg">Explanation:</p>
                    <p>{q.explanation}</p>
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-mono">
                      <span>Aligned note reference:</span>
                      <a href={`#${q.loId}`} className="text-accent hover:underline">
                        Read note section ({q.loId}) &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Legacy Questions Fallback */
          legacyQuestions.map((q, qIndex) => {
            const isMulti = q.type === 'multi';
            const userAns = userAnswers[q.id];
            const isCorrect = isLegacyQuestionCorrect(q);

            return (
              <div
                key={q.id}
                className="p-6 sm:p-7 rounded-2xl border border-line bg-surface space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-fg-muted">Question {qIndex + 1}</span>
                  {submitted && (
                    <span
                      className={`text-xs font-mono font-bold ${
                        isCorrect ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {isCorrect ? 'Correct ✓' : 'Incorrect ✕'}
                    </span>
                  )}
                </div>

                <p className="font-body text-base text-fg font-medium">{q.prompt}</p>

                <div className="space-y-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = isMulti
                      ? ((userAns as number[]) || []).includes(optIdx)
                      : userAns === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx, isMulti)}
                        disabled={submitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm font-body transition-all ${
                          isSelected ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/50'
                        }`}
                      >
                        <span className="text-fg">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* "Beyond the Video" Section */}
      {isAlignedMode && beyondItems.length > 0 && (
        <div className="space-y-6 pt-6 border-t-2 border-dashed border-line">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-display font-bold text-xl text-fg">
                Beyond the Video (Optional Extension)
              </h3>
            </div>
            <p className="text-xs font-body text-fg-muted leading-relaxed">
              These objectives are in the syllabus but were not covered in your selected video. Answering them helps you test concepts you read in the Notes tab. They are scored as bonus knowledge and do not penalize your chapter verification stamp.
            </p>
          </div>

          <div className="space-y-6">
            {beyondItems.map((bq, bqIndex) => {
              const isMulti = bq.type === 'multi';
              const userAns = userAnswers[bq.id];
              const isCorrect = isBankQuestionCorrect(bq);

              return (
                <div
                  key={bq.id}
                  className="p-6 sm:p-7 rounded-2xl border border-line bg-surface/70 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
                      <span className="font-bold text-fg">Extension {bqIndex + 1}</span>
                      <span>•</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-bg border border-line">
                        {bq.loId}
                      </span>
                    </div>

                    <a
                      href={`#${bq.loId}`}
                      className="text-xs font-mono text-accent hover:underline flex items-center space-x-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Note ({bq.loId})</span>
                    </a>
                  </div>

                  <p className="font-body text-base text-fg font-medium leading-relaxed">
                    {bq.stem}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {bq.options.map((opt, optIdx) => {
                      const isSelected = isMulti
                        ? ((userAns as number[]) || []).includes(optIdx)
                        : userAns === optIdx;
                      return (
                        <button
                          key={opt.id}
                          data-testid="beyond-quiz-option"
                          onClick={() => handleSelectOption(bq.id, optIdx, isMulti)}
                          disabled={submitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm font-body transition-all ${
                            isSelected ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/50'
                          }`}
                        >
                          <span className="text-fg">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 p-4 rounded-xl border border-line bg-bg text-xs font-body text-fg-muted">
                      <p className="font-semibold text-fg">Explanation:</p>
                      <p className="mt-1">{bq.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
        {submitted ? (
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-pill border border-line bg-surface hover:bg-bg text-fg font-mono text-xs font-semibold shadow-sm transition-all w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Practice Quiz</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleGradeQuiz}
            className="flex items-center justify-center space-x-2 px-8 py-3.5 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold shadow-tactile transition-all hover:opacity-90 w-full sm:w-auto"
          >
            <Check className="w-4 h-4" />
            <span>Submit Practice Answers</span>
          </button>
        )}

        {submitted && earnedStamp && (
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            <Award className="w-4 h-4" />
            <span>Chapter Verified! Progress Saved.</span>
          </div>
        )}
      </div>

      {/* "Report Mismatch" Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/40 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-surface border border-line p-6 shadow-tactile-lg space-y-4 text-fg">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-accent" />
                <h3 className="font-display font-bold text-base text-fg">Report Quiz Mismatch</h3>
              </div>
              <button
                onClick={() => setShowReportModal(null)}
                className="font-mono text-xs text-fg-muted hover:text-fg px-2 py-1 rounded border border-line"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-fg-muted font-body leading-relaxed">
              Did a question test something not taught in the followed video without being placed in the &ldquo;Beyond the video&rdquo; section?
            </p>

            <div className="p-3 bg-bg rounded-xl border border-line text-xs font-mono text-fg space-y-1">
              <div>Chapter: {chapterSlug}</div>
              <div>Course: {courseSlug}</div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReportModal(null)}
                className="px-3 py-1.5 rounded-pill border border-line text-xs font-mono text-fg-muted hover:text-fg"
              >
                Cancel
              </button>
              <a
                href={`https://github.com/example/vellum/issues/new?title=Quiz+Mismatch+in+${chapterSlug}&body=Report+from+quiz+widget+in+${chapterSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowReportModal(null)}
                className="px-4 py-1.5 rounded-pill bg-accent text-on-accent text-xs font-mono font-semibold shadow-sm flex items-center space-x-1"
              >
                <span>File Issue on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
