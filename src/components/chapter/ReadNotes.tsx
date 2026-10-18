'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  ShieldCheck,
  AlertCircle,
  Play,
  BookOpen,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { markNotesRead, getStudentState } from '@/lib/storage';
import { ParsedNotes } from '@/lib/content';
import { LearningObjective, VideoAlignment } from '@/lib/alignment/types';
import { Underline } from '@/components/illustrations/Kit';

interface ReadNotesProps {
  chapterId: string;
  notes: ParsedNotes;
  objectives?: LearningObjective[] | null;
  modularNotes?: Record<string, string> | null;
  alignment?: VideoAlignment | null;
  followedVideoTitle?: string;
  orderMode?: 'canonical' | 'video';
  onToggleOrderMode?: (mode: 'canonical' | 'video') => void;
}

export function ReadNotes({
  chapterId,
  notes,
  objectives,
  modularNotes,
  alignment,
  followedVideoTitle,
  orderMode = 'canonical',
  onToggleOrderMode,
}: ReadNotesProps) {
  const [isRead, setIsRead] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const state = getStudentState();
    if (state.chapters[chapterId]?.notesRead) {
      setIsRead(true);
    }

    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [chapterId]);

  const handleMarkAsRead = () => {
    markNotesRead(chapterId);
    setIsRead(true);
  };

  const toggleReveal = (id: string) => {
    setRevealedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Determine whether to use modular notes or legacy notes
  const hasModularNotes = Boolean(modularNotes && objectives && objectives.length > 0);

  // Compute LO display order
  let orderedObjectives: LearningObjective[] = [];
  if (hasModularNotes && objectives) {
    if (orderMode === 'video' && alignment && alignment.order && alignment.order.length > 0) {
      const orderMap = new Map(alignment.order.map((id, idx) => [id, idx]));
      orderedObjectives = [...objectives].sort((a, b) => {
        const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
        const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
        if (idxA !== idxB) return idxA - idxB;
        return a.order - b.order;
      });
    } else {
      orderedObjectives = [...objectives].sort((a, b) => a.order - b.order);
    }
  }

  return (
    <article className="relative max-w-[68ch] mx-auto space-y-10 animate-in fade-in duration-200 text-fg">
      {/* Reading Progress Pencil Line Along Top */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-line/20">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* "Following: <Video>" Outline Banner */}
      {followedVideoTitle && (
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-fg font-bold">
                Aligned to this video&apos;s outline
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-fg line-clamp-1 mt-0.5">
                Following: {followedVideoTitle}
              </h3>
            </div>

            {/* Order Mode Toggle */}
            {hasModularNotes && onToggleOrderMode && (
              <div className="flex items-center space-x-1 p-1 bg-bg rounded-pill border border-line shrink-0">
                <button
                  onClick={() => onToggleOrderMode('canonical')}
                  className={`px-3 py-1 rounded-pill text-xs font-mono font-semibold transition-all ${
                    orderMode === 'canonical'
                      ? 'bg-accent text-on-accent shadow-sm'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  Canonical order
                </button>
                <button
                  onClick={() => onToggleOrderMode('video')}
                  className={`px-3 py-1 rounded-pill text-xs font-mono font-semibold transition-all ${
                    orderMode === 'video'
                      ? 'bg-accent text-on-accent shadow-sm'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  Video order
                </button>
              </div>
            )}
          </div>

          <p className="text-xs font-body text-fg-muted leading-relaxed">
            Concepts covered in the video feature timestamps matching the creator&apos;s outline.
            Concepts not covered in the video are clearly tagged so you can read them here.
          </p>
        </div>
      )}

      {/* Meta Header */}
      <div className="p-5 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-fg-muted">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-semibold text-fg">
            <Clock className="w-4 h-4 text-accent" />
            <span>{notes.readingTimeMinutes} min read</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Open License (CC BY-SA 4.0)</span>
          </span>
        </div>

        <div>
          <span className="px-2.5 py-1 rounded-pill bg-bg text-fg border border-line font-mono text-[11px]">
            Verified Curriculum ✓
          </span>
        </div>
      </div>

      {/* Modular Notes Rendering */}
      {hasModularNotes ? (
        <div className="space-y-12">
          {orderedObjectives.map((lo, idx) => {
            const rawMdx = modularNotes?.[lo.id] || '';
            const cov = alignment?.coverage[lo.id];
            const marker = cov?.evidence?.find((e) => e.kind === 'marker');
            const isCovered = cov?.status === 'covered';
            const isPartial = cov?.status === 'partial';
            const isUncovered = !cov || cov.status === 'none';

            return (
              <section
                key={lo.id}
                id={lo.id}
                className="p-6 sm:p-8 rounded-2xl bg-surface border border-line space-y-6 scroll-mt-24 shadow-sm"
              >
                {/* LO Header & Badge */}
                <div className="border-b border-line pb-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-fg-muted uppercase tracking-wider">
                      Objective {idx + 1} of {orderedObjectives.length} • {lo.tier.toUpperCase()}
                    </span>

                    {/* Tag indicating video alignment status */}
                    {marker && marker.t !== undefined ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-pill text-xs font-mono font-semibold badge-covered">
                        <Play className="w-3 h-3 fill-current" />
                        <span>
                          In this video at {Math.floor(marker.t / 60)}:
                          {(marker.t % 60).toString().padStart(2, '0')}
                        </span>
                      </span>
                    ) : isCovered ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-pill text-xs font-mono font-semibold badge-covered">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>In this video</span>
                      </span>
                    ) : isPartial ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-pill text-xs font-mono font-semibold badge-uncovered">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Partially in this video</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-pill text-xs font-mono font-semibold badge-uncovered">
                        <BookOpen className="w-3 h-3" />
                        <span>Not in this video: read this</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl text-fg tracking-tight">
                    {lo.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted pt-1">
                    <span className="px-2 py-0.5 rounded bg-bg border border-line text-[10px]">
                      Bloom: {lo.bloom}
                    </span>
                    <span>•</span>
                    <span>~{lo.estMinutes} mins</span>
                    {lo.prerequisites && lo.prerequisites.length > 0 && (
                      <>
                        <span>•</span>
                        <span>Prereq: {lo.prerequisites.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Render Markdown Sections */}
                <div className="prose max-w-none text-fg font-body text-base sm:text-lg leading-relaxed space-y-5">
                  {rawMdx.split('\n\n').map((paragraph, pIdx) => {
                    // Check Yourself Question & Reveal
                    if (paragraph.startsWith('### Check Yourself')) {
                      const qId = `${lo.id}-check`;
                      const isRevealed = revealedQuestions[qId];
                      return (
                        <div
                          key={pIdx}
                          className="mt-6 p-5 rounded-xl border border-line bg-bg/50 space-y-3"
                        >
                          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-fg uppercase">
                            <Lightbulb className="w-4 h-4 text-accent" />
                            <span>Check Yourself</span>
                          </div>
                          <p className="font-body text-sm text-fg">
                            {paragraph.replace('### Check Yourself', '').trim()}
                          </p>
                          <button
                            onClick={() => toggleReveal(qId)}
                            className="px-3 py-1.5 rounded-pill border border-line bg-surface hover:bg-bg text-xs font-mono font-semibold text-fg transition-all"
                          >
                            {isRevealed ? 'Hide Explanation' : 'Reveal Answer & Explanation'}
                          </button>
                        </div>
                      );
                    }

                    // Answer reveal block
                    if (paragraph.startsWith('**Answer:**')) {
                      const qId = `${lo.id}-check`;
                      if (!revealedQuestions[qId]) return null;
                      return (
                        <div
                          key={pIdx}
                          className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs font-body text-emerald-800 dark:text-emerald-200 animate-in fade-in"
                        >
                          {paragraph}
                        </div>
                      );
                    }

                    // Subheadings
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4
                          key={pIdx}
                          className="font-display font-bold text-lg sm:text-xl text-fg pt-2"
                        >
                          {paragraph.slice(4)}
                        </h4>
                      );
                    }

                    // Blockquotes / Warnings
                    if (paragraph.startsWith('> ')) {
                      return (
                        <blockquote
                          key={pIdx}
                          className="border-l-4 border-accent pl-4 italic text-fg-muted text-sm sm:text-base my-3"
                        >
                          {paragraph.slice(2)}
                        </blockquote>
                      );
                    }

                    return <p key={pIdx}>{paragraph}</p>;
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Legacy Note Rendering Fallback */
        <div className="prose max-w-none text-fg font-body text-lg leading-relaxed space-y-7">
          {notes.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return (
                <div key={idx} className="pt-8 pb-2 border-b border-line">
                  <h2
                    id={paragraph.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    className="font-display font-black text-2xl sm:text-3xl text-fg scroll-mt-24"
                  >
                    {paragraph.slice(3)}
                  </h2>
                  <Underline className="w-32 h-2 text-accent mt-1" />
                </div>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>
      )}

      {/* Completion Action */}
      <div className="pt-10 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-fg-muted">
          Finished reading these notes? Mark your progress.
        </div>
        <button
          onClick={handleMarkAsRead}
          disabled={isRead}
          className={`px-6 py-3 rounded-pill font-mono text-xs font-semibold shadow-tactile transition-all ${
            isRead
              ? 'bg-surface border border-line text-fg-muted cursor-default'
              : 'bg-accent text-on-accent hover:opacity-90'
          }`}
        >
          {isRead ? 'Notes Read ✓' : 'Mark as Read'}
        </button>
      </div>
    </article>
  );
}
