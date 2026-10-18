import fs from 'fs';
import path from 'path';
import { ChapterVideos, QuizQuestion } from './types';

const ROOT_DIR = process.cwd();

export interface ParsedNotes {
  title: string;
  readingTimeMinutes: number;
  reviewed: boolean;
  sources: Array<{
    title: string;
    author: string;
    url: string;
    license: string;
    licenseUrl: string;
    dateAccessed: string;
  }>;
  content: string;
}

export function getChapterNotes(courseSlug: string, chapterSlug: string): ParsedNotes {
  const notePath = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes.mdx');

  if (!fs.existsSync(notePath)) {
    return {
      title: 'Chapter Notes in Production',
      readingTimeMinutes: 10,
      reviewed: false,
      sources: [],
      content: `## Notes for this chapter are currently in editorial peer-review.\n\nPlease check back shortly, or explore the curated **Watch** video lecture and test your understanding in the **Practice** quiz.`,
    };
  }

  const raw = fs.readFileSync(notePath, 'utf-8');

  // Simple, robust frontmatter parser without heavy runtime dependencies
  let frontmatter: any = {
    title: 'Notes',
    readingTimeMinutes: 10,
    reviewed: false,
    sources: [],
  };
  let content = raw;

  if (raw.startsWith('---')) {
    const parts = raw.split('---');
    if (parts.length >= 3) {
      const yamlBlock = parts[1];
      content = parts.slice(2).join('---').trim();

      // Extract title
      const titleMatch = yamlBlock.match(/title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) frontmatter.title = titleMatch[1];

      // Extract readingTimeMinutes
      const timeMatch = yamlBlock.match(/readingTimeMinutes:\s*(\d+)/);
      if (timeMatch) frontmatter.readingTimeMinutes = parseInt(timeMatch[1], 10);

      // Extract reviewed
      const reviewedMatch = yamlBlock.match(/reviewed:\s*(true|false)/);
      if (reviewedMatch) frontmatter.reviewed = reviewedMatch[1] === 'true';
    }
  }

  return {
    title: frontmatter.title,
    readingTimeMinutes: frontmatter.readingTimeMinutes,
    reviewed: frontmatter.reviewed,
    sources: frontmatter.sources,
    content,
  };
}

export function getChapterQuiz(courseSlug: string, chapterSlug: string): QuizQuestion[] {
  const quizPath = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'quiz.json');
  if (!fs.existsSync(quizPath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(quizPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse quiz for ${courseSlug}/${chapterSlug}:`, err);
    return [];
  }
}

export function getChapterVideos(courseSlug: string, chapterSlug: string): ChapterVideos | null {
  const videoManifestPath = path.join(ROOT_DIR, 'data', 'videos', `${courseSlug}.json`);
  if (!fs.existsSync(videoManifestPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(videoManifestPath, 'utf-8');
    const data = JSON.parse(raw);
    return data[chapterSlug] || null;
  } catch (err) {
    console.error(`Failed to read videos for ${courseSlug}:`, err);
    return null;
  }
}

export function getChangelog() {
  const changelogPath = path.join(ROOT_DIR, 'data', 'videos', 'changelog.json');
  if (!fs.existsSync(changelogPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
  } catch {
    return [];
  }
}

export function getLicenseLedger() {
  const licensePath = path.join(ROOT_DIR, 'content', 'LICENSES.json');
  if (!fs.existsSync(licensePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(licensePath, 'utf-8'));
  } catch {
    return [];
  }
}

export function getChapterAlignment(courseSlug: string, chapterSlug: string) {
  const alignPath = path.join(ROOT_DIR, 'data', 'alignment', courseSlug, `${chapterSlug}.json`);
  if (!fs.existsSync(alignPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(alignPath, 'utf-8'));
  } catch {
    return null;
  }
}

export function getChapterObjectives(courseSlug: string, chapterSlug: string) {
  const objPath = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'objectives.json');
  if (!fs.existsSync(objPath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(objPath, 'utf-8'));
    return data.objectives || [];
  } catch {
    return null;
  }
}

export function getChapterModularNotes(courseSlug: string, chapterSlug: string) {
  const notesDir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes');
  if (!fs.existsSync(notesDir)) return null;
  try {
    const files = fs.readdirSync(notesDir);
    const result: Record<string, string> = {};
    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const loId = file.replace(/\.mdx$/, '');
        result[loId] = fs.readFileSync(path.join(notesDir, file), 'utf-8');
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

export function getChapterQuestionBank(courseSlug: string, chapterSlug: string) {
  const bankPath = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'quiz', 'bank.json');
  if (!fs.existsSync(bankPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(bankPath, 'utf-8'));
  } catch {
    return null;
  }
}

