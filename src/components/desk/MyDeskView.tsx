'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/navigation';
import { Flame, Award, Clock, ArrowRight, Play, BookOpen } from 'lucide-react';
import { getStudentState } from '@/lib/storage';
import { COURSES, CHAPTERS } from '@/lib/courses-data';
import { StudentState } from '@/lib/types';
import { TallyMarks, RubberStampBadge } from '@/components/illustrations/Kit';

export function MyDeskView() {
  const [state, setState] = useState<StudentState | null>(null);

  useEffect(() => {
    setState(getStudentState());
    const onStateChange = () => setState(getStudentState());
    window.addEventListener('vellum_state_change', onStateChange);
    return () => window.removeEventListener('vellum_state_change', onStateChange);
  }, []);

  if (!state) {
    return (
      <div className="py-20 text-center font-mono text-sm text-fg-muted">
        Opening your study field desk...
      </div>
    );
  }

  // Calculate course completion stats
  const courseStats = COURSES.map((course) => {
    const chapters = CHAPTERS[course.slug] || [];
    const completedCount = chapters.filter((c) => state.chapters[c.id]?.earnedStamp).length;
    const percent = Math.round((completedCount / chapters.length) * 100);
    return {
      course,
      total: chapters.length,
      completed: completedCount,
      percent,
    };
  });

  const totalStamps = Object.values(state.chapters).filter((c) => c.earnedStamp).length;

  // Find last active chapter
  let lastActiveChapter: any = null;
  let latestTime = 0;
  COURSES.forEach((course) => {
    const chs = CHAPTERS[course.slug] || [];
    chs.forEach((ch) => {
      const prog = state.chapters[ch.id];
      if (prog && prog.lastVisited) {
        const time = new Date(prog.lastVisited).getTime();
        if (time > latestTime) {
          latestTime = time;
          lastActiveChapter = { ...ch, courseTitle: course.title };
        }
      }
    });
  });

  if (!lastActiveChapter) {
    lastActiveChapter = {
      ...CHAPTERS['ai-ml'][0],
      courseTitle: 'AI & Machine Learning',
    };
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-200 text-fg">
      {/* Top Desk Header */}
      <div className="p-8 sm:p-12 rounded-card bg-surface border border-line shadow-tactile-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-fg-muted mb-2">
            <span>Engineer&rsquo;s Field Desk</span>
            <span>•</span>
            <span>Local Session</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-fg">
            Welcome to Your Study Desk
          </h1>
          <p className="text-base text-fg-muted font-body mt-2 max-w-xl leading-relaxed">
            Track daily study streaks, inspect verified chapter completion stamps, and resume learning.
          </p>
        </div>

        {/* Streak & Stamp Badges */}
        <div className="flex items-center space-x-4 shrink-0">
          <div className="p-5 rounded-2xl bg-bg border border-line text-center shadow-sm">
            <div className="flex items-center justify-center space-x-1.5 text-accent mb-1">
              <Flame className="w-6 h-6 fill-accent" />
              <span className="font-display font-extrabold text-3xl text-fg">
                {state.streak.currentCount}
              </span>
            </div>
            <span className="text-[11px] font-mono text-fg-muted uppercase font-bold">
              Day Streak
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-bg border border-line text-center shadow-sm">
            <div className="flex items-center justify-center space-x-1.5 text-accent mb-1">
              <Award className="w-6 h-6" />
              <span className="font-display font-extrabold text-3xl text-fg">
                {totalStamps}
              </span>
            </div>
            <span className="text-[11px] font-mono text-fg-muted uppercase font-bold">
              Stamps Earned
            </span>
          </div>
        </div>
      </div>

      {/* Continue Learning Card */}
      {lastActiveChapter && (
        <div className="p-7 sm:p-8 rounded-card border-2 border-accent bg-surface shadow-tactile flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-fg tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Continue Reading</span>
            </span>
            <h3 className="font-display font-bold text-2xl text-fg mt-1">
              {lastActiveChapter.title}
            </h3>
            <p className="text-xs text-fg-muted font-body mt-1">
              {lastActiveChapter.courseTitle} • Chapter {lastActiveChapter.order} • ~{lastActiveChapter.estimatedHours}h
            </p>
          </div>

          <a
            href={`/${lastActiveChapter.courseSlug}/${lastActiveChapter.slug}`}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold hover:opacity-90 shadow-tactile transition-all shrink-0"
          >
            <span>Resume Chapter</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Study-Days Heatmap Drawn as Notebook Tally Ticks */}
      <section className="p-8 rounded-card bg-surface border border-line shadow-tactile space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-fg">Study Activity Heatmap</h2>
          <span className="text-xs font-mono text-fg-muted">Recorded locally in browser</span>
        </div>
        <p className="text-xs text-fg-muted font-body">
          Every active study session adds a pencil tally tick to your laboratory log.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="p-3 rounded-xl bg-bg border border-line text-center">
              <span className="block text-[10px] font-mono uppercase text-fg-muted mb-1">{day}</span>
              <div className="flex justify-center py-1">
                <TallyMarks count={idx <= 4 ? 5 : 2} className="w-8 h-4 text-accent" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Progress */}
      <section className="space-y-6">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-fg">Curriculum Tracks</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courseStats.map(({ course, total, completed, percent }) => (
            <div
              key={course.id}
              className="p-7 rounded-card border border-line bg-surface shadow-tactile flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                  <span className="font-bold uppercase tracking-wider">{course.shortTitle}</span>
                  <span>{completed}/{total} Chapters</span>
                </div>
                <h4 className="font-display font-bold text-xl text-fg mb-4">
                  {course.title}
                </h4>

                {/* Progress Bar */}
                <div className="w-full bg-bg h-3 rounded-pill overflow-hidden border border-line">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-pill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-line flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-fg">{percent}% Completed</span>
                <a
                  href={`/${course.slug}`}
                  className="text-fg font-bold hover:underline decoration-accent underline-offset-2 flex items-center space-x-1"
                >
                  <span>View Track</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Watched Videos */}
      {state.recentlyWatchedVideos.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display font-black text-2xl text-fg">Recently Watched Videos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.recentlyWatchedVideos.map((video) => (
              <div
                key={video.videoId}
                className="p-5 rounded-2xl border border-line bg-surface hover:bg-bg transition-all"
              >
                <div className="flex items-center space-x-2 text-[10px] font-mono text-fg-muted mb-1">
                  <Play className="w-3 h-3 text-accent" />
                  <span>Watched recently</span>
                </div>
                <h5 className="font-display font-semibold text-sm text-fg line-clamp-1">
                  {video.title}
                </h5>
                <a
                  href={`/${video.courseSlug}/${video.chapterSlug}`}
                  className="text-xs font-mono text-accent hover:underline mt-2 inline-block font-bold"
                >
                  Return to Chapter →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
