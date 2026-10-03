'use client';

import React, { useEffect, useState } from 'react';
import { Clock, ArrowRight, Shield, Cpu, Sparkles } from 'lucide-react';
import { Course, ChapterMeta, CourseTier } from '@/lib/types';
import { getStudentState } from '@/lib/storage';
import { RubberStampBadge } from '@/components/illustrations/Kit';

interface RoadmapViewProps {
  course: Course;
  chapters: ChapterMeta[];
}

export function RoadmapView({ course, chapters }: RoadmapViewProps) {
  const [studentProgress, setStudentProgress] = useState<Record<string, any>>({});
  const [activeTier, setActiveTier] = useState<CourseTier>('Beginner');

  useEffect(() => {
    const state = getStudentState();
    setStudentProgress(state.chapters);

    const onStateChange = () => {
      const s = getStudentState();
      setStudentProgress(s.chapters);
    };
    window.addEventListener('vellum_state_change', onStateChange);
    return () => window.removeEventListener('vellum_state_change', onStateChange);
  }, []);

  const tiers: CourseTier[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-12">
      {/* Sticky Tier Tabs */}
      <div className="sticky top-20 z-20 flex items-center space-x-2 p-1.5 rounded-pill bg-surface/90 backdrop-blur-md border border-line w-fit">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTier(t)}
            className={`px-4 py-1.5 rounded-pill text-xs font-mono font-bold transition-colors duration-150 ${
              activeTier === t
                ? 'bg-accent text-on-accent shadow-sm'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            {t} Tier
          </button>
        ))}
      </div>

      {tiers.map((tier) => {
        const tierChapters = chapters.filter((c) => c.tier === tier);
        if (tierChapters.length === 0) return null;

        return (
          <section
            key={tier}
            className={`space-y-6 ${activeTier === tier ? 'block' : 'opacity-90'}`}
          >
            {/* Tier Header with Editorial Divider */}
            <div className="flex items-center space-x-4">
              <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-pill bg-surface border border-line font-bold text-fg">
                {tier} Tier
              </span>
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs font-mono text-fg-muted">
                {tierChapters.length} Chapter{tierChapters.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Chapters Layout (Custom per course skin) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tierChapters.map((chapter) => {
                const prog = studentProgress[chapter.id];
                const isCompleted = prog?.completed || prog?.earnedStamp;

                // Skin 1: Cybersecurity Dossier Row Motif
                if (course.slug === 'cybersecurity') {
                  return (
                    <a
                      key={chapter.id}
                      href={`/${course.slug}/${chapter.slug}`}
                      className="group relative flex flex-col justify-between p-6 rounded-card border border-line bg-surface hover:border-accent transition-all duration-200 hover:-translate-y-1 shadow-tactile text-fg overflow-hidden"
                    >
                      {/* Redaction Bar Motif on Cyber chapters */}
                      {!isCompleted && (
                        <div className="h-1.5 w-16 bg-accent rounded-full mb-3 opacity-90" />
                      )}

                      <div>
                        <div className="flex items-start justify-between mb-3 font-mono text-xs text-fg-muted">
                          <span className="font-display font-extrabold text-3xl text-fg-muted/40 group-hover:text-accent transition-colors">
                            {chapter.order < 10 ? `0${chapter.order}` : chapter.order}
                          </span>
                          {isCompleted ? (
                            <RubberStampBadge text="DECRYPTED" className="text-accent scale-90" />
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-bg border border-line text-[10px]">
                              {chapter.volatility}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-lg text-fg leading-snug group-hover:text-accent transition-colors mb-2">
                          {chapter.title}
                        </h3>

                        <p className="text-xs text-fg-muted font-body leading-relaxed line-clamp-2">
                          {chapter.promise}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-fg-muted">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span>{chapter.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center space-x-1 font-bold text-fg group-hover:translate-x-1 transition-transform group-hover:underline decoration-accent underline-offset-2">
                          <span>{isCompleted ? 'Review Dossier' : 'Execute'}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-accent" />
                        </div>
                      </div>
                    </a>
                  );
                }

                // Default / AI / IoT Card Motif
                return (
                  <a
                    key={chapter.id}
                    href={`/${course.slug}/${chapter.slug}`}
                    className="group relative flex flex-col justify-between p-6 rounded-card border border-line bg-surface hover:border-accent transition-all duration-200 hover:-translate-y-1 shadow-tactile text-fg"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <span className="font-display font-extrabold text-3xl sm:text-4xl text-fg-muted/40 group-hover:text-accent transition-colors">
                          {chapter.order < 10 ? `0${chapter.order}` : chapter.order}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          {isCompleted ? (
                            <RubberStampBadge text="MASTERED" className="text-accent scale-80" />
                          ) : (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg border border-line text-fg-muted">
                              {chapter.volatility}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-lg text-fg leading-snug group-hover:text-accent transition-colors mb-2">
                        {chapter.title}
                      </h3>

                      <p className="text-xs text-fg-muted font-body leading-relaxed line-clamp-2">
                        {chapter.promise}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-fg-muted">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{chapter.estimatedHours} hrs</span>
                      </div>

                      <div className="flex items-center space-x-1 font-bold text-fg group-hover:translate-x-1 transition-transform group-hover:underline decoration-accent underline-offset-2">
                        <span>{isCompleted ? 'Review' : 'Open'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-accent" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
