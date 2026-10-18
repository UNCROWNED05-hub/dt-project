'use client';

import { StudentState, StudentChapterProgress } from './types';
import { StudentProgressV2 } from './alignment/types';

export const STORAGE_KEY_V1 = 'codex_student_state_v1';
export const STORAGE_KEY_V2 = 'progress.v2';

export const DEFAULT_STATE_V2: StudentProgressV2 = {
  version: 2,
  streak: {
    currentCount: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  chapters: {},
  objectives: {},
  recentlyWatchedVideos: [],
  settings: {
    reducedMotion: false,
  },
};

/**
 * Pure migration from v1 student state schema to v2.
 */
export function migrateV1ToV2(v1: any): StudentProgressV2 {
  if (!v1) return { ...DEFAULT_STATE_V2 };
  if (v1.version === 2) return v1 as StudentProgressV2;

  const v2: StudentProgressV2 = {
    version: 2,
    streak: {
      currentCount: v1.streak?.currentCount ?? 1,
      lastActiveDate: v1.streak?.lastActiveDate ?? new Date().toISOString().split('T')[0],
    },
    chapters: {},
    objectives: v1.objectives || {},
    recentlyWatchedVideos: Array.isArray(v1.recentlyWatchedVideos) ? [...v1.recentlyWatchedVideos] : [],
    settings: {
      reducedMotion: Boolean(v1.settings?.reducedMotion),
    },
  };

  if (v1.chapters && typeof v1.chapters === 'object') {
    for (const [chId, ch] of Object.entries<any>(v1.chapters)) {
      v2.chapters[chId] = {
        completed: Boolean(ch.completed || ch.earnedStamp || (ch.quizBestScore >= 70)),
        lastVisited: ch.lastVisited || new Date().toISOString(),
        earnedStamp: Boolean(ch.earnedStamp || (ch.quizBestScore >= 70)),
        bestScore: typeof ch.quizBestScore === 'number' ? ch.quizBestScore : (ch.bestScore || 0),
        followedVideoId: ch.followedVideoId,
        orderMode: ch.orderMode || 'canonical',
        notesRead: Boolean(ch.notesRead),
        watchedVideo: Boolean(ch.watchedVideo),
      };
    }
  }

  return v2;
}

export function getStudentProgressV2(): StudentProgressV2 {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE_V2;
  }
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      return { ...DEFAULT_STATE_V2, ...parsed };
    }

    // Attempt migration from v1
    const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1);
      const migrated = migrateV1ToV2(parsedV1);
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      return migrated;
    }

    return DEFAULT_STATE_V2;
  } catch (err) {
    console.error('Failed to load student progress v2 from localStorage:', err);
    return DEFAULT_STATE_V2;
  }
}

export function saveStudentProgressV2(state: StudentProgressV2): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
    // Keep legacy v1 key synchronized for backwards compatibility
    const v1State = getStudentStateFromV2(state);
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(v1State));
    window.dispatchEvent(new Event('vellum_state_change'));
  } catch (err) {
    console.error('Failed to save student progress v2:', err);
  }
}

function getStudentStateFromV2(v2: StudentProgressV2): StudentState {
  const v1Chapters: Record<string, StudentChapterProgress> = {};
  for (const [id, ch] of Object.entries(v2.chapters)) {
    v1Chapters[id] = {
      completed: ch.completed,
      lastVisited: ch.lastVisited,
      quizBestScore: ch.bestScore,
      earnedStamp: ch.earnedStamp,
      incorrectQuestionIds: [],
      notesRead: Boolean(ch.notesRead),
      watchedVideo: Boolean(ch.watchedVideo),
    };
  }

  return {
    streak: v2.streak,
    chapters: v1Chapters,
    recentlyWatchedVideos: v2.recentlyWatchedVideos,
    settings: v2.settings,
  };
}

// Backwards-compatible legacy getters and setters
export function getStudentState(): StudentState {
  const v2 = getStudentProgressV2();
  return getStudentStateFromV2(v2);
}

export function saveStudentState(state: StudentState): void {
  const v2 = migrateV1ToV2(state);
  saveStudentProgressV2(v2);
}

export function recordChapterActivity(chapterId: string): void {
  const state = getStudentProgressV2();
  const today = new Date().toISOString().split('T')[0];

  // Update Streak logic
  const lastActive = state.streak.lastActiveDate;
  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive === yesterday) {
      state.streak.currentCount += 1;
    } else {
      state.streak.currentCount = 1;
    }
    state.streak.lastActiveDate = today;
  }

  // Ensure chapter record exists
  if (!state.chapters[chapterId]) {
    state.chapters[chapterId] = {
      completed: false,
      lastVisited: new Date().toISOString(),
      bestScore: 0,
      earnedStamp: false,
      notesRead: false,
      watchedVideo: false,
      orderMode: 'canonical',
    };
  } else {
    state.chapters[chapterId].lastVisited = new Date().toISOString();
  }

  saveStudentProgressV2(state);
}

