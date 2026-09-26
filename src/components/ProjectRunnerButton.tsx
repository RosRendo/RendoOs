'use client';

import { useState } from 'react';
import {
  Play, Square, ExternalLink, RefreshCw,
  Settings2, Server, Layout, Smartphone,
} from 'lucide-react';

interface ProjectRunnerButtonProps {
  projectId: string;
  projectName: string;
  // Frontend
  folderPath?: string | null;
  runScript?: string | null;
  port?: number | null;
  initialIsRunning?: boolean;
  // Backend
  backendPath?: string | null;
  backendScript?: string | null;
  backendPort?: number | null;
  initialIsBackendRunning?: boolean;
  // Extra (e.g. Expo / React Native / mobile)
  extraPath?: string | null;
  extraScript?: string | null;
  extraPort?: number | null;
  extraName?: string | null;
  initialIsExtraRunning?: boolean;

  onStatusChange?: (status: { isRunning: boolean; isBackendRunning: boolean; isExtraRunning: boolean }) => void;
  className?: string;
}

export default function ProjectRunnerButton({
  projectId,
  projectName,
  folderPath,
  runScript = 'npm run dev',
  port = 3000,
  initialIsRunning = false,
  backendPath,
  backendScript = 'npm run start:dev',
  backendPort = 4000,
  initialIsBackendRunning = false,
  extraPath,
  extraScript = 'npx expo start',
  extraPort = 8081,
  extraName = 'Mobile',
  initialIsExtraRunning = false,
  onStatusChange,
  className = '',
}: ProjectRunnerButtonProps) {
  const [isFeRunning, setIsFeRunning] = useState(initialIsRunning);
  const [isBeRunning, setIsBeRunning] = useState(initialIsBackendRunning);
  const [isExRunning, setIsExRunning] = useState(initialIsExtraRunning);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Config modal state
  const [localFeFolder, setLocalFeFolder] = useState(folderPath || '');
  const [localFeCommand, setLocalFeCommand] = useState(runScript || 'npm run dev');
  const [localFePort, setLocalFePort] = useState(port || 3000);

  const [localBeFolder, setLocalBeFolder] = useState(backendPath || '');
  const [localBeCommand, setLocalBeCommand] = useState(backendScript || 'npm run start:dev');
  const [localBePort, setLocalBePort] = useState(backendPort || 4000);

  const [localExFolder, setLocalExFolder] = useState(extraPath || '');
  const [localExCommand, setLocalExCommand] = useState(extraScript || 'npx expo start');
  const [localExPort, setLocalExPort] = useState(extraPort || 8081);
  const [localExName, setLocalExName] = useState(extraName || 'Mobile');

  const hasBackend = Boolean(backendPath || localBeFolder);
  const hasExtra = Boolean(extraPath || localExFolder);
  const isMultiService = hasBackend || hasExtra;
  const anyRunning = isFeRunning || isBeRunning || isExRunning;

  const handleToggle = async (target: 'frontend' | 'backend' | 'extra' | 'all') => {
    if ((target === 'frontend' || target === 'all') && !folderPath && !localFeFolder) {
      setShowConfig(true);
      return;
    }

    let action = 'start';
    if (target === 'frontend') action = isFeRunning ? 'stop' : 'start';
    else if (target === 'backend') action = isBeRunning ? 'stop' : 'start';
    else if (target === 'extra') action = isExRunning ? 'stop' : 'start';
    else action = anyRunning ? 'stop' : 'start';

    setLoadingTarget(target);
    try {
      const res = await fetch(`/api/projects/${projectId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, target }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFeRunning(data.isFrontendRunning);
        setIsBeRunning(data.isBackendRunning);
        setIsExRunning(data.isExtraRunning ?? false);
        if (onStatusChange) {
          onStatusChange({
            isRunning: data.isFrontendRunning,
            isBackendRunning: data.isBackendRunning,
            isExtraRunning: data.isExtraRunning ?? false,
          });
        }
      } else {
        alert(data.error || `Failed to ${action} ${target}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Process error: ${err.message}`);
    } finally {
      setLoadingTarget(null);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTarget('save');
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderPath: localFeFolder.trim() || null,
          runScript: localFeCommand.trim() || 'npm run dev',
          port: localFePort || 3000,
          backendPath: localBeFolder.trim() || null,
          backendScript: localBeCommand.trim() || 'npm run start:dev',
          backendPort: localBePort || 4000,
          extraPath: localExFolder.trim() || null,
          extraScript: localExCommand.trim() || 'npx expo start',
          extraPort: localExPort || 8081,
          extraName: localExName.trim() || 'Mobile',
        }),
      });
      if (res.ok) {
        setShowConfig(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save configuration');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTarget(null);
    }
  };

  // ── Dot indicator ─────────────────────────────────────────────────
  const Dot = ({ running, color }: { running: boolean; color: string }) => (
    <span className={`w-1.5 h-1.5 rounded-full ${running ? `${color} animate-pulse` : 'bg-zinc-400 opacity-30'}`} />
  );

  // ── Port link ─────────────────────────────────────────────────────
  const PortLink = ({ running, p, color }: { running: boolean; p: number; color: string }) =>
    running ? (
      <a
        href={`http://localhost:${p}`}
        target="_blank"
        rel="noreferrer"
        className={`text-[10px] font-mono ${color} hover:underline`}
        title={`Open :${p}`}
      >
        :{p}
      </a>
    ) : null;

  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>

      {isMultiService ? (
        /* ── Multi-service pill ─────────────────────────── */
        <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-0.5 shadow-sm">

          {/* Run All / Stop All */}
          <button
            type="button"
            onClick={() => handleToggle('all')}
            disabled={loadingTarget !== null}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
              anyRunning
                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title={anyRunning ? 'Stop All' : 'Run All'}
          >
            {loadingTarget === 'all' ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : anyRunning ? (
              <><Square className="w-2.5 h-2.5 fill-current" /><span>Stop All</span></>
            ) : (
              <><Play className="w-2.5 h-2.5 fill-current" /><span>Run All</span></>
            )}
          </button>

          {/* FE */}
          <div className="flex items-center px-1.5 border-l border-zinc-200 dark:border-zinc-800 gap-1">
            <button
              type="button"
              onClick={() => handleToggle('frontend')}
              disabled={loadingTarget !== null}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                isFeRunning
                  ? 'text-emerald-500 font-bold hover:bg-emerald-500/10'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
              title={isFeRunning ? 'Stop Frontend' : 'Start Frontend'}
            >
              {loadingTarget === 'frontend' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Layout className="w-3 h-3 opacity-70" />}
              <span>FE</span>
              <Dot running={isFeRunning} color="bg-emerald-500" />
            </button>
            <PortLink running={isFeRunning} p={port || localFePort || 3000} color="text-emerald-500" />
          </div>

          {/* BE */}
          {hasBackend && (
            <div className="flex items-center px-1.5 border-l border-zinc-200 dark:border-zinc-800 gap-1">
              <button
                type="button"
                onClick={() => handleToggle('backend')}
                disabled={loadingTarget !== null}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  isBeRunning
                    ? 'text-blue-500 font-bold hover:bg-blue-500/10'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
                title={isBeRunning ? 'Stop Backend' : 'Start Backend'}
              >
                {loadingTarget === 'backend' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Server className="w-3 h-3 opacity-70" />}
                <span>BE</span>
                <Dot running={isBeRunning} color="bg-blue-500" />
              </button>
              <PortLink running={isBeRunning} p={backendPort || localBePort || 4000} color="text-blue-500" />
            </div>
          )}

          {/* Extra (Expo / Mobile) */}
          {hasExtra && (
            <div className="flex items-center px-1.5 border-l border-zinc-200 dark:border-zinc-800 gap-1">
              <button
                type="button"
                onClick={() => handleToggle('extra')}
                disabled={loadingTarget !== null}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  isExRunning
                    ? 'text-violet-500 font-bold hover:bg-violet-500/10'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
                title={isExRunning ? `Stop ${localExName}` : `Start ${localExName}`}
              >
                {loadingTarget === 'extra' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Smartphone className="w-3 h-3 opacity-70" />}
                <span>{localExName || extraName || 'Mobile'}</span>
                <Dot running={isExRunning} color="bg-violet-500" />
              </button>
              <PortLink running={isExRunning} p={extraPort || localExPort || 8081} color="text-violet-500" />
            </div>
          )}

          {/* Config cog */}
          <button
            type="button"
            onClick={() => setShowConfig(true)}
            className="p-1 ml-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="Configure Runner"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* ── Single service button ──────────────────────── */
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleToggle('frontend')}
            disabled={loadingTarget !== null}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer shadow-sm ${
              isFeRunning
                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30'
            }`}
            title={isFeRunning ? `Stop ${projectName}` : `Run ${projectName} on RendoOs`}
          >
            {loadingTarget === 'frontend' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isFeRunning ? (
              <><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /><Square className="w-3 h-3 fill-current" /><span>Stop App</span></>
            ) : (
              <><Play className="w-3.5 h-3.5 fill-current" /><span>Run on RendoOs</span></>
            )}
          </button>

          {isFeRunning && (
            <a
              href={`http://localhost:${port || localFePort || 3000}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>:{port || localFePort || 3000}</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setShowConfig(true)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            title="Configure Runner"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Configuration Modal ────────────────────────────────── */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#11131a] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Configure Runner — {projectName}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Set up launch controls for each service. Leave extra empty if not needed.
                </p>
              </div>
              <button type="button" onClick={() => setShowConfig(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-mono">✕</button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              {/* Frontend */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Layout className="w-4 h-4 text-emerald-500" /><span>Frontend</span>
                </div>
                <input type="text" placeholder="Folder path" value={localFeFolder} onChange={(e) => setLocalFeFolder(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="npm run dev" value={localFeCommand} onChange={(e) => setLocalFeCommand(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                  <input type="number" placeholder="3000" value={localFePort} onChange={(e) => setLocalFePort(parseInt(e.target.value, 10))}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                </div>
              </div>

              {/* Backend */}
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Server className="w-4 h-4 text-blue-500" /><span>Backend (Optional)</span>
                </div>
                <input type="text" placeholder="Backend folder path" value={localBeFolder} onChange={(e) => setLocalBeFolder(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="npm run start:dev" value={localBeCommand} onChange={(e) => setLocalBeCommand(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                  <input type="number" placeholder="4000" value={localBePort} onChange={(e) => setLocalBePort(parseInt(e.target.value, 10))}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                </div>
              </div>

              {/* Extra / Mobile */}
              <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Smartphone className="w-4 h-4 text-violet-500" /><span>Extra Service (Optional — Expo, Mobile, etc.)</span>
                </div>
                <input type="text" placeholder="Extra service folder path (e.g. frontend-expo)" value={localExFolder} onChange={(e) => setLocalExFolder(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="Label (e.g. Expo)" value={localExName} onChange={(e) => setLocalExName(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                  <input type="text" placeholder="npx expo start" value={localExCommand} onChange={(e) => setLocalExCommand(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                  <input type="number" placeholder="8081" value={localExPort} onChange={(e) => setLocalExPort(parseInt(e.target.value, 10))}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setShowConfig(false)} className="px-4 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">Cancel</button>
                <button type="submit" disabled={loadingTarget === 'save'}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm">
                  {loadingTarget === 'save' ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
