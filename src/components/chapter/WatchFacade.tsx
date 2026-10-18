'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  ExternalLink,
  Info,
  CheckCircle2,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Compass,
  AlertTriangle,
  HelpCircle,
  Flag,
  Sparkles,
} from 'lucide-react';
import { ChapterVideos, VideoItem } from '@/lib/types';
import { VideoAlignment, LearningObjective } from '@/lib/alignment/types';
import { recordVideoWatched } from '@/lib/storage';

interface WatchFacadeProps {
  chapterId: string;
  courseSlug: string;
  chapterSlug: string;
  videos: ChapterVideos | null;
  alignments?: Record<string, VideoAlignment> | null;
  objectives?: LearningObjective[] | null;
  followedVideoId?: string;
  onFollowVideo?: (videoId: string) => void;
}

export function WatchFacade({
  chapterId,
  courseSlug,
  chapterSlug,
  videos,
  alignments,
  objectives = [],
  followedVideoId,
  onFollowVideo,
}: WatchFacadeProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);
  const [showScorePopover, setShowScorePopover] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [expandedDrawerVideoId, setExpandedDrawerVideoId] = useState<string | null>(null);

  if (!videos || !videos.topPick) {
    return (
      <div className="p-8 rounded-card bg-surface border border-line text-center">
        <p className="text-fg-muted font-body">No video currently ranked for this chapter.</p>
      </div>
    );
  }

  const { topPick, alternates = [], lastChecked } = videos;
  const currentFollowedId = followedVideoId || topPick.videoId;

  const handlePlay = (video: VideoItem, startSec: number = 0) => {
    setActiveVideoId(video.videoId);
    setSeekSeconds(startSec);
    recordVideoWatched(chapterId, video.videoId, video.title, courseSlug, chapterSlug);
  };

  const handleSeek = (video: VideoItem, sec: number) => {
    setActiveVideoId(video.videoId);
    setSeekSeconds(sec);
  };

  const handleSelectFollow = (videoId: string) => {
    if (onFollowVideo) {
      onFollowVideo(videoId);
    }
  };

  const formattedDate = new Date(lastChecked).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const allCandidates = [topPick, ...alternates];
  const coreCount = (objectives || []).filter((o) => o.tier === 'core').length || 8;

  const renderConfidenceBadge = (confidence?: string) => {
    switch (confidence) {
      case 'confirmed':
        return (
          <span className="px-2 py-0.5 rounded-pill text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Confirmed by Maintainer
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-pill text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            High Confidence
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-pill text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Medium Confidence
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-pill text-[10px] font-mono font-medium bg-zinc-500/10 text-fg-muted border border-line">
            Low Confidence
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Info Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>Last automated benchmark check: {formattedDate}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHowItWorksModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-pill text-xs font-mono border border-line bg-surface hover:bg-bg text-fg transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>How alignment works</span>
          </button>

          <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-[10px] font-mono font-medium bg-surface text-fg border border-line">
            <CheckCircle2 className="w-3 h-3 mr-1 text-accent" />
            Official YouTube v3 API
          </span>
        </div>
      </div>

      {/* Primary Ranked #1 Video Card */}
      {(() => {
        const align = alignments?.[topPick.videoId];
        const isFollowed = currentFollowedId === topPick.videoId;
        const coveredCount = align
          ? Math.round(align.coreCoverage * coreCount)
          : coreCount;
        const isDrawerOpen = expandedDrawerVideoId === topPick.videoId;

        return (
          <div className="rounded-card border border-line bg-surface shadow-tactile-lg overflow-hidden transition-all text-fg">
            <div className="p-4 sm:p-6 bg-bg/50 border-b border-line flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold tracking-wider uppercase flex items-center shadow-sm">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  #1 Top Pick
                </span>

                {renderConfidenceBadge(align?.confidence)}

                {/* Coverage Meter */}
                <span className="px-2.5 py-1 rounded-pill bg-surface border border-line text-xs font-mono font-semibold text-fg">
                  Covers {coveredCount} of {coreCount} core objectives ({Math.round((align?.coreCoverage ?? 1) * 100)}%)
                </span>

                {/* Following badge or follow action */}
                {isFollowed ? (
                  <span className="px-2.5 py-1 rounded-pill bg-accent-2/15 text-accent-2 border border-accent-2/30 font-mono text-xs font-bold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Following for Notes & Quiz
                  </span>
                ) : (
                  <button
                    onClick={() => handleSelectFollow(topPick.videoId)}
                    className="px-3 py-1 rounded-pill bg-surface hover:bg-bg border border-line text-xs font-mono font-semibold hover:border-accent text-fg transition-all"
                  >
                    Follow this video
                  </button>
                )}
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
                      {topPick.whyTopPick ||
                        'Surpassed syllabus requirements and engagement criteria across consecutive runs.'}
                    </p>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-fg-muted">Objective Coverage:</span>
                        <span className="font-semibold text-fg">
                          {Math.round((align?.coreCoverage ?? 1) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-fg-muted">Engagement Quality:</span>
                        <span className="font-semibold text-fg">
                          {(topPick.scoreBreakdown.engagement * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-fg-muted">Channel Authority:</span>
                        <span className="font-semibold text-fg">
                          {(topPick.scoreBreakdown.authority * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-fg-muted">Freshness Factor:</span>
                        <span className="font-semibold text-fg">
                          {(topPick.scoreBreakdown.freshness * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-line text-[10px] text-fg-muted font-mono text-center">
                      Dethroning rule: 12% lead required over 2 runs
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Player or Facade */}
            <div className="relative aspect-video w-full bg-bg/80">
              {activeVideoId === topPick.videoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${topPick.videoId}?autoplay=1&rel=0${
                    seekSeconds ? `&start=${seekSeconds}` : ''
                  }`}
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

            {/* Missing LO warning banner if applicable */}
            {align && align.mustHaveMissing && align.mustHaveMissing.length > 0 && (
              <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center space-x-2 text-xs font-mono text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Missing must-have objectives: {align.mustHaveMissing.join(', ')}. The notes tab provides full coverage.
                </span>
              </div>
            )}

            {/* Metadata and Drawer Toggle */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-fg leading-snug">
                  {topPick.title}
                </h3>
                <p className="text-sm font-mono text-fg-muted mt-1">
                  By <span className="font-semibold text-fg">{topPick.channelTitle}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setExpandedDrawerVideoId(isDrawerOpen ? null : topPick.videoId)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-pill border border-line bg-surface hover:bg-bg text-fg font-mono text-xs font-semibold shadow-sm transition-all"
                >
                  <span>{isDrawerOpen ? 'Hide coverage outline' : 'Inspect coverage outline'}</span>
                  {isDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setShowReportModal(topPick.videoId)}
                  title="Report alignment mismatch"
                  className="p-2.5 rounded-pill border border-line bg-surface hover:bg-bg text-fg-muted hover:text-fg transition-all"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${topPick.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-pill border border-line bg-surface hover:bg-bg text-fg font-mono text-xs font-semibold shadow-sm transition-all"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Expandable Coverage Outline Drawer */}
            {isDrawerOpen && align && (
              <div className="border-t border-line bg-bg/30 p-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
                    Objective Coverage & Creator Timestamps
                  </h4>
                  <span className="text-[11px] font-mono text-fg-muted">
                    Click timestamps to seek inline
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {(objectives || []).map((lo) => {
                    const cov = align.coverage[lo.id];
                    const status = cov?.status || 'none';
                    const markerEvidence = cov?.evidence?.find((e) => e.kind === 'marker');

                    return (
                      <div
                        key={lo.id}
                        className="p-3 rounded-xl border border-line bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-start space-x-2.5">
                          {status === 'covered' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                          ) : status === 'partial' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 mt-1 shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[10px] text-fg-muted uppercase">
                                {lo.id}
                              </span>
                              <span className="font-semibold text-fg">{lo.title}</span>
                              {lo.mustHave && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-surface border border-line rounded text-fg-muted">
                                  Must-have
                                </span>
                              )}
                            </div>
                            {markerEvidence && (
                              <p className="text-[11px] text-fg-muted mt-0.5">
                                Creator chapter: &ldquo;{markerEvidence.text}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 sm:self-center self-end">
                          {markerEvidence && markerEvidence.t !== undefined ? (
                            <button
                              onClick={() => handleSeek(topPick, markerEvidence.t!)}
                              className="px-2.5 py-1 rounded bg-accent/10 hover:bg-accent hover:text-on-accent text-accent font-mono text-xs font-semibold transition-all flex items-center space-x-1"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>
                                {Math.floor(markerEvidence.t / 60)}:
                                {(markerEvidence.t % 60).toString().padStart(2, '0')}
                              </span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-fg-muted">
                              {status === 'covered'
                                ? 'Covered (metadata)'
                                : status === 'partial'
                                ? 'Partially covered'
                                : 'Not in this video'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Alternates Section */}
      {alternates.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-lg text-fg flex items-center space-x-2">
              <span>Alternate Visual Explanations</span>
              <span className="text-xs font-mono font-normal text-fg-muted">
                ({alternates.length} runner-up)
              </span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternates.map((alt, index) => {
              const align = alignments?.[alt.videoId];
              const isFollowed = currentFollowedId === alt.videoId;
              const coveredCount = align
                ? Math.round(align.coreCoverage * coreCount)
                : coreCount;
              const isDrawerOpen = expandedDrawerVideoId === alt.videoId;

              return (
                <div
                  key={alt.videoId}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all text-fg ${
                    isFollowed
                      ? 'border-accent bg-surface shadow-tactile'
                      : 'border-line bg-surface hover:shadow-tactile'
                  }`}
                >
                  <div>
                    {/* Top Chips */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-[11px] font-mono">
                        <span className="font-bold text-accent">#{index + 2} Alternate</span>
                        <span>•</span>
                        <span>Score: {(alt.score * 100).toFixed(0)}</span>
                      </div>
                      {renderConfidenceBadge(align?.confidence)}
                    </div>

                    {/* Thumbnail Facade */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-bg group cursor-pointer">
                      {activeVideoId === alt.videoId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${alt.videoId}?autoplay=1&rel=0${
                            seekSeconds ? `&start=${seekSeconds}` : ''
                          }`}
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

                    {/* Coverage badge */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-fg">
                        Covers {coveredCount} of {coreCount} core objectives
                      </span>
                      {isFollowed ? (
                        <span className="text-[10px] font-mono font-bold text-accent-2 bg-accent-2/15 px-2 py-0.5 rounded-pill border border-accent-2/30">
                          ✓ Currently Following
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSelectFollow(alt.videoId)}
                          className="text-[10px] font-mono font-bold text-accent hover:underline"
                        >
                          Follow this video &rarr;
                        </button>
                      )}
                    </div>

                    <h5 className="font-display font-semibold text-sm text-fg line-clamp-2 leading-snug">
                      {alt.title}
                    </h5>
                    <p className="text-xs text-fg-muted font-body mt-0.5">{alt.channelTitle}</p>
                  </div>

                  {/* Actions & Drawer */}
                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => setExpandedDrawerVideoId(isDrawerOpen ? null : alt.videoId)}
                      className="text-fg-muted hover:text-fg flex items-center space-x-1"
                    >
                      <span>{isDrawerOpen ? 'Hide outline' : 'Outline'}</span>
                      {isDrawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <div className="flex items-center space-x-3">
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

                  {/* Drawer for Alternate */}
                  {isDrawerOpen && align && (
                    <div className="mt-3 pt-3 border-t border-line space-y-2 text-xs">
                      {(objectives || []).map((lo) => {
                        const cov = align.coverage[lo.id];
                        const marker = cov?.evidence?.find((e) => e.kind === 'marker');
                        return (
                          <div key={lo.id} className="flex items-center justify-between py-1 border-b border-line/40 text-[11px]">
                            <span className="truncate pr-2 text-fg">{lo.title}</span>
                            {marker?.t !== undefined ? (
                              <button
                                onClick={() => handleSeek(alt, marker.t!)}
                                className="font-mono text-accent hover:underline shrink-0"
                              >
                                {Math.floor(marker.t / 60)}:{(marker.t % 60).toString().padStart(2, '0')}
                              </button>
                            ) : (
                              <span className="font-mono text-fg-muted shrink-0">
                                {cov?.status === 'covered' ? 'Covered' : 'None'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* "How Alignment Works" Plain-Language Modal */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/40 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full rounded-2xl bg-surface border border-line p-6 shadow-tactile-lg space-y-4 text-fg">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-lg text-fg">How Objective Alignment Works</h3>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="font-mono text-xs text-fg-muted hover:text-fg px-2 py-1 rounded border border-line"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 font-body text-sm leading-relaxed text-fg-muted">
              <p>
                <strong className="text-fg">The Chapter&apos;s Objectives Are the Contract:</strong> Every chapter is defined by clear, measurable learning objectives (LOs).
              </p>
              <p>
                <strong className="text-fg">Videos Teach Differently:</strong> Different creators teach in different sequences, with different terminology and varying depths.
              </p>
              <p>
                <strong className="text-fg">Official YouTube Metadata Only:</strong> We parse creator timestamps and official video metadata without unauthorized scrapers or LLMs. We map which objectives are covered in the video.
              </p>
              <p>
                <strong className="text-fg">Notes & Quizzes Follow Your Video:</strong> When you select a video, your notes and quiz adapt automatically. Notes will indicate exactly when a concept is covered in the video, or clearly label concepts not covered so you can read them. You will never be tested on something your chosen video did not cover without warning.
              </p>
            </div>

            <div className="pt-3 border-t border-line flex justify-end">
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="px-4 py-2 rounded-pill bg-accent text-on-accent font-mono text-xs font-semibold shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Report Alignment Mismatch" Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/40 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-surface border border-line p-6 shadow-tactile-lg space-y-4 text-fg">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-accent" />
                <h3 className="font-display font-bold text-base text-fg">Report Alignment Mismatch</h3>
              </div>
              <button
                onClick={() => setShowReportModal(null)}
                className="font-mono text-xs text-fg-muted hover:text-fg px-2 py-1 rounded border border-line"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-fg-muted font-body leading-relaxed">
              Found a timestamp mismatch or uncovered concept for video <code className="font-mono font-bold text-fg">{showReportModal}</code> in <code className="font-mono font-bold text-fg">{chapterSlug}</code>?
            </p>

            <div className="p-3 bg-bg rounded-xl border border-line text-xs font-mono text-fg space-y-1">
              <div>Course: {courseSlug}</div>
              <div>Chapter: {chapterSlug}</div>
              <div>Video ID: {showReportModal}</div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReportModal(null)}
                className="px-3 py-1.5 rounded-pill border border-line text-xs font-mono text-fg-muted hover:text-fg"
              >
                Cancel
              </button>
              <a
                href={`https://github.com/example/vellum/issues/new?title=Alignment+Mismatch+in+${chapterSlug}&body=Video+ID:+${showReportModal}%0AChapter:+${chapterSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowReportModal(null)}
                className="px-4 py-1.5 rounded-pill bg-accent text-on-accent text-xs font-mono font-semibold shadow-sm flex items-center space-x-1"
              >
                <span>File Issue on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
