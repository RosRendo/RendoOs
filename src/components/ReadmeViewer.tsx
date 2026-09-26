'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Edit2,
  Check,
  Copy,
  RefreshCw,
  Folder,
  ExternalLink,
  Save,
  Eye,
  CheckCircle2,
  Code2,
} from 'lucide-react';

interface ReadmeViewerProps {
  projectId: string;
  projectName: string;
}

export default function ReadmeViewer({ projectId, projectName }: ReadmeViewerProps) {
  const [content, setContent] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  const fetchReadme = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}/readme`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '');
        setFilePath(data.filePath || null);
        setExists(data.exists ?? false);
      }
    } catch (err) {
      console.error('Failed to load README:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchReadme();
  }, [fetchReadme]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/projects/${projectId}/readme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setFilePath(data.filePath || filePath);
        setExists(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to save README:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPath = () => {
    if (filePath) {
      navigator.clipboard.writeText(filePath);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  // Render markdown with custom styling
  const renderFormattedMarkdown = (text: string) => {
    if (!text.trim()) {
      return (
        <div className="py-20 text-center text-zinc-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No README content found.</p>
          <p className="text-xs text-zinc-500 mt-1">Click Edit to create one for this project.</p>
        </div>
      );
    }

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableBuffer: string[] = [];

    const flushCode = (key: string | number) => {
      if (codeBuffer.length > 0) {
        const codeText = codeBuffer.join('\n');
        elements.push(
          <div key={`code-${key}`} className="my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-300 uppercase">{codeLanguage || 'text'}</span>
              <button
                onClick={() => navigator.clipboard.writeText(codeText)}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre font-mono">
              {codeText}
            </pre>
          </div>
        );
        codeBuffer = [];
        codeLanguage = '';
      }
    };

    const flushTable = (key: string | number) => {
      if (tableBuffer.length > 0) {
        const rows = tableBuffer.map(r => r.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1));
        const headers = rows[0] || [];
        const bodyRows = rows.slice(2); // Skip header and separator row

        elements.push(
          <div key={`table-${key}`} className="my-5 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
                  {headers.map((h, hi) => (
                    <th key={hi} className="px-4 py-2.5 font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-[11px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-[#11131a]">
                {bodyRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2 text-zinc-600 dark:text-zinc-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          flushCode(index);
        } else {
          flushTable(index);
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Markdown Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        tableBuffer.push(line.trim());
        return;
      } else if (inTable) {
        inTable = false;
        flushTable(index);
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`sp-${index}`} className="h-3" />);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white mt-4 mb-2 flex items-center gap-2">
            <span>{line.replace('# ', '')}</span>
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-6 mb-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-1.5 flex items-center gap-2">
            <span>{line.replace('## ', '')}</span>
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-sm font-bold tracking-tight text-zinc-800 dark:text-zinc-200 mt-4 mb-1.5">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(
          <hr key={`hr-${index}`} className="my-5 border-zinc-200 dark:border-zinc-800" />
        );
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <div key={`bq-${index}`} className="my-3 pl-4 py-1 border-l-2 border-blue-500 bg-blue-500/5 rounded-r-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 italic">
            {line.replace('> ', '')}
          </div>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <div key={`li-${index}`} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <span className="leading-relaxed">{parseInline(itemText)}</span>
          </div>
        );
        return;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={`num-${index}`} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 my-1 pl-1">
            <span className="font-mono text-[11px] font-bold text-blue-500 shrink-0">{numMatch[1]}.</span>
            <span className="leading-relaxed">{parseInline(numMatch[2])}</span>
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${index}`} className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed my-1">
          {parseInline(line)}
        </p>
      );
    });

    if (inCodeBlock) flushCode('eof');
    if (inTable) flushTable('eof');

    return elements;
  };

  // Helper for inline markdown (bold, code, links)
  const parseInline = (text: string): React.ReactNode => {
    // Regex for bold **text** and code `text`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-zinc-900 dark:text-zinc-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 font-semibold border border-zinc-200 dark:border-zinc-700/60">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">README.md</h3>
              {exists ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                  LIVE ON DISK
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                  AUTO-GENERATED
                </span>
              )}
            </div>
            {filePath && (
              <p
                onClick={handleCopyPath}
                title="Click to copy path"
                className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 hover:text-blue-500 cursor-pointer flex items-center gap-1 group"
              >
                <Folder className="w-3 h-3 text-zinc-400 group-hover:text-blue-500" />
                <span className="truncate max-w-md">{filePath}</span>
                {copiedPath && <span className="text-emerald-500 text-[10px]">Copied!</span>}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
            <button
              onClick={() => setIsEditing(false)}
              className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                !isEditing
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors border-l border-zinc-200 dark:border-zinc-800 ${
                isEditing
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <button
            onClick={fetchReadme}
            disabled={loading}
            title="Reload from disk"
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            title="Copy Raw Markdown"
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors flex items-center gap-1"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save to File'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-2" />
            <p className="text-xs font-mono">Reading project README.md from disk...</p>
          </div>
        ) : isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Editing raw markdown · Markdown preview rendered instantly</span>
              <span>Press Save to persist directly to disk</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                  e.preventDefault();
                  handleSave();
                }
              }}
              rows={24}
              placeholder="# Project Title&#10;&#10;Project documentation..."
              className="w-full p-4 rounded-xl text-xs font-mono bg-zinc-950 text-zinc-100 border border-zinc-800 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
            />
          </div>
        ) : (
          <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
            {renderFormattedMarkdown(content)}
          </div>
        )}
      </div>
    </div>
  );
}
