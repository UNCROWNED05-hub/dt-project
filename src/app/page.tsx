'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { ArrowRight, Play, BookOpen, CheckCircle, Flame, Clock, Award, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import { COURSES } from '@/lib/courses-data';
import { getChangelog } from '@/lib/content';
import { Underline, HighlighterSwipe, SketchArrow, Scribble, PencilDivider, TallyMarks, RubberStampBadge, NeuralHeroDoodle, CyberHeroDoodle, IoTHeroDoodle } from '@/components/illustrations/Kit';

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [reRankSimulated, setReRankSimulated] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const changelog = [
    {
      id: "c1",
      course: "AI & ML",
      title: "Transformers & LLMs",
      newTop: "Visualizing Attention (3Blue1Brown)",
      score: "96.5",
      reason: "Surpassed previous pick by 14.8% on syllabus fit"
    },
    {
      id: "c2",
      course: "Cybersecurity",
      title: "Web App Security",
      newTop: "OWASP Top 10 Lab (John Hammond)",
      score: "93.6",
      reason: "Updated 2026 taxonomy with live remediation"
    },
    {
      id: "c3",
      course: "IoT",
      title: "Microcontrollers in Practice",
      newTop: "Hardware Interrupts (Phil's Lab)",
      score: "96.2",
      reason: "Scored 16.1% higher in oscilloscope precision"
    }
  ];

  // Auto-cycle through the 3 interactive step demos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pt-28 sm:pt-36 pb-20">
      {/* 1. ASYMMETRIC HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-pill bg-surface border border-line text-xs font-mono text-fg-muted shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>Free Engineering Monograph • No Login Required</span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-fg">
              Stop hoarding tabs. <br />
              <span className="relative inline-block mt-2">
                <span className="font-accent italic font-normal text-fg">
                  Start learning.
                </span>
                <span className="absolute left-0 -bottom-2 w-full">
                  <Underline className="w-full h-3 text-accent" />
                </span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-fg-muted font-body max-w-2xl leading-relaxed pt-2">
              A physical study notebook for engineering minds. Master AI, Cybersecurity, and IoT 
              from first principles—guided by auto-ranked YouTube lectures, open-license notes, and scenario quizzes.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="/ai-ml"
                className="inline-flex items-center space-x-2 px-7 py-4 rounded-pill bg-accent text-on-accent font-mono text-sm font-bold shadow-tactile hover:-translate-y-0.5 transition-all"
              >
                <span>Pick a book</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center space-x-2 px-6 py-4 rounded-pill bg-surface border border-line text-fg font-mono text-sm font-semibold hover:bg-bg transition-colors"
              >
                <span>How we pick videos</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE SHELF (Three Overlapping Book-Spines) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-xs font-mono uppercase tracking-widest text-fg-muted">
            <span className="w-4 h-px bg-line" />
            <span>The Study Bookshelf</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-fg">
            Three Definitive Treatises
          </h2>
        </div>

        {/* Desktop: Overlapping Leaning Books / Mobile: Stacked Spines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end pt-6">
          {/* Book 1: AI & ML */}
          <a
            href="/ai-ml"
            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-card border border-line transition-all duration-300 md:-rotate-1 hover:rotate-0 hover:-translate-y-7 shadow-tactile hover:shadow-tactile-lg bg-block-1 text-on-block-1 min-h-[460px]"
          >
            {/* Top Bookmark Ribbon */}
            <div className="absolute top-0 right-8 w-6 h-10 bg-accent shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }} />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-wider font-bold opacity-80">
                  Vol. I • 65 Hours
                </span>
                <Sparkles className="w-5 h-5 text-accent" />
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight mb-2">
                AI & Machine Learning
              </h3>

              <p className="text-xs font-mono opacity-80 mb-6">
                From Vector Calculus to Transformers
              </p>

              <div className="py-4">
                <NeuralHeroDoodle className="w-24 h-24" />
              </div>
            </div>

            <div className="pt-4 border-t border-current/15 flex items-center justify-between text-xs font-mono">
              <span className="font-bold">10 Chapters • Beg to Adv</span>
              <span className="p-2 rounded-full bg-fg text-bg group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>

          {/* Book 2: Cybersecurity */}
          <a
            href="/cybersecurity"
            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-card border border-line transition-all duration-300 md:rotate-1 hover:rotate-0 hover:-translate-y-7 shadow-tactile hover:shadow-tactile-lg bg-block-3 text-on-block-3 min-h-[500px]"
          >
            {/* Top Bookmark Ribbon */}
            <div className="absolute top-0 right-8 w-6 h-10 bg-accent-2 shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }} />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-wider font-bold opacity-80">
                  Vol. II • 72 Hours
                </span>
                <Shield className="w-5 h-5 text-accent" />
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight mb-2">
                Cybersecurity & Defense
              </h3>

              <p className="text-xs font-mono opacity-80 mb-6">
                Threat Modeling & Ethical Defense Ops
              </p>

              <div className="py-4">
                <CyberHeroDoodle className="w-24 h-24" />
              </div>
            </div>

            <div className="pt-4 border-t border-current/15 flex items-center justify-between text-xs font-mono">
              <span className="font-bold">11 Chapters • Beg to Adv</span>
              <span className="p-2 rounded-full bg-fg text-bg group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>

          {/* Book 3: IoT */}
          <a
            href="/iot"
            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-card border border-line transition-all duration-300 md:-rotate-1 hover:rotate-0 hover:-translate-y-7 shadow-tactile hover:shadow-tactile-lg bg-block-2 text-on-block-2 min-h-[480px]"
          >
            {/* Top Bookmark Ribbon */}
            <div className="absolute top-0 right-8 w-6 h-10 bg-accent shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }} />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-wider font-bold opacity-80">
                  Vol. III • 68 Hours
                </span>
                <Cpu className="w-5 h-5 text-accent" />
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight mb-2">
                Internet of Things (IoT)
              </h3>

              <p className="text-xs font-mono opacity-80 mb-6">
                Embedded Hardware to Edge Intelligence
              </p>

              <div className="py-4">
                <IoTHeroDoodle className="w-24 h-24" />
              </div>
            </div>

            <div className="pt-4 border-t border-current/15 flex items-center justify-between text-xs font-mono">
              <span className="font-bold">10 Chapters • Beg to Adv</span>
              <span className="p-2 rounded-full bg-fg text-bg group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* 3. FRESH THIS WEEK TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-line shadow-sm overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-2.5 py-1 rounded-pill bg-accent text-on-accent text-[11px] font-mono font-bold uppercase">
              Fresh This Week
            </span>
            <span className="text-xs font-mono text-fg-muted hidden sm:inline">
              Automated 12% dethroning updates
            </span>
          </div>

          <div className="flex-1 overflow-x-auto flex items-center space-x-8 text-xs font-mono text-fg">
            {changelog.map((c) => (
              <div key={c.id} className="flex items-center space-x-2 shrink-0">
                <span className="text-fg font-bold underline decoration-accent underline-offset-2">[{c.course}]</span>
                <span className="font-semibold">{c.title}:</span>
                <span className="text-fg-muted">{c.newTop}</span>
                <span className="px-1.5 py-0.5 rounded bg-bg text-[10px] font-bold">{c.score}pts</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PINNED "HOW IT WORKS" & INTERACTIVE SIGNATURE DEMOS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="flex items-center space-x-3 text-xs font-mono uppercase tracking-widest text-fg-muted">
            <span className="w-4 h-px bg-line" />
            <span>Interactive Pedagogical Engine</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-fg">
            The Three-Part Chapter System
          </h2>
          <p className="text-fg-muted font-body max-w-xl text-base">
            Click through each stage to witness how real-time algorithms, open licenses, and instant scenario testing converge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Switcher */}
          <div className="lg:col-span-5 space-y-4">
            {/* Step 1 */}
            <div
              onClick={() => setActiveStep(1)}
              className={`p-6 rounded-card border cursor-pointer transition-all ${
                activeStep === 1
                  ? 'bg-surface border-accent shadow-tactile'
                  : 'bg-bg border-line hover:bg-surface/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                  activeStep === 1 ? 'bg-accent text-on-accent' : 'bg-surface border border-line text-fg'
                }`}>
                  1
                </span>
                <h3 className="font-display font-bold text-xl text-fg">Watch (Ranked Lectures)</h3>
              </div>
              <p className="text-xs sm:text-sm text-fg-muted font-body leading-relaxed pl-11">
                YouTube API v3 pipeline continuously benchmarks candidate lectures using engagement quality, traction, channel authority, and freshness.
              </p>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveStep(2)}
              className={`p-6 rounded-card border cursor-pointer transition-all ${
                activeStep === 2
                  ? 'bg-surface border-accent shadow-tactile'
                  : 'bg-bg border-line hover:bg-surface/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                  activeStep === 2 ? 'bg-accent text-on-accent' : 'bg-surface border border-line text-fg'
                }`}>
                  2
                </span>
                <h3 className="font-display font-bold text-xl text-fg">Read (Open-License Notes)</h3>
              </div>
              <p className="text-xs sm:text-sm text-fg-muted font-body leading-relaxed pl-11">
                7 mandatory sections: Why it matters, plain-English mechanics, runnable code, common traps, cheat sheet, and verified legal citations.
              </p>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveStep(3)}
              className={`p-6 rounded-card border cursor-pointer transition-all ${
                activeStep === 3
                  ? 'bg-surface border-accent shadow-tactile'
                  : 'bg-bg border-line hover:bg-surface/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                  activeStep === 3 ? 'bg-accent text-on-accent' : 'bg-surface border border-line text-fg'
                }`}>
                  3
                </span>
                <h3 className="font-display font-bold text-xl text-fg">Practice (Scenario Mastery)</h3>
              </div>
              <p className="text-xs sm:text-sm text-fg-muted font-body leading-relaxed pl-11">
                Original conceptual questions. Scoring 70% or more awards a rubber-drawn chapter verification stamp saved locally.
              </p>
            </div>
          </div>

          {/* Right: Live Interactive Demonstrations */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-card bg-surface border border-line shadow-tactile min-h-[380px] flex flex-col justify-center">
              {/* Demo 1: Re-Rank Simulation */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="font-mono text-xs font-bold uppercase text-fg">Live Re-Ranking Engine Demo</span>
                    <button
                      onClick={() => setReRankSimulated((p) => !p)}
                      className="px-3 py-1 rounded-pill bg-accent text-on-accent text-xs font-mono font-bold shadow-sm"
                    >
                      {reRankSimulated ? 'Reset Order' : 'Simulate Challenger Dethrone (+14%)'}
                    </button>
                  </div>

                  {/* Cards Swapping with FLIP effect */}
                  <div className="space-y-3 pt-2">
                    <div
                      className={`p-4 rounded-2xl border transition-all duration-500 ${
                        reRankSimulated
                          ? 'bg-accent/10 border-accent order-1'
                          : 'bg-bg border-line'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-bold text-fg flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          <span>{reRankSimulated ? '#1 Top Pick (Dethroned Challenger)' : '#2 Runner-up'}</span>
                        </span>
                        <span>Score: {reRankSimulated ? '96.5' : '88.2'}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-fg">
                        Visualizing Attention and Transformer Architecture
                      </h4>
                      <p className="text-xs text-fg-muted font-mono mt-0.5">3Blue1Brown • 26:45</p>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all duration-500 ${
                        reRankSimulated
                          ? 'bg-bg border-line opacity-80'
                          : 'bg-accent/10 border-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-bold text-fg flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          <span>{reRankSimulated ? '#2 Alternate (Old Incumbent)' : '#1 Top Pick'}</span>
                        </span>
                        <span>Score: 89.5</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-fg">
                        Attention Is All You Need Explained
                      </h4>
                      <p className="text-xs text-fg-muted font-mono mt-0.5">Yannic Kilcher • 34:10</p>
                    </div>
                  </div>

                  <p className="text-xs text-fg-muted font-mono pt-2">
                    *Hysteresis rule: Challenger replaces #1 only upon beating score by &ge; 12% across 2 runs.
                  </p>
                </div>
              )}

              {/* Demo 2: Reading Note Highlighter Simulation */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="font-mono text-xs font-bold uppercase text-fg">Interactive Editorial Notes Demo</span>
                    <span className="font-mono text-xs text-fg-muted">CC BY-SA 4.0</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-bg border border-line space-y-3 font-body text-sm leading-relaxed text-fg">
                    <p>
                      In classical software, humans code explicit rules. In{' '}
                      <span className="bg-accent/25 px-1 py-0.5 rounded font-semibold text-fg">
                        machine learning
                      </span>
                      , the computer adjusts weight parameters to statistically discover relationships from data.
                    </p>
                    <div className="p-3 rounded-xl bg-surface border-l-4 border-accent text-xs italic text-fg">
                      &ldquo;Margin Note: Never optimize for training loss at the expense of production generalization.&rdquo;
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-fg-muted pt-2">
                    <span>Includes: Runnable Code • Common Traps • Cheat Sheet</span>
                    <span className="text-fg font-semibold px-2 py-0.5 rounded bg-line/20">reviewed: false (Draft)</span>
                  </div>
                </div>
              )}

              {/* Demo 3: Quiz Ink-Fill & Stamp Simulation */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="font-mono text-xs font-bold uppercase text-fg">Tactile Scenario Quiz Demo</span>
                    <span className="font-mono text-xs text-fg-muted">Question 1 of 8</span>
                  </div>

                  <div className="space-y-3">
                    <p className="font-display font-semibold text-base text-fg">
                      Which principle of the CIA triad was preserved when an encrypted payload resisted unauthorized decryption?
                    </p>

                    <div
                      onClick={() => setQuizAnswered(true)}
                      className={`p-3.5 rounded-xl border cursor-pointer text-xs font-body transition-all ${
                        quizAnswered
                          ? 'bg-accent text-on-accent border-accent font-bold'
                          : 'bg-bg border-line hover:bg-surface text-fg'
                      }`}
                    >
                      Confidentiality (Correct answer — click to test ink fill)
                    </div>
                  </div>

                  {quizAnswered && (
                    <div className="pt-2 flex items-center justify-between animate-in fade-in">
                      <span className="text-xs font-mono text-fg">Mastery achieved! Score: 100%</span>
                      <RubberStampBadge text="VERIFIED • COMPLETE" className="text-accent" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ASYMMETRIC BENTO GRID (6 Distinct Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-xs font-mono uppercase tracking-widest text-fg-muted">
            <span className="w-4 h-px bg-line" />
            <span>Built Differently</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-fg">
            Crafted for Focus, Not Algorithms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 5-Factor Ranking Engine */}
          <div className="md:col-span-2 p-8 rounded-card bg-surface border border-line shadow-tactile flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-fg flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>01 • Video Engine</span>
              </span>
              <h3 className="font-display font-bold text-2xl text-fg mt-2 mb-3">
                Autonomous 5-Factor Ranking
              </h3>
              <p className="text-sm text-fg-muted font-body leading-relaxed max-w-xl">
                Every video score combines engagement quality (likes/views Laplace-smoothed), traction velocity, 
                channel authority allow-lists, syllabus keyword fit, and volatility freshness decay. No sponsored links, ever.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-2 text-xs font-mono text-fg">
              <span className="px-2.5 py-1 rounded bg-bg border border-line">Engagement 25%</span>
              <span className="px-2.5 py-1 rounded bg-bg border border-line">Authority 25%</span>
              <span className="px-2.5 py-1 rounded bg-bg border border-line">Syllabus Fit 20%</span>
              <span className="px-2.5 py-1 rounded bg-bg border border-line">Freshness 15%</span>
            </div>
          </div>

          {/* Card 2: Open-Source Legal Ledger */}
          <div className="p-8 rounded-card bg-block-3 text-on-block-3 border border-line shadow-tactile flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase font-bold opacity-80">02 • Legal Transparency</span>
              <h3 className="font-display font-bold text-2xl mt-2 mb-3">
                100% Free & Open
              </h3>
              <p className="text-sm font-body leading-relaxed opacity-90">
                Notes synthesized strictly from NIST, OWASP, D2L.ai, and OpenStax. All logged into a public credit ledger.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-current/20 flex items-center justify-between text-xs font-mono">
              <span>content/LICENSES.json</span>
              <a href="/sources" className="underline font-bold">View Ledger →</a>
            </div>
          </div>

          {/* Card 3: Local-First Privacy */}
          <div className="p-8 rounded-card bg-surface border border-line shadow-tactile flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-fg flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>03 • Zero Tracking</span>
              </span>
              <h3 className="font-display font-bold text-2xl text-fg mt-2 mb-3">
                Your Progress Stays Local
              </h3>
              <p className="text-sm text-fg-muted font-body leading-relaxed">
                Streaks, best scores, and completion stamps live in your browser&rsquo;s localStorage. No passwords, no surveillance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-fg">
              <div className="flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-accent fill-accent" />
                <span>codex_student_state_v1</span>
              </div>
              <span className="font-bold">Offline-Ready</span>
            </div>
          </div>

          {/* Card 4: Lightning Client Search */}
          <div className="md:col-span-2 p-8 rounded-card bg-surface border border-line shadow-tactile flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-fg flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>04 • Instant Navigation</span>
              </span>
              <h3 className="font-display font-bold text-2xl text-fg mt-2 mb-3">
                Static Fuzzy Command Palette
              </h3>
              <p className="text-sm text-fg-muted font-body leading-relaxed max-w-xl">
                Press <kbd className="px-1.5 py-0.5 bg-bg border border-line rounded font-mono text-xs">Ctrl+K</kbd> anywhere. 
                Fuzzy search across all 31 chapters, prerequisites, hours, and keywords with sub-10ms response on slow 2G connections.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-fg-muted">
              <span>Powered by client-side Fuse.js index</span>
              <span className="font-bold text-fg">Try searching &ldquo;Wireshark&rdquo;</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-card bg-surface border border-line shadow-tactile-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight">
              Open your field notebook.
            </h3>
            <p className="text-sm sm:text-base text-fg-muted font-body">
              Pick a track, learn the foundational equations and protocols, and verify your understanding today.
            </p>
          </div>

          <a
            href="/ai-ml/what-ai-ml-really-are"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-pill bg-accent text-on-accent font-mono text-sm font-bold shadow-tactile hover:-translate-y-0.5 transition-all shrink-0"
          >
            <span>Begin Chapter 01</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
