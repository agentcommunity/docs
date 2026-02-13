'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const VISIBLE_COUNT = 8;

export function TagFilter({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  const setTag = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set('tag', tag);
    else params.delete('tag');
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : '/blog');
  };

  const visibleTags = expanded ? tags : tags.slice(0, VISIBLE_COUNT);
  const hasMore = tags.length > VISIBLE_COUNT;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <button
        onClick={() => setTag(null)}
        className={`rounded-full px-3 py-1 text-sm transition-colors shrink-0 ${!activeTag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
      >
        All
      </button>
      {visibleTags.map(tag => (
        <button
          key={tag}
          onClick={() => setTag(tag)}
          className={`rounded-full px-3 py-1 text-sm transition-colors shrink-0 ${activeTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
        >
          #{tag}
        </button>
      ))}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? 'Less' : `+${tags.length - VISIBLE_COUNT} more`}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}
