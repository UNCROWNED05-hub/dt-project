'use client';

import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Shield, Cpu, RefreshCw } from 'lucide-react';

export interface ChangelogEntry {
  id: string;
  course: string;
  courseSlug?: string;
  title: string;
  newTop: string;
  score: string;
  reason: string;
}

interface FreshThisWeekProps {
  entries: ChangelogEntry[];
}

export function FreshThisWeek({ entries }: FreshThisWeekProps) {
  const [activeCourseFilter, setActiveCourseFilter] = useState<string>('all');
  const [flapKey, setFlapKey] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll state
  const isDown = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  const filteredEntries =
    activeCourseFilter === 'all'
      ? entries
      : entries.filter((e) => {
          const matchCourse = e.course.toLowerCase();
          if (activeCourseFilter === 'ai-ml') return matchCourse.includes('ai') || matchCourse.includes('ml');
          if (activeCourseFilter === 'cybersecurity') return matchCourse.includes('cyber');
          if (activeCourseFilter === 'iot') return matchCourse.includes('iot');
          return true;
        });

  const handleFilterChange = (filter: string) => {
    setActiveCourseFilter(filter);
    // Flips cleanly once on user chip selection
    setFlapKey((prev) => prev + 1);
  };

  const scrollPrev = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Pointer drag for manual scrubbing
  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onPointerUp = () => {
    isDown.current = false;
  };

  const onPointerLeave = () => {
    isDown.current = false;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-line">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-[10px] bg-fg text-bg text-xs font-display font-bold uppercase tracking-wider">
            Fresh Updates
          </span>
          <span className="text-xs font-body text-fg-muted">
            Audited daily against 12% dethroning threshold
          </span>
        </div>

        {/* Filter Chips & Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center space-x-1.5" role="group" aria-label="Filter updates by course">
            {[
              { id: 'all', label: 'All' },
              { id: 'ai-ml', label: 'AI & ML' },
              { id: 'cybersecurity', label: 'Cyber' },
              { id: 'iot', label: 'IoT' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleFilterChange(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  activeCourseFilter === chip.id
                    ? 'bg-accent text-on-accent font-bold shadow-sm'
                    : 'bg-bg border border-line text-fg-muted hover:text-fg'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 pl-2 border-l border-line">
            <button
              onClick={scrollPrev}
              aria-label="Previous update"
              className="w-8 h-8 rounded-lg bg-bg border border-line flex items-center justify-center text-fg hover:border-accent active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next update"
              className="w-8 h-8 rounded-lg bg-bg border border-line flex items-center justify-center text-fg hover:border-accent active:scale-95 transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Scroll-Snap Track */}
      <div
        ref={trackRef}
        key={flapKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        className="flex items-stretch space-x-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'thin' }}
      >
        {filteredEntries.map((item) => (
          <div
            key={item.id}
            className="w-[310px] sm:w-[340px] shrink-0 p-4 rounded-xl bg-bg border border-line flex flex-col justify-between space-y-3 snap-start hover:border-accent/60 transition-all animate-in fade-in duration-300"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-fg underline decoration-accent underline-offset-2">[{item.course}]</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-line font-bold text-fg tabular-nums">
                  {item.score} pts
                </span>
              </div>

              <h4 className="font-display font-bold text-sm text-fg leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-fg-muted font-body mt-1">
                New Top Pick: <strong className="text-fg">{item.newTop}</strong>
              </p>
            </div>

            <p className="text-[11px] font-body text-fg-muted leading-relaxed line-clamp-2 pt-2 border-t border-line/60">
              {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
