'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  ArchiveRestore,
  Search,
  ExternalLink,
  FolderGit2,
  RefreshCw,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { formatTimeAgo, parseTechStack } from '@/lib/utils';

export default function ArchivePage() {
  const [archivedProjects, setArchivedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects?status=ARCHIVED&includeArchived=true');
      if (res.ok) {
        const data = await res.json();
        setArchivedProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleRestore = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });
      fetchArchived();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeletingProject(true);
    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjectToDelete(null);
        fetchArchived();
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

  const filtered = archivedProjects.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Archive className="w-5 h-5 text-zinc-400" />
            <span>Project Archive</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
              {archivedProjects.length} Repos
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Cold storage for finished milestones, completed experiments, and retired repositories.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0c0d12] border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const parsedTech = parseTechStack(project.techStack);
            const techBadges = [
              ...(parsedTech.frontend || []),
              ...(parsedTech.backend || []),
            ].slice(0, 3);

            return (
              <div
                key={project.id}
                className="group rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] p-4 flex flex-col justify-between space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700/60">
                      ARCHIVED
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {formatTimeAgo(project.updatedAt)}
                    </span>
                  </div>

                  <Link href={`/projects/${project.slug || project.id}`}>
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided'}
                  </p>

                  {techBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {techBadges.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">
                    {project._count?.tasks ?? 0} tasks
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRestore(project.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300 font-medium text-xs cursor-pointer"
                      title="Restore to Active"
                    >
                      <ArchiveRestore className="w-3.5 h-3.5" />
                      Restore
                    </button>
                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="inline-flex items-center p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-500 transition-colors text-zinc-400 cursor-pointer"
                      title="Permanently Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <Archive className="w-8 h-8 mx-auto text-zinc-400 mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No archived projects
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Projects you archive will safely rest here without cluttering your active cockpit.
          </p>
        </div>
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
                  Delete Project Permanently
                </h3>
                <p className="text-xs text-zinc-500">
                  Permanent action
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{projectToDelete.name}</span>? This action cannot be undone.
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deletingProject ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
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
