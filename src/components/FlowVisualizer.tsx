'use client';

import {
  Zap, Terminal, Code2, MessageSquare, CreditCard, Database,
  Shield, Sparkles, Cpu, PlayCircle, BarChart2, ClipboardList,
  Layers, Box, Server, Globe, HardDrive, CornerDownRight,
  ArrowRight,
} from 'lucide-react';

export interface FlowData {
  version: number;
  summary: string;
  steps: { number: number; title: string; description: string }[];
  features: { id: string; icon: string; title: string; description: string; color: string; tech?: string[] }[];
  services: { name: string; port?: number | null; tech: string; type: string; script?: string }[];
  pages: string[];
  apiRoutes: string[];
}

const ICON_MAP: Record<string, any> = {
  zap: Zap, terminal: Terminal, 'code-2': Code2, 'message-square': MessageSquare,
  'credit-card': CreditCard, database: Database, shield: Shield, sparkles: Sparkles,
  cpu: Cpu, 'play-circle': PlayCircle, 'bar-chart-2': BarChart2,
  'clipboard-list': ClipboardList, layers: Layers, box: Box, server: Server,
};

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  amber:   { bg: 'bg-amber-500/8 dark:bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400',   badge: 'bg-amber-500/15 text-amber-400' },
  emerald: { bg: 'bg-emerald-500/8 dark:bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400' },
  sky:     { bg: 'bg-sky-500/8 dark:bg-sky-500/10',       border: 'border-sky-500/20',     icon: 'text-sky-400',     badge: 'bg-sky-500/15 text-sky-400' },
  blue:    { bg: 'bg-blue-500/8 dark:bg-blue-500/10',     border: 'border-blue-500/20',     icon: 'text-blue-400',    badge: 'bg-blue-500/15 text-blue-400' },
  violet:  { bg: 'bg-violet-500/8 dark:bg-violet-500/10', border: 'border-violet-500/20',  icon: 'text-violet-400',  badge: 'bg-violet-500/15 text-violet-400' },
  purple:  { bg: 'bg-purple-500/8 dark:bg-purple-500/10', border: 'border-purple-500/20',  icon: 'text-purple-400',  badge: 'bg-purple-500/15 text-purple-400' },
  rose:    { bg: 'bg-rose-500/8 dark:bg-rose-500/10',     border: 'border-rose-500/20',    icon: 'text-rose-400',    badge: 'bg-rose-500/15 text-rose-400' },
  fuchsia: { bg: 'bg-fuchsia-500/8 dark:bg-fuchsia-500/10', border: 'border-fuchsia-500/20', icon: 'text-fuchsia-400', badge: 'bg-fuchsia-500/15 text-fuchsia-400' },
  orange:  { bg: 'bg-orange-500/8 dark:bg-orange-500/10', border: 'border-orange-500/20',  icon: 'text-orange-400',  badge: 'bg-orange-500/15 text-orange-400' },
  teal:    { bg: 'bg-teal-500/8 dark:bg-teal-500/10',     border: 'border-teal-500/20',    icon: 'text-teal-400',    badge: 'bg-teal-500/15 text-teal-400' },
  indigo:  { bg: 'bg-indigo-500/8 dark:bg-indigo-500/10', border: 'border-indigo-500/20',  icon: 'text-indigo-400',  badge: 'bg-indigo-500/15 text-indigo-400' },
  zinc:    { bg: 'bg-zinc-500/5 dark:bg-zinc-800/40',     border: 'border-zinc-700/30',    icon: 'text-zinc-400',    badge: 'bg-zinc-700/40 text-zinc-400' },
};

const SERVICE_COLORS: Record<string, string> = {
  frontend: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
  backend:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  database: 'text-violet-400 bg-violet-500/10 border-violet-500/25',
  external: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
};

const SERVICE_ICONS: Record<string, any> = {
  frontend: Globe, backend: Server, database: HardDrive, external: Zap,
};

export default function FlowVisualizer({ data }: { data: FlowData }) {
  return (
    <div className="space-y-10">

      {/* Summary */}
      {data.summary && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-l-2 border-blue-500/40 pl-4 italic">
          {data.summary}
        </p>
      )}

      {/* Services Map */}
      {data.services.length > 0 && (
        <section>
          <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Running Services
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.services.map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.type] || Server;
              const cls = SERVICE_COLORS[svc.type] || SERVICE_COLORS.external;
              return (
                <div key={i} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono ${cls}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="font-semibold">{svc.name}</span>
                  <span className="opacity-60">·</span>
                  <span className="opacity-80">{svc.tech}</span>
                  {svc.port && (
                    <span className="opacity-60">:{svc.port}</span>
                  )}
                </div>
              );
            })}
            {data.services.length > 1 && (
              <div className="flex items-center gap-1 px-2 text-zinc-600 dark:text-zinc-500">
                {data.services.map((_, i) => i < data.services.length - 1 && (
                  <ArrowRight key={i} className="w-3 h-3" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* User Journey Steps */}
      {data.steps.length > 0 && (
        <section>
          <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
            User Journey
          </h4>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-[13px] top-7 bottom-7 w-px bg-gradient-to-b from-blue-500/40 via-blue-500/20 to-transparent" />
            <div className="space-y-5">
              {data.steps.map((step) => (
                <div key={step.number} className="flex gap-4 relative">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 border-2 border-blue-500/30 flex items-center justify-center z-10 shadow-sm shadow-blue-500/20">
                    <span className="text-[11px] font-bold font-mono text-white">{step.number}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5 pb-2">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{step.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Cards */}
      {data.features.length > 0 && (
        <section>
          <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
            Key Features ({data.features.length} detected)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.features.map((feat) => {
              const Icon = ICON_MAP[feat.icon] || Box;
              const c = COLOR_MAP[feat.color] || COLOR_MAP.zinc;
              return (
                <div
                  key={feat.id}
                  className={`p-4 rounded-xl border ${c.bg} ${c.border} space-y-2 transition-all hover:scale-[1.01]`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg} border ${c.border}`}>
                      <Icon className={`w-4 h-4 ${c.icon}`} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">
                      {feat.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                  {feat.tech && feat.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {feat.tech.map((t) => (
                        <span key={t} className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${c.badge}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pages & Routes */}
      {(data.pages.length > 0 || data.apiRoutes.length > 0) && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.pages.length > 0 && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
              <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Pages ({data.pages.length})
              </p>
              <div className="space-y-1">
                {data.pages.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.apiRoutes.length > 0 && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
              <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
                API Routes ({data.apiRoutes.length})
              </p>
              <div className="space-y-1">
                {data.apiRoutes.slice(0, 10).map((r) => (
                  <div key={r} className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <Server className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
                {data.apiRoutes.length > 10 && (
                  <p className="text-[10px] text-zinc-500 pl-4">+{data.apiRoutes.length - 10} more routes</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
