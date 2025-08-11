'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId();
  const [svg, setSvg] = useState('');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        fontFamily: 'inherit',
      });
      try {
        const { svg } = await mermaid.render(id, chart.replaceAll('\\n', '\n'));
        if (mounted) setSvg(svg);
      } catch (err) {
        console.error('Mermaid render error', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [chart, id, resolvedTheme]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}