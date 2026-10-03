import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PencilTrail } from '@/components/motion/PencilTrail';
import { CommandPalette } from '@/components/search/CommandPalette';
import { ThemeSync } from '@/components/layout/ThemeSync';

export const metadata: Metadata = {
  title: 'Vellum | Tactile Engineering Library',
  description: 'A free, open-license study library for AI & Machine Learning, Cybersecurity, and IoT. Powered by peer-reviewed notes, ranked YouTube lectures, and practice quizzes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="desk">
      <body className="bg-bg text-fg">
        {/* Skip Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Dynamic Theme Injector on HTML Root */}
        <ThemeSync />

        {/* Static Noise Texture Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Layer 2: Canvas Graphite Trail */}
        <PencilTrail />

        {/* Static Command Palette */}
        <CommandPalette />

        {/* Shell Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        {/* Editorial Footer */}
        <Footer />
      </body>
    </html>
  );
}
