'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
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
  const navRef = useRef<HTMLElement>(null);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tiers: CourseTier[] = ['Beginner', 'Intermediate', 'Advanced'];

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

  const scrollToTier = (slug: string, updateHash = true) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const stickyTop = isMobile ? 64 : 80;
    const navHeight = navRef.current?.offsetHeight || 44;
    const offset = stickyTop + navHeight + 16;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1500);

    if (updateHash && window.location.hash !== `#${slug}`) {
      window.history.pushState(null, '', `#${slug}`);
    }

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    });
  };

  const handleTierClick = (e: React.MouseEvent<HTMLAnchorElement>, tier: CourseTier, slug: string) => {
    e.preventDefault();
    setActiveTier(tier);
    scrollToTier(slug, true);
  };

  // Deep-link handling on mount (#beginner, #intermediate, #advanced)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'beginner' || hash === 'intermediate' || hash === 'advanced') {
      const matchedTier = tiers.find((t) => t.toLowerCase() === hash);
      if (matchedTier) {
        setActiveTier(matchedTier);
        const timer = setTimeout(() => {
          scrollToTier(hash, false);
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Scroll-spy listener to update active tier and hash during manual scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrollingRef.current) return;
      const navHeight = navRef.current?.offsetHeight || 56;
      const triggerY = navHeight + 80;

      let detectedTier: CourseTier = activeTier;
      for (const t of tiers) {
        const slug = t.toLowerCase();
        const el = document.getElementById(slug);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY && rect.bottom > triggerY) {
            detectedTier = t;
            break;
          }
        }
      }

      if (detectedTier !== activeTier) {
        setActiveTier(detectedTier);
        const slug = detectedTier.toLowerCase();
        if (window.location.hash !== `#${slug}`) {
          window.history.replaceState(null, '', `#${slug}`);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTier, tiers]);

  return (
    <div className="space-y-16">
      {/* Sticky Tier Navigation Bar (Semantic <nav> with Anchor Links) */}
      <nav
        ref={navRef}
        aria-label="Curriculum Tiers"
        className="sticky top-20 z-20 flex items-center space-x-2 p-1.5 rounded-pill bg-surface/90 backdrop-blur-md border border-line w-fit shadow-sm max-w-full overflow-x-auto"
      >
        {tiers.map((t) => {
          const slug = t.toLowerCase();
          const tierChapters = chapters.filter((c) => c.tier === t);
          const totalHours = tierChapters.reduce((acc, c) => acc + c.estimatedHours, 0);
          const isActive = activeTier === t;

          return (
            <a
              key={t}
              href={`#${slug}`}
              onClick={(e) => handleTierClick(e, t, slug)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative px-4 py-1.5 rounded-pill text-xs font-body transition-colors duration-150 shrink-0 select-none ${
                isActive
                  ? 'bg-accent text-on-accent font-bold shadow-sm'
                  : 'text-fg-muted hover:text-fg font-medium'
              }`}
            >
              <span>{t} Tier</span>
              <span className="ml-1.5 text-[11px] opacity-80 font-normal">
                ({tierChapters.length} ch • {totalHours}h)
              </span>
            </a>
          );
        })}
      </nav>

      {tiers.map((tier) => {
        const slug = tier.toLowerCase();
        const tierChapters = chapters.filter((c) => c.tier === tier);
        if (tierChapters.length === 0) return null;
        const totalHours = tierChapters.reduce((acc, c) => acc + c.estimatedHours, 0);

        return (
          <section
            key={tier}
            id={slug}
            style={{ scrollMarginTop: '138px' }}
            className="space-y-6 pt-2"
          >
            {/* Tier Header with Editorial Divider */}
            <div className="flex items-center space-x-4">
              <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-pill bg-surface border border-line font-bold text-fg">
                {tier} Tier
              </span>
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs font-mono text-fg-muted">
                {tierChapters.length} Chapter{tierChapters.length > 1 ? 's' : ''} • ~{totalHours} hrs
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
