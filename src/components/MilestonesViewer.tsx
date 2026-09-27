'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Milestone,
  Plus,
  CheckCircle2,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
  X,
  Target,
} from 'lucide-react';
import { MilestoneItem } from '@/lib/types';

interface MilestonesViewerProps {
  projectId: string;
  projectName: string;
}

export default function MilestonesViewer({ projectId, projectName }: MilestonesViewerProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New milestone form
  const [newTitle, setNewTitle] = useState('');
  const [newProgress, setNewProgress] = useState(0);
  const [newDueDate, setNewDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editProgress, setEditProgress] = useState(0);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/milestones?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: newTitle.trim(),
          progress: Number(newProgress) || 0,
          dueDate: newDueDate || undefined,
          order: milestones.length,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewProgress(0);
        setNewDueDate('');
        setShowAddForm(false);
        fetchMilestones();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Error adding milestone:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (id: string, progress: number) => {
    try {
      const res = await fetch('/api/milestones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, progress }),
      });
      if (res.ok) {
        fetchMilestones();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Error updating milestone progress:', err);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return;
    try {
      const res = await fetch(`/api/milestones?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMilestones();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
  };

  const startEdit = (m: MilestoneItem) => {
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditProgress(m.progress);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch('/api/milestones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          title: editTitle.trim(),
          progress: editProgress,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchMilestones();
        window.dispatchEvent(new CustomEvent('rendo-data-changed'));
      }
    } catch (err) {
      console.error('Error saving milestone edit:', err);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
              PROJECT MILESTONES & PHASES
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Key delivery milestones and progress for {projectName}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Add Milestone Form Popover */}
      {showAddForm && (
        <form
          onSubmit={handleCreateMilestone}
          className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
              New Project Milestone
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              required
              placeholder="e.g. M1 — Core booking API & dispatch engine"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                  Initial Progress: {newProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Milestones List */}
      {loading && milestones.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-zinc-400" />
          Loading milestones...
        </div>
      ) : milestones.length > 0 ? (
        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const isEditing = editingId === m.id;
            const isComplete = m.progress === 100;

            return (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-100"
                      />
                      <button
                        onClick={saveEdit}
                        className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs font-mono font-bold text-blue-500 shrink-0">
                        M{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {m.title}
                      </span>
                      {isComplete && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold shrink-0">
                          DONE
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {m.progress}%
                    </span>

                    {!isEditing && (
                      <button
                        onClick={() => startEdit(m)}
                        className="p-1 text-zinc-400 hover:text-zinc-200"
                        title="Edit title"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-1 text-zinc-400 hover:text-rose-400"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isComplete ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>

                {/* Quick Quick Progress Step Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    {[0, 25, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleUpdateProgress(m.id, val)}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          m.progress === val
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>

                  {m.dueDate && (
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(m.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
          <Target className="w-6 h-6 mx-auto text-zinc-400 mb-1" />
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
            No milestones tracked yet for {projectName}
          </p>
          <p className="text-[11px] text-zinc-400">
            Define clear milestones (e.g. M1 — Core booking, M2 — Dispatch, M3 — Payments) to visualize progress.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500"
          >
            <Plus className="w-3.5 h-3.5" /> Define First Milestone
          </button>
        </div>
      )}
    </div>
  );
}
