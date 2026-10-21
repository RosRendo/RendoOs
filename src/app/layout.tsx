import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'RendoOs — Personal Command Center',
  description: 'A calm personal operating system and command center for managing software projects, experiments, ideas, and architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 antialiased font-sans transition-colors duration-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
