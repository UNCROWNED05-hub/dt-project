import React from 'react';

interface DoodleProps {
  type: 'neural' | 'redaction' | 'circuit';
  className?: string;
}

export function CourseDoodle({ type, className = 'w-24 h-24' }: DoodleProps) {
  if (type === 'neural') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Hand-drawn Neural Network nodes and synapses */}
        <path
          d="M25 40 Q50 30 75 35 T100 50"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="4 3"
          className="opacity-40"
        />
        <path
          d="M25 80 Q55 90 75 75 T100 65"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="opacity-40"
        />
        <path
          d="M25 40 Q60 60 100 65"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-30"
        />
        <path
          d="M25 80 Q60 55 100 50"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 2"
          className="opacity-30"
        />
        {/* Layer 1 Nodes */}
        <circle cx="25" cy="40" r="8" stroke="currentColor" strokeWidth="2" fill="var(--bg-primary)" />
        <circle cx="25" cy="80" r="8" stroke="currentColor" strokeWidth="2" fill="var(--bg-primary)" />
        {/* Hidden Layer Nodes */}
        <circle cx="62" cy="35" r="7" stroke="currentColor" strokeWidth="2" fill="var(--card-tint-2)" />
        <circle cx="62" cy="62" r="7" stroke="currentColor" strokeWidth="2" fill="var(--bg-primary)" />
        <circle cx="62" cy="88" r="7" stroke="currentColor" strokeWidth="2" fill="var(--card-tint-3)" />
        {/* Output Nodes */}
        <circle cx="100" cy="50" r="9" stroke="currentColor" strokeWidth="2.5" fill="var(--card-tint-2)" />
        <circle cx="100" cy="72" r="9" stroke="currentColor" strokeWidth="2.5" fill="var(--bg-primary)" />
      </svg>
    );
  }

  if (type === 'redaction') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Redaction bars and terminal lock motif */}
        <rect x="15" y="22" width="70" height="12" rx="2" fill="currentColor" className="opacity-90" />
        <rect x="15" y="42" width="90" height="12" rx="2" fill="currentColor" className="opacity-90" />
        <rect x="15" y="62" width="45" height="12" rx="2" fill="currentColor" className="opacity-90" />
        {/* Sketched Padlock Shackle */}
        <path
          d="M82 72 V62 C82 54 94 54 94 62 V72"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-amber-500"
        />
        <rect x="74" y="72" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="2" fill="var(--bg-surface)" />
        <circle cx="88" cy="83" r="2.5" fill="currentColor" />
        <line x1="88" y1="85" x2="88" y2="90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Circuit trace for IoT
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* IC Chip Core */}
      <rect x="40" y="40" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="2.2" fill="var(--bg-surface)" />
      <circle cx="48" cy="48" r="2.5" fill="currentColor" />
      {/* IC Pins */}
      <line x1="48" y1="34" x2="48" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="60" y1="34" x2="60" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="34" x2="72" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="48" y1="80" x2="48" y2="86" stroke="currentColor" strokeWidth="2" />
      <line x1="60" y1="80" x2="60" y2="86" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="80" x2="72" y2="86" stroke="currentColor" strokeWidth="2" />
      {/* Traces */}
      <path d="M48 34 L48 20 L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="1.8" fill="var(--card-tint-2)" />
      <path d="M72 86 L72 100 L102 100" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="102" cy="100" r="3" stroke="currentColor" strokeWidth="1.8" fill="var(--card-tint-2)" />
      <path d="M80 60 L104 60" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="104" cy="60" r="3" stroke="currentColor" strokeWidth="1.8" fill="var(--card-tint-2)" />
    </svg>
  );
}
