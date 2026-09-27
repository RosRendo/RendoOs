'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sun,
  Flame,
  CheckCircle2,
  Square,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  FolderGit2,
  Lightbulb,
  FileText,
  ShieldCheck,
  Calendar,
  Check,
  Pause,
  Archive,
} from 'lucide-react';
import ProjectRunnerButton from '@/components/ProjectRunnerButton';
import { formatTimeAgo, getStatusBadge } from '@/lib/utils';
import { ProjectDetail } from '@/lib/types';

interface TodayCommandCenterProps {
  onDataChange?: () => void;
}

export default function TodayCommandCenter({ onDataChange }: TodayCommandCenterProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/today');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch today command center data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayData();

    // Listen to global changes
    const handler = () => fetchTodayData();
    window.addEventListener('rendo-data-changed', handler);
    return () => window.removeEventListener('rendo-data-changed', handler);
  }, [fetchTodayData]);

  // Handle task check directly inside Today widget
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (res.ok) {
        fetchTodayData();
        if (onDataChange) onDataChange();
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
        fetchTodayData();
        if (onDataChange) onDataChange();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  const openCapture = (type: 'TASK' | 'IDEA' | 'NOTE' | 'BLOCKER') => {
    window.dispatchEvent(new CustomEvent('open-quick-capture', { detail: { type } }));
  };

  const primary: ProjectDetail | null = data?.primaryProject ?? null;
  const todayTasks: any[] = data?.todayTasks ?? [];
  const needsAttention: any[] = data?.needsAttention ?? [];

  const todayDateString = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d14] shadow-sm overflow-hidden space-y-4 p-5 md:p-6">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Sun className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                TODAY&apos;S COMMAND CENTER
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                DAILY FOCUS
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Proactive focus, urgent deadlines, and attention reminders for {todayDateString}
            </p>
          </div>
        </div>

        {/* 🧠 Quick Capture Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mr-1 hidden lg:inline">
            Quick Capture:
          </span>
          <button
            onClick={() => openCapture('TASK')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-blue-500/10 text-blue-500 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Task
          </button>
          <button
            onClick={() => openCapture('IDEA')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-amber-500/10 text-amber-500 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Idea
          </button>
          <button
            onClick={() => openCapture('NOTE')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-violet-500/10 text-violet-500 dark:text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Note
          </button>
          <button
            onClick={() => openCapture('BLOCKER')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Blocker
          </button>
        </div>
      </div>

      {/* ── 3 Core Pillars: Current Focus | Today Tasks | Needs Attention ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Pillar 1: Current Focus (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#10121a] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-wider text-rose-500 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              CURRENT FOCUS
            </span>
            {primary && (
              <Link
                href={`/projects/${primary.slug || primary.id}`}
                className="text-[11px] font-mono text-blue-500 hover:underline flex items-center gap-0.5"
              >
                Cockpit <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>

          {primary ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {primary.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {primary.description || 'Primary active development repository.'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Milestone Progress</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {primary.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${primary.progress}%` }}
                  />
                </div>
              </div>

              {primary.currentMilestone && (
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                    Target Milestone
                  </span>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">
                    {primary.currentMilestone}
                  </p>
                </div>
              )}

              {/* Quick Runner Controls */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  {primary.port && (
                    <span className={primary.isRunning ? 'text-emerald-400 font-bold' : ''}>
                      :{primary.port}
                    </span>
                  )}
                  {primary.backendPort && (
                    <span className={primary.isBackendRunning ? 'text-blue-400 font-bold' : ''}>
                      :{primary.backendPort}
                    </span>
                  )}
                </div>

                <ProjectRunnerButton
                  projectId={primary.id}
                  projectName={primary.name}
                  folderPath={primary.folderPath}
                  runScript={primary.runScript}
                  port={primary.port}
                  initialIsRunning={primary.isRunning}
                  backendPath={primary.backendPath}
                  backendScript={primary.backendScript}
                  backendPort={primary.backendPort}
                  initialIsBackendRunning={primary.isBackendRunning}
                  extraPath={primary.extraPath}
                  extraScript={primary.extraScript}
                  extraPort={primary.extraPort}
                  extraName={primary.extraName}
                  initialIsExtraRunning={primary.isExtraRunning}
                  onStatusChange={() => {
                    fetchTodayData();
                    if (onDataChange) onDataChange();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-zinc-500">
              No project currently marked as primary focus.
            </div>
          )}
        </div>

        {/* Pillar 2: Today's Tasks (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#10121a] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-wider text-blue-500 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              TODAY&apos;S TASKS
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {todayTasks.filter((t) => t.status === 'DONE').length}/{todayTasks.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 5).map((task) => {
                const isDone = task.status === 'DONE';
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className={`group flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-zinc-100/50 dark:bg-zinc-900/20 border-zinc-200/50 dark:border-zinc-800/40 opacity-60'
                        : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700'
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 shrink-0 transition-colors ${
                        isDone ? 'text-emerald-500' : 'text-zinc-400 group-hover:text-blue-500'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate ${
                          isDone ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-zinc-400">
                        {task.project && (
                          <span className="text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">
                            {task.project.name}
                          </span>
                        )}
                        {task.priority === 'HIGH' && (
                          <span className="px-1 py-0.2 rounded bg-rose-500/10 text-rose-400 font-bold">
                            P1
                          </span>
                        )}
                        {task.dueDate && (
                          <span
                            className={
                              new Date(task.dueDate).getTime() < Date.now() && !isDone
                                ? 'text-rose-400 font-bold'
                                : 'text-zinc-400'
                            }
                          >
                            Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                No priority tasks due today. All clear!
              </div>
            )}
          </div>
        </div>

        {/* Pillar 3: Needs Attention & Reminders (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#10121a] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              NEEDS ATTENTION ({needsAttention.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Proactive checks</span>
          </div>

          <div className="space-y-2">
            {needsAttention.length > 0 ? (
              needsAttention.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-lg border text-xs space-y-2 ${
                    item.type === 'overdue'
                      ? 'border-rose-500/20 bg-rose-500/5'
                      : item.type === 'inactive'
                      ? 'border-amber-500/20 bg-amber-500/5'
                      : 'border-rose-500/20 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {item.message}
                      </p>
                    </div>
                    <Link
                      href={`/projects/${item.projectSlug || item.projectId}`}
                      className="text-[10px] font-mono text-blue-500 hover:underline shrink-0"
                    >
                      View →
                    </Link>
                  </div>

                  {/* If inactive project: provide 1-click triage actions */}
                  {item.type === 'inactive' && (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-amber-500/10">
                      <span className="text-[10px] font-mono text-zinc-400">Action:</span>
                      <button
                        onClick={() => handleProjectAction(item.projectId, 'KEEP')}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Touch project to keep it active"
                      >
                        Keep Active
                      </button>
                      <button
                        onClick={() => handleProjectAction(item.projectId, 'PAUSE')}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-500 hover:text-white transition-colors"
                        title="Mark project as paused"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => handleProjectAction(item.projectId, 'ARCHIVE')}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors"
                        title="Archive project to reduce clutter"
                      >
                        Archive
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                All codebases are healthy and up to date!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
