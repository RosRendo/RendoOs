'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidViewerProps {
  chart: string;
  className?: string;
}

export default function MermaidViewer({ chart, className = '' }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;

    async function renderMermaid() {
      if (!chart || !chart.trim()) {
        setSvgContent('');
        setError(null);
        return;
      }

      try {
        setError(null);
        const mermaid = (await import('mermaid')).default;

        const isDark = document.documentElement.classList.contains('dark');

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          themeVariables: isDark
            ? {
                primaryColor: '#1e293b',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#3b82f6',
                lineColor: '#60a5fa',
                secondaryColor: '#0f172a',
                tertiaryColor: '#1e2230',
                background: '#090a0f',
                nodeBorder: '#3b82f6',
                clusterBkg: '#11131a',
                clusterBorder: '#1e2230',
                defaultLinkColor: '#60a5fa',
                titleColor: '#f8fafc',
                edgeLabelBackground: '#1e2230',
              }
            : {
                primaryColor: '#f1f5f9',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#3b82f6',
                lineColor: '#2563eb',
                secondaryColor: '#ffffff',
                tertiaryColor: '#e2e8f0',
                background: '#ffffff',
                nodeBorder: '#93c5fd',
                clusterBkg: '#f8fafc',
                clusterBorder: '#cbd5e1',
                defaultLinkColor: '#2563eb',
                titleColor: '#0f172a',
                edgeLabelBackground: '#ffffff',
              },
        });

        // Ensure unique ID for render
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, chart);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Mermaid render error:', err);
          setError(err.message || 'Failed to render Mermaid diagram. Check syntax.');
        }
      }
    }

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className={`relative flex flex-col w-full ${className}`}>
      {/* Zoom / Reset Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 text-xs font-mono shadow-sm">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="px-2 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          title="Zoom Out"
        >
          -
        </button>
        <span className="px-1 text-[11px] text-zinc-500">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
          className="px-2 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-1.5 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-[10px]"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>

      {error ? (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-mono space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            <span>⚠</span> Mermaid Syntax Notice
          </p>
          <p className="text-[11px] text-zinc-400">{error}</p>
          <div className="mt-2 pt-2 border-t border-rose-500/20 text-zinc-400">
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">Raw Content:</span>
            <pre className="text-zinc-300 text-[11px] overflow-x-auto whitespace-pre-wrap">{chart}</pre>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full overflow-x-auto overflow-y-auto p-4 flex items-center justify-center transition-transform duration-150"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}
