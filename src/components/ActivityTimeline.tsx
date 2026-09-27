'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
  AlertTriangle,
  FolderGit2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface ActivityTimelineProps {
  projectId?: string;
  projectName?: string;
}

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  timestamp: string;
  project?: { id: string; name: string; slug: string } | null;
}

export default function ActivityTimeline({ projectId, projectName }: ActivityTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = useCallback(async () => {
    try {
      setLoading(true);
      const url = projectId ? `/api/activity?projectId=${projectId}` : '/api/activity';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching activity timeline:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTimeline();

    const handler = () => fetchTimeline();
    window.addEventListener('rendo-data-changed', handler);
    return () => window.removeEventListener('rendo-data-changed', handler);
  }, [fetchTimeline]);

  // Group events by date labels (TODAY, YESTERDAY, MMM DD)
  const groupEventsByDate = (eventsList: TimelineEvent[]) => {
    const groups: Record<string, TimelineEvent[]> = {};
    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    for (const event of eventsList) {
      const eventDate = new Date(event.timestamp);
      let label = '';

      if (eventDate.toDateString() === todayStr) {
        label = 'TODAY';
      } else if (eventDate.toDateString() === yesterdayStr) {
        label = 'YESTERDAY';
      } else {
        label = eventDate.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        }).toUpperCase();
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(event);
    }

    return groups;
  };

  const grouped = groupEventsByDate(events);
  const groupKeys = Object.keys(grouped);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
              ACTIVITY TIMELINE
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Answering: &ldquo;What was I doing last time?&rdquo;
          </p>
        </div>

        <button
          onClick={fetchTimeline}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-500 hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {loading && events.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-zinc-400" />
          Loading activity stream...
        </div>
      ) : groupKeys.length > 0 ? (
        <div className="space-y-6">
          {groupKeys.map((dateLabel) => (
            <div key={dateLabel} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-zinc-900 dark:text-zinc-100">
                  {dateLabel}
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Events under this date */}
              <div className="space-y-2 pl-2">
                {grouped[dateLabel].map((evt) => {
                  const isTask = evt.type === 'TASK_COMPLETED';
                  const isMilestone = evt.type.includes('MILESTONE');
                  const isBlocker = evt.type.includes('BLOCKER');

                  return (
                    <div
                      key={evt.id}
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                    >
                      <div className="mt-0.5 shrink-0">
                        {isTask || isMilestone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : isBlocker ? (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 mx-1" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {evt.title}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                            {formatTimeAgo(evt.timestamp)}
                          </span>
                        </div>

                        {evt.description && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                            {evt.description}
                          </p>
                        )}

                        {evt.project && !projectId && (
                          <span className="inline-block mt-1 text-[10px] font-mono text-blue-500">
                            in {evt.project.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Clock className="w-6 h-6 mx-auto text-zinc-400 mb-1" />
          <p className="font-medium text-zinc-700 dark:text-zinc-300">
            No activity recorded yet for {projectName || 'this project'}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Complete tasks or define milestones to populate your activity timeline.
          </p>
        </div>
      )}
    </div>
  );
}
