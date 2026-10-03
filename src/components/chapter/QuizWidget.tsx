'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Check } from 'lucide-react';
import { QuizQuestion } from '@/lib/types';
import { updateQuizScore, getStudentState } from '@/lib/storage';
import { TallyMarks, RubberStampBadge } from '@/components/illustrations/Kit';

interface QuizWidgetProps {
  chapterId: string;
  courseSlug: string;
  chapterSlug: string;
  questions: QuizQuestion[];
}

export function QuizWidget({ chapterId, courseSlug, chapterSlug, questions }: QuizWidgetProps) {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [earnedStamp, setEarnedStamp] = useState(false);

  useEffect(() => {
    setActiveQuestions(questions);
    const state = getStudentState();
    const ch = state.chapters[chapterId];
    if (ch) {
      setBestScore(ch.quizBestScore);
      setEarnedStamp(ch.earnedStamp);
    }
  }, [chapterId, questions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 rounded-card bg-surface border border-line text-center">
        <p className="text-fg-muted font-body">Quiz questions for this chapter are currently in editorial review.</p>
      </div>
    );
  }

  const handleSingleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleMultiSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => {
      const current = (prev[questionId] as number[]) || [];
      const exists = current.includes(optionIndex);
      const updated = exists ? current.filter((i) => i !== optionIndex) : [...current, optionIndex];
      return {
        ...prev,
        [questionId]: updated,
      };
    });
  };

  const isQuestionCorrect = (q: QuizQuestion): boolean => {
    const ans = userAnswers[q.id];
    if (q.type === 'multi') {
      const userList = (ans as number[]) || [];
      const correctList = q.correctIndices || [];
      if (userList.length !== correctList.length) return false;
      return correctList.every((val) => userList.includes(val));
    }
    return ans === q.correctIndex;
  };

  const calculateScore = () => {
    let correctCount = 0;
    const incorrectIds: string[] = [];

    activeQuestions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        correctCount += 1;
      } else {
        incorrectIds.push(q.id);
      }
    });

    const percent = Math.round((correctCount / activeQuestions.length) * 100);
    setSubmitted(true);

    const newlyEarned = updateQuizScore(chapterId, percent, incorrectIds);
    if (newlyEarned || percent >= 70) {
      setEarnedStamp(true);
    }
    if (percent > bestScore) {
      setBestScore(percent);
    }
  };

  const retryAll = () => {
    setActiveQuestions(questions);
    setUserAnswers({});
    setSubmitted(false);
  };

  const retryMissed = () => {
    const missed = activeQuestions.filter((q) => !isQuestionCorrect(q));
    if (missed.length > 0) {
      setActiveQuestions(missed);
      setUserAnswers({});
      setSubmitted(false);
    }
  };

  const correctCount = activeQuestions.filter((q) => isQuestionCorrect(q)).length;
  const currentPercent = Math.round((correctCount / activeQuestions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200 text-fg">
      {/* Top Status Bar with Pencil Tally Marks */}
      <div className="p-5 sm:p-6 rounded-card bg-surface border border-line flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-display font-bold text-xl text-fg">
              Mastery Verification Quiz
            </h3>
            <TallyMarks count={Math.min(5, Math.ceil(activeQuestions.length / 2))} className="w-8 h-4 text-accent" />
          </div>
          <p className="text-xs text-fg-muted font-body">
            {activeQuestions.length} conceptual & scenario questions • 70% threshold required for chapter stamp
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="text-right">
            <span className="text-fg-muted">Best Score: </span>
            <span className="font-bold text-fg">{bestScore}%</span>
          </div>
          {earnedStamp && (
            <RubberStampBadge text="VERIFIED" className="text-accent scale-90" />
          )}
        </div>
      </div>

      {/* Submitted Results Card */}
      {submitted && (
        <div className="p-6 sm:p-8 rounded-card border border-line bg-surface shadow-tactile-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-fg">
                {currentPercent >= 70 ? 'Chapter Mastery Achieved!' : 'Keep Practicing'}
              </h3>
              <p className="text-sm font-body text-fg-muted mt-1">
                You scored <strong className="font-mono text-fg text-base">{currentPercent}%</strong> ({correctCount} of {activeQuestions.length} correct).
                {currentPercent >= 70
                  ? ' Your official verification stamp has been permanently awarded.'
                  : ' Review the explanations below and retry missed questions.'}
              </p>
            </div>

            {currentPercent >= 70 && (
              <RubberStampBadge text="CHAPTER COMPLETE" className="text-accent text-sm px-5 py-2 scale-100" />
            )}
          </div>

          <div className="pt-4 border-t border-line flex flex-wrap items-center gap-3">
            <button
              onClick={retryAll}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-pill bg-bg border border-line text-xs font-mono font-semibold hover:bg-surface text-fg transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry All Questions</span>
            </button>

            {currentPercent < 100 && (
              <button
                onClick={retryMissed}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-pill bg-accent text-on-accent text-xs font-mono font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                <span>Retry Only Missed ({activeQuestions.length - correctCount})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-6">
        {activeQuestions.map((q, qIndex) => {
          const isCorrect = submitted && isQuestionCorrect(q);
          const isWrong = submitted && !isQuestionCorrect(q);

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-8 rounded-card border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-accent bg-surface/80'
                    : 'border-accent-2 bg-surface/80 animate-shake'
                  : 'border-line bg-surface shadow-tactile'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-accent">Question {qIndex + 1}</span>
                  <span>•</span>
                  <span className="bg-bg px-2 py-0.5 rounded-pill border border-line text-[10px]">
                    {q.difficulty}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{q.type === 'scenario' ? 'Scenario-Based' : q.type}</span>
                </div>
                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="text-accent font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-accent-2 font-bold flex items-center space-x-1">
                        <XCircle className="w-4 h-4" />
                        <span>Needs Review</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Scenario Context */}
              {q.scenarioContext && (
                <div className="my-3 p-3.5 rounded-xl bg-bg border border-line font-mono text-xs text-fg">
                  <span className="text-fg-muted block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Given Telemetry Context:
                  </span>
                  {q.scenarioContext}
                </div>
              )}

              {/* Prompt */}
              <h4 className="font-display font-bold text-lg text-fg my-2 leading-snug">
                {q.prompt}
              </h4>

              {/* Tactile Answer Slabs with Left-to-Right Ink Fill */}
              <div className="space-y-3 mt-5">
                {q.options.map((opt, optIndex) => {
                  const isSelected =
                    q.type === 'multi'
                      ? ((userAnswers[q.id] as number[]) || []).includes(optIndex)
                      : userAnswers[q.id] === optIndex;

                  const isCorrectOption =
                    q.type === 'multi'
                      ? (q.correctIndices || []).includes(optIndex)
                      : q.correctIndex === optIndex;

                  let slabClasses = 'border-line bg-bg hover:bg-surface text-fg';

                  if (submitted) {
                    if (isCorrectOption) {
                      slabClasses = 'border-accent bg-accent/20 text-fg font-semibold';
                    } else if (isSelected && !isCorrectOption) {
                      slabClasses = 'border-accent-2 bg-accent-2/20 text-fg';
                    }
                  } else if (isSelected) {
                    slabClasses = 'border-accent bg-accent/20 text-fg font-bold shadow-sm';
                  }

                  return (
                    <div
                      key={optIndex}
                      onClick={() =>
                        q.type === 'multi'
                          ? handleMultiSelect(q.id, optIndex)
                          : handleSingleSelect(q.id, optIndex)
                      }
                      className={`relative overflow-hidden p-4 rounded-2xl border cursor-pointer text-sm font-body transition-all duration-300 flex items-start space-x-3.5 ${slabClasses}`}
                    >
                      {/* Left-to-right ink-fill highlight on selection */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-accent/10 transition-transform duration-300 pointer-events-none" />
                      )}

                      <div className="mt-0.5 shrink-0 z-10">
                        {q.type === 'multi' ? (
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-accent border-accent text-on-accent' : 'border-line'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-accent bg-accent' : 'border-line'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-on-accent rounded-full" />}
                          </div>
                        )}
                      </div>

                      <span className="flex-1 leading-relaxed z-10">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanations */}
              {submitted && (
                <div className="mt-5 p-4 rounded-2xl bg-bg border border-line text-xs font-body text-fg leading-relaxed animate-in fade-in">
                  <div className="flex items-center space-x-1.5 font-mono font-bold text-fg-muted mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-accent" />
                    <span>Editorial Breakdown:</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={calculateScore}
            disabled={Object.keys(userAnswers).length === 0}
            className="px-8 py-3.5 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold shadow-tactile hover:opacity-90 disabled:opacity-50 transition-all"
          >
            Submit Quiz & Check Answers ({Object.keys(userAnswers).length}/{activeQuestions.length} answered)
          </button>
        </div>
      )}
    </div>
  );
}
