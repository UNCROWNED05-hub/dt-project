'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Play, Check, RotateCcw, Sparkles } from 'lucide-react';
import rankingConfig from '@/../ranking.config.json';
import quizAi01 from '@/../../content/ai-ml/what-ai-ml-really-are/quiz.json';

interface StepMeta {
  id: 'watch' | 'read' | 'practice';
  roman: string;
  name: string;
  tagline: string;
  description: string;
}

const STEPS: StepMeta[] = [
  {
    id: 'watch',
    roman: 'I',
    name: 'Watch',
    tagline: 'Autonomous Video Ranking',
    description:
      'Curated lectures scored on pedagogical traction, syllabus alignment, and channel authority — refreshed daily to keep pace with engineering.',
  },
  {
    id: 'read',
    roman: 'II',
    name: 'Read',
    tagline: 'Open-License Field Notes',
    description:
      'Six mandatory sections covering mathematical mechanics, runnable code, common traps, and verified legal citations under open licenses.',
  },
  {
    id: 'practice',
    roman: 'III',
    name: 'Practice',
    tagline: 'Tactile Scenario Mastery',
    description:
      'Interactive scenarios that simulate production failures. Answering correctly awards a rubber verification stamp stored locally on your device.',
  },
];

// Helper to format float score into 1-decimal tabular string
function formatScore(val: number): string {
  return val.toFixed(1);
}

