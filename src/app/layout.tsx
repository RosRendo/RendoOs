import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Rendo Hub — Personal Command Center',
  description: 'A personal command center for managing software projects, experiments, ideas, and architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-4 text-center text-xs text-zinc-500 font-mono">
          Rendo Hub • Focus on building, not organizing • v1.0
        </footer>
      </body>
    </html>
  );
}
