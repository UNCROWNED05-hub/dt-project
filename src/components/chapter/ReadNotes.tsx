'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { markNotesRead, getStudentState } from '@/lib/storage';
import { ParsedNotes } from '@/lib/content';
import { Underline } from '@/components/illustrations/Kit';

interface ReadNotesProps {
  chapterId: string;
  notes: ParsedNotes;
}

export function ReadNotes({ chapterId, notes }: ReadNotesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRead, setIsRead] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const state = getStudentState();
    if (state.chapters[chapterId]?.notesRead) {
      setIsRead(true);
    }

    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [chapterId]);

  const handleMarkAsRead = () => {
    markNotesRead(chapterId);
    setIsRead(true);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <article className="relative max-w-[68ch] mx-auto space-y-10 animate-in fade-in duration-200 text-fg">
      {/* Reading Progress Pencil Line Along Top */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-line/20">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Meta Header */}
      <div className="p-5 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-fg-muted">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-semibold text-fg">
            <Clock className="w-4 h-4 text-accent" />
            <span>{notes.readingTimeMinutes} min read</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Open License (CC BY-SA 4.0)</span>
          </span>
        </div>

        <div>
          {notes.reviewed ? (
            <span className="px-2.5 py-1 rounded-pill bg-bg text-fg border border-line">
              Verified ✓
            </span>
          ) : (
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-pill bg-bg text-fg border border-line">
              <AlertCircle className="w-3.5 h-3.5 text-accent" />
              <span>reviewed: false (Draft Review)</span>
            </span>
          )}
        </div>
      </div>

      {/* Notes Body with Drop Cap and Semantic Prose */}
      <div className="prose max-w-none text-fg font-body text-lg leading-relaxed space-y-7">
        {notes.content.split('\n\n').map((paragraph, idx) => {
          // Headers
          if (paragraph.startsWith('## ')) {
            return (
              <div key={idx} className="pt-8 pb-2 border-b border-line">
                <h2
                  id={paragraph.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className="font-display font-black text-2xl sm:text-3xl text-fg scroll-mt-24"
                >
                  {paragraph.slice(3)}
                </h2>
                <Underline className="w-32 h-2 text-accent mt-1" />
              </div>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="font-display font-bold text-xl text-fg pt-4 pb-1 scroll-mt-24"
              >
                {paragraph.slice(4)}
              </h3>
            );
          }

          // Code blocks
          if (paragraph.startsWith('```')) {
            const lines = paragraph.split('\n');
            const lang = lines[0].replace('```', '') || 'code';
            const code = lines.slice(1, -1).join('\n');
            return (
              <div
                key={idx}
                className="relative my-6 rounded-card overflow-hidden border border-line bg-surface shadow-tactile font-mono text-xs sm:text-sm text-fg"
              >
                <div className="flex items-center justify-between px-5 py-2.5 bg-bg/80 border-b border-line text-xs font-mono text-fg-muted">
                  <span className="uppercase tracking-wider font-semibold">{lang}</span>
                  <button
                    onClick={() => copyToClipboard(code, idx)}
                    className="flex items-center space-x-1.5 text-fg-muted hover:text-fg transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-accent" />
                        <span className="text-accent font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-5 overflow-x-auto leading-relaxed text-fg">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }

          // Callout / Sticky note
          if (paragraph.startsWith('> ')) {
            return (
              <div
                key={idx}
                className="relative p-5 my-6 rounded-2xl bg-surface border-l-4 border-accent shadow-sm rotate-0.5 text-fg italic font-body"
              >
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-accent block not-italic mb-1">
                  Editorial Sticky Note:
                </span>
                {paragraph.slice(2)}
              </div>
            );
          }

          // Unordered lists
          if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={idx} className="list-disc list-inside space-y-2 my-4 pl-2 text-fg">
                {items.map((it, i) => (
                  <li key={i} className="leading-relaxed">
                    {it.replace(/^[-*]\s+/, '')}
                  </li>
                ))}
              </ul>
            );
          }

          // First paragraph: Drop Cap treatment
          if (idx === 1 || (idx === 2 && !paragraph.startsWith('#'))) {
            const firstLetter = paragraph.charAt(0);
            const remaining = paragraph.slice(1);
            return (
              <p key={idx} className="text-lg leading-relaxed text-fg">
                <span className="float-left font-display font-black text-5xl leading-none pr-3 pt-1 text-accent">
                  {firstLetter}
                </span>
                {remaining}
              </p>
            );
          }

          // Default paragraph
          return (
            <p key={idx} className="text-lg leading-relaxed text-fg">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Completion Marker Button */}
      <div className="pt-10 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-lg text-fg">
            Finished reading these notes?
          </h4>
          <p className="text-xs text-fg-muted font-body">
            Record your study progress and proceed to the practice quiz.
          </p>
        </div>

        <button
          onClick={handleMarkAsRead}
          disabled={isRead}
          className={`flex items-center space-x-2 px-6 py-3 rounded-pill font-mono text-xs font-bold shadow-tactile transition-all ${
            isRead
              ? 'bg-surface text-fg border border-line cursor-default'
              : 'bg-accent text-on-accent hover:opacity-90 active:scale-95'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{isRead ? 'Notes Completed ✓' : 'Mark Notes Read'}</span>
        </button>
      </div>
    </article>
  );
}
