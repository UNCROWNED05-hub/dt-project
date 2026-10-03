'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, X, ArrowRight, Play, Sparkles, Shield, Cpu, RotateCcw } from 'lucide-react';
import Fuse from 'fuse.js';
import { COURSES, CHAPTERS } from '@/lib/courses-data';
import { ChapterMeta } from '@/lib/types';

interface SearchItem extends ChapterMeta {
  courseTitle: string;
}

const RECENT_SEARCHES_KEY = 'vellum_recent_searches';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Load all 31 chapters into searchable list
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

  // Fuse.js index tuned for typo tolerance & keyword priority
  const fuse = useMemo(() => {
    return new Fuse(allChapters, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'searchRecipe.mustHaveKeywords', weight: 0.35 },
        { name: 'promise', weight: 0.15 },
        { name: 'courseTitle', weight: 0.1 },
      ],
      threshold: 0.42,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [allChapters]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) {
        setRecentSearches(JSON.parse(raw).slice(0, 5));
      }
    } catch (e) {}
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      const updated = [term.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Filtered and ranked results
  const results = useMemo(() => {
    let pool = allChapters;
    if (selectedCourseFilter !== 'all') {
      pool = pool.filter((ch) => ch.courseSlug === selectedCourseFilter);
    }

    if (!query.trim()) {
      return pool.slice(0, 8);
    }

    const matched = fuse.search(query.trim()).map((res) => res.item);
    if (selectedCourseFilter !== 'all') {
      return matched.filter((ch) => ch.courseSlug === selectedCourseFilter).slice(0, 10);
    }
    return matched.slice(0, 10);
  }, [query, selectedCourseFilter, fuse, allChapters]);

  // Global keydown triggers: Ctrl+K, Cmd+K, and '/'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Manage focus & body scroll locking
  useEffect(() => {
    if (isOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      document.body.style.overflow = '';
      lastActiveElementRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (item: SearchItem) => {
    if (query.trim()) saveRecentSearch(query);
    setIsOpen(false);
    router.push(`/${item.courseSlug}/${item.slug}`);
  };

  const onKeyDownInModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Tab') {
      // Focus trapping inside modal
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  const activeResult = results[selectedIndex] || results[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-3 sm:px-6 bg-bg/90 overflow-hidden"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Chapter search"
    >
      {/* Search Container with 3D Lift-In Effect */}
      <div
        className="w-full max-w-4xl bg-surface border border-line rounded-card shadow-tactile-lg overflow-hidden flex flex-col text-fg animate-in fade-in zoom-in-95 duration-200"
        style={{
          transform: 'translateZ(0)',
          maxHeight: '88vh',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDownInModal}
      >
        {/* Giant Search Input Bar (No Logo Inside) */}
        <div className="flex items-center px-6 sm:px-8 py-5 sm:py-6 border-b border-line bg-bg/40">
          <Search className="w-6 h-6 sm:w-8 sm:h-8 text-accent mr-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results-list"
            aria-activedescendant={activeResult ? `search-item-${activeResult.id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={`Search ${allChapters.length} chapters...`}
            className="w-full bg-transparent border-none outline-none font-display font-bold text-xl sm:text-3xl text-fg placeholder:text-fg-muted/60 tracking-tight"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-bg text-fg-muted hover:text-fg transition-colors shrink-0 ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Filter Bar (Plain Text Tabs) */}
        <div className="flex items-center space-x-2 px-6 sm:px-8 py-3 border-b border-line bg-surface overflow-x-auto text-xs font-body">
          <span className="text-fg-muted font-medium mr-2 shrink-0">Filter:</span>
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'ai-ml', label: 'AI & Machine Learning' },
            { id: 'cybersecurity', label: 'Cybersecurity' },
            { id: 'iot', label: 'Internet of Things' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedCourseFilter(f.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-pill text-xs transition-colors shrink-0 ${
                selectedCourseFilter === f.id
                  ? 'bg-accent text-on-accent font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-bg'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main Content Area: Split View on Desktop (Results List + Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden flex-1 min-h-[380px]">
          {/* Left / Results List Column */}
          <div
            id="search-results-list"
            role="listbox"
            className="lg:col-span-7 overflow-y-auto max-h-[58vh] p-3 sm:p-4 space-y-1.5 divide-y divide-line/30"
          >
            {results.length === 0 ? (
              <div className="py-16 text-center text-fg-muted font-body px-6 space-y-3">
                <p className="font-display font-bold text-lg text-fg">
                  We checked every shelf in the library...
                </p>
                <p className="text-xs max-w-sm mx-auto leading-relaxed">
                  No chapters matched &ldquo;{query}&rdquo;. Try searching for &ldquo;Wireshark&rdquo;, &ldquo;Overfitting&rdquo;, &ldquo;MQTT&rdquo;, or &ldquo;Transformers&rdquo;.
                </p>
              </div>
            ) : (
              results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const isAi = item.courseSlug === 'ai-ml';
                const isCyber = item.courseSlug === 'cybersecurity';

                return (
                  <div
                    key={item.id}
                    id={`search-item-${item.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-bg border-l-4 border-accent shadow-sm'
                        : 'hover:bg-bg/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3 pr-2">
                      {/* Course dot marker */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          isAi ? 'bg-accent' : isCyber ? 'bg-accent-2' : 'bg-fg'
                        }`}
                      />

                      <div>
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-fg-muted mb-0.5">
                          <span className="font-bold text-fg uppercase">{item.courseTitle}</span>
                          <span>•</span>
                          <span>Ch {item.order < 10 ? `0${item.order}` : item.order}</span>
                          <span>•</span>
                          <span>{item.tier} Tier</span>
                        </div>

                        <h4 className="font-display font-bold text-base text-fg leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs text-fg-muted font-body line-clamp-1 mt-0.5">
                          {item.promise}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right font-mono text-[11px] text-fg-muted pt-1">
                      <span>{item.estimatedHours}h</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Empty Query: Recent Searches & Quick Starts */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="pt-4 px-2 space-y-2 border-t border-line">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-fg-muted">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recent searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded bg-bg border border-line text-xs font-body text-fg hover:border-accent"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right / Live Preview Column (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 border-l border-line bg-bg/50 p-6 flex-col justify-between">
            {activeResult ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted">
                    <span className="px-2 py-0.5 rounded bg-surface border border-line font-bold text-fg">
                      {activeResult.tier} Tier
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-accent" />
                      <span>{activeResult.estimatedHours} hours</span>
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-fg leading-snug">
                    {activeResult.title}
                  </h3>

                  <p className="text-xs font-body text-fg-muted leading-relaxed">
                    {activeResult.promise}
                  </p>
                </div>

                {/* Video Module Preview Slab */}
                <div className="p-4 rounded-xl bg-surface border border-line space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted">
                    <span className="font-bold text-fg">Curated Video Engine</span>
                    <span className="text-fg font-bold px-1.5 py-0.5 rounded bg-bg border border-line">#1 Top Lecture</span>
                  </div>
                  <div className="flex items-center space-x-3 pt-1">
                    <div className="w-10 h-10 rounded-lg bg-bg border border-line flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 text-accent fill-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-fg line-clamp-1">
                        Ranked candidate benchmark
                      </p>
                      <p className="text-[10px] font-mono text-fg-muted">
                        Auto-refreshed via YouTube v3
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mandatory Sections Overview */}
                <div className="text-[11px] font-mono text-fg-muted space-y-1">
                  <div>Includes: 7-Section Notes • Runnable Code • Scenario Quiz</div>
                  <div>Volatility Tag: <span className="font-bold text-fg">{activeResult.volatility}</span></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs font-mono text-fg-muted">
                Select a chapter to preview
              </div>
            )}

            {/* Direct Open Button */}
            {activeResult && (
              <div className="pt-4 border-t border-line">
                <button
                  onClick={() => handleSelect(activeResult)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-pill bg-accent text-on-accent font-body text-xs font-bold shadow-tactile hover:opacity-90 transition-all cursor-pointer"
                >
                  <span>Open chapter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-6 py-3 border-t border-line bg-surface flex items-center justify-between text-[11px] font-mono text-fg-muted">
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Navigate: <kbd className="px-1 bg-bg border rounded">↑</kbd> <kbd className="px-1 bg-bg border rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 bg-bg border rounded">↵</kbd></span>
            <span>Close: <kbd className="px-1 bg-bg border rounded">esc</kbd></span>
          </div>
          <span aria-live="polite">{results.length} chapters found</span>
        </div>
      </div>
    </div>
  );
}
