import React from 'react';
import { notFound } from 'next/navigation';
import {
  getCourseBySlug,
  getChapterBySlug,
  getAdjacentChapters,
  COURSES,
  CHAPTERS,
} from '@/lib/courses-data';
import {
  getChapterNotes,
  getChapterVideos,
  getChapterQuiz,
  getChapterAlignment,
  getChapterObjectives,
  getChapterModularNotes,
  getChapterQuestionBank,
} from '@/lib/content';
import { ChapterView } from '@/components/chapter/ChapterView';

interface ChapterPageProps {
  params: {
    courseSlug: string;
    chapterSlug: string;
  };
}

export function generateStaticParams() {
  const params: Array<{ courseSlug: string; chapterSlug: string }> = [];
  COURSES.forEach((course) => {
    const chapters = CHAPTERS[course.slug] || [];
    chapters.forEach((chapter) => {
      params.push({
        courseSlug: course.slug,
        chapterSlug: chapter.slug,
      });
    });
  });
  return params;
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { courseSlug, chapterSlug } = params;
  const course = getCourseBySlug(courseSlug);
  const chapter = getChapterBySlug(courseSlug, chapterSlug);

  if (!course || !chapter) {
    notFound();
  }

  const { prev, next } = getAdjacentChapters(courseSlug, chapterSlug);
  const notes = getChapterNotes(courseSlug, chapterSlug);
  const videos = getChapterVideos(courseSlug, chapterSlug);
  const quiz = getChapterQuiz(courseSlug, chapterSlug);
  const alignments = getChapterAlignment(courseSlug, chapterSlug);
  const objectives = getChapterObjectives(courseSlug, chapterSlug);
  const modularNotes = getChapterModularNotes(courseSlug, chapterSlug);
  const questionBank = getChapterQuestionBank(courseSlug, chapterSlug);

  return (
    <ChapterView
      course={course}
      chapter={chapter}
      prevChapter={prev}
      nextChapter={next}
      notes={notes}
      videos={videos}
      quiz={quiz}
      alignments={alignments}
      objectives={objectives}
      modularNotes={modularNotes}
      questionBank={questionBank}
    />
  );
}
