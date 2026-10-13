'use client';

import React from 'react';

// 1. Hand-Drawn Underline
export function Underline({ className = 'w-full h-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 9 C40 3, 100 11, 198 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-stroke"
      />
    </svg>
  );
}

// 2. Hand-Drawn Marker Highlighter Swipe
export function HighlighterSwipe({ className = 'w-full h-4', color = 'var(--accent)' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 240 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 11 C60 6, 150 14, 237 8"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

// 3. Hand-Drawn Arrow
export function SketchArrow({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 20 C14 19, 26 21, 33 20 M23 10 C27 15, 31 18, 34 20 C30 23, 26 27, 22 31"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 4. Hand-Drawn Scribble Accent
export function Scribble({ className = 'w-12 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 14 C12 6, 18 20, 28 10 C38 4, 44 18, 57 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 5. Wobbly Pencil Divider
export function PencilDivider({ className = 'w-full h-2 my-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 3 C80 1, 160 5, 240 2 C320 4, 370 2, 400 3"
        stroke="var(--line)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 6. Five-Bar Pencil Tally Marks
export function TallyMarks({ count = 5, className = 'w-12 h-6' }: { count?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {count >= 1 && <line x1="6" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {count >= 2 && <line x1="13" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {count >= 3 && <line x1="20" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {count >= 4 && <line x1="27" y1="3" x2="26" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
      {count >= 5 && <line x1="2" y1="18" x2="31" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

// 7. Tactile Rubber Stamp
export function RubberStampBadge({ text = "COMPLETE", className = "" }: { text?: string; className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center px-3.5 py-1 uppercase font-mono font-bold text-xs tracking-widest border-2 border-dashed border-current rounded -rotate-6 shadow-stamp select-none ${className}`}
    >
      <span>{text}</span>
    </div>
  );
}

// 8. Hero Course Doodles
export function NeuralHeroDoodle({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Synapses with pulsating glow */}
      <path d="M25 45 Q65 30 110 50" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 95 Q65 110 110 90" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 45 Q70 70 110 90" stroke="var(--accent)" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
      <path d="M25 95 Q70 70 110 50" stroke="var(--accent-2)" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />

      {/* Nodes lighting up sequentially */}
      <circle cx="25" cy="45" r="9" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.2" />
      <circle cx="25" cy="95" r="9" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.2" />
      
      <circle cx="68" cy="38" r="8" fill="var(--accent)" stroke="var(--fg)" strokeWidth="2.2" />
      <circle cx="68" cy="70" r="8" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.2" />
      <circle cx="68" cy="102" r="8" fill="var(--accent-2)" stroke="var(--fg)" strokeWidth="2.2" />

      <circle cx="112" cy="50" r="10" fill="var(--accent)" stroke="var(--fg)" strokeWidth="2.5" />
      <circle cx="112" cy="90" r="10" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.5" />
    </svg>
  );
}

export function CyberHeroDoodle({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Keyhole surrounded by redaction bars */}
      <rect x="18" y="25" width="75" height="14" rx="3" fill="var(--accent)" />
      <rect x="18" y="48" width="95" height="14" rx="3" fill="var(--line)" />
      <rect x="18" y="71" width="55" height="14" rx="3" fill="var(--accent)" />

      {/* Padlock and Shield Motif */}
      <path
        d="M86 65 V52 C86 42 100 42 100 52 V65"
        stroke="var(--accent-2)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="76" y="65" width="36" height="30" rx="6" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.5" />
      <circle cx="94" cy="78" r="3" fill="var(--accent)" />
      <path d="M94 81 V87" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IoTHeroDoodle({ className = 'w-32 h-32' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sensor IC with traces and wireless radiating arcs */}
      <rect x="45" y="45" width="50" height="50" rx="8" fill="var(--surface)" stroke="var(--fg)" strokeWidth="2.5" />
      <circle cx="58" cy="58" r="3" fill="var(--accent)" />

      {/* Radiating RF Signal Arcs */}
      <path d="M102 38 C112 48 112 92 102 102" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M112 28 C126 42 126 98 112 112" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Pins and Circuit Traces */}
      <path d="M70 45 V28 H30 V20" stroke="var(--line)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="30" cy="20" r="3.5" fill="var(--accent)" />
      <path d="M70 95 V112 H105 V120" stroke="var(--line)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="105" cy="120" r="3.5" fill="var(--accent-2)" />
    </svg>
  );
}
