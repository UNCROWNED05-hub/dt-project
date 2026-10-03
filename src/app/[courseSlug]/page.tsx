import React from 'react';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getChaptersForCourse, COURSES } from '@/lib/courses-data';
import { RoadmapView } from '@/components/course/RoadmapView';
import { NeuralHeroDoodle, CyberHeroDoodle, IoTHeroDoodle } from '@/components/illustrations/Kit';
import { Clock, BookOpen, ArrowLeft } from 'lucide-react';

interface CoursePageProps {
  params: {
    courseSlug: string;
  };
}

export function generateStaticParams() {
  return COURSES.map((course) => ({
    courseSlug: course.slug,
  }));
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = getCourseBySlug(params.courseSlug);
  if (!course) {
    notFound();
  }

  const chapters = getChaptersForCourse(course.slug);

  // Render course-specific hero doodle
  const renderDoodle = () => {
    if (course.doodle === 'neural') return <NeuralHeroDoodle className="w-32 h-32 sm:w-40 sm:h-40" />;
    if (course.doodle === 'redaction') return <CyberHeroDoodle className="w-32 h-32 sm:w-40 sm:h-40" />;
    return <IoTHeroDoodle className="w-32 h-32 sm:w-40 sm:h-40" />;
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
          <a href="/" className="hover:text-fg flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Library</span>
          </a>
          <span>/</span>
          <span className="text-fg font-semibold">{course.title}</span>
        </div>

        {/* Course Hero Banner */}
        <div className="p-8 sm:p-14 rounded-card border border-line bg-surface shadow-tactile-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-pill bg-bg border border-line text-xs font-mono text-fg-muted">
              <span>{course.badge}</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-fg tracking-tight leading-[0.95]">
              {course.title.split(' ')[0]} <br />
              <span className="font-accent italic font-normal text-fg">
                {course.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-fg-muted font-body leading-relaxed pt-2">
              {course.description}
            </p>

            <div className="flex items-center space-x-4 text-xs font-mono text-fg-muted pt-2">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-accent" />
                <span>{course.totalHours} Estimated Hours</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>{chapters.length} Ordered Chapters</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center p-4 rounded-2xl bg-bg border border-line">
            {renderDoodle()}
          </div>
        </div>

        {/* Roadmap of Chapters */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-fg">
                Curriculum Roadmap
              </h2>
              <p className="text-xs sm:text-sm text-fg-muted font-body mt-1">
                Follow this progression from absolute beginner fundamentals through advanced production engineering.
              </p>
            </div>
          </div>

          <RoadmapView course={course} chapters={chapters} />
        </div>
      </div>
    </div>
  );
}
