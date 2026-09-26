'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Square,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  FolderGit2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Activity,
  Terminal,
  Cpu,
  GitBranch,
  Radio,
} from 'lucide-react';
import { getStatusBadge, getHealthBadge, formatTimeAgo, parseTechStack } from '@/lib/utils';
import { ProjectDetail } from '@/lib/types';
import TechIcon, { TechBadge, GithubIcon } from '@/components/TechIcon';
import ProjectRunnerButton from '@/components/ProjectRunnerButton';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'RUNNING' | 'EXPERIMENT' | 'PAUSED'>('ALL');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, projectsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/projects?status=ALL'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setActiveProjects(projectsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle task status toggle directly from dashboard
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Handle blocker resolve directly from dashboard
  const handleResolveBlocker = async (blockerId: string, currentResolved: boolean) => {
    try {
      const res = await fetch('/api/blockers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blockerId, resolved: !currentResolved }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to resolve blocker:', err);
    }
  };

  // Switch primary focus
  const handleSetPrimary = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/primary`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to set primary project:', err);
    }
  };

  // Running services detection
  const runningProjects = useMemo(() => {
    return activeProjects.filter((p) => p.isRunning || p.isBackendRunning || p.isExtraRunning);
  }, [activeProjects]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400">Loading RendoOs Cockpit...</span>
        </div>
      </div>
    );
  }

  const primary: ProjectDetail | null = stats?.primaryProject ?? null;
  const primaryStatusBadge = primary ? getStatusBadge(primary.status) : null;
  const primaryHealthBadge = primary ? getHealthBadge(primary.health) : null;

  // Filter next 3 actionable tasks (NOW bucket first, then NEXT bucket, TODO status only)
  const todoTasks = primary?.tasks
    ?.filter((t) => t.status === 'TODO')
    ?.sort((a, b) => {
      if (a.bucket === 'NOW' && b.bucket !== 'NOW') return -1;
      if (b.bucket === 'NOW' && a.bucket !== 'NOW') return 1;
      return a.order - b.order;
    })
    ?.slice(0, 3) ?? [];

  // Active blockers
  const activeBlockers = primary?.blockers?.filter((b) => !b.resolved) ?? [];

  // Filter other projects based on selected filter
  const otherProjects = activeProjects
    .filter((p) => p.id !== primary?.id)
    .filter((p) => {
      if (selectedFilter === 'RUNNING') {
        return p.isRunning || p.isBackendRunning || p.isExtraRunning;
      }
      if (selectedFilter === 'EXPERIMENT') return p.status === 'EXPERIMENT';
      if (selectedFilter === 'PAUSED') return p.status === 'PAUSED';
      return true;
    });

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* ── System Status Alerts ──────────────────────────────────── */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.slice(0, 2).map((alert: any) => (
            <div
              key={alert.id}
              className="flex items-center justify-between px-3.5 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold text-amber-200">{alert.title}:</span>
                <span className="text-zinc-300">{alert.message}</span>
              </div>
              {alert.projectId && (
                <Link
                  href={`/projects/${alert.projectId}`}
                  className="flex items-center gap-1 font-medium hover:underline text-amber-300 shrink-0 ml-3"
                >
                  View <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Minimalist High-Contrast Telemetry Ribbon ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Projects</span>
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {activeProjects.length}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">tracked</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Live Services</span>
            <Radio className={`w-3.5 h-3.5 ${runningProjects.length > 0 ? 'text-emerald-500 animate-pulse' : 'text-zinc-400'}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-xl font-bold font-mono ${runningProjects.length > 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
              {runningProjects.length}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">running</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Active Focus</span>
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-blue-500">
              {stats?.counts?.active ?? 0}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">in dev</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Blockers</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${activeBlockers.length > 0 ? 'text-rose-500' : 'text-zinc-400'}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-xl font-bold font-mono ${activeBlockers.length > 0 ? 'text-rose-500' : 'text-zinc-400'}`}>
              {activeBlockers.length}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">open</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Git Ecosystem</span>
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-500">
              100%
            </span>
            <span className="text-[10px] font-mono text-emerald-400/80">synced</span>
          </div>
        </div>
      </div>

      {/* ── Live Active Services Cockpit Banner (if any runner is active) ── */}
      {runningProjects.length > 0 && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-[#0c1510] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE SERVICES RUNNING ({runningProjects.length})</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">Click port badge to open in browser</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {runningProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/50 dark:bg-black/40 border border-emerald-500/20 text-xs"
              >
                <Link
                  href={`/projects/${p.slug || p.id}`}
                  className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-emerald-400 truncate max-w-[140px]"
                >
                  {p.name}
                </Link>

                <div className="flex items-center gap-1.5 shrink-0">
                  {p.isRunning && p.port && (
                    <a
                      href={`http://localhost:${p.port}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                      title="Open Frontend"
                    >
                      FE :{p.port} ↗
                    </a>
                  )}
                  {p.isBackendRunning && p.backendPort && (
                    <a
                      href={`http://localhost:${p.backendPort}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                      title="Open Backend"
                    >
                      BE :{p.backendPort} ↗
                    </a>
                  )}
                  {p.isExtraRunning && p.extraPort && (
                    <a
                      href={`http://localhost:${p.extraPort}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 transition-colors"
                      title="Open Extra Service"
                    >
                      :{p.extraPort} ↗
                    </a>
                  )}

                  <ProjectRunnerButton
                    projectId={p.id}
                    projectName={p.name}
                    folderPath={p.folderPath}
                    runScript={p.runScript}
                    port={p.port}
                    initialIsRunning={p.isRunning}
                    backendPath={p.backendPath}
                    backendScript={p.backendScript}
                    backendPort={p.backendPort}
                    initialIsBackendRunning={p.isBackendRunning}
                    extraPath={p.extraPath}
                    extraScript={p.extraScript}
                    extraPort={p.extraPort}
                    extraName={p.extraName}
                    initialIsExtraRunning={p.isExtraRunning}
                    onStatusChange={() => fetchDashboardData()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION: PRIMARY FOCUS SPOTLIGHT (Vercel / Raycast Style) ── */}
      {primary ? (
        <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] shadow-sm overflow-hidden">
          {/* Header Action Bar */}
          <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-rose-500 uppercase">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>CURRENT FOCUS COCKPIT</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 1-Click Launch Cockpit */}
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
                onStatusChange={() => fetchDashboardData()}
              />

              {primary.repoUrl && (
                <a
                  href={primary.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Open GitHub repository"
                >
                  <GithubIcon className="w-3 h-3" />
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}

              {primaryHealthBadge && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${primaryHealthBadge.bgColor} ${primaryHealthBadge.textColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${primaryHealthBadge.dotColor}`} />
                  {primaryHealthBadge.label}
                </div>
              )}

              <Link
                href={`/projects/${primary.slug || primary.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <span>Open Cockpit</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Mockup & Info */}
              <div className="lg:col-span-5 space-y-4">
                <Link
                  href={`/projects/${primary.slug || primary.id}`}
                  className="block relative aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 group cursor-pointer"
                >
                  {primary.image ? (
                    <img
                      src={primary.image}
                      alt={primary.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                      <FolderGit2 className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-mono text-zinc-500">No preview snapshot</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white font-mono flex items-center gap-1">
                      Inspect Repository <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </Link>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {primary.name}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {primary.description || 'Primary active repository.'}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Milestone Progress</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {primary.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full progress-bar-fill"
                      style={{ width: `${primary.progress}%` }}
                    />
                  </div>
                </div>

                {/* Current Milestone */}
                {primary.currentMilestone && (
                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                    <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                      Current Milestone
                    </span>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {primary.currentMilestone}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Next 3 Tasks & Blockers */}
              <div className="lg:col-span-7 space-y-5">
                {/* Actionable Next Tasks */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase">
                        NEXT 3 ACTION ITEMS
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-mono">
                        NOW
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Click box to complete
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {todoTasks.length > 0 ? (
                      todoTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id, task.status)}
                          className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-zinc-400 hover:text-emerald-500 transition-colors shrink-0"
                          >
                            <Square className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-400 transition-colors">
                                {task.title}
                              </span>
                              {task.bucket === 'NOW' && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  NOW
                                </span>
                              )}
                              {task.priority === 'HIGH' && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/10 text-rose-400">
                                  P1
                                </span>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3.5 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                        <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                        All priority action items completed for this cycle!
                      </div>
                    )}
                  </div>
                </div>

                {/* Blockers Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-rose-500 dark:text-rose-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      BLOCKERS
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {activeBlockers.length} active
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {activeBlockers.length > 0 ? (
                      activeBlockers.map((blocker) => (
                        <div
                          key={blocker.id}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-rose-400 text-sm leading-none mt-0.5">⚠</span>
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                                {blocker.title}
                              </p>
                              {blocker.description && (
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                  {blocker.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleResolveBlocker(blocker.id, blocker.resolved)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white transition-colors shrink-0 text-zinc-600 dark:text-zinc-400"
                            title="Mark blocker as resolved"
                          >
                            Resolve
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>No active blockers right now. Smooth execution!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tech Stack Preview */}
                {primary.techStack && (
                  <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Key Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(() => {
                        const parsed = parseTechStack(primary.techStack);
                        const allTech = [
                          ...(parsed.frontend || []),
                          ...(parsed.backend || []),
                          ...(parsed.database || []),
                          ...(parsed.infrastructure || []),
                        ];
                        return allTech.slice(0, 7).map((tech) => (
                          <TechBadge key={tech} name={tech} size={11} className="text-[10px] py-0.5 px-2" />
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <FolderGit2 className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No Primary Project Selected
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Choose a project below to set as your primary focus for today.
          </p>
        </div>
      )}

      {/* ── SECTION: OTHER PROJECTS AT A GLANCE ───────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3.5">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Repositories & Workspaces
            </h2>
            <p className="text-xs text-zinc-500">
              All active codebases in your development environment
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Filter Chips */}
            <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  selectedFilter === 'ALL'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                All ({activeProjects.length})
              </button>
              <button
                onClick={() => setSelectedFilter('RUNNING')}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  selectedFilter === 'RUNNING'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-500 dark:text-emerald-400 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Live ({runningProjects.length})
              </button>
              <button
                onClick={() => setSelectedFilter('EXPERIMENT')}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-colors ${
                  selectedFilter === 'EXPERIMENT'
                    ? 'bg-white dark:bg-zinc-800 text-violet-500 dark:text-violet-400 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Experiments
              </button>
            </div>

            <Link
              href="/projects"
              className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1 ml-2"
            >
              Catalog <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {otherProjects.map((project) => {
            const statusBadge = getStatusBadge(project.status);
            const isAnyRunning = project.isRunning || project.isBackendRunning || project.isExtraRunning;

            return (
              <div
                key={project.id}
                className={`group relative rounded-xl border bg-white dark:bg-[#0c0d12] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all p-4 flex flex-col justify-between ${
                  isAnyRunning
                    ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'border-zinc-200 dark:border-zinc-800/80 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.bgColor} ${statusBadge.textColor}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${statusBadge.dotColor}`} />
                      {statusBadge.label}
                    </span>

                    <div className="flex items-center gap-1">
                      <ProjectRunnerButton
                        projectId={project.id}
                        projectName={project.name}
                        folderPath={project.folderPath}
                        runScript={project.runScript}
                        port={project.port}
                        initialIsRunning={project.isRunning}
                        backendPath={project.backendPath}
                        backendScript={project.backendScript}
                        backendPort={project.backendPort}
                        initialIsBackendRunning={project.isBackendRunning}
                        extraPath={project.extraPath}
                        extraScript={project.extraScript}
                        extraPort={project.extraPort}
                        extraName={project.extraName}
                        initialIsExtraRunning={project.isExtraRunning}
                        onStatusChange={() => fetchDashboardData()}
                      />

                      <button
                        onClick={() => handleSetPrimary(project.id)}
                        className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-zinc-400 hover:text-rose-400 transition-opacity p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="Set as primary focus"
                      >
                        <Flame className="w-3 h-3 text-rose-500" />
                      </button>
                    </div>
                  </div>

                  <Link href={`/projects/${project.slug || project.id}`}>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided'}
                  </p>

                  {/* Ports / GitHub Quick Ribbon */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px] font-mono">
                    {project.port && (
                      <span className={`text-[10px] ${project.isRunning ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                        FE :{project.port}
                      </span>
                    )}
                    {project.backendPort && (
                      <span className={`text-[10px] ${project.isBackendRunning ? 'text-blue-400 font-bold' : 'text-zinc-400'}`}>
                        BE :{project.backendPort}
                      </span>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-zinc-400 hover:text-zinc-100 flex items-center gap-0.5"
                        title="View on GitHub"
                      >
                        <GithubIcon className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Progress</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-0.5">
                    <span>{formatTimeAgo(project.updatedAt)}</span>
                    <span className="text-zinc-500">
                      {project._count?.tasks ?? 0} tasks
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
