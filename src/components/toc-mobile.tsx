'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Heading } from '@/lib/types';

export function MobileTableOfContents({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="xl:hidden mb-6 border border-border rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3 text-sm font-medium"
      >
        On this page
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1">
          {headings.map(heading => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={() => setOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              style={{ paddingLeft: `${(heading.depth - 2) * 12 + 4}px` }}
            >
              {heading.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
