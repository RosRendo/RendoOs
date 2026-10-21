'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  CalendarCheck2,
  Lightbulb,
  Archive,
  Settings,
  Terminal,
  Plus,
  Search,
  ChevronDown,
  Sparkles,
  FolderSearch,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import QuickAddModal from './QuickAddModal';
import QuickCaptureModal, { CaptureType } from './QuickCaptureModal';
import ScanProjectModal from './ScanProjectModal';

interface NavGroup {
  label: string;
  items: {
    name: string;
    href: string;
    icon: any;
    exact?: boolean;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'HOME',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'WORK',
    items: [
      { name: 'Repositories', href: '/projects', icon: FolderGit2 },
      { name: 'Review', href: '/review', icon: CalendarCheck2 },
    ],
  },
  {
    label: 'KNOWLEDGE',
    items: [
      { name: 'Ideas Inbox', href: '/ideas', icon: Lightbulb },
      { name: 'Archive', href: '/archive', icon: Archive },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar collapse state (persisted)
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [quickCaptureType, setQuickCaptureType] = useState<CaptureType>('TASK');

  // Quick Project Switcher State
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [switcherSearch, setSwitcherSearch] = useState('');
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Load sidebar preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rendo-sidebar-collapsed');
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    } catch (e) {
      // LocalStorage unavailable
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('rendo-sidebar-collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Fetch project list for quick switcher
  useEffect(() => {
    fetch('/api/projects?status=ALL')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjectsList(data))
      .catch((err) => console.error('Projects fetch error:', err));
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
  const filteredSwitcherProjects = projectsList.filter(
    (p) =>
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
      <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {/* ── DESKTOP PERSISTENT CALM SIDEBAR ──────────────────────── */}
        <aside
          className={`hidden md:flex flex-col border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#0c0d12]/95 backdrop-blur-md transition-all duration-200 shrink-0 sticky top-0 h-screen z-30 ${
            collapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Sidebar Header: Brand & Project Switcher */}
          <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2.5 overflow-hidden transition-all ${
                collapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div className="w-7 h-7 rounded-md bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              {!collapsed && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                    RendoOs
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60 shrink-0">
                    v2.0
                  </span>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Project Switcher Button (when expanded) */}
          {!collapsed && (
            <div className="px-3 pt-3 pb-1" ref={switcherRef}>
              <button
                onClick={() => setShowSwitcher(!showSwitcher)}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <FolderGit2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">
                    {pathname.startsWith('/projects/')
                      ? projectsList.find((p) => pathname.includes(p.id) || pathname.includes(p.slug))?.name || 'Jump to Repo...'
                      : 'Jump to Repo...'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
              </button>

              {/* Project Switcher Dropdown */}
              {showSwitcher && (
                <div className="absolute left-3 right-3 mt-1.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-2 border-b border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                      <Search className="w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search repos..."
                        value={switcherSearch}
                        onChange={(e) => setSwitcherSearch(e.target.value)}
                        className="w-full bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-1 divide-y divide-zinc-50 dark:divide-zinc-800/40">
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
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 truncate">
                                {proj.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-mono truncate">{proj.slug}</p>
                            </div>
                            {isLive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grouped Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                {!collapsed && (
                  <span className="block px-2.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold mb-1">
                    {group.label}
                  </span>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                        collapsed ? 'justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-2xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer: Telemetry & Collapse Button */}
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
            {activeServicesCount > 0 && (
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-semibold ${
                  collapsed ? 'justify-center' : ''
                }`}
                title={`${activeServicesCount} services running`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                {!collapsed && <span>{activeServicesCount} Live</span>}
              </div>
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-1`}>
              {collapsed && (
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Expand sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
              {!collapsed && (
                <span className="text-[10px] font-mono text-zinc-400">
                  RendoOs • Clean Room
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* ── MOBILE SLIDE-OVER DRAWER ──────────────────────────────── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-white dark:bg-[#0c0d12] border-r border-zinc-200 dark:border-zinc-800 h-full p-4 flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm">RendoOs</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto space-y-4">
                {navGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <span className="block px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                      {group.label}
                    </span>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                            isActive
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT WORKBENCH ────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-20 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-3">
              {/* Left: Mobile Toggle & Context Breadcrumb */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {pathname === '/'
                      ? 'Dashboard'
                      : pathname.startsWith('/projects')
                      ? 'Workspaces'
                      : pathname.startsWith('/ideas')
                      ? 'Ideas'
                      : pathname.startsWith('/review')
                      ? 'Review'
                      : pathname.startsWith('/archive')
                      ? 'Archive'
                      : 'Settings'}
                  </span>
                </div>
              </div>

              {/* Right: Actions & Theme Toggle */}
              <div className="flex items-center gap-2">
                {/* Quick Capture (Ctrl+K) Button */}
                <button
                  onClick={() => {
                    setQuickCaptureType('TASK');
                    setShowQuickCapture(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer group"
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
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                  title="Scan local project folder"
                >
                  <FolderSearch className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Scan</span>
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New</span>
                </button>

                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-4 text-center text-xs text-zinc-400 font-mono">
            RendoOs • Notion Calmness + Linear Precision • Clean Room
          </footer>
        </div>
      </div>

      {/* Global Modals */}
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
