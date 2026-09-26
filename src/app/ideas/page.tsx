'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  FolderPlus,
  Trash2,
  FolderGit2,
  RefreshCw,
  Search,
  Sparkles,
  Command,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { IdeaItem } from '@/lib/types';

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState<string>('ALL');

  // Quick form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ideasRes, projectsRes] = await Promise.all([
        fetch('/api/ideas'),
        fetch('/api/projects'),
      ]);

      if (ideasRes.ok) {
        const ideasData = await ideasRes.json();
        setIdeas(ideasData);
      }
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.map((p: any) => ({ id: p.id, name: p.name })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          projectId: selectedProjectId || null,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewDesc('');
        setSelectedProjectId('');
        fetchData();
        titleInputRef.current?.focus();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToProject = async (ideaId: string) => {
    try {
      const res = await fetch('/api/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ideaId,
          convertToProject: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          router.push(`/projects/${data.project.slug || data.project.id}`);
        } else {
          fetchData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      await fetch(`/api/ideas?id=${ideaId}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filterProject === 'STANDALONE' && idea.projectId) return false;
    if (filterProject !== 'ALL' && filterProject !== 'STANDALONE' && idea.projectId !== filterProject) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        idea.title.toLowerCase().includes(q) ||
        (idea.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          <span>Ideas Inbox</span>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
            {ideas.length} Sparks
          </span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Frictionless scratchpad for upcoming concepts, technical experiments, and feature ideas.
        </p>
      </div>

      {/* Quick Add Form Box (Linear / Raycast Style) */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
          <span className="text-xs font-mono font-semibold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Capture New Concept
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            Convert to repository anytime with 1 click
          </span>
        </div>

        <form onSubmit={handleCreateIdea} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-8">
              <input
                ref={titleInputRef}
                type="text"
                required
                placeholder="What are you thinking? (e.g. AI-powered real-time log analyzer)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Standalone (New Idea)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    Attach to: {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Technical details, proposed stack, or requirements (optional)..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
          />

          <div className="flex justify-end pt-0.5">
            <button
              type="submit"
              disabled={submitting || !newTitle.trim()}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{submitting ? 'Saving...' : 'Record Idea'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setFilterProject('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterProject === 'ALL'
                ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-700/60 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            All ({ideas.length})
          </button>
          <button
            onClick={() => setFilterProject('STANDALONE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterProject === 'STANDALONE'
                ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-700/60 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Standalone ({ideas.filter((i) => !i.projectId).length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0c0d12] border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-xs"
          />
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
        </div>
      ) : filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] p-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </span>
                    {idea.project ? (
                      <Link
                        href={`/projects/${idea.project.slug || idea.project.id}`}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:underline flex items-center gap-1"
                      >
                        <FolderGit2 className="w-2.5 h-2.5" />
                        {idea.project.name}
                      </Link>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        Standalone
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition-opacity"
                    title="Delete idea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {idea.title}
                </h3>

                {idea.description && (
                  <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line line-clamp-4">
                    {idea.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400">{formatTimeAgo(idea.createdAt)}</span>
                <button
                  onClick={() => handleConvertToProject(idea.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer"
                  title="Promote this idea to a full project with status IDEA"
                >
                  <FolderPlus className="w-3 h-3 text-amber-500" />
                  <span>Convert to Repo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <Lightbulb className="w-8 h-8 mx-auto text-amber-500/40 mb-2" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Inbox is clear
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Capture sudden sparks, experiments, and architecture thoughts with the form above.
          </p>
        </div>
      )}
    </div>
  );
}
