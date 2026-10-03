'use client';

import React from 'react';

// Configure the active mark: 1 = The Monograph Fold, 2 = The Compass Nib, 3 = The Stepped Codex
export const ACTIVE_LOGO_MARK: 1 | 2 | 3 = 1;

interface LogoProps {
  variant?: 'mark' | 'wordmark' | 'stacked';
  markVariant?: 1 | 2 | 3;
  className?: string;
}

export function Logo({
  variant = 'wordmark',
  markVariant = ACTIVE_LOGO_MARK,
  className = '',
}: LogoProps) {
  const renderMark = (size = 'w-7 h-7') => {
    if (markVariant === 2) {
      // Mark 2: The Compass Nib
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${size} shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5`}
          aria-hidden="true"
        >
          <path
            d="M16 3 L25 15 C25 21 21 26 16 29 C11 26 7 21 7 15 Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
            className="animate-stroke"
          />
          <path d="M16 3 V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="19" r="2.2" fill="var(--accent)" />
          <path d="M12 25 Q16 27 20 25" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    if (markVariant === 3) {
      // Mark 3: The Stepped Codex
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${size} shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5`}
          aria-hidden="true"
        >
          <rect x="5" y="8" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="9" y="5" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <rect x="13" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path d="M15 8 V16 L18 14 L21 16 V8" fill="var(--accent)" />
        </svg>
      );
    }

    // Mark 1: The Monograph Fold (Default Strongest)
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${size} shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5`}
        aria-hidden="true"
      >
        {/* Geometric Folio Fold forming "V" */}
        <path
          d="M6 7 L16 26 L26 7"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-stroke"
        />
        <path
          d="M10 7 L16 19 L22 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />
        {/* Architectural vertex accent pin */}
        <circle cx="16" cy="26" r="2" fill="var(--accent)" />
        {/* Folio top registration rule */}
        <line x1="6" y1="7" x2="26" y2="7" stroke="var(--line)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  };

  if (variant === 'mark') {
    return (
      <span className={`inline-flex items-center text-fg ${className}`} aria-label="Vellum Library">
        {renderMark()}
      </span>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={`group inline-flex flex-col items-center text-center text-fg cursor-pointer select-none ${className}`}
        aria-label="Vellum Library"
      >
        {renderMark('w-10 h-10')}
        <span className="font-display font-black text-2xl tracking-tight leading-none mt-2">
          VELLUM
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-fg-muted mt-0.5">
          ENGINEERING MONOGRAPHS
        </span>
      </div>
    );
  }

  // Default: wordmark
  return (
    <div
      className={`group inline-flex items-center space-x-2.5 text-fg cursor-pointer select-none ${className}`}
      aria-label="Vellum Library"
    >
      {renderMark('w-6 h-6')}
      <div className="flex flex-col">
        <span className="font-display font-black text-lg tracking-tight leading-none">
          VELLUM
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-fg-muted -mt-0.5">
          LIBRARY
        </span>
      </div>
    </div>
  );
}
