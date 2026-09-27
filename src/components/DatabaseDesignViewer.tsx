'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  Table as TableIcon,
  Code2,
  Copy,
  Check,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Folder,
  Layers,
  Search,
  ExternalLink,
  Key,
  Link2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import MermaidViewer from './MermaidViewer';
import { DatabaseDesignResult, DbTable, getDatabaseTemplate } from '@/lib/database-types';

interface DatabaseDesignViewerProps {
  projectId: string;
  projectName: string;
}

export default function DatabaseDesignViewer({
  projectId,
  projectName,
}: DatabaseDesignViewerProps) {
  const [data, setData] = useState<DatabaseDesignResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'erd' | 'tables' | 'code'>('erd');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [saveToDisk, setSaveToDisk] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTable, setSearchTable] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchDatabaseDesign = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}/database`);
      if (res.ok) {
        const result: DatabaseDesignResult = await res.json();
        setData(result);
        setEditedContent(result.rawContent || result.erdMermaid || '');
        if (result.tables && result.tables.length > 0 && !result.erdMermaid) {
          setViewMode('tables');
        }
      }
    } catch (err) {
      console.error('Failed to load database design:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDatabaseDesign();
  }, [fetchDatabaseDesign]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/projects/${projectId}/database`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editedContent,
          filePath: data?.filePath || null,
          saveToDisk: Boolean(saveToDisk && data?.filePath),
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        setSuccessMessage('Database design saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchDatabaseDesign();
      }
    } catch (err) {
      console.error('Failed to save database design:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editedContent || data?.rawContent || data?.erdMermaid || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyTemplate = (templateName: 'ecommerce' | 'pos' | 'saas') => {
    const tmpl = getDatabaseTemplate(templateName);
    setEditedContent(tmpl.rawContent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12]">
        <div className="flex flex-col items-center gap-2.5">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-xs font-mono text-zinc-400">Loading Database Schema & ERD...</span>
        </div>
      </div>
    );
  }

  if (!data || (!data.hasDatabase && !data.rawContent && !data.erdMermaid)) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center bg-white/50 dark:bg-[#0c0d12]/50 space-y-3">
        <Database className="w-10 h-10 mx-auto text-zinc-400 opacity-50" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          No Database Configured for {projectName}
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          This project does not currently declare a database in its tech stack or contain a local schema file.
        </p>
        <button
          onClick={() => {
            setIsEditing(true);
            handleApplyTemplate('saas');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Design New Database Schema</span>
        </button>
      </div>
    );
  }

  const filteredTables = (data.tables || []).filter((t) =>
    t.name.toLowerCase().includes(searchTable.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ── Top Header & Mode Toolbar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Database Design
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 font-semibold">
                {data.engine}
              </span>
              {data.tables && data.tables.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {data.tables.length} {data.tables.length === 1 ? 'Table' : 'Tables'}
                </span>
              )}
            </div>

            {data.filePath ? (
              <p className="text-[10px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1 truncate max-w-[320px] sm:max-w-md">
                <Folder className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="truncate">{data.filePath}</span>
              </p>
            ) : (
              <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                Active Architecture Database Schema
              </p>
            )}
          </div>
        </div>

        {/* View Mode Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {!isEditing && (
            <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs font-mono">
              <button
                onClick={() => setViewMode('erd')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'erd'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>ERD Visual</span>
              </button>

              <button
                onClick={() => setViewMode('tables')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'tables'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>Tables ({data.tables.length})</span>
              </button>

              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'code'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Source</span>
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 transition-colors shadow-xs"
            title="Copy schema to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                setEditedContent(data.rawContent || data.erdMermaid || '');
              }
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors shadow-xs ${
              isEditing
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Schema'}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ── EDIT MODE ──────────────────────────────────────────────── */}
      {isEditing ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-mono">
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                Schema & ERD Editor
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Edit Prisma schema, SQL DDL, or Mermaid erDiagram code.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-400">Templates:</span>
              <button
                type="button"
                onClick={() => handleApplyTemplate('saas')}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                SaaS
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('ecommerce')}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                E-Commerce
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate('pos')}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                POS / SQL
              </button>
            </div>
          </div>

          <textarea
            rows={18}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-4 font-mono text-xs bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
            placeholder="Paste your schema.prisma, SQL DDL, or Mermaid erDiagram here..."
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            {data.filePath ? (
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToDisk}
                  onChange={(e) => setSaveToDisk(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-0"
                />
                <span>Also write changes directly to disk ({data.filePath})</span>
              </label>
            ) : (
              <span className="text-xs font-mono text-zinc-500">
                Saves to project database design record
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Database Design'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── VIEW MODES ───────────────────────────────────────────── */
        <div>
          {/* 1. VISUAL MERMAID ERD */}
          {viewMode === 'erd' && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                    Interactive Entity Relationship Diagram (ERD)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Primary Key (PK)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-violet-400" /> Foreign Key (FK)
                  </span>
                </div>
              </div>

              <div className="min-h-[420px] rounded-lg bg-zinc-50/60 dark:bg-black/40 border border-zinc-100 dark:border-zinc-800/60 p-4 overflow-auto">
                <MermaidViewer chart={data.erdMermaid} />
              </div>
            </div>
          )}

          {/* 2. TABLE INSPECTOR */}
          {viewMode === 'tables' && (
            <div className="space-y-4">
              {/* Search Bar for Tables */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Filter tables & models..."
                    value={searchTable}
                    onChange={(e) => setSearchTable(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0c0d12] border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-xs"
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Showing {filteredTables.length} of {data.tables.length} models
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTables.map((table) => (
                  <div
                    key={table.name}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] overflow-hidden shadow-xs"
                  >
                    {/* Table Title Bar */}
                    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TableIcon className="w-3.5 h-3.5 text-blue-500" />
                        <h4 className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">
                          {table.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {table.columns.length} columns
                      </span>
                    </div>

                    {/* Columns List */}
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                      {table.columns.map((col) => (
                        <div
                          key={col.name}
                          className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors font-mono"
                        >
                          <div className="flex items-center gap-2">
                            {col.isPrimaryKey ? (
                              <Key className="w-3 h-3 text-amber-500" />
                            ) : col.isForeignKey ? (
                              <Link2 className="w-3 h-3 text-blue-400" />
                            ) : (
                              <span className="w-3 h-3 block" />
                            )}
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                              {col.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60">
                              {col.type}
                            </span>
                            {col.isPrimaryKey && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                                PK
                              </span>
                            )}
                            {col.isForeignKey && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                                FK
                              </span>
                            )}
                            {col.isNullable && (
                              <span className="text-[9px] text-zinc-400">null</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. CODE / SOURCE VIEW */}
          {viewMode === 'code' && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0d12] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Raw Schema Code ({data.format.toUpperCase()})
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-100"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed max-h-[500px]">
                <code>{data.rawContent || data.erdMermaid}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
