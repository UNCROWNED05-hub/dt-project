import React from 'react';
import Link from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center text-fg">
      <div className="max-w-md space-y-6">
        {/* Sketched Broken Pencil Doodle */}
        <div className="w-24 h-24 mx-auto text-accent">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 70 L45 45 M55 35 L80 10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M40 50 L50 40 M46 54 L54 44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="3 3"
            />
            <polygon points="15,75 25,75 18,68" fill="currentColor" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
            Error 404 • Blank Margin
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-fg">
            Page Not Found
          </h1>
          <p className="text-sm text-fg-muted font-body leading-relaxed">
            It looks like this chapter has drifted outside the margins or does not exist in our library catalog yet.
          </p>
        </div>

        <div>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold shadow-tactile transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Library</span>
          </a>
        </div>
      </div>
    </div>
  );
}
