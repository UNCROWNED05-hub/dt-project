import React from 'react';
import { getLicenseLedger } from '@/lib/content';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Sources & Credits Ledger | Vellum',
  description: 'Legal transparency ledger of all open-source curriculum materials, Creative Commons resources, and official documentation.',
};

export default function SourcesPage() {
  const ledger = getLicenseLedger();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 text-fg">
      {/* Header */}
      <div className="space-y-4 border-b border-line pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-pill bg-surface border border-line text-xs font-mono text-fg-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Legal Integrity & Open Education</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-fg tracking-tight">
          Sources, Credits & License Ledger
        </h1>

        <p className="text-base sm:text-lg text-fg-muted font-body leading-relaxed max-w-3xl pt-2">
          Vellum is committed to 100% legal compliance and transparency. 
          Every note is originally authored or synthesized strictly from verified open-access materials 
          under permissive licenses (CC BY, CC BY-SA, Public Domain, BSD, or OASIS open standards). 
          We never copy from proprietary textbooks or paywalled courses.
        </p>
      </div>

      {/* Ledger Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-fg">
            Canonical Reference Ledger ({ledger.length} Sources)
          </h2>
          <span className="text-xs font-mono text-fg-muted">content/LICENSES.json</span>
        </div>

        <div className="space-y-4">
          {ledger.map((entry: any) => (
            <div
              key={entry.id}
              className="p-6 sm:p-7 rounded-card border border-line bg-surface shadow-tactile space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-display font-bold text-xl text-fg">
                  {entry.title}
                </h3>
                <a
                  href={entry.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-pill bg-bg border border-line font-mono text-xs font-semibold w-fit hover:border-accent transition-colors text-fg"
                >
                  <span>{entry.license}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 text-accent" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-fg-muted">
                <span>Author: <strong className="text-fg">{entry.author}</strong></span>
                <span>•</span>
                <span>Accessed: {entry.dateAccessed}</span>
                <span>•</span>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center space-x-1"
                >
                  <span>Canonical Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {entry.notes && (
                <p className="text-xs sm:text-sm text-fg-muted font-body pt-1 leading-relaxed">
                  {entry.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
