'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Lightbulb,
  Archive,
  Settings,
  Plus,
  Terminal,
  FolderSearch,
  ChevronDown,
  Search,
  ExternalLink,
  Play,
  Square,
  Sparkles,
  Command,
  CalendarCheck2,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect, useRef } from 'react';
import QuickAddModal from './QuickAddModal';
import QuickCaptureModal, { CaptureType } from './QuickCaptureModal';
import ScanProjectModal from './ScanProjectModal';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderGit2 },
  { name: 'Ideas', href: '/ideas', icon: Lightbulb },
  { name: 'Review', href: '/review', icon: CalendarCheck2 },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [quickCaptureType, setQuickCaptureType] = useState<CaptureType>('TASK');

  // Quick Project Switcher State
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [switcherSearch, setSwitcherSearch] = useState('');
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch project list for quick switcher
    fetch('/api/projects?status=ALL')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjectsList(data))
      .catch((err) => console.error('Navbar projects fetch error:', err));
  }, [pathname]);

  // Click outside listener for switcher
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setShowSwitcher(false);
      }
    }
    if (showSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSwitcher]);

  // Filtered projects for switcher
  const filteredSwitcherProjects = projectsList.filter((p) =>
    p.name.toLowerCase().includes(switcherSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(switcherSearch.toLowerCase())
  );

  const activeServicesCount = projectsList.filter(
    (p) => p.isRunning || p.isBackendRunning || p.isExtraRunning
  ).length;

  // Global Ctrl+K / Cmd+K listener for Quick Capture
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowQuickCapture((prev) => !prev);
      }
    }
    function handleOpenEvent(e: any) {
      if (e.detail?.type) setQuickCaptureType(e.detail.type);
      setShowQuickCapture(true);
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('open-quick-capture', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('open-quick-capture', handleOpenEvent);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Brand & Navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-7 rounded-md bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  RendoOs
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                  v2.0
                </span>
              </div>
            </Link>

            {/* Quick Project Switcher Dropdown */}
            <div className="relative hidden md:block" ref={switcherRef}>
              <button
                onClick={() => setShowSwitcher(!showSwitcher)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
                <span className="max-w-[140px] truncate">
                  {pathname.startsWith('/projects/')
                    ? projectsList.find((p) => pathname.includes(p.id) || pathname.includes(p.slug))?.name || 'Projects'
                    : 'Jump to Project...'}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {showSwitcher && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-2 border-b border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                      <Search className="w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search 14 projects..."
                        value={switcherSearch}
                        onChange={(e) => setSwitcherSearch(e.target.value)}
                        className="w-full bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-1 divide-y divide-zinc-50 dark:divide-zinc-800/40">
                    {filteredSwitcherProjects.length === 0 ? (
                      <p className="p-3 text-center text-xs text-zinc-500 font-mono">No matching project</p>
                    ) : (
                      filteredSwitcherProjects.map((proj) => {
                        const isLive = proj.isRunning || proj.isBackendRunning;
                        return (
                          <button
                            key={proj.id}
                            onClick={() => {
                              setShowSwitcher(false);
                              router.push(`/projects/${proj.slug || proj.id}`);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 truncate">
                                {proj.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-mono truncate">{proj.slug}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {proj.port && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                  :{proj.port}
                                </span>
                              )}
                              {isLive && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Server" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-2xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-2">
            {/* Active Services Live Telemetry Pill */}
            {activeServicesCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeServicesCount} Active</span>
              </div>
            )}

            {/* Quick Capture (Ctrl+K) Button */}
            <button
              onClick={() => {
                setQuickCaptureType('TASK');
                setShowQuickCapture(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer group"
              title="Quick Capture (Ctrl + K)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Capture</span>
              <kbd className="hidden lg:inline-flex text-[9px] font-mono px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setShowScanModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              title="Scan local project folder"
            >
              <FolderSearch className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Scan</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-zinc-100 dark:border-zinc-800/60 py-1.5 px-2 bg-zinc-50 dark:bg-zinc-900/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-zinc-900 dark:text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {showQuickCapture && (
        <QuickCaptureModal
          isOpen={showQuickCapture}
          onClose={() => setShowQuickCapture(false)}
          defaultType={quickCaptureType}
        />
      )}
      {showAddModal && <QuickAddModal onClose={() => setShowAddModal(false)} />}
      {showScanModal && <ScanProjectModal onClose={() => setShowScanModal(false)} />}
    </>
  );
}
