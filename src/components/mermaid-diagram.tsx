'use client';

import { useEffect, useId, useRef, useState } from 'react';

export function MermaidDiagram({ source }: { source: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const id = useId().replaceAll(':', '_');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const { default: mermaid } = await import('mermaid');

        // Read theme from document
        const isDark = document.documentElement.classList.contains('dark');

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
        });

        const { svg } = await mermaid.render(`mermaid${id}`, source);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to render diagram');
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [source, id]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-amber-500/50 bg-amber-500/5 p-4">
        <p className="text-sm font-medium text-amber-600 mb-2">Diagram rendering failed</p>
        <pre className="text-xs overflow-auto">{source}</pre>
        <p className="text-xs text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  return <div ref={containerRef} className="my-4 flex justify-center [&_svg]:max-w-full" />;
}
