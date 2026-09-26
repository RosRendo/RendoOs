'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Flame,
  Archive,
  ArchiveRestore,
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderSearch,
  Trash2,
  LayoutGrid,
  List,
  Radio,
  Clock,
  Sparkles,
  Command,
} from 'lucide-react';
import { getStatusBadge, getHealthBadge, formatTimeAgo, parseTechStack } from '@/lib/utils';
import QuickAddModal from '@/components/QuickAddModal';
import ScanProjectModal from '@/components/ScanProjectModal';
import TechIcon, { TechBadge, GithubIcon } from '@/components/TechIcon';
import ProjectRunnerButton from '@/components/ProjectRunnerButton';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects?includeArchived=true');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjectToDelete(null);
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    } finally {
      setDeletingProject(false);
    }
  };

  const handleSetPrimary = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}/primary`, { method: 'POST' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArchive = async (project: any) => {
    const newStatus = project.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED';
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const runningCount = useMemo(() => {
    return projects.filter((p) => p.isRunning || p.isBackendRunning || p.isExtraRunning).length;
  }, [projects]);

  const counts = useMemo(() => {
    return {
      ALL: projects.filter((p) => p.status !== 'ARCHIVED').length,
      RUNNING: runningCount,
      ACTIVE: projects.filter((p) => p.status === 'ACTIVE').length,
      EXPERIMENT: projects.filter((p) => p.status === 'EXPERIMENT').length,
      PAUSED: projects.filter((p) => p.status === 'PAUSED').length,
      ARCHIVED: projects.filter((p) => p.status === 'ARCHIVED').length,
    };
  }, [projects, runningCount]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status Filter
      if (activeFilter === 'RUNNING') {
        if (!project.isRunning && !project.isBackendRunning && !project.isExtraRunning) return false;
      } else if (activeFilter !== 'ALL') {
        if (project.status !== activeFilter) return false;
      } else {
        // In "ALL" tab, show everything except ARCHIVED by default
        if (project.status === 'ARCHIVED') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesDesc = (project.description || '').toLowerCase().includes(query);
        const matchesTech = (project.techStack || '').toLowerCase().includes(query);
        const matchesFolder = (project.folderPath || '').toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesTech || matchesFolder;
      }

      return true;
    });
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <span>Projects Cockpit</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
              {projects.length} Repos
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Visual index and live server control center for your entire workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              title="Dense Table View (Raycast style)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowScanModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium transition-colors shadow-xs cursor-pointer"
          >
            <FolderSearch className="w-3.5 h-3.5 text-blue-500" />
            <span>Scan Folder</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Filters */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All', count: counts.ALL },
            { id: 'RUNNING', label: 'Live Running', count: counts.RUNNING, isRunningTab: true },
            { id: 'ACTIVE', label: 'Active', count: counts.ACTIVE },
            { id: 'EXPERIMENT', label: 'Experiments', count: counts.EXPERIMENT },
            { id: 'PAUSED', label: 'Paused', count: counts.PAUSED },
            { id: 'ARCHIVED', label: 'Archive', count: counts.ARCHIVED },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-700/60 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 border border-transparent'
              }`}
            >
              {tab.isRunningTab && tab.count > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeFilter === tab.id
                    ? 'bg-zinc-800 text-zinc-300 dark:bg-zinc-700 dark:text-zinc-200'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search with keyboard shortcut badge */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search projects, stack, port..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-white dark:bg-[#0c0d12] border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Projects Content: Grid or High-Density Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
        </div>
      ) : filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          /* ── GRID VIEW ────────────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const statusBadge = getStatusBadge(project.status);
              const healthBadge = getHealthBadge(project.health);
              const parsedTech = parseTechStack(project.techStack);
              const techBadges = [
                ...(parsedTech.frontend || []),
                ...(parsedTech.backend || []),
                ...(parsedTech.database || []),
              ].slice(0, 4);

              const isAnyRunning = project.isRunning || project.isBackendRunning || project.isExtraRunning;

              return (
                <div
                  key={project.id}
                  className={`group rounded-xl border bg-white dark:bg-[#0c0d12] overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                    project.isPrimary
                      ? 'border-blue-500/50 dark:border-blue-500/40 shadow-xs ring-1 ring-blue-500/20'
                      : isAnyRunning
                      ? 'border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Card Visual Image Banner */}
                    <Link
                      href={`/projects/${project.slug || project.id}`}
                      className="block relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden border-b border-zinc-100 dark:border-zinc-800/80 cursor-pointer"
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-950">
                          <FolderGit2 className="w-8 h-8 mb-1.5 opacity-40" />
                          <span className="text-[11px] font-mono text-zinc-500">
                            {project.name}
                          </span>
                        </div>
                      )}

                      {/* Primary Focus Banner Badge */}
                      {project.isPrimary && (
                        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-semibold shadow-md">
                          <Flame className="w-3 h-3 fill-white" />
                          FOCUS
                        </div>
                      )}

                      {/* Health indicator */}
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium backdrop-blur-md border ${healthBadge.bgColor} ${healthBadge.textColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${healthBadge.dotColor}`} />
                          {healthBadge.label}
                        </span>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.bgColor} ${statusBadge.textColor}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${statusBadge.dotColor}`} />
                            {statusBadge.label}
                          </span>

                          <div className="flex items-center space-x-1">
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
                              onStatusChange={() => fetchProjects()}
                            />

                            {!project.isPrimary && project.status !== 'ARCHIVED' && (
                              <button
                                onClick={() => handleSetPrimary(project.id)}
                                className="text-[10px] font-mono text-zinc-400 hover:text-rose-400 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Set as primary focus"
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleToggleArchive(project)}
                              className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title={project.status === 'ARCHIVED' ? 'Restore project' : 'Archive project'}
                            >
                              {project.status === 'ARCHIVED' ? (
                                <ArchiveRestore className="w-3.5 h-3.5" />
                              ) : (
                                <Archive className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => setProjectToDelete(project)}
                              className="text-[10px] font-mono text-zinc-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <Link href={`/projects/${project.slug || project.id}`}>
                          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-400 transition-colors">
                            {project.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                          {project.description || 'No description provided'}
                        </p>
                      </div>

                      {/* Tech Badges */}
                      {techBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {techBadges.map((tech) => (
                            <TechBadge key={tech} name={tech} size={11} className="text-[10px] py-0.5 px-2" />
                          ))}
                        </div>
                      )}

                      {/* Ports & GitHub Ribbon */}
                      <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-[10px] font-mono">
                        {project.port && (
                          <span className={project.isRunning ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                            FE :{project.port}
                          </span>
                        )}
                        {project.backendPort && (
                          <span className={project.isBackendRunning ? 'text-blue-400 font-bold' : 'text-zinc-400'}>
                            BE :{project.backendPort}
                          </span>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto text-zinc-400 hover:text-zinc-100 flex items-center gap-1"
                            title="Open repository"
                          >
                            <GithubIcon className="w-3 h-3" />
                            <span>repo ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Progress Bar & Meta */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Progress</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-0.5">
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
        ) : (
          /* ── COMMAND TABLE VIEW (Raycast / Linear style) ──────────── */
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    <th className="py-2.5 px-4">Project</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Ports & Services</th>
                    <th className="py-2.5 px-3">Tech Stack</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3">1-Click Runner</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
                  {filteredProjects.map((project) => {
                    const statusBadge = getStatusBadge(project.status);
                    const parsedTech = parseTechStack(project.techStack);
                    const techList = [
                      ...(parsedTech.frontend || []),
                      ...(parsedTech.backend || []),
                    ].slice(0, 3);

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group"
                      >
                        {/* Name & Slug */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {project.isPrimary && (
                              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                            )}
                            <div>
                              <Link
                                href={`/projects/${project.slug || project.id}`}
                                className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-500 transition-colors"
                              >
                                {project.name}
                              </Link>
                              <div className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]">
                                {project.folderPath || project.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${statusBadge.bgColor} ${statusBadge.textColor}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${statusBadge.dotColor}`} />
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Ports & Services */}
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {project.port ? (
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  project.isRunning
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                :{project.port}
                              </span>
                            ) : null}
                            {project.backendPort ? (
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  project.isBackendRunning
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                :{project.backendPort}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Tech Stack */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {techList.map((t) => (
                              <TechBadge key={t} name={t} size={10} className="text-[9px] py-0.5 px-1.5" />
                            ))}
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="py-3 px-3">
                          <div className="w-24 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <span>{project.progress}%</span>
                              <span>{project._count?.tasks ?? 0}t</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 1-Click Runner */}
                        <td className="py-3 px-3">
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
                            onStatusChange={() => fetchProjects()}
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {project.repoUrl && (
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Open GitHub"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {!project.isPrimary && project.status !== 'ARCHIVED' && (
                              <button
                                onClick={() => handleSetPrimary(project.id)}
                                className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Set focus"
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleArchive(project)}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title={project.status === 'ARCHIVED' ? 'Restore' : 'Archive'}
                            >
                              {project.status === 'ARCHIVED' ? (
                                <ArchiveRestore className="w-3.5 h-3.5" />
                              ) : (
                                <Archive className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => setProjectToDelete(project)}
                              className="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="py-16 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <FolderGit2 className="w-10 h-10 mx-auto text-zinc-400 mb-2 opacity-60" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No projects found
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No projects matched "${searchQuery}". Press / to search something else.`
              : 'No projects in this category yet. Click New Project to add one.'}
          </p>
        </div>
      )}

      {showAddModal && <QuickAddModal onClose={() => setShowAddModal(false)} />}
      {showScanModal && (
        <ScanProjectModal
          onClose={() => setShowScanModal(false)}
          onImportSuccess={() => fetchProjects()}
        />
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0c0d12] rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Delete Project
                </h3>
                <p className="text-xs text-zinc-500">
                  Permanent action
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{projectToDelete.name}</span>? This will permanently delete all associated tasks, blockers, ideas, links, and runner configurations.
            </p>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={deletingProject}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {deletingProject ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
