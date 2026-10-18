export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type ObjectiveTier = 'core' | 'extension';

export interface LearningObjective {
  id: string;
  order: number;
  title: string;
  bloom: BloomLevel;
  tier: ObjectiveTier;
  mustHave: boolean;
  keywords: string[];
  aliases?: string[];
  prerequisites?: string[];
  estMinutes: number;
}

export interface ObjectivesFile {
  version: number;
  chapterId: string;
  objectives: LearningObjective[];
}

export interface CreatorMarker {
  seconds: number;
  timeStr: string;
  title: string;
}

export type EvidenceKind = 'marker' | 'title' | 'description' | 'tag' | 'override';

export interface EvidenceItem {
  kind: EvidenceKind;
  text: string;
  t?: number;
}

export type CoverageStatus = 'covered' | 'partial' | 'none';

export interface LoCoverageDetail {
  status: CoverageStatus;
  score: number;
  evidence: EvidenceItem[];
}

export type AlignmentConfidence = 'low' | 'medium' | 'high' | 'confirmed';

export interface VideoAlignment {
  videoId: string;
  objectivesVersion: number;
  confidence: AlignmentConfidence;
  signals: string[];
  coreCoverage: number; // 0.0 to 1.0 (partials count 0.5)
  mustHaveMissing: string[]; // loIds of core mustHave LOs not covered
  coverage: Record<string, LoCoverageDetail>;
  order: string[]; // loIds in chronological appearance in video
  segment?: {
    startSec: number;
    endSec: number;
  };
}

export interface QuestionBankItem {
  id: string;
  loId: string;
  type: 'single' | 'multi' | 'scenario' | 'numeric';
  difficulty: 1 | 2 | 3;
  stem: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  answer: Array<string | number>;
  explanation: string;
  noteRef: string;
  verify?: string;
  reviewed: boolean;
}

export interface ComposedQuiz {
  chapterId: string;
  videoId: string;
  alignedQuestions: QuestionBankItem[];
  beyondQuestions: QuestionBankItem[];
  seed: string;
  alignedTargetCount: number;
}

export interface StudentProgressV2 {
  version: 2;
  streak: {
    currentCount: number;
    lastActiveDate: string;
  };
  chapters: Record<
    string,
    {
      completed: boolean;
      lastVisited: string;
      earnedStamp: boolean;
      bestScore: number;
      followedVideoId?: string;
      orderMode?: 'canonical' | 'video';
      notesRead?: boolean;
      watchedVideo?: boolean;
    }
  >;
  objectives: Record<
    string,
    {
      mastered: boolean;
      timesTested: number;
      timesCorrect: number;
      lastAttempted?: string;
    }
  >;
  recentlyWatchedVideos: Array<{
    videoId: string;
    title: string;
    courseSlug: string;
    chapterSlug: string;
    watchedAt: string;
  }>;
  settings: {
    reducedMotion: boolean;
  };
}
