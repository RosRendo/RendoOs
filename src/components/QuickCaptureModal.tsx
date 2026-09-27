'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckSquare,
  Lightbulb,
  FileText,
  AlertTriangle,
  FolderGit2,
  Calendar,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export type CaptureType = 'TASK' | 'IDEA' | 'NOTE' | 'BLOCKER';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: CaptureType;
  defaultProjectId?: string;
  onSuccess?: () => void;
}

export default function QuickCaptureModal({
  isOpen,
  onClose,
  defaultType = 'TASK',
  defaultProjectId,
  onSuccess,
}: QuickCaptureModalProps) {
  const router = useRouter();
  const [type, setType] = useState<CaptureType>(defaultType);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; isPrimary?: boolean }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bucket, setBucket] = useState<'NOW' | 'NEXT' | 'LATER'>('NOW');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync default type when opened
  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setTitle('');
      setDescription('');
      setDueDate('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultType]);

  // Fetch project list
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/projects?status=ALL')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data.map((p) => ({ id: p.id, name: p.name, isPrimary: p.isPrimary })));
          if (!selectedProjectId) {
            if (defaultProjectId) {
              setSelectedProjectId(defaultProjectId);
            } else {
              const primary = data.find((p) => p.isPrimary);
              if (primary) setSelectedProjectId(primary.id);
              else if (data.length > 0) setSelectedProjectId(data[0].id);
            }
          }
        }
      })
      .catch(console.error);
  }, [isOpen, defaultProjectId, selectedProjectId]);

  // Global keydown: Esc to close, Ctrl+Enter to submit
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, description, selectedProjectId, bucket, priority, dueDate, type]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() && !description.trim()) return;

    setLoading(true);
    try {
      if (type === 'TASK') {
        if (!selectedProjectId) {
          alert('Please select a project for this task');
          setLoading(false);
          return;
        }
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProjectId,
            title: title.trim(),
            description: description.trim() || undefined,
            bucket,
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          }),
        });
      } else if (type === 'IDEA') {
        await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim() || description.slice(0, 40).trim(),
            description: description.trim() || undefined,
            projectId: selectedProjectId || null,
          }),
        });
      } else if (type === 'NOTE') {
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProjectId || null,
            title: title.trim() || 'Quick Note',
            content: description.trim(),
          }),
        });
      } else if (type === 'BLOCKER') {
        if (!selectedProjectId) {
          alert('Please select a project for this blocker');
          setLoading(false);
          return;
        }
        await fetch('/api/blockers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: selectedProjectId,
            title: title.trim(),
            description: description.trim() || undefined,
          }),
        });
      }

      onClose();
      if (onSuccess) onSuccess();
      router.refresh();
      // Dispatch custom event for dashboard/listeners to reload
      window.dispatchEvent(new CustomEvent('rendo-data-changed'));
    } catch (err) {
      console.error('Quick capture error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#0e1017] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header / Type Switcher */}
        <div className="px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
              QUICK CAPTURE
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              Ctrl + K
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-3 bg-zinc-50/60 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setType('TASK')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              type === 'TASK'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Task
          </button>

          <button
            type="button"
            onClick={() => setType('IDEA')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              type === 'IDEA'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Idea
          </button>

          <button
            type="button"
            onClick={() => setType('NOTE')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              type === 'NOTE'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Note
          </button>

          <button
            type="button"
            onClick={() => setType('BLOCKER')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              type === 'BLOCKER'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Blocker
          </button>
        </div>

        {/* Capture Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Project Target */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
              Project Context
            </label>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-zinc-400 shrink-0" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {type === 'IDEA' || type === 'NOTE' ? (
                  <option value="">General (No specific project)</option>
                ) : null}
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isPrimary ? '🔥 (Current Focus)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
              {type === 'TASK' && 'Task Title'}
              {type === 'IDEA' && 'Idea Title'}
              {type === 'NOTE' && 'Note Title'}
              {type === 'BLOCKER' && 'Blocker Title'}
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              placeholder={
                type === 'TASK'
                  ? 'e.g. Finish booking API endpoint...'
                  : type === 'IDEA'
                  ? 'e.g. AI-driven resume keyword analyzer...'
                  : type === 'NOTE'
                  ? 'e.g. Database migration checklist...'
                  : 'e.g. ABA Bank webhook verification failing...'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Task-Specific Metadata Options */}
          {type === 'TASK' && (
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  Bucket
                </label>
                <select
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="NOW">NOW</option>
                  <option value="NEXT">NEXT</option>
                  <option value="LATER">LATER</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="HIGH">High (P1)</option>
                  <option value="MEDIUM">Med (P2)</option>
                  <option value="LOW">Low (P3)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Description / Content (Multiline) */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
              {type === 'NOTE' ? 'Content (Markdown)' : 'Details (Optional)'}
            </label>
            <textarea
              rows={type === 'NOTE' ? 4 : 2}
              placeholder={
                type === 'NOTE'
                  ? 'Write thoughts, architectural notes, or markdown snippets...'
                  : 'Add context, dependencies, or notes...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              Press <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">Ctrl + Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!title.trim() && !description.trim())}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              >
                <span>Save {type.charAt(0) + type.slice(1).toLowerCase()}</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
