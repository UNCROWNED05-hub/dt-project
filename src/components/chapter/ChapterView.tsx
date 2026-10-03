'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { Play, BookOpen, CheckCircle, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { Course, ChapterMeta } from '@/lib/types';
import { ParsedNotes } from '@/lib/content';
import { WatchFacade } from './WatchFacade';
import { ReadNotes } from './ReadNotes';
import { QuizWidget } from './QuizWidget';
import { recordChapterActivity, getStudentState } from '@/lib/storage';
import { RubberStampBadge, Underline } from '@/components/illustrations/Kit';

interface ChapterViewProps {
  course: Course;
  chapter: ChapterMeta;
  prevChapter: ChapterMeta | null;
  nextChapter: ChapterMeta | null;
  notes: ParsedNotes;
  videos: any;
  quiz: any[];
}

export function ChapterView({
  course,
  chapter,
  prevChapter,
  nextChapter,
  notes,
  videos,
  quiz,
}: ChapterViewProps) {
  const [activeTab, setActiveTab] = useState<'watch' | 'read' | 'practice'>('watch');
  const [earnedStamp, setEarnedStamp] = useState(false);

  useEffect(() => {
    recordChapterActivity(chapter.id);
    const state = getStudentState();
    if (state.chapters[chapter.id]?.earnedStamp) {
      setEarnedStamp(true);
    }
  }, [chapter.id]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Sticky Tab Header */}
      <div className="sticky top-0 z-30 w-full border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Link */}
            <a
              href={`/${course.slug}`}
              className="flex items-center space-x-1.5 text-xs font-mono text-fg-muted hover:text-fg transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{course.shortTitle}</span>
              <span className="sm:hidden">Back</span>
            </a>

            {/* Three Pillar Tabs with Sliding Underline Motif */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab('watch')}
                className={`relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-pill text-xs sm:text-sm font-mono font-semibold transition-colors duration-150 ${
                  activeTab === 'watch'
                    ? 'bg-accent text-on-accent shadow-sm'
                    : 'text-fg-muted hover:text-fg hover:bg-bg'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>1. Watch</span>
              </button>

              <button
                onClick={() => setActiveTab('read')}
                className={`relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-pill text-xs sm:text-sm font-mono font-semibold transition-colors duration-150 ${
                  activeTab === 'read'
                    ? 'bg-accent text-on-accent shadow-sm'
                    : 'text-fg-muted hover:text-fg hover:bg-bg'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>2. Read</span>
              </button>

              <button
                onClick={() => setActiveTab('practice')}
                className={`relative flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-pill text-xs sm:text-sm font-mono font-semibold transition-colors duration-150 ${
                  activeTab === 'practice'
                    ? 'bg-accent text-on-accent shadow-sm'
                    : 'text-fg-muted hover:text-fg hover:bg-bg'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>3. Practice</span>
                {earnedStamp && <span className="w-2 h-2 rounded-full bg-accent-2 ml-0.5" />}
              </button>
            </nav>

            {/* Stamp Indicator */}
            <div className="shrink-0">
              {earnedStamp ? (
                <RubberStampBadge text="VERIFIED" className="text-accent scale-75 origin-right" />
              ) : (
                <span className="text-[11px] font-mono text-fg-muted hidden sm:inline">
                  Ch {chapter.order < 10 ? `0${chapter.order}` : chapter.order}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chapter Content Viewport */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Chapter Title & Meta Chips */}
        <div className="space-y-4 pb-8 border-b border-line">
          <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
            <span className="uppercase font-semibold text-fg">{course.title}</span>
            <span>•</span>
            <span>Chapter {chapter.order}</span>
            <span>•</span>
            <span className="bg-surface px-2 py-0.5 rounded-pill border border-line text-[10px]">
              {chapter.tier} Tier
            </span>
          </div>

          <div className="flex items-baseline space-x-4">
            <span className="font-display font-extrabold text-4xl sm:text-6xl text-fg-muted/30 select-none">
              {chapter.order < 10 ? `0${chapter.order}` : chapter.order}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight leading-[1.05]">
              {chapter.title}
            </h1>
          </div>

          <p className="text-base sm:text-xl text-fg-muted font-body leading-relaxed max-w-3xl pt-1">
            {chapter.promise}
          </p>
        </div>

        {/* Tab 1: Watch */}
        {activeTab === 'watch' && (
          <WatchFacade
            chapterId={chapter.id}
            courseSlug={course.slug}
            chapterSlug={chapter.slug}
            videos={videos}
          />
        )}

        {/* Tab 2: Read */}
        {activeTab === 'read' && (
          <ReadNotes
            chapterId={chapter.id}
            notes={notes}
          />
        )}

        {/* Tab 3: Practice */}
        {activeTab === 'practice' && (
          <QuizWidget
            chapterId={chapter.id}
            courseSlug={course.slug}
            chapterSlug={chapter.slug}
            questions={quiz}
          />
        )}

        {/* Bottom Navigation Footer */}
        <div className="pt-12 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          {prevChapter ? (
            <a
              href={`/${course.slug}/${prevChapter.slug}`}
              className="flex items-center space-x-2 px-5 py-3 rounded-pill border border-line bg-surface hover:bg-bg text-fg shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: {prevChapter.title}</span>
            </a>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <a
              href={`/${course.slug}/${nextChapter.slug}`}
              className="flex items-center space-x-2 px-6 py-3 rounded-pill bg-accent text-on-accent font-bold shadow-tactile transition-all w-full sm:w-auto justify-center"
            >
              <span>Next: {nextChapter.title}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <a
              href={`/${course.slug}`}
              className="flex items-center space-x-2 px-6 py-3 rounded-pill bg-accent text-on-accent shadow-tactile transition-all w-full sm:w-auto justify-center font-bold"
            >
              <span>Track Complete! Return to Roadmap</span>
              <Award className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
