'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Newspaper, X } from 'lucide-react';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  type: 'docs' | 'blog';
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          <span>&#8984;</span>K
        </kbd>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-0 top-[20%] z-50 mx-auto max-w-lg px-4">
            <div className="rounded-xl border border-border bg-background shadow-2xl">
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search docs and blog..."
                  className="flex-1 py-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {results.length > 0 && (
                <div className="max-h-72 overflow-y-auto p-2">
                  {results.map((result, i) => (
                    <button
                      key={result.href}
                      onClick={() => navigate(result.href)}
                      className={`flex items-start gap-3 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        i === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`}
                    >
                      {result.type === 'docs' ? <FileText className="w-4 h-4 mt-0.5 shrink-0" /> : <Newspaper className="w-4 h-4 mt-0.5 shrink-0" />}
                      <div className="min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{result.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {query && results.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">No results found.</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
