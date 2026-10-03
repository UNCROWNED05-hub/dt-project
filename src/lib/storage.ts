'use client';

import { StudentState, StudentChapterProgress } from './types';

const STORAGE_KEY = 'codex_student_state_v1';

const DEFAULT_STATE: StudentState = {
  streak: {
    currentCount: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  chapters: {},
  recentlyWatchedVideos: [],
  settings: {
    reducedMotion: false,
  },
};

export function getStudentState(): StudentState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch (err) {
    console.error('Failed to load student state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

export function saveStudentState(state: StudentState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('vellum_state_change'));
  } catch (err) {
    console.error('Failed to save student state:', err);
  }
}

export function recordChapterActivity(chapterId: string): void {
  const state = getStudentState();
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
      quizBestScore: 0,
      earnedStamp: false,
      incorrectQuestionIds: [],
      notesRead: false,
      watchedVideo: false,
    };
  } else {
    state.chapters[chapterId].lastVisited = new Date().toISOString();
  }

  saveStudentState(state);
}

export function updateQuizScore(chapterId: string, scorePercent: number, incorrectIds: string[]): boolean {
  const state = getStudentState();
  const ch = state.chapters[chapterId] || {
    completed: false,
    lastVisited: new Date().toISOString(),
    quizBestScore: 0,
    earnedStamp: false,
    incorrectQuestionIds: [],
    notesRead: false,
    watchedVideo: false,
  };

  if (scorePercent > ch.quizBestScore) {
    ch.quizBestScore = scorePercent;
  }
  ch.incorrectQuestionIds = incorrectIds;

  const newlyEarnedStamp = scorePercent >= 70 && !ch.earnedStamp;
  if (scorePercent >= 70) {
    ch.earnedStamp = true;
    ch.completed = true;
  }

  state.chapters[chapterId] = ch;
  saveStudentState(state);
  return newlyEarnedStamp;
}

export function markNotesRead(chapterId: string): void {
  const state = getStudentState();
  if (!state.chapters[chapterId]) {
    recordChapterActivity(chapterId);
  }
  const curr = getStudentState();
  if (curr.chapters[chapterId]) {
    curr.chapters[chapterId].notesRead = true;
    saveStudentState(curr);
  }
}

export function recordVideoWatched(chapterId: string, videoId: string, title: string, courseSlug: string, chapterSlug: string): void {
  const state = getStudentState();
  if (!state.chapters[chapterId]) {
    recordChapterActivity(chapterId);
  }
  const curr = getStudentState();
  if (curr.chapters[chapterId]) {
    curr.chapters[chapterId].watchedVideo = true;
  }

  // Add to recently watched (limit 5)
  const filtered = curr.recentlyWatchedVideos.filter((v) => v.videoId !== videoId);
  filtered.unshift({
    videoId,
    title,
    courseSlug,
    chapterSlug,
    watchedAt: new Date().toISOString(),
  });
  curr.recentlyWatchedVideos = filtered.slice(0, 5);

  saveStudentState(curr);
}
