'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, X, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { COURSES, CHAPTERS } from '@/lib/courses-data';
import { ChapterMeta } from '@/lib/types';

interface SearchItem extends ChapterMeta {
  courseTitle: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const allChapters = useMemo<SearchItem[]>(() => {
    const list: SearchItem[] = [];
    COURSES.forEach((course) => {
      const chs = CHAPTERS[course.slug] || [];
      chs.forEach((ch) => {
        list.push({
          ...ch,
          courseTitle: course.title,
        });
      });
    });
    return list;
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(allChapters, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'promise', weight: 0.3 },
        { name: 'courseTitle', weight: 0.2 },
        { name: 'searchRecipe.mustHaveKeywords', weight: 0.2 },
      ],
      threshold: 0.35,
    });
  }, [allChapters]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return allChapters.slice(0, 8);
    }
    return fuse.search(query).map((res) => res.item).slice(0, 8);
  }, [query, fuse, allChapters]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    router.push(`/${item.courseSlug}/${item.slug}`);
  };

  const onKeyDownInModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-bg/70 backdrop-blur-sm transition-all"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-surface border border-line rounded-card shadow-tactile-lg overflow-hidden flex flex-col text-fg"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDownInModal}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-line bg-bg/40">
          <Search className="w-5 h-5 text-fg-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 31 chapters, topics, or keywords..."
            className="w-full bg-transparent border-none outline-none text-base placeholder:text-fg-muted text-fg font-body"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-bg text-fg-muted hover:text-fg transition-colors"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-line/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-fg-muted font-body">
              <p className="text-sm">No chapters found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-fg-muted/70">Try searching for &ldquo;Wireshark&rdquo;, &ldquo;Overfitting&rdquo;, or &ldquo;ESP32&rdquo;</p>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-bg border-l-4 border-accent pl-3.5 shadow-sm'
                      : 'hover:bg-bg/50'
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted mb-1">
                      <span className="font-bold text-fg uppercase tracking-wider">{item.courseTitle}</span>
                      <span>•</span>
                      <span>Ch {item.order < 10 ? `0${item.order}` : item.order}</span>
                      <span>•</span>
                      <span className="bg-surface px-1.5 py-0.5 rounded border border-line text-[10px] font-semibold">
                        {item.tier}
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-base text-fg">
                      {item.title}
                    </h4>
                    <p className="text-xs text-fg-muted font-body line-clamp-1 mt-0.5">
                      {item.promise}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0 self-center text-xs text-fg-muted font-mono">
                    <Clock className="w-3.5 h-3.5 mr-0.5" />
                    <span>{item.estimatedHours}h</span>
                    {isSelected && <ArrowRight className="w-4 h-4 ml-1.5 text-accent" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Shortcut Footer */}
        <div className="px-5 py-3 bg-bg/50 border-t border-line flex items-center justify-between text-[11px] text-fg-muted font-mono">
          <div className="flex items-center space-x-3">
            <span><kbd className="px-1.5 py-0.5 bg-surface border border-line rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-surface border border-line rounded">↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-surface border border-line rounded">↵</kbd> open</span>
            <span><kbd className="px-1.5 py-0.5 bg-surface border border-line rounded">esc</kbd> close</span>
          </div>
          <span>31 Chapters Indexed</span>
        </div>
      </div>
    </div>
  );
}
