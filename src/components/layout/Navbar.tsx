'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Flame, Search, Sparkles, Shield, Cpu, BookMarked, Home, Feather } from 'lucide-react';
import { getStudentState } from '@/lib/storage';

export function Navbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(1);
  const isHome = pathname === '/';

  useEffect(() => {
    const updateStreak = () => {
      const state = getStudentState();
      setStreak(state.streak.currentCount);
    };
    updateStreak();

    window.addEventListener('vellum_state_change', updateStreak);
    return () => window.removeEventListener('vellum_state_change', updateStreak);
  }, []);

  const triggerSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
    );
  };

  // HOME PAGE: Floating Pill Nav
  if (isHome) {
    return (
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl">
        <nav className="flex items-center justify-between px-5 py-3 rounded-pill bg-surface/90 backdrop-blur-md border border-line shadow-tactile text-fg">
          <a href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-full bg-fg text-bg flex items-center justify-center font-bold">
              <Feather className="w-4 h-4 text-accent" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Vellum</span>
          </a>

          <div className="hidden sm:flex items-center space-x-6 text-sm font-medium">
            <a href="/ai-ml" className="text-fg-muted hover:text-fg transition-colors">AI & ML</a>
            <a href="/cybersecurity" className="text-fg-muted hover:text-fg transition-colors">Cybersecurity</a>
            <a href="/iot" className="text-fg-muted hover:text-fg transition-colors">IoT</a>
            <a href="/my-desk" className="text-fg-muted hover:text-fg transition-colors">My Desk</a>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={triggerSearch}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-pill bg-bg border border-line text-xs font-mono text-fg-muted hover:text-fg transition-all"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ctrl+K</span>
            </button>

            <a
              href="/ai-ml"
              className="px-4 py-1.5 rounded-pill bg-accent text-on-accent text-xs font-mono font-bold shadow-sm hover:opacity-90 transition-all"
            >
              Start Reading
            </a>
          </div>
        </nav>
      </header>
    );
  }

  // APP PAGES: Desktop Left Rail + Mobile Bottom Pill
  return (
    <>
      {/* Top Header on App Pages (Brand + Search + Streak) */}
      <header className="w-full border-b border-line bg-surface/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between text-fg">
        <a href="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-fg text-bg flex items-center justify-center">
            <Feather className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="font-display font-bold text-base tracking-tight">Vellum</span>
        </a>

        <div className="flex items-center space-x-3">
          <button
            onClick={triggerSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-pill bg-bg border border-line text-xs font-mono text-fg-muted hover:text-fg transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search library</span>
            <kbd className="hidden sm:inline px-1 bg-surface border border-line rounded text-[10px]">Ctrl+K</kbd>
          </button>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-pill bg-bg border border-line text-xs font-mono font-semibold text-fg">
            <Flame className="w-3.5 h-3.5 text-accent fill-accent" />
            <span>{streak}d streak</span>
          </div>
        </div>
      </header>

      {/* Desktop Slim Left Navigation Rail */}
      <aside
        className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center py-4 px-2.5 rounded-pill bg-surface border border-line shadow-tactile text-fg space-y-5"
        aria-label="Course Navigation Rail"
      >
        <a
          href="/"
          className={`p-2 rounded-full transition-all ${isHome ? 'bg-bg text-accent' : 'text-fg-muted hover:text-fg'}`}
          title="Library Home"
        >
          <Home className="w-5 h-5" />
        </a>

        <div className="w-5 h-px bg-line" />

        <a
          href="/ai-ml"
          className={`p-2 rounded-full transition-all ${
            pathname?.startsWith('/ai-ml') ? 'bg-bg text-accent shadow-sm ring-1 ring-accent' : 'text-fg-muted hover:text-fg'
          }`}
          title="AI & Machine Learning"
        >
          <Sparkles className="w-5 h-5" />
        </a>

        <a
          href="/cybersecurity"
          className={`p-2 rounded-full transition-all ${
            pathname?.startsWith('/cybersecurity') ? 'bg-bg text-accent shadow-sm ring-1 ring-accent' : 'text-fg-muted hover:text-fg'
          }`}
          title="Cybersecurity"
        >
          <Shield className="w-5 h-5" />
        </a>

        <a
          href="/iot"
          className={`p-2 rounded-full transition-all ${
            pathname?.startsWith('/iot') ? 'bg-bg text-accent shadow-sm ring-1 ring-accent' : 'text-fg-muted hover:text-fg'
          }`}
          title="Internet of Things"
        >
          <Cpu className="w-5 h-5" />
        </a>

        <div className="w-5 h-px bg-line" />

        <a
          href="/my-desk"
          className={`p-2 rounded-full transition-all ${
            pathname === '/my-desk' ? 'bg-bg text-accent shadow-sm ring-1 ring-accent' : 'text-fg-muted hover:text-fg'
          }`}
          title="My Desk"
        >
          <BookMarked className="w-5 h-5" />
        </a>
      </aside>

      {/* Mobile Bottom Pill Navigation */}
      <nav
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center px-5 py-2.5 rounded-pill bg-surface/95 backdrop-blur-md border border-line shadow-tactile text-fg space-x-7"
        aria-label="Mobile Navigation"
      >
        <a href="/" className={`p-1 ${isHome ? 'text-accent' : 'text-fg-muted'}`}>
          <Home className="w-5 h-5" />
        </a>
        <a href="/ai-ml" className={`p-1 ${pathname?.startsWith('/ai-ml') ? 'text-accent' : 'text-fg-muted'}`}>
          <Sparkles className="w-5 h-5" />
        </a>
        <a href="/cybersecurity" className={`p-1 ${pathname?.startsWith('/cybersecurity') ? 'text-accent' : 'text-fg-muted'}`}>
          <Shield className="w-5 h-5" />
        </a>
        <a href="/iot" className={`p-1 ${pathname?.startsWith('/iot') ? 'text-accent' : 'text-fg-muted'}`}>
          <Cpu className="w-5 h-5" />
        </a>
        <a href="/my-desk" className={`p-1 ${pathname === '/my-desk' ? 'text-accent' : 'text-fg-muted'}`}>
          <BookMarked className="w-5 h-5" />
        </a>
      </nav>
    </>
  );
}
