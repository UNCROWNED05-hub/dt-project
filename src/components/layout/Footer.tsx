import React from 'react';
import { Feather, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-fg text-bg flex items-center justify-center font-bold">
                <Feather className="w-4 h-4 text-accent" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-fg">Vellum</span>
            </div>
            <p className="text-sm text-fg-muted font-body max-w-md leading-relaxed">
              A tactile library for engineering minds. Grounded in mathematical first principles, 
              verified open lectures, peer-reviewed notes, and scenario-based mastery checks.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-fg-muted pt-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>100% Free & Open-License (CC BY-SA / Public Domain)</span>
            </div>
          </div>

          {/* Curriculum Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
              Curriculum Tracks
            </h4>
            <ul className="space-y-2.5 text-sm text-fg-muted font-body">
              <li>
                <a href="/ai-ml" className="hover:text-fg transition-colors">
                  AI & Machine Learning (10 Ch)
                </a>
              </li>
              <li>
                <a href="/cybersecurity" className="hover:text-fg transition-colors">
                  Cybersecurity & Defense (11 Ch)
                </a>
              </li>
              <li>
                <a href="/iot" className="hover:text-fg transition-colors">
                  Internet of Things (10 Ch)
                </a>
              </li>
              <li>
                <a href="/my-desk" className="hover:text-fg transition-colors">
                  My Desk & Streaks
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
              Transparency
            </h4>
            <ul className="space-y-2.5 text-sm text-fg-muted font-body">
              <li>
                <a href="/sources" className="hover:text-fg transition-colors">
                  Sources & License Ledger
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-fg transition-colors">
                  About & Manifesto
                </a>
              </li>
              <li>
                <a
                  href="https://developers.google.com/youtube/v3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg transition-colors"
                >
                  YouTube Data API v3
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Row */}
        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between text-xs text-fg-muted font-mono gap-3">
          <p>© {new Date().getFullYear()} Vellum. Written for Indian IT & engineering students.</p>
          <div className="flex items-center space-x-4">
            <span>Built for Mobile 4G</span>
            <span>•</span>
            <span>WCAG 2.2 AA Verified</span>
          </div>
        </div>
      </div>

      {/* Signature Moment: Giant Wordmark Cropped at the Bottom */}
      <div className="select-none pointer-events-none w-full overflow-hidden leading-none text-center opacity-10 font-display font-black text-[18vw] tracking-tighter text-fg translate-y-[25%]">
        VELLUM
      </div>
    </footer>
  );
}
