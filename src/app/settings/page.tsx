'use client';

import { useState } from 'react';
import {
  Settings,
  Database,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  FileCode,
  Shield,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function SettingsPage() {
  const [reseeding, setReseeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReseed = async () => {
    if (!confirm('This will reload sample projects (ServiceFinder, Orchestrator, etc.) and reset tasks. Continue?')) {
      return;
    }
    setReseeding(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings/seed', { method: 'POST' });
      if (res.ok) {
        setMessage('Database reset and seeded with ServiceFinder successfully!');
      } else {
        setMessage('Failed to reseed database.');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-zinc-400" />
          System Settings & Storage
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Preferences, database connection status, and knowledge sync status.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Developer Profile */}
      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          Builder Profile
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white text-lg font-bold">
            R
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Rendo
            </h3>
            <p className="text-xs font-mono text-zinc-400">@rendo</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Personal Command Center Operator
            </p>
          </div>
        </div>
      </div>

      {/* Database & Infrastructure Status */}
      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            Storage & Database Engine
          </span>
          <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
            <span className="text-zinc-400 text-[10px] block uppercase tracking-wider mb-1">
              Active Database
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
              SQLite (dev.db via Prisma ORM)
            </span>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Zero external dependencies required. Swappable to PostgreSQL anytime via schema datasource.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
            <span className="text-zinc-400 text-[10px] block uppercase tracking-wider mb-1">
              Media & Screenshot Storage
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
              Local Filesystem (/public/uploads)
            </span>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">
              Fast zero-latency local development storage.
            </p>
          </div>
        </div>

        {/* Obsidian Vault Status */}
        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-violet-400" />
              <div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Obsidian Knowledge Sync
                </span>
                <p className="text-[11px] font-mono text-zinc-500">
                  D:\AI\Obsidian\AI_Brain_Sync
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Mirror
            </span>
          </div>
        </div>

        {/* Reseed Database button */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Reset & Reload Sample Data
            </p>
            <p className="text-[11px] text-zinc-500">
              Replaces the database with ServiceFinder and clean demo projects.
            </p>
          </div>

          <button
            onClick={handleReseed}
            disabled={reseeding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
            <span>{reseeding ? 'Resetting...' : 'Reload Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
