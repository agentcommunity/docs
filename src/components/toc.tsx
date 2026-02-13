'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/types';

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -40% 0px' }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1 text-sm">
      <p className="font-medium mb-2">On this page</p>
      {headings.map(heading => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `#${heading.id}`);
          }}
          className={`block transition-colors ${
            activeId === heading.id
              ? 'text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={{ paddingLeft: `${(heading.depth - 2) * 12 + 4}px` }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
