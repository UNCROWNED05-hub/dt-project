import React from 'react';
import { Feather, BookOpen, Compass, Code2 } from 'lucide-react';

export const metadata = {
  title: 'About Vellum | Engineering Field Library',
  description: 'The editorial vision, craftsmanship, and learning manifesto behind Vellum.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 text-fg">
      {/* Title */}
      <div className="space-y-4 border-b border-line pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-pill bg-surface border border-line text-xs font-mono text-fg-muted">
          <Feather className="w-3.5 h-3.5 text-accent" />
          <span>The Vellum Manifesto</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-fg tracking-tight">
          Built for Students Who Want Real Foundations
        </h1>

        <p className="text-base sm:text-xl text-fg-muted font-body leading-relaxed pt-2">
          Too much of modern technical education is either locked behind expensive bootcamps or scattered across 
          disorganized, unverified video playlists. Vellum was conceived as an alternative: a free, 
          rigorous, and tactile library designed to be read like a thoughtful monograph.
        </p>
      </div>

      {/* Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-card border border-line bg-surface shadow-tactile space-y-3">
          <Compass className="w-6 h-6 text-accent" />
          <h3 className="font-display font-bold text-xl text-fg">
            1. Clear Path, Not a Pile of Links
          </h3>
          <p className="text-sm text-fg-muted font-body leading-relaxed">
            Every course is an intentional progression capped at 10 to 11 chapters. We don&rsquo;t overwhelm you with 400 links; we give you the single most effective explanation for each step.
          </p>
        </div>

        <div className="p-7 rounded-card border border-line bg-surface shadow-tactile space-y-3">
          <Code2 className="w-6 h-6 text-accent-2" />
          <h3 className="font-display font-bold text-xl text-fg">
            2. First Principles & Code
          </h3>
          <p className="text-sm text-fg-muted font-body leading-relaxed">
            Every theoretical concept is accompanied by runnable, zero-dependency code—from bare-metal gradient descent in Python to non-blocking GPIO interrupts on microcontrollers.
          </p>
        </div>

        <div className="p-7 rounded-card border border-line bg-surface shadow-tactile space-y-3">
          <BookOpen className="w-6 h-6 text-accent" />
          <h3 className="font-display font-bold text-xl text-fg">
            3. Free, Legal & Respectful
          </h3>
          <p className="text-sm text-fg-muted font-body leading-relaxed">
            All notes are synthesized from open-access academic works under Creative Commons or Public Domain. No paywalls, no tracking cookies, and no account required.
          </p>
        </div>

        <div className="p-7 rounded-card border border-line bg-surface shadow-tactile space-y-3">
          <Feather className="w-6 h-6 text-accent" />
          <h3 className="font-display font-bold text-xl text-fg">
            4. High Tactile Craft
          </h3>
          <p className="text-sm text-fg-muted font-body leading-relaxed">
            We reject the sterile, homogenous look of automated sites. We believe tools made for engineers should look and feel as deliberate and tactile as a physical study notebook.
          </p>
        </div>
      </div>
    </div>
  );
}