export function ChapterSystemDeck() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteractedTouch, setHasInteractedTouch] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Watch Card State (3-State Machine)
  // State 0: Idle
  // State 1: Challenger candidate emerges, Check 1 passed
  // State 2: Check 2 passed, challenger dethrones incumbent (FLIP 800ms)
  const [watchState, setWatchState] = useState<0 | 1 | 2>(0);

  // Read Card State
  const [marginNoteOpen, setMarginNoteOpen] = useState<boolean>(false);

  // Practice Card State
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shakeWrong, setShakeWrong] = useState<boolean>(false);

  // Drag interaction refs
  const dragStartX = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const dragDistanceX = useRef<number>(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Keyboard navigation within the tablist
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let targetIdx = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIdx = (activeIndex + 1) % STEPS.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIdx = (activeIndex - 1 + STEPS.length) % STEPS.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIdx = STEPS.length - 1;
      }

      if (targetIdx !== -1) {
        setActiveIndex(targetIdx);
        // Focus active tab button
        const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        if (buttons && buttons[targetIdx]) {
          buttons[targetIdx].focus();
        }
      }
    },
    [activeIndex]
  );

  // Prev / Next actions
  const goPrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => Math.min(STEPS.length - 1, prev + 1));
  };

  const isPointerDownRef = useRef<boolean>(false);
  const pointerTargetRef = useRef<HTMLElement | null>(null);

  // Pointer drag events on the stage
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartTime.current = performance.now();
    dragDistanceX.current = 0;
    isPointerDownRef.current = true;
    pointerTargetRef.current = e.currentTarget as HTMLElement;
    setDragOffset(0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartX.current;
    dragDistanceX.current = deltaX;

    if (!isDragging && Math.abs(deltaX) > 6) {
      setIsDragging(true);
      try {
        pointerTargetRef.current?.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (isDragging) {
      // Apply rubber-banding at the ends
      let effectiveDelta = deltaX;
      if (activeIndex === 0 && deltaX > 0) {
        effectiveDelta = deltaX * 0.28;
      } else if (activeIndex === STEPS.length - 1 && deltaX < 0) {
        effectiveDelta = deltaX * 0.28;
      }
      setDragOffset(effectiveDelta);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (isDragging) {
      setIsDragging(false);
      try {
        if (pointerTargetRef.current?.hasPointerCapture(e.pointerId)) {
          pointerTargetRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {}

      const deltaX = dragDistanceX.current;
      const elapsed = Math.max(1, performance.now() - dragStartTime.current);
      const velocity = Math.abs(deltaX) / elapsed; // px per ms

      setHasInteractedTouch(true);
      setDragOffset(0);

      // Threshold: 48px or 0.35 px/ms
      if (deltaX < -48 || (deltaX < -15 && velocity >= 0.35)) {
        if (activeIndex < STEPS.length - 1) {
          setActiveIndex((prev) => prev + 1);
        }
      } else if (deltaX > 48 || (deltaX > 15 && velocity >= 0.35)) {
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
      }
    } else {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const onPointerCancel = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  // Card click handler: if user dragged > 6px, suppress click
  const handleCardClick = (targetIndex: number) => {
    if (Math.abs(dragDistanceX.current) > 6) {
      return; // Suppress accidental clicks after drag
    }
    setActiveIndex(targetIndex);
  };

  // -------------------------------------------------------------
  // Watch State Machine Handlers
  // -------------------------------------------------------------
  const advanceWatchState = () => {
    setWatchState((prev) => {
      if (prev === 0) return 1;
      if (prev === 1) return 2;
      return 0; // Reset
    });
  };

  const thresholdPercent = Math.round(((rankingConfig?.dethroningThreshold ?? 1.12) - 1) * 100);
  const consecutiveChecks = rankingConfig?.requiredConsecutiveChecks ?? 2;

  // -------------------------------------------------------------
  // Quiz Question Cycling Handlers
  // -------------------------------------------------------------
  const questions = Array.isArray(quizAi01) && quizAi01.length > 0 ? quizAi01 : [];
  const activeQuiz = questions[currentQuizIdx % questions.length] || {
    prompt: 'How does traditional software engineering differ fundamentally from machine learning?',
    options: [
      'Traditional engineering writes algorithms in Python, while machine learning algorithms are executed without code.',
      'Traditional engineering feeds human-written rules and data into a computer to produce answers; machine learning feeds data and answers to discover the underlying mathematical rules.',
      'Traditional engineering cannot process numerical datasets, whereas machine learning can only process text.',
      'Traditional engineering uses floating-point math, whereas machine learning requires quantum computing.',
    ],
    correctIndex: 1,
    explanation:
      'In classical programming, humans code explicit rules. In ML, the computer adjusts weight parameters to statistically discover the mapping between inputs and targets.',
  };

  const handleSelectQuizOption = (optIdx: number) => {
    setSelectedOption(optIdx);
    if (optIdx !== activeQuiz.correctIndex) {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setShakeWrong(false);
    setCurrentQuizIdx((prev) => (prev + 1) % questions.length);
  };

  // -------------------------------------------------------------
  // Calculate Card 3D Transform & Styles
  // -------------------------------------------------------------
  const getCardStyle = (cardIndex: number): React.CSSProperties => {
    const offset = cardIndex - activeIndex;

    // In Reduced Motion or Calm Mode: pure 2D cross-fade without 3D rotation
    if (isReducedMotion) {
      return {
        transform: `translateX(${offset * 100}%)`,
        opacity: offset === 0 ? 1 : 0,
        pointerEvents: offset === 0 ? 'auto' : 'none',
        transition: 'opacity 200ms ease, transform 200ms ease',
        zIndex: offset === 0 ? 30 : 10,
      };
    }

    // Interactive Drag Influence (pixels converted into approximate percentage)
    const dragPct = isDragging ? (dragOffset / (stageRef.current?.clientWidth || 600)) * 100 : 0;

    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let zIndex = 30;

    if (offset === 0) {
      translateX = dragPct * 0.45;
      translateZ = 0;
      rotateY = -dragPct * 0.12;
      scale = 1;
      zIndex = 30;
    } else if (offset === 1) {
      translateX = 16 + dragPct * 0.35;
      translateZ = -140;
      rotateY = -16 - dragPct * 0.1;
      scale = 0.94;
      zIndex = 20;
    } else if (offset === -1) {
      translateX = -16 + dragPct * 0.35;
      translateZ = -140;
      rotateY = 16 - dragPct * 0.1;
      scale = 0.94;
      zIndex = 20;
    } else if (offset === 2) {
      translateX = 26 + dragPct * 0.25;
      translateZ = -240;
      rotateY = -22;
      scale = 0.88;
      zIndex = 10;
    } else if (offset === -2) {
      translateX = -26 + dragPct * 0.25;
      translateZ = -240;
      rotateY = 22;
      scale = 0.88;
      zIndex = 10;
    } else {
      translateX = offset > 0 ? 40 : -40;
      translateZ = -300;
      rotateY = offset > 0 ? -30 : 30;
      scale = 0.8;
      zIndex = 5;
    }

    return {
      transform: `translate3d(${translateX}%, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      transition: isDragging ? 'none' : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
      zIndex,
      transformStyle: 'preserve-3d',
    };
  };

  return (
    <div className="space-y-8" onKeyDown={handleKeyDown}>
      {/* Visually hidden live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        Step {activeIndex + 1} of 3: {STEPS[activeIndex].name}
      </div>

      {/* Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* ======================================================== */}
        {/* LEFT 5 COLUMNS: Giant Word Tabs & Controller Controls     */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section Header */}
          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight">
              The Three-Part Chapter System
            </h2>
            <p className="text-sm font-body text-fg-muted">
              Every chapter follows a strict, deliberate progression. Explore each phase manually below.
            </p>
          </div>

          {/* Tablist: 3 Giant Words Stacked (Desktop) / Row (Mobile) */}
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Chapter Progression Steps"
            className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-4 sm:gap-6 lg:gap-4 snap-x"
          >
            {STEPS.map((step, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={step.id}
                  id={`tab-${step.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${step.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative text-left py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg transition-colors shrink-0 snap-start min-h-[44px] flex items-baseline space-x-3.5`}
                >
                  {/* Roman Folio */}
                  <span
                    className={`font-mono text-sm sm:text-base font-semibold transition-colors tabular-nums ${
                      isActive ? 'text-fg font-black' : 'text-fg-muted/70 group-hover:text-fg'
                    }`}
                  >
                    {step.roman}.
                  </span>

                  {/* Giant Step Word */}
                  <span className="relative inline-block">
                    <span
                      className={`font-display font-black tracking-tight leading-none transition-colors text-4xl sm:text-5xl lg:text-[clamp(3.5rem,5.5vw,5rem)] ${
                        isActive ? 'text-fg' : 'text-fg-muted/65 group-hover:text-fg'
                      }`}
                    >
                      {step.name}
                    </span>

                    {/* Hand-Drawn Accent Underline under Active Word */}
                    {isActive && (
                      <svg
                        className="absolute -bottom-2 left-0 w-full h-3 text-accent pointer-events-none"
                        viewBox="0 0 100 12"
                        preserveAspectRatio="none"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 2 8 Q 30 2, 60 7 T 98 5"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          className="animate-stroke"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Description & Controller Bar (Desktop Placement) */}
          <div className="hidden lg:block pt-4 border-t border-line space-y-5">
            <div className="min-h-[72px]">
              <p className="font-mono text-xs uppercase tracking-wider text-fg font-bold mb-1">
                <span className="px-1.5 py-0.5 rounded bg-bg border border-line text-fg mr-1.5 font-bold">Phase {STEPS[activeIndex].roman}</span>
                <span>{STEPS[activeIndex].tagline}</span>
              </p>
              <p className="font-body text-sm text-fg leading-relaxed transition-opacity duration-300">
                {STEPS[activeIndex].description}
              </p>
            </div>

            {/* Stepper Navigation Arrows & Counter */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  aria-label="Previous step"
                  className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-fg hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={goNext}
                  disabled={activeIndex === STEPS.length - 1}
                  aria-label="Next step"
                  className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-fg hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="font-mono text-xs font-bold text-fg-muted tabular-nums">
                <span className="text-fg text-sm">{activeIndex + 1}</span> / {STEPS.length}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT 7 COLUMNS: 3D Perspective Stack Stage              */}
        {/* ======================================================== */}
        <div className="lg:col-span-7">
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            style={{
              perspective: '1400px',
              touchAction: 'pan-y',
            }}
            className="relative w-full h-[520px] sm:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            {/* Touch Hint on Mobile / Touch Devices */}
            {!hasInteractedTouch && (
              <div className="absolute top-3 right-4 z-40 lg:hidden pointer-events-none px-2.5 py-1 rounded bg-bg/90 border border-line text-[11px] font-mono text-fg-muted shadow-sm flex items-center space-x-1.5">
                <span>← Swipe →</span>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* CARD 1: WATCH (Re-ranking Engine 3-State Machine)    */}
            {/* ---------------------------------------------------- */}
            <div
              id="panel-watch"
              role="tabpanel"
              aria-labelledby="tab-watch"
              style={getCardStyle(0)}
              onClick={() => handleCardClick(0)}
              className="absolute w-full max-w-[560px] h-full p-6 sm:p-7 rounded-2xl bg-surface border border-line shadow-tactile flex flex-col justify-between overflow-hidden"
            >
              {/* Dimming overlay when card is inactive */}
              {activeIndex !== 0 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(0);
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-bg/70 via-bg/40 to-transparent cursor-pointer z-20 rounded-2xl"
                  aria-hidden="true"
                />
              )}

              {/* Inner card content (inert when inactive) */}
              <div
                tabIndex={-1}
                aria-hidden={activeIndex !== 0}
                className={`space-y-4 flex flex-col justify-between h-full ${
                  activeIndex !== 0 ? 'pointer-events-none' : ''
                }`}
              >
                {/* Header Slab */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="font-display font-bold text-sm text-fg">
                        Curated Lecture Engine
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-fg-muted px-2 py-0.5 rounded bg-bg border border-line">
                      Sample numbers
                    </span>
                  </div>

                  {/* Two-Dot Indicator for Hysteresis Checks */}
                  <div className="flex items-center justify-between pt-3 text-xs font-mono">
                    <div className="flex items-center space-x-2 text-fg">
                      <span className="font-semibold text-fg-muted">Hysteresis Check:</span>
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-3 h-3 rounded-full border transition-colors ${
                            watchState >= 1 ? 'bg-accent border-accent' : 'bg-bg border-line'
                          }`}
                        />
                        <span
                          className={`w-3 h-3 rounded-full border transition-colors ${
                            watchState >= 2 ? 'bg-accent border-accent' : 'bg-bg border-line'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-fg-muted tabular-nums">
                        {watchState === 0
                          ? `0 of ${consecutiveChecks} passed`
                          : watchState === 1
                          ? `1 of ${consecutiveChecks} passed`
                          : `2 of ${consecutiveChecks} passed`}
                      </span>
                    </div>

                    <span className="text-[11px] text-fg-muted font-mono">Threshold +{thresholdPercent}%</span>
                  </div>
                </div>

                {/* Ranked Lecture Items (FLIP / Smooth Re-order) */}
                <div className="space-y-3 py-1">
                  {/* Candidate / Challenger Video */}
                  {watchState >= 1 && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all duration-700 ${
                        watchState === 2
                          ? 'bg-accent/10 border-accent order-1'
                          : 'bg-surface border-accent/60 shadow-sm animate-in slide-in-from-right duration-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-bold text-fg flex items-center space-x-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-accent text-on-accent text-[10px] font-bold">
                            NEW
                          </span>
                          <span>{watchState === 2 ? '#1 Top Pick (Dethroned)' : 'Challenger Candidate'}</span>
                        </span>
                        <span className="font-bold text-fg tabular-nums">
                          Score: {watchState === 2 ? '97.2' : '96.8'}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-fg leading-snug">
                        Visualizing Attention & Transformer Weights
                      </h4>
                      <p className="text-xs text-fg-muted font-body mt-0.5">3Blue1Brown • 26:45</p>
                    </div>
                  )}

                  {/* Incumbent #1 Video */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all duration-700 ${
                      watchState === 2
                        ? 'bg-bg border-line order-2 opacity-85'
                        : 'bg-accent/10 border-accent shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-fg flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <span>{watchState === 2 ? '#2 Runner-up (Incumbent)' : '#1 Top Pick'}</span>
                      </span>
                      <span className="font-bold text-fg tabular-nums">Score: 94.2</span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-fg leading-snug">
                      But What Is a Neural Network?
                    </h4>
                    <p className="text-xs text-fg-muted font-body mt-0.5">3Blue1Brown • 19:13</p>
                  </div>

                  {/* Alternate #2 Video */}
                  <div
                    className={`p-3 rounded-xl border bg-bg border-line transition-all duration-700 ${
                      watchState === 2 ? 'order-3' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-fg-muted flex items-center space-x-1.5">
                        <span>{watchState === 2 ? '#3 Alternate' : '#2 Alternate'}</span>
                      </span>
                      <span className="text-fg-muted tabular-nums">Score: 91.2</span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-fg leading-snug">
                      Gradient Descent, How Networks Learn
                    </h4>
                    <p className="text-xs text-fg-muted font-body mt-0.5">3Blue1Brown • 21:01</p>
                  </div>
                </div>

                {/* State Machine Action Keycap & Rule Caption */}
                <div className="pt-3 border-t border-line space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        advanceWatchState();
                      }}
                      className="w-full py-2.5 px-4 rounded-[13px] bg-fg text-bg font-display font-bold text-xs sm:text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      {watchState === 0 && <span>A better video appears</span>}
                      {watchState === 1 && <span>Run the second check</span>}
                      {watchState === 2 && (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset simulation</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-fg-muted font-body text-center leading-relaxed">
                    A newcomer must beat the current #1 by {thresholdPercent}% on {consecutiveChecks}{' '}
                    checks in a row.
                  </p>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 2: READ (Editorial Notes & Interactive Margin)   */}
            {/* ---------------------------------------------------- */}
            <div
              id="panel-read"
              role="tabpanel"
              aria-labelledby="tab-read"
              style={getCardStyle(1)}
              onClick={() => handleCardClick(1)}
              className="absolute w-full max-w-[560px] h-full p-6 sm:p-7 rounded-2xl bg-surface border border-line shadow-tactile flex flex-col justify-between overflow-hidden"
            >
              {/* Dimming overlay when card is inactive */}
              {activeIndex !== 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(1);
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-bg/70 via-bg/40 to-transparent cursor-pointer z-20 rounded-2xl"
                  aria-hidden="true"
                />
              )}

              {/* Inner card content (inert when inactive) */}
              <div
                tabIndex={-1}
                aria-hidden={activeIndex !== 1}
                className={`space-y-4 flex flex-col justify-between h-full ${
                  activeIndex !== 1 ? 'pointer-events-none' : ''
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="font-display font-bold text-sm text-fg">
                        Field Notebook Mock
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-fg-muted px-2 py-0.5 rounded bg-bg border border-line">
                      CC BY-SA 4.0
                    </span>
                  </div>

                  {/* Note Template Section Navigation Badges */}
                  <div className="pt-3 flex flex-wrap gap-1.5 text-[11px] font-mono text-fg-muted">
                    <span className="px-2 py-0.5 rounded bg-bg border border-line text-fg font-bold">
                      1. Why It Matters
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg border border-line">
                      2. Mechanics
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg border border-line">
                      3. Runnable Code
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg border border-line">
                      4. Common Traps
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg border border-line">
                      5. Cheat Sheet
                    </span>
                  </div>
                </div>

                {/* Interactive Reading Passage */}
                <div className="p-4 rounded-xl bg-bg border border-line space-y-3 font-body text-sm leading-relaxed text-fg">
                  <p>
                    In traditional computing, humans program explicit logic. In machine learning, an
                    algorithm iteratively adjusts mathematical parameters to discover relationships.{' '}
                    Tap the key concept below:
                  </p>

                  {/* Interactive Highlighted Term */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMarginNoteOpen((prev) => !prev);
                      }}
                      className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded font-semibold text-fg transition-all text-xs sm:text-sm cursor-pointer border ${
                        marginNoteOpen
                          ? 'bg-accent/25 border-accent'
                          : 'bg-surface border-line hover:border-accent'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span>Inductive Bias</span>
                      <span className="text-[10px] text-fg-muted font-mono">
                        {marginNoteOpen ? '(Close Note)' : '(Tap for Margin Note)'}
                      </span>
                    </button>
                  </div>

                  {/* Margin Note Flyout Slab */}
                  {marginNoteOpen && (
                    <div className="p-3.5 rounded-xl bg-surface border-l-4 border-accent text-xs font-body text-fg space-y-1 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <p className="font-bold text-accent font-mono text-[11px] uppercase">
                        Marginalia Note #14
                      </p>
                      <p className="leading-relaxed">
                        Every learning algorithm must make assumptions to generalize beyond training
                        rows. Without an inductive bias, every possible hypothesis remains equally
                        likely.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Citation Status */}
                <div className="pt-3 border-t border-line flex items-center justify-between text-xs font-body text-fg-muted">
                  <span>Verified Legal Citations: NIST & OWASP</span>
                  <span className="text-fg font-semibold font-mono text-[11px]">
                    10-min read
                  </span>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 3: PRACTICE (Tactile Scenario Quiz & Ink-Fill)   */}
            {/* ---------------------------------------------------- */}
            <div
              id="panel-practice"
              role="tabpanel"
              aria-labelledby="tab-practice"
              style={getCardStyle(2)}
              onClick={() => handleCardClick(2)}
              className="absolute w-full max-w-[560px] h-full p-6 sm:p-7 rounded-2xl bg-surface border border-line shadow-tactile flex flex-col justify-between overflow-hidden"
            >
              {/* Dimming overlay when card is inactive */}
              {activeIndex !== 2 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(2);
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-bg/70 via-bg/40 to-transparent cursor-pointer z-20 rounded-2xl"
                  aria-hidden="true"
                />
              )}

              {/* Inner card content (inert when inactive) */}
              <div
                tabIndex={-1}
                aria-hidden={activeIndex !== 2}
                className={`space-y-4 flex flex-col justify-between h-full ${
                  activeIndex !== 2 ? 'pointer-events-none' : ''
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="font-display font-bold text-sm text-fg">
                        Scenario Verification Lab
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-fg-muted px-2 py-0.5 rounded bg-bg border border-line">
                      Real Quiz Dataset
                    </span>
                  </div>

                  <p className="font-display font-bold text-sm sm:text-base text-fg pt-3 leading-snug">
                    {activeQuiz.prompt}
                  </p>
                </div>

                {/* 4 Interactive Answer Slabs */}
                <div className={`space-y-2 py-1 ${shakeWrong ? 'animate-shake' : ''}`}>
                  {activeQuiz.options.map((optionText, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === activeQuiz.correctIndex;

                    return (
                      <button
                        key={optIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectQuizOption(optIdx);
                        }}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-xl border text-xs font-body transition-all min-h-[44px] flex items-start space-x-2.5 ${
                          isSelected && isCorrect
                            ? 'bg-accent text-on-accent border-accent font-semibold shadow-sm'
                            : isSelected && !isCorrect
                            ? 'bg-red-950/20 text-fg border-red-500 font-semibold'
                            : 'bg-bg border-line hover:border-accent text-fg'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[11px] font-mono font-bold mt-0.5 ${
                            isSelected && isCorrect
                              ? 'bg-on-accent text-accent border-on-accent'
                              : 'bg-surface border-line text-fg'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed flex-1 line-clamp-2">{optionText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Slab: Checkmark / Stamp / Explanation */}
                <div className="pt-3 border-t border-line">
                  {selectedOption !== null ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {selectedOption === activeQuiz.correctIndex ? (
                          <div className="flex items-center space-x-2 text-xs font-mono text-fg font-bold">
                            <Check className="w-4 h-4 text-accent" />
                            <span>Correct answer verified!</span>
                          </div>
                        ) : (
                          <div className="text-xs font-mono text-red-500 font-bold">
                            Incorrect scenario selection.
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextQuizQuestion();
                          }}
                          className="px-3 py-1.5 rounded-[10px] bg-fg text-bg font-display font-bold text-xs hover:opacity-90 transition-opacity"
                        >
                          Try another question
                        </button>
                      </div>

                      {/* Tactile Rubber Stamp Badge if Correct */}
                      {selectedOption === activeQuiz.correctIndex && (
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-xs text-fg-muted font-body leading-relaxed line-clamp-2 pr-2">
                            {activeQuiz.explanation}
                          </p>
                          <div className="rubber-stamp text-accent shrink-0 text-[10px] py-1 px-2 font-mono">
                            VERIFIED • PASS
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-fg-muted font-body text-center">
                      Tap any slab to fill ink and test your conceptual understanding.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Step Description (Mobile Placement Below Deck) */}
          <div className="block lg:hidden pt-6 border-t border-line space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-fg font-bold mb-1">
                <span className="px-1.5 py-0.5 rounded bg-bg border border-line text-fg mr-1.5 font-bold">Phase {STEPS[activeIndex].roman}</span>
                <span>{STEPS[activeIndex].tagline}</span>
              </p>
              <p className="font-body text-sm text-fg leading-relaxed">
                {STEPS[activeIndex].description}
              </p>
            </div>

            {/* Stepper Navigation Arrows & Counter on Mobile */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  aria-label="Previous step"
                  className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-fg hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={goNext}
                  disabled={activeIndex === STEPS.length - 1}
                  aria-label="Next step"
                  className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-fg hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="font-mono text-xs font-bold text-fg-muted tabular-nums">
                <span className="text-fg text-sm">{activeIndex + 1}</span> / {STEPS.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
