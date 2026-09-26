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
  Server,
  Layers,
  Terminal,
  Activity,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { GithubIcon } from '@/components/TechIcon';

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
        setMessage('Database reset and seeded with sample projects successfully!');
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
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-zinc-400" />
          <span>System Settings & Architecture</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Preferences, persistent database connection, Obsidian vault sync, and ecosystem diagnostics.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Builder Profile */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] shadow-xs space-y-3.5">
        <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
          Builder Profile
        </h2>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm flex items-center justify-center shadow-xs">
            RR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Ros Rendo
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Lead Architect
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">Personal Command Center Operator</p>
          </div>
        </div>
      </div>

      {/* Ecosystem Telemetry */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] shadow-xs space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/60 pb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
            GitHub Remote Synchronization
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 100% Synced
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
            <span className="text-zinc-400 text-[10px] block uppercase tracking-wider mb-1">
              Organization / Account
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
              github.com/ROS-RENDO
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
            <span className="text-zinc-400 text-[10px] block uppercase tracking-wider mb-1">
              Active Repositories
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
              13 Verified Projects
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
            <span className="text-zinc-400 text-[10px] block uppercase tracking-wider mb-1">
              Push Automation
            </span>
            <span className="text-emerald-500 dark:text-emerald-400 font-semibold">
              npm run repos:push
            </span>
          </div>
        </div>
      </div>

      {/* Storage & Database Diagnostics */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] shadow-xs space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/60 pb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            Storage & Database Engine
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
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

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
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
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-violet-400" />
              <div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Obsidian Knowledge Vault
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
