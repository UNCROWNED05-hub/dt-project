'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, ExternalLink, Info, CheckCircle2, Award, Clock } from 'lucide-react';
import { ChapterVideos, VideoItem } from '@/lib/types';
import { recordVideoWatched } from '@/lib/storage';

interface WatchFacadeProps {
  chapterId: string;
  courseSlug: string;
  chapterSlug: string;
  videos: ChapterVideos | null;
}

export function WatchFacade({ chapterId, courseSlug, chapterSlug, videos }: WatchFacadeProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showScorePopover, setShowScorePopover] = useState(false);

  if (!videos || !videos.topPick) {
    return (
      <div className="p-8 rounded-card bg-surface border border-line text-center">
        <p className="text-fg-muted font-body">No video currently ranked for this chapter.</p>
      </div>
    );
  }

  const { topPick, alternates = [], lastChecked } = videos;

  const handlePlay = (video: VideoItem) => {
    setActiveVideoId(video.videoId);
    recordVideoWatched(chapterId, video.videoId, video.title, courseSlug, chapterSlug);
  };

  const formattedDate = new Date(lastChecked).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>Last automated benchmark check: {formattedDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-[10px] font-mono font-medium bg-surface text-fg border border-line">
            <CheckCircle2 className="w-3 h-3 mr-1 text-accent" />
            Official YouTube v3 API Verified
          </span>
        </div>
      </div>

      {/* Primary Ranked #1 Video Card */}
      <div className="rounded-card border border-line bg-surface shadow-tactile-lg overflow-hidden transition-all text-fg">
        <div className="p-4 sm:p-6 bg-bg/50 border-b border-line flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold tracking-wider uppercase flex items-center shadow-sm">
              <Award className="w-3.5 h-3.5 mr-1" />
              #1 Top Pick
            </span>
            <span className="text-xs font-mono text-fg-muted hidden sm:inline">
              Composite Score: {(topPick.score * 100).toFixed(1)}/100
            </span>
          </div>

          {/* Popover Button */}
          <div className="relative">
            <button
              onClick={() => setShowScorePopover((p) => !p)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-pill border border-line bg-surface hover:bg-bg text-xs font-mono text-fg shadow-sm transition-all"
            >
              <Info className="w-3.5 h-3.5 text-accent" />
              <span>Why is this #1?</span>
            </button>

            {/* Score Breakdown Popover */}
            {showScorePopover && topPick.scoreBreakdown && (
              <div className="absolute right-0 top-10 z-20 w-80 p-5 rounded-2xl bg-surface border border-line shadow-tactile-lg text-fg text-xs font-body animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                  <span className="font-mono font-bold text-fg">Scoring Breakdown</span>
                  <span className="font-mono text-accent font-bold">
                    {(topPick.score * 100).toFixed(1)} pts
                  </span>
                </div>

                <p className="text-xs text-fg-muted mb-3 leading-relaxed">
                  {topPick.whyTopPick || 'Surpassed syllabus requirements and engagement criteria across consecutive runs.'}
                </p>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted">Syllabus Fit:</span>
                    <span className="font-semibold text-fg">{(topPick.scoreBreakdown.syllabusFit * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted">Engagement Quality:</span>
                    <span className="font-semibold text-fg">{(topPick.scoreBreakdown.engagement * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted">Channel Authority:</span>
                    <span className="font-semibold text-fg">{(topPick.scoreBreakdown.authority * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted">Freshness Factor:</span>
                    <span className="font-semibold text-fg">{(topPick.scoreBreakdown.freshness * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted">Traction Velocity:</span>
                    <span className="font-semibold text-fg">{(topPick.scoreBreakdown.traction * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-line text-[10px] text-fg-muted font-mono text-center">
                  Dethroning rule: 12% lead required to replace #1
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Player or Facade */}
        <div className="relative aspect-video w-full bg-bg/80">
          {activeVideoId === topPick.videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${topPick.videoId}?autoplay=1&rel=0`}
              title={topPick.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => handlePlay(topPick)}
            >
              <Image
                src={topPick.thumbnailUrl}
                alt={topPick.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-fg/20 group-hover:bg-fg/10 transition-colors" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-pill bg-accent text-on-accent flex items-center justify-center shadow-tactile-lg transform group-hover:scale-110 transition-all">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-bg/90 text-fg font-mono text-xs font-semibold border border-line">
                {topPick.duration}
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-fg leading-snug">
              {topPick.title}
            </h3>
            <p className="text-sm font-mono text-fg-muted mt-1">
              By <span className="font-semibold text-fg">{topPick.channelTitle}</span>
            </p>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${topPick.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-pill border border-line bg-surface hover:bg-bg text-fg font-mono text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            <span>Open on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Alternates */}
      {alternates.length > 0 && (
        <div className="space-y-4 pt-6">
          <h4 className="font-display font-bold text-lg text-fg flex items-center space-x-2">
            <span>Alternate Visual Explanations</span>
            <span className="text-xs font-mono font-normal text-fg-muted">
              ({alternates.length} runner-up)
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternates.map((alt, index) => (
              <div
                key={alt.videoId}
                className="rounded-2xl border border-line bg-surface p-4 flex flex-col justify-between hover:shadow-tactile transition-all text-fg"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-bg group cursor-pointer">
                    {activeVideoId === alt.videoId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${alt.videoId}?autoplay=1&rel=0`}
                        title={alt.title}
                        className="w-full h-full border-none"
                        allowFullScreen
                      />
                    ) : (
                      <div onClick={() => handlePlay(alt)} className="w-full h-full relative">
                        <Image
                          src={alt.thumbnailUrl}
                          alt={alt.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-fg/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-accent text-on-accent flex items-center justify-center">
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-bg/90 text-fg font-mono text-[10px] border border-line">
                          {alt.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] font-mono text-fg-muted mb-1">
                    <span className="font-bold text-accent">#{index + 2} Alternate</span>
                    <span>•</span>
                    <span>Score: {(alt.score * 100).toFixed(0)}</span>
                  </div>

                  <h5 className="font-display font-semibold text-sm text-fg line-clamp-2 leading-snug">
                    {alt.title}
                  </h5>
                  <p className="text-xs text-fg-muted font-body mt-0.5">{alt.channelTitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => handlePlay(alt)}
                    className="text-accent font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Watch inline</span>
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${alt.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-muted hover:text-fg flex items-center space-x-1"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