export function setChapterFollowedVideo(chapterId: string, videoId: string): void {
  const state = getStudentProgressV2();
  if (!state.chapters[chapterId]) {
    recordChapterActivity(chapterId);
  }
  const curr = getStudentProgressV2();
  if (curr.chapters[chapterId]) {
    curr.chapters[chapterId].followedVideoId = videoId;
    saveStudentProgressV2(curr);
  }
}

export function setChapterOrderMode(chapterId: string, mode: 'canonical' | 'video'): void {
  const state = getStudentProgressV2();
  if (!state.chapters[chapterId]) {
    recordChapterActivity(chapterId);
  }
  const curr = getStudentProgressV2();
  if (curr.chapters[chapterId]) {
    curr.chapters[chapterId].orderMode = mode;
    saveStudentProgressV2(curr);
  }
}

export function recordAlignedQuizScore(
  chapterId: string,
  videoId: string,
  alignedScorePercent: number,
  answeredObjectives: Array<{ loId: string; correct: boolean }>
): boolean {
  const state = getStudentProgressV2();
  const ch = state.chapters[chapterId] || {
    completed: false,
    lastVisited: new Date().toISOString(),
    bestScore: 0,
    earnedStamp: false,
    notesRead: false,
    watchedVideo: false,
    followedVideoId: videoId,
    orderMode: 'canonical',
  };

  ch.followedVideoId = videoId;
  if (alignedScorePercent > ch.bestScore) {
    ch.bestScore = alignedScorePercent;
  }

  // Stamp requirement: >= 70% on video-aligned questions
  const newlyEarnedStamp = alignedScorePercent >= 70 && !ch.earnedStamp;
  if (alignedScorePercent >= 70) {
    ch.earnedStamp = true;
    ch.completed = true;
  }
  state.chapters[chapterId] = ch;

  // Track per-LO mastery
  const now = new Date().toISOString();
  for (const item of answeredObjectives) {
    const existing = state.objectives[item.loId] || {
      mastered: false,
      timesTested: 0,
      timesCorrect: 0,
    };
    existing.timesTested += 1;
    if (item.correct) {
      existing.timesCorrect += 1;
    }
    existing.lastAttempted = now;
    // Mastered if accuracy >= 75% with at least 1 correct answer
    existing.mastered = existing.timesCorrect >= 1 && (existing.timesCorrect / existing.timesTested >= 0.75);
    state.objectives[item.loId] = existing;
  }

  saveStudentProgressV2(state);
  return newlyEarnedStamp;
}

export function updateQuizScore(chapterId: string, scorePercent: number, incorrectIds: string[]): boolean {
  const state = getStudentProgressV2();
  const ch = state.chapters[chapterId] || {
    completed: false,
    lastVisited: new Date().toISOString(),
    bestScore: 0,
    earnedStamp: false,
    notesRead: false,
    watchedVideo: false,
    orderMode: 'canonical',
  };

  if (scorePercent > ch.bestScore) {
    ch.bestScore = scorePercent;
  }

  const newlyEarnedStamp = scorePercent >= 70 && !ch.earnedStamp;
  if (scorePercent >= 70) {
    ch.earnedStamp = true;
    ch.completed = true;
  }

  state.chapters[chapterId] = ch;
  saveStudentProgressV2(state);
  return newlyEarnedStamp;
}

export function markNotesRead(chapterId: string): void {
  const state = getStudentProgressV2();
  if (!state.chapters[chapterId]) {
    recordChapterActivity(chapterId);
  }
  const curr = getStudentProgressV2();
  if (curr.chapters[chapterId]) {
    curr.chapters[chapterId].notesRead = true;
    saveStudentProgressV2(curr);
  }
}

export function recordVideoWatched(
  chapterId: string,
  videoId: string,
  title: string,
  courseSlug: string,
  chapterSlug: string
): void {
  const state = getStudentProgressV2();
  if (!state.chapters[chapterId]) {
    recordChapterActivity(chapterId);
  }
  const curr = getStudentProgressV2();
  if (curr.chapters[chapterId]) {
    curr.chapters[chapterId].watchedVideo = true;
    curr.chapters[chapterId].followedVideoId = videoId;
  }

  const filtered = curr.recentlyWatchedVideos.filter((v) => v.videoId !== videoId);
  filtered.unshift({
    videoId,
    title,
    courseSlug,
    chapterSlug,
    watchedAt: new Date().toISOString(),
  });
  curr.recentlyWatchedVideos = filtered.slice(0, 5);

  saveStudentProgressV2(curr);
}

export function getObjectiveStats(loId: string) {
  const state = getStudentProgressV2();
  return state.objectives[loId];
}
