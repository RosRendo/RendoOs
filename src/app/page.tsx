'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  CheckSquare,
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
  Check,
} from 'lucide-react';
import { getStatusBadge, getHealthBadge, formatTimeAgo, parseTechStack } from '@/lib/utils';
import { ProjectDetail, TaskItem, BlockerItem } from '@/lib/types';
import TechIcon, { TechBadge } from '@/components/TechIcon';
import ProjectRunnerButton from '@/components/ProjectRunnerButton';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);

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

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-sm font-mono text-zinc-500">Loading Command Center...</span>
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

  // Secondary projects (excluding primary)
  const otherProjects = activeProjects.filter((p) => p.id !== primary?.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / System Status Alerts */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.slice(0, 2).map((alert: any) => (
            <div
              key={alert.id}
              className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
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

      {/* Quick Status Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active</span>
          <span className="text-xl font-bold text-emerald-500">{stats?.counts?.active ?? 0}</span>
        </div>
        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Experiments</span>
          <span className="text-xl font-bold text-violet-400">{stats?.counts?.experiment ?? 0}</span>
        </div>
        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Paused</span>
          <span className="text-xl font-bold text-amber-400">{stats?.counts?.paused ?? 0}</span>
        </div>
        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Ideas Inbox</span>
          <span className="text-xl font-bold text-sky-400">{stats?.counts?.ideas ?? 0}</span>
        </div>
        <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] flex flex-col">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Archived</span>
          <span className="text-xl font-bold text-zinc-400">{stats?.counts?.archived ?? 0}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION: CURRENT FOCUS HERO                                     */}
      {/* ============================================================== */}
      {primary ? (
        <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] shadow-xl overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-rose-500 dark:text-rose-400 uppercase">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>CURRENT FOCUS</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
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
              {primaryHealthBadge && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${primaryHealthBadge.bgColor} ${primaryHealthBadge.textColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${primaryHealthBadge.dotColor}`} />
                  {primaryHealthBadge.label}
                </div>
              )}
              {primaryStatusBadge && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${primaryStatusBadge.bgColor} ${primaryStatusBadge.textColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${primaryStatusBadge.dotColor}`} />
                  {primaryStatusBadge.label}
                </div>
              )}
              <Link
                href={`/projects/${primary.slug || primary.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-400"
              >
                Project Cockpit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visual Mockup & Info */}
              <div className="lg:col-span-5 space-y-4">
                <Link
                  href={`/projects/${primary.slug || primary.id}`}
                  className="block relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 group cursor-pointer"
                >
                  {primary.image ? (
                    <img
                      src={primary.image}
                      alt={primary.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                      <FolderGit2 className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-mono">No preview uploaded</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-white font-medium flex items-center gap-1">
                      Open Project Details <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {primary.name}
                  </h1>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {primary.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Progress</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {primary.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full progress-bar-fill"
                      style={{ width: `${primary.progress}%` }}
                    />
                  </div>
                </div>

                {/* Current Milestone */}
                {primary.currentMilestone && (
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
                    <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                      Current Milestone
                    </span>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {primary.currentMilestone}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Next 3 Tasks & Blockers */}
              <div className="lg:col-span-7 space-y-6">
                {/* Actionable Next Tasks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase">
                        NEXT 3 ACTION ITEMS
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                        TODAY
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Check box to complete
                    </span>
                  </div>

                  <div className="space-y-2">
                    {todoTasks.length > 0 ? (
                      todoTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id, task.status)}
                          className="group flex items-start gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-zinc-400 hover:text-blue-500 transition-colors shrink-0"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-400 transition-colors">
                                {task.title}
                              </span>
                              {task.bucket === 'NOW' && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
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
                      <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                        All priority tasks completed for this milestone!
                      </div>
                    )}
                  </div>
                </div>

                {/* Blockers Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold tracking-wider text-rose-500 dark:text-rose-400 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      BLOCKERS
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {activeBlockers.length} active
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeBlockers.length > 0 ? (
                      activeBlockers.map((blocker) => (
                        <div
                          key={blocker.id}
                          className="flex items-start justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="text-rose-400 text-base leading-none">⚠</span>
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
                            className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white transition-colors shrink-0 text-zinc-600 dark:text-zinc-400"
                            title="Mark blocker as resolved"
                          >
                            Resolve
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs text-zinc-500 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>No active blockers right now. Smooth sailing!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tech Stack Preview */}
                {primary.techStack && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
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
                          <TechBadge key={tech} name={tech} />
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
        <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <FolderGit2 className="w-12 h-12 mx-auto text-zinc-400 mb-3" />
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            No Primary Project Selected
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Choose a project to set as your primary focus for today.
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION: OTHER PROJECTS AT A GLANCE                             */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Active Projects & Experiments
            </h2>
            <p className="text-xs text-zinc-500">
              Other repositories in your cockpit
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1"
          >
            View all ({activeProjects.length}) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherProjects.slice(0, 3).map((project) => {
            const statusBadge = getStatusBadge(project.status);
            const healthBadge = getHealthBadge(project.health);
            return (
              <div
                key={project.id}
                className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.bgColor} ${statusBadge.textColor}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${statusBadge.dotColor}`} />
                      {statusBadge.label}
                    </span>
                    <div className="flex items-center gap-1.5">
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
                        className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-zinc-400 hover:text-amber-400 transition-opacity flex items-center gap-1 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="Set as primary focus project"
                      >
                        <Flame className="w-3 h-3 text-amber-500" />
                        Set Focus
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
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span>Progress</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1">
                    <span>Updated {formatTimeAgo(project.updatedAt)}</span>
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
