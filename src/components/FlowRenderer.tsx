'use client';

import { CornerDownRight } from 'lucide-react';

interface FlowRendererProps {
  content: string;
}

interface FlowBlock {
  type: 'section' | 'step' | 'feature' | 'text';
  title?: string;
  number?: number;
  body: string[];
}

function parseFlow(content: string): FlowBlock[] {
  const lines = content.split('\n');
  const blocks: FlowBlock[] = [];
  let current: FlowBlock | null = null;

  const flush = () => {
    if (current) {
      while (current.body.length > 0 && current.body[current.body.length - 1].trim() === '') {
        current.body.pop();
      }
      blocks.push(current);
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (/^\[SECTION\]/i.test(trimmed)) {
      flush();
      current = { type: 'section', title: trimmed.replace(/^\[SECTION\]\s*/i, ''), body: [] };
      continue;
    }
    if (/^\[FEATURE\]/i.test(trimmed)) {
      flush();
      current = { type: 'feature', title: trimmed.replace(/^\[FEATURE\]\s*/i, ''), body: [] };
      continue;
    }
    const stepMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (stepMatch) {
      flush();
      current = { type: 'step', number: parseInt(stepMatch[1]), title: stepMatch[2], body: [] };
      continue;
    }
    if (current) {
      current.body.push(rawLine);
    } else if (trimmed) {
      current = { type: 'text', body: [rawLine] };
    }
  }
  flush();
  return blocks;
}

export default function FlowRenderer({ content }: FlowRendererProps) {
  if (!content?.trim()) {
    return <p className="text-xs text-zinc-500 font-mono italic">No flow content to display.</p>;
  }

  const blocks = parseFlow(content);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === 'section') {
          return (
            <div key={i} className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 dark:from-zinc-700 to-transparent" />
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-2">
                  {block.title}
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-zinc-200 dark:from-zinc-700 to-transparent" />
              </div>
            </div>
          );
        }
        if (block.type === 'step') {
          return (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                <span className="text-[11px] font-bold font-mono text-blue-400">{block.number}</span>
              </div>
              <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-snug">{block.title}</p>
                {block.body.filter(l => l.trim()).map((line, j) => (
                  <div key={j} className="flex items-start gap-1.5">
                    <CornerDownRight className="w-3 h-3 text-zinc-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{line.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if (block.type === 'feature') {
          return (
            <div key={i} className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 dark:bg-violet-500/[0.07] space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-400 uppercase tracking-wider">Feature</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{block.title}</span>
              </div>
              {block.body.filter(l => l.trim()).map((line, j) => (
                <p key={j} className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-1">{line.trim()}</p>
              ))}
            </div>
          );
        }
        return (
          <div key={i} className="space-y-1">
            {block.body.filter(l => l.trim()).map((line, j) => (
              <p key={j} className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{line.trim()}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
