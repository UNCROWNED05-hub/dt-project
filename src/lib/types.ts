export type CourseTier = 'Beginner' | 'Intermediate' | 'Advanced';
export type Volatility = 'evergreen' | 'moderate' | 'fast-moving';
export type CourseTheme = 'sunrise' | 'midnight' | 'blueprint';

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  theme: CourseTheme;
  accentColor: string;
  badge: string;
  totalHours: number;
  chaptersCount: number;
  doodle: 'neural' | 'redaction' | 'circuit';
}

export interface SearchRecipe {
  query: string;
  mustHaveKeywords: string[];
  minDurationMinutes: number;
  maxDurationMinutes: number;
  language?: string;
}

export interface ChapterMeta {
  id: string;
  slug: string;
  title: string;
  order: number;
  courseSlug: string;
  promise: string;
  estimatedHours: number;
  tier: CourseTier;
  volatility: Volatility;
  prerequisites: string[];
  searchRecipe: SearchRecipe;
}

export interface VideoScoreBreakdown {
  engagement: number;
  traction: number;
  authority: number;
  freshness: number;
  syllabusFit: number;
}

export interface VideoItem {
  videoId: string;
  title: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  thumbnailUrl: string;
  score: number;
  scoreBreakdown?: VideoScoreBreakdown;
  whyTopPick?: string;
}

export interface ChapterVideos {
  lastChecked: string;
  topPick: VideoItem;
  alternates: VideoItem[];
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multi' | 'scenario';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  scenarioContext?: string;
  options: string[];
  correctIndex?: number;
  correctIndices?: number[];
  explanation: string;
  sectionAnchor: string;
}

export interface LicenseEntry {
  id: string;
  title: string;
  author: string;
  url: string;
  license: string;
  licenseUrl: string;
  dateAccessed: string;
  chaptersUsedIn: string[];
  notes?: string;
}

export interface StudentChapterProgress {
  completed: boolean;
  lastVisited: string;
  quizBestScore: number;
  earnedStamp: boolean;
  incorrectQuestionIds: string[];
  notesRead: boolean;
  watchedVideo: boolean;
}

export interface StudentState {
  streak: {
    currentCount: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
  chapters: Record<string, StudentChapterProgress>;
  recentlyWatchedVideos: {
    videoId: string;
    title: string;
    courseSlug: string;
    chapterSlug: string;
    watchedAt: string;
  }[];
  settings: {
    reducedMotion: boolean;
  };
}
