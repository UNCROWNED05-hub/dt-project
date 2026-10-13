'use client';

import React from 'react';
import Link from 'next/navigation';
import { ArrowRight, Play, BookOpen, CheckCircle, Flame, Clock, Award, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import { COURSES } from '@/lib/courses-data';
import { getChangelog } from '@/lib/content';
import { Underline, HighlighterSwipe, SketchArrow, Scribble, PencilDivider, TallyMarks, RubberStampBadge, NeuralHeroDoodle, CyberHeroDoodle, IoTHeroDoodle } from '@/components/illustrations/Kit';
import { ChapterSystemDeck } from '@/components/home/ChapterSystemDeck';
import { FreshThisWeek } from '@/components/home/FreshThisWeek';

export default function HomePage() {
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

  return (
    <div className="space-y-24 sm:space-y-32 pt-28 sm:pt-36 pb-20">
      {/* 1. ASYMMETRIC HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-pill bg-surface border border-line text-xs font-mono text-fg-muted shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent" />
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

      {/* 3. FRESH THIS WEEK (MANUAL SCROLL-SNAP ROW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FreshThisWeek entries={changelog} />
      </section>

      {/* 4. THE THREE-PART CHAPTER SYSTEM (MANUAL 3D DECK) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChapterSystemDeck />
      </section>

      {/* 5. ASYMMETRIC BENTO GRID (6 Distinct Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-8">
          <h2 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight">
            Crafted for Focus, Not Algorithms
          </h2>
          <p className="text-sm font-body text-fg/85 max-w-xl">
            A transparent engineering library built for rigorous self-paced mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 5-Factor Ranking Engine */}
          <div className="md:col-span-2 p-8 rounded-card bg-surface border border-line shadow-tactile flex flex-col justify-between">
            <div>
              <span className="font-display text-xs font-bold text-fg flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Video Engine Architecture</span>
              </span>
              <h3 className="font-display font-bold text-2xl text-fg mt-2 mb-3">
                Autonomous 5-Factor Ranking
              </h3>
              <p className="text-sm text-fg/85 font-body leading-relaxed max-w-xl">
                Every video score combines engagement quality (likes/views Laplace-smoothed), traction velocity, 
                channel authority allow-lists, syllabus keyword fit, and volatility freshness decay. Refreshed daily with zero sponsored links.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-2 text-xs font-mono text-fg">
              <span className="px-2.5 py-1 rounded bg-bg border border-line tabular-nums">Engagement 25%</span>
              <span className="px-2.5 py-1 rounded bg-bg border border-line tabular-nums">Authority 25%</span>
              <span className="px-2.5 py-1 rounded bg-bg border border-line tabular-nums">Syllabus Fit 20%</span>
              <span className="px-2.5 py-1 rounded bg-bg border border-line tabular-nums">Freshness 15%</span>
            </div>
          </div>

          {/* Card 2: Open-Source Legal Ledger */}
          <div className="p-8 rounded-card bg-block-3 text-on-block-3 border border-line shadow-tactile flex flex-col justify-between">
            <div>
              <span className="font-display text-xs font-bold opacity-90">Legal Transparency</span>
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
              <span className="font-display text-xs font-bold text-fg flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Zero Tracking</span>
              </span>
              <h3 className="font-display font-bold text-2xl text-fg mt-2 mb-3">
                Your Progress Stays Local
              </h3>
              <p className="text-sm text-fg/85 font-body leading-relaxed">
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
              <span className="font-display text-xs font-bold text-fg flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Instant Navigation</span>
              </span>
              <h3 className="font-display font-bold text-2xl text-fg mt-2 mb-3">
                Static Fuzzy Command Palette
              </h3>
              <p className="text-sm text-fg/85 font-body leading-relaxed max-w-xl">
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
            <p className="text-sm sm:text-base text-fg/85 font-body">
              Pick a track, learn the foundational equations and protocols, and verify your understanding today.
            </p>
          </div>

          <a
            href="/ai-ml/what-ai-ml-really-are"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-[14px] bg-fg text-bg font-display text-sm font-bold shadow-tactile hover:-translate-y-0.5 transition-all shrink-0 active:scale-95"
          >
            <span>Begin Chapter 01</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
