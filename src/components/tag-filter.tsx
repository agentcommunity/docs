'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function TagFilter({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setTag = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) params.set('tag', tag);
    else params.delete('tag');
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : '/blog');
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setTag(null)}
        className={`rounded-full px-3 py-1 text-sm transition-colors ${!activeTag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => setTag(tag)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${activeTag === tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
