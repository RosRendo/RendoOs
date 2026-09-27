'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CalendarCheck2,
  CheckCircle2,
  FolderGit2,
  Clock,
  Lightbulb,
  Flame,
  ArrowRight,
  ExternalLink,
  Square,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { formatTimeAgo, getStatusBadge } from '@/lib/utils';

export default function WeeklyReviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviewData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/review');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching weekly review:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  // Handle task status toggle
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (res.ok) {
        fetchReviewData();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Quick Inactive Project triage actions: Keep Active, Pause, Archive
  const handleProjectAction = async (projectId: string, action: 'KEEP' | 'PAUSE' | 'ARCHIVE') => {
    try {
      let body: any = {};
      if (action === 'KEEP') {
        body = { updatedAt: new Date().toISOString() };
      } else if (action === 'PAUSE') {
        body = { status: 'PAUSED' };
      } else if (action === 'ARCHIVE') {
        body = { status: 'ARCHIVED' };
      }

      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchReviewData();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400">Loading Weekly Review...</span>
        </div>
      </div>
    );
  }

  const currentFocus = data?.currentFocus;
  const completedTasks = data?.completedTasks ?? [];
  const projectsTouched = data?.projectsTouched ?? [];
  const inactiveProjects = data?.inactiveProjects ?? [];
  const newIdeas = data?.newIdeas ?? [];
  const nextWeekTasks = data?.nextWeekTasks ?? [];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
              WEEKLY REVIEW
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              MOMENTUM SYNC
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Reflect on what was accomplished over the past 7 days, clear inactive clutter, and set next week&apos;s trajectory.
          </p>
        </div>

        <button
          onClick={fetchReviewData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* ── 4 High-Contrast Weekly Metric Cards ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Tasks Completed */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d14] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-500 font-semibold">
              Completed Tasks
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500/80" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {data?.completedCount ?? 0}
            </span>
            <span className="text-xs font-mono text-zinc-400">past 7 days</span>
          </div>
        </div>

        {/* 2. Projects Touched */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d14] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-500 font-semibold">
              Projects Touched
            </span>
            <FolderGit2 className="w-4 h-4 text-blue-500/80" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {data?.projectsTouchedCount ?? 0}
            </span>
            <span className="text-xs font-mono text-zinc-400">codebases</span>
          </div>
        </div>

        {/* 3. Inactive Projects */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d14] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold">
              Projects Inactive
            </span>
            <Clock className="w-4 h-4 text-amber-500/80" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {data?.inactiveProjectsCount ?? 0}
            </span>
            <span className="text-xs font-mono text-zinc-400">need review</span>
          </div>
        </div>

        {/* 4. New Ideas */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d14] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
              New Ideas
            </span>
            <Lightbulb className="w-4 h-4 text-sky-400/80" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {data?.newIdeasCount ?? 0}
            </span>
            <span className="text-xs font-mono text-zinc-400">captured</span>
          </div>
        </div>
      </div>

      {/* ── Mid Section: Current Focus & Next Week Trajectory ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Current Focus Card (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d14] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-rose-500 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              CURRENT FOCUS
            </span>
            {currentFocus && (
              <Link
                href={`/projects/${currentFocus.slug || currentFocus.id}`}
                className="text-xs font-mono text-blue-500 hover:underline flex items-center gap-1"
              >
                Open Cockpit <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {currentFocus ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {currentFocus.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                  {currentFocus.description || 'Primary active codebase.'}
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Milestone Progress</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {currentFocus.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${currentFocus.progress}%` }}
                  />
                </div>
              </div>

              {currentFocus.currentMilestone && (
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Current Milestone Goal
                  </span>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">
                    {currentFocus.currentMilestone}
                  </p>
                </div>
              )}

              {/* Blockers Alert if any */}
              {currentFocus.blockers && currentFocus.blockers.length > 0 && (
                <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {currentFocus.blockers.length} Active Blocker(s)
                  </span>
                  <p className="text-zinc-300 text-[11px]">
                    {currentFocus.blockers.map((b: any) => b.title).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500">
              No project currently marked as primary focus.
            </div>
          )}
        </div>

        {/* Right: Next Week Plan (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d14] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              NEXT WEEK PRIORITIES
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {nextWeekTasks.length} queued
            </span>
          </div>

          <div className="space-y-2">
            {nextWeekTasks.length > 0 ? (
              nextWeekTasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id, task.status)}
                  className="group flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                >
                  <button
                    type="button"
                    className="mt-0.5 text-zinc-400 group-hover:text-emerald-500 transition-colors shrink-0"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-400">
                      {task.project && (
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {task.project.name}
                        </span>
                      )}
                      {task.bucket && (
                        <span className="px-1 py-0.2 rounded bg-blue-500/10 text-blue-400">
                          {task.bucket}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                All queued tasks completed! Ready to plan next sprint.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lower Section: Inactive Projects Triage & Completed Highlights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inactive Projects Triage (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d14] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              INACTIVE PROJECTS ({inactiveProjects.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Triage & declutter</span>
          </div>

          <div className="space-y-2">
            {inactiveProjects.length > 0 ? (
              inactiveProjects.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {p.name}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Untouched since {formatTimeAgo(p.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleProjectAction(p.id, 'KEEP')}
                      className="px-2 py-1 text-[10px] font-mono rounded bg-white dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="Keep project active"
                    >
                      Keep Active
                    </button>
                    <button
                      onClick={() => handleProjectAction(p.id, 'PAUSE')}
                      className="px-2 py-1 text-[10px] font-mono rounded bg-white dark:bg-zinc-800 hover:bg-amber-600 hover:text-white transition-colors"
                      title="Pause project"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => handleProjectAction(p.id, 'ARCHIVE')}
                      className="px-2 py-1 text-[10px] font-mono rounded bg-white dark:bg-zinc-800 hover:bg-zinc-600 hover:text-white transition-colors"
                      title="Archive project"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                No inactive projects languishing. Great repository discipline!
              </div>
            )}
          </div>
        </div>

        {/* Recently Completed Log (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d14] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              COMPLETED THIS WEEK ({completedTasks.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Wins log</span>
          </div>

          <div className="space-y-2">
            {completedTasks.length > 0 ? (
              completedTasks.slice(0, 6).map((t: any) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 line-through truncate">
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 shrink-0">
                    {t.project && <span>{t.project.name}</span>}
                    <span>•</span>
                    <span>{formatTimeAgo(t.updatedAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                No tasks logged as completed in the past 7 days yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
