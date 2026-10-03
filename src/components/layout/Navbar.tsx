'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { Search, Flame } from 'lucide-react';
import { getStudentState } from '@/lib/storage';

export function Navbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
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

  // Scroll detection for condensing into dock and hiding on scroll-down
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 80);

      if (currentY > 140 && currentY > lastScrollY.current) {
        setIsHidden(true); // scrolling down
      } else {
        setIsHidden(false); // scrolling up or top
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  // 1. HOME DESKTOP NAVIGATION
  if (isHome) {
    return (
      <>
        {/* Desktop Header: Transparent bar over hero, morphs into floating dock after 80px */}
        <header
          className={`hidden md:flex fixed z-50 transition-all duration-300 ease-out ${
            isScrolled
              ? `top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl px-6 py-2.5 rounded-pill border border-line shadow-tactile-lg bg-nav-bg text-nav-fg ${
                  isHidden ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'
                }`
              : 'top-0 left-0 right-0 w-full px-8 lg:px-12 py-6 bg-transparent text-fg justify-between items-center'
          }`}
        >
          {/* Logo Left */}
          <a href="/" className="shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            <Logo variant="wordmark" />
          </a>

          {/* Three Courses Plain Text Links with Pencil Underline on Hover */}
          <nav className="flex items-center space-x-8" aria-label="Course Tracks">
            <a
              href="/ai-ml"
              className="group relative text-sm font-body font-medium text-fg hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
            >
              <span>AI & ML</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full rounded-full" />
            </a>

            <a
              href="/cybersecurity"
              className="group relative text-sm font-body font-medium text-fg hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
            >
              <span>Cybersecurity</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full rounded-full" />
            </a>

            <a
              href="/iot"
              className="group relative text-sm font-body font-medium text-fg hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-1"
            >
              <span>IoT</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full rounded-full" />
            </a>
          </nav>

          {/* Actions: Search Trigger & Start Reading Button */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={triggerSearch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-pill border border-line bg-surface/80 hover:bg-surface text-xs font-body text-fg-muted hover:text-fg transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Search chapters (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-accent" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg border border-line font-mono text-[10px] text-fg">
                Ctrl K
              </kbd>
            </button>

            <a
              href="/ai-ml"
              className="px-5 py-2 rounded-pill bg-accent text-on-accent text-xs font-body font-bold shadow-tactile hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Start reading
            </a>
          </div>
        </header>

        {/* Mobile Header Bar (Top) */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3.5 bg-surface/90 backdrop-blur-md border-b border-line flex items-center justify-between text-fg">
          <a href="/">
            <Logo variant="wordmark" />
          </a>
          <button
            onClick={triggerSearch}
            className="p-2 rounded-pill bg-bg border border-line text-fg min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-accent" />
          </button>
        </header>

        {/* Mobile Bottom Dock (Targets >= 44px) */}
        <nav
          className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center px-3 py-1.5 rounded-pill bg-surface/95 backdrop-blur-md border border-line shadow-tactile-lg text-fg space-x-1"
          aria-label="Mobile Navigation"
        >
          <a
            href="/"
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body text-accent"
          >
            <span className="font-bold">Home</span>
          </a>
          <a
            href="/ai-ml"
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body text-fg-muted hover:text-fg"
          >
            <span>AI</span>
          </a>
          <a
            href="/cybersecurity"
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body text-fg-muted hover:text-fg"
          >
            <span>Cyber</span>
          </a>
          <a
            href="/iot"
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body text-fg-muted hover:text-fg"
          >
            <span>IoT</span>
          </a>
          <a
            href="/my-desk"
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body text-fg-muted hover:text-fg"
          >
            <span>Desk</span>
          </a>
        </nav>
      </>
    );
  }

  // 2. APP PAGES NAVIGATION (Top Bar + Slim Left Rail + Mobile Bottom Dock)
  return (
    <>
      {/* Top Header on App Pages */}
      <header className="w-full border-b border-line bg-surface/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between text-fg sticky top-0 z-30">
        <a href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
          <Logo variant="wordmark" />
        </a>

        <div className="flex items-center space-x-4">
          <button
            onClick={triggerSearch}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-pill bg-bg border border-line text-xs font-body text-fg-muted hover:text-fg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Search chapters"
          >
            <Search className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Search chapters...</span>
            <kbd className="hidden sm:inline px-1 bg-surface border border-line rounded font-mono text-[10px] text-fg">
              Ctrl K
            </kbd>
          </button>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-pill bg-bg border border-line text-xs font-mono font-semibold text-fg">
            <Flame className="w-3.5 h-3.5 text-accent fill-accent" />
            <span>{streak}d</span>
          </div>
        </div>
      </header>

      {/* Desktop Slim Left Navigation Rail with Custom Redrawn Icons & Bookmark Ribbon */}
      <aside
        className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center py-4 px-2.5 rounded-pill bg-surface border border-line shadow-tactile text-fg space-y-4"
        aria-label="Curriculum Tracks Navigation Rail"
      >
        {/* Home */}
        <div className="relative group flex items-center justify-center">
          <a
            href="/"
            className="p-2 rounded-full text-fg-muted hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </a>
          <span className="absolute left-14 px-2 py-1 rounded bg-fg text-bg text-[11px] font-body opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
            Library Home
          </span>
        </div>

        <div className="w-5 h-px bg-line" />

        {/* AI & ML */}
        <div className="relative group flex items-center justify-center">
          <a
            href="/ai-ml"
            className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pathname?.startsWith('/ai-ml') ? 'text-fg' : 'text-fg-muted hover:text-fg'
            }`}
            aria-label="AI and Machine Learning"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
            </svg>
          </a>
          {pathname?.startsWith('/ai-ml') && (
            <span
              className="absolute -right-2 top-1.5 w-1.5 h-6 bg-accent rounded-l-sm"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}
            />
          )}
          <span className="absolute left-14 px-2 py-1 rounded bg-fg text-bg text-[11px] font-body opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
            AI & ML
          </span>
        </div>

        {/* Cybersecurity */}
        <div className="relative group flex items-center justify-center">
          <a
            href="/cybersecurity"
            className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pathname?.startsWith('/cybersecurity') ? 'text-fg' : 'text-fg-muted hover:text-fg'
            }`}
            aria-label="Cybersecurity"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </a>
          {pathname?.startsWith('/cybersecurity') && (
            <span
              className="absolute -right-2 top-1.5 w-1.5 h-6 bg-accent rounded-l-sm"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}
            />
          )}
          <span className="absolute left-14 px-2 py-1 rounded bg-fg text-bg text-[11px] font-body opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
            Cybersecurity
          </span>
        </div>

        {/* IoT */}
        <div className="relative group flex items-center justify-center">
          <a
            href="/iot"
            className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pathname?.startsWith('/iot') ? 'text-fg' : 'text-fg-muted hover:text-fg'
            }`}
            aria-label="Internet of Things"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
            </svg>
          </a>
          {pathname?.startsWith('/iot') && (
            <span
              className="absolute -right-2 top-1.5 w-1.5 h-6 bg-accent rounded-l-sm"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}
            />
          )}
          <span className="absolute left-14 px-2 py-1 rounded bg-fg text-bg text-[11px] font-body opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
            Internet of Things
          </span>
        </div>

        <div className="w-5 h-px bg-line" />

        {/* My Desk */}
        <div className="relative group flex items-center justify-center">
          <a
            href="/my-desk"
            className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pathname === '/my-desk' ? 'text-fg' : 'text-fg-muted hover:text-fg'
            }`}
            aria-label="My Desk"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </a>
          {pathname === '/my-desk' && (
            <span
              className="absolute -right-2 top-1.5 w-1.5 h-6 bg-accent rounded-l-sm"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}
            />
          )}
          <span className="absolute left-14 px-2 py-1 rounded bg-fg text-bg text-[11px] font-body opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
            My Desk
          </span>
        </div>
      </aside>

      {/* Mobile Bottom Dock (Targets >= 44px) */}
      <nav
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center px-3 py-1.5 rounded-pill bg-surface/95 backdrop-blur-md border border-line shadow-tactile-lg text-fg space-x-1"
        aria-label="Mobile Navigation"
      >
        <a
          href="/"
          className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body text-fg-muted hover:text-fg"
        >
          <span>Home</span>
        </a>
        <a
          href="/ai-ml"
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body ${
            pathname?.startsWith('/ai-ml') ? 'text-accent font-bold' : 'text-fg-muted hover:text-fg'
          }`}
        >
          <span>AI</span>
        </a>
        <a
          href="/cybersecurity"
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body ${
            pathname?.startsWith('/cybersecurity') ? 'text-accent font-bold' : 'text-fg-muted hover:text-fg'
          }`}
        >
          <span>Cyber</span>
        </a>
        <a
          href="/iot"
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body ${
            pathname?.startsWith('/iot') ? 'text-accent font-bold' : 'text-fg-muted hover:text-fg'
          }`}
        >
          <span>IoT</span>
        </a>
        <a
          href="/my-desk"
          className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-[10px] font-body ${
            pathname === '/my-desk' ? 'text-accent font-bold' : 'text-fg-muted hover:text-fg'
          }`}
        >
          <span>Desk</span>
        </a>
      </nav>
    </>
  );
}
