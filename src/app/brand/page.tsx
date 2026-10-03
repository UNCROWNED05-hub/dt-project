'use client';

import React, { useState } from 'react';
import { Logo, ACTIVE_LOGO_MARK } from '@/components/layout/Logo';
import { ArrowLeft, Check } from 'lucide-react';

export default function BrandPage() {
  const [selectedTheme, setSelectedTheme] = useState('desk');

  const themes = [
    { id: 'desk', name: 'Desk (Neutral Parchment)' },
    { id: 'sunrise', name: 'Sunrise Paper (AI & ML)' },
    { id: 'midnight', name: 'Midnight Ledger (Cybersecurity)' },
    { id: 'blueprint', name: 'Blueprint Meadow (IoT)' },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4 border-b border-line pb-8">
        <a href="/" className="inline-flex items-center space-x-1.5 text-xs font-mono text-fg-muted hover:text-fg mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Library</span>
        </a>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">Brand Identity Laboratory</span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-fg mt-1">
              Vellum Logo Marks
            </h1>
          </div>

          {/* Theme switcher for testing legibility */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-fg-muted">Test Theme:</span>
            <select
              value={selectedTheme}
              onChange={(e) => {
                setSelectedTheme(e.target.value);
                document.documentElement.setAttribute('data-theme', e.target.value);
                document.documentElement.style.colorScheme = e.target.value === 'midnight' ? 'dark' : 'light';
              }}
              className="px-3 py-1.5 rounded-pill bg-surface border border-line text-xs font-mono text-fg outline-none"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* The 3 Original Marks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Mark 1: The Monograph Fold */}
        <div className={`p-8 rounded-card border ${ACTIVE_LOGO_MARK === 1 ? 'border-accent bg-surface shadow-tactile-lg' : 'border-line bg-surface/50'} space-y-6 flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-fg">Mark 01 (Default • Applied)</span>
              {ACTIVE_LOGO_MARK === 1 && (
                <span className="px-2 py-0.5 rounded-pill bg-accent text-on-accent text-[10px] font-mono font-bold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE</span>
                </span>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-bg border border-line flex items-center justify-center">
              <Logo variant="mark" markVariant={1} className="scale-150" />
            </div>

            <h3 className="font-display font-bold text-xl text-fg">The Monograph Fold</h3>
            <p className="text-xs text-fg-muted font-body leading-relaxed">
              An architectural parchment sheet folded into a crisp &ldquo;V&rdquo; monogram. Features self-drawing construction lines and an accent vertex pin.
            </p>
          </div>

          <div className="pt-4 border-t border-line space-y-3">
            <div className="text-[11px] font-mono text-fg-muted">16px Legibility Check:</div>
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-fg-muted">16px:</span>
              <div className="w-4 h-4 text-fg"><Logo variant="mark" markVariant={1} className="w-4 h-4" /></div>
              <span className="text-xs font-mono text-fg-muted">32px:</span>
              <div className="w-8 h-8 text-fg"><Logo variant="mark" markVariant={1} className="w-8 h-8" /></div>
            </div>
          </div>
        </div>

        {/* Mark 2: The Compass Nib */}
        <div className={`p-8 rounded-card border ${ACTIVE_LOGO_MARK === 2 ? 'border-accent bg-surface shadow-tactile-lg' : 'border-line bg-surface/50'} space-y-6 flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-fg">Mark 02 (Drafting Precision)</span>
              {ACTIVE_LOGO_MARK === 2 && (
                <span className="px-2 py-0.5 rounded-pill bg-accent text-on-accent text-[10px] font-mono font-bold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE</span>
                </span>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-bg border border-line flex items-center justify-center">
              <Logo variant="mark" markVariant={2} className="scale-150" />
            </div>

            <h3 className="font-display font-bold text-xl text-fg">The Compass Nib</h3>
            <p className="text-xs text-fg-muted font-body leading-relaxed">
              A fountain nib intersecting a geometric compass arc. Evokes engineering precision, technical drafting, and rigorous laboratory analysis.
            </p>
          </div>

          <div className="pt-4 border-t border-line space-y-3">
            <div className="text-[11px] font-mono text-fg-muted">16px Legibility Check:</div>
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-fg-muted">16px:</span>
              <div className="w-4 h-4 text-fg"><Logo variant="mark" markVariant={2} className="w-4 h-4" /></div>
              <span className="text-xs font-mono text-fg-muted">32px:</span>
              <div className="w-8 h-8 text-fg"><Logo variant="mark" markVariant={2} className="w-8 h-8" /></div>
            </div>
          </div>
        </div>

        {/* Mark 3: The Stepped Codex */}
        <div className={`p-8 rounded-card border ${ACTIVE_LOGO_MARK === 3 ? 'border-accent bg-surface shadow-tactile-lg' : 'border-line bg-surface/50'} space-y-6 flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-fg">Mark 03 (Library Folio)</span>
              {ACTIVE_LOGO_MARK === 3 && (
                <span className="px-2 py-0.5 rounded-pill bg-accent text-on-accent text-[10px] font-mono font-bold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE</span>
                </span>
              )}
            </div>

            <div className="p-8 rounded-2xl bg-bg border border-line flex items-center justify-center">
              <Logo variant="mark" markVariant={3} className="scale-150" />
            </div>

            <h3 className="font-display font-bold text-xl text-fg">The Stepped Codex</h3>
            <p className="text-xs text-fg-muted font-body leading-relaxed">
              Three staggered bound signatures anchored by an accent ribbon bookmark, representing progressive mastery from beginner to advanced.
            </p>
          </div>

          <div className="pt-4 border-t border-line space-y-3">
            <div className="text-[11px] font-mono text-fg-muted">16px Legibility Check:</div>
            <div className="flex items-center space-x-4">
              <span className="text-xs font-mono text-fg-muted">16px:</span>
              <div className="w-4 h-4 text-fg"><Logo variant="mark" markVariant={3} className="w-4 h-4" /></div>
              <span className="text-xs font-mono text-fg-muted">32px:</span>
              <div className="w-8 h-8 text-fg"><Logo variant="mark" markVariant={3} className="w-8 h-8" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Component Formats */}
      <div className="p-8 rounded-card bg-surface border border-line space-y-8">
        <h2 className="font-display font-bold text-2xl text-fg">Applied Formats</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-2">
          <div className="space-y-2">
            <span className="text-xs font-mono text-fg-muted block">1. Wordmark (Standard Nav):</span>
            <div className="p-4 rounded-xl bg-bg border border-line">
              <Logo variant="wordmark" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-fg-muted block">2. Standalone Mark (Pills & Mobile):</span>
            <div className="p-4 rounded-xl bg-bg border border-line flex justify-center">
              <Logo variant="mark" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-fg-muted block">3. Stacked Monograph (Covers & Footer):</span>
            <div className="p-4 rounded-xl bg-bg border border-line flex justify-center">
              <Logo variant="stacked" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
