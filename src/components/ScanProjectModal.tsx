'use client';

import { useState } from 'react';
import {
  FolderSearch,
  X,
  Check,
  FolderGit2,
  Terminal,
  Globe,
  Upload,
  RefreshCw,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TechBadge } from './TechIcon';
import TechIcon from './TechIcon';
import { useRouter } from 'next/navigation';

interface ScanProjectModalProps {
  onClose: () => void;
  onImportSuccess?: () => void;
}

export default function ScanProjectModal({ onClose, onImportSuccess }: ScanProjectModalProps) {
  const router = useRouter();
  const [folderPath, setFolderPath] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form override fields after scan
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [runScript, setRunScript] = useState('npm run dev');
  const [port, setPort] = useState(3000);
  const [backendPath, setBackendPath] = useState('');
  const [backendScript, setBackendScript] = useState('npm run start:dev');
  const [backendPort, setBackendPort] = useState<number | string>('');
  const [image, setImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderPath.trim()) return;

    setScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: folderPath.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to scan folder');
      }

      setScanResult(data);
      setName(data.name || '');
      setDescription(data.description || '');
      setRunScript(data.runScript || 'npm run dev');
      setPort(data.port || 3000);
      setBackendPath(data.backendPath || '');
      setBackendScript(data.backendScript || 'npm run start:dev');
      setBackendPort(data.backendPort || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleImport = async () => {
    if (!name.trim()) return;
    setImporting(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          status,
          techStack: scanResult?.techStack || {},
          overview: scanResult?.overview || '',
          repoUrl: scanResult?.repoUrl || null,
          folderPath: scanResult?.folderPath || folderPath.trim(),
          runScript: runScript.trim(),
          port: port || 3000,
          backendPath: backendPath.trim() || null,
          backendScript: backendScript.trim() || null,
          backendPort: backendPort ? parseInt(backendPort.toString(), 10) : null,
          image: image || null,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onClose();
        if (onImportSuccess) onImportSuccess();
        router.push(`/projects/${created.slug || created.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to import project');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#11131a] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FolderSearch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Scan Local Project Folder
              </h2>
              <p className="text-[11px] text-zinc-500">
                Inspect package.json, Git repository, and detect tech stack with real SVG badges.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Scan input */}
          <form onSubmit={handleScan} className="space-y-3">
            <label className="block text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
              Enter Local Project Folder Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. D:\FOR RENDO (ONLY )\Personal Project\Orchestrator\backend"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={scanning || !folderPath.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning...
                  </>
                ) : (
                  <>
                    <FolderSearch className="w-3.5 h-3.5" /> Scan Folder
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Scan Result Preview */}
          {scanResult && (
            <div className="space-y-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-5">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-500 uppercase flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Scan Completed Successfully
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Ready to import
                </span>
              </div>

              {/* Detected Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPERIMENT">EXPERIMENT</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="IDEA">IDEA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="One sentence description"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
                />
              </div>

              {/* Screenshot / Visual Snapshot */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono text-zinc-500">
                    Project Screenshot / UI Mockup
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="text-[10px] font-mono text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  {image ? (
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shrink-0">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-28 h-16 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 bg-zinc-50 dark:bg-zinc-950 cursor-pointer shrink-0 transition-colors">
                      <Upload className="w-4 h-4 text-zinc-400 mb-0.5" />
                      <span className="text-[10px] font-mono text-zinc-400">
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Or enter image URL / public path (e.g. /projects/ui.png)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-mono"
                    />
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Attach visual screenshot for instant preview in dashboard & cards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Detected Tech Stack with Real Brand SVGs */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono text-zinc-500">
                  Detected Technologies (Authentic Brand Badges)
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  {[
                    ...(scanResult.techStack?.frontend || []),
                    ...(scanResult.techStack?.backend || []),
                    ...(scanResult.techStack?.database || []),
                    ...(scanResult.techStack?.infrastructure || []),
                  ].length > 0 ? (
                    [
                      ...(scanResult.techStack?.frontend || []),
                      ...(scanResult.techStack?.backend || []),
                      ...(scanResult.techStack?.database || []),
                      ...(scanResult.techStack?.infrastructure || []),
                    ].map((tech) => <TechBadge key={tech} name={tech} />)
                  ) : (
                    <span className="text-xs text-zinc-400 font-mono">
                      No dependencies detected in package.json
                    </span>
                  )}
                </div>
              </div>

              {/* Detected Git Repository */}
              {scanResult.repoUrl && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <TechIcon name="github" size={16} />
                  <span className="font-mono text-zinc-400 text-[11px]">Git Remote:</span>
                  <a
                    href={scanResult.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-blue-500 hover:underline truncate"
                  >
                    {scanResult.repoUrl}
                  </a>
                </div>
              )}

              {/* Dual Run Settings: Frontend & Backend */}
              <div className="space-y-3 pt-1">
                {/* Frontend */}
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
                  <div className="text-[11px] font-mono font-semibold text-emerald-500 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Frontend Runner
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">
                        Frontend Command
                      </label>
                      <input
                        type="text"
                        value={runScript}
                        onChange={(e) => setRunScript(e.target.value)}
                        placeholder="npm run dev"
                        className="w-full px-2.5 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">
                        Frontend Port
                      </label>
                      <input
                        type="number"
                        value={port}
                        onChange={(e) => setPort(parseInt(e.target.value, 10))}
                        placeholder="3000"
                        className="w-full px-2.5 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Backend */}
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
                  <div className="text-[11px] font-mono font-semibold text-blue-500 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" /> Backend Runner (Optional)
                    </span>
                    {backendPath && (
                      <span className="text-[10px] font-mono text-zinc-400 font-normal">
                        Detected subfolder
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">
                        Backend Folder Path
                      </label>
                      <input
                        type="text"
                        value={backendPath}
                        onChange={(e) => setBackendPath(e.target.value)}
                        placeholder="Leave blank if monolithic or enter backend folder"
                        className="w-full px-2.5 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">
                          Backend Command
                        </label>
                        <input
                          type="text"
                          value={backendScript}
                          onChange={(e) => setBackendScript(e.target.value)}
                          placeholder="npm run start:dev / python main.py"
                          className="w-full px-2.5 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">
                          Backend Port
                        </label>
                        <input
                          type="number"
                          value={backendPort}
                          onChange={(e) => setBackendPort(e.target.value)}
                          placeholder="4000 or 8000"
                          className="w-full px-2.5 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Cancel
          </button>

          {scanResult && (
            <button
              onClick={handleImport}
              disabled={importing || !name.trim()}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{importing ? 'Importing...' : 'Import to Rendo Hub'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
