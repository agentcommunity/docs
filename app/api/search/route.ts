import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { source, aidSource, blogSource } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Individual endpoints can be split if desired, but expose a merged search here.
const docsSearch = createFromSource(source, { language: 'english' });
const aidSearch = createFromSource(aidSource, { language: 'english' });
const blogSearch = createFromSource(blogSource, { language: 'english' });

export async function GET(req: Request) {
  // Run all three searches in parallel and merge results
  const url = new URL(req.url);
  const query = url.searchParams.get('q') ?? '';

  // Delegate to providers; their GET expects a Request with ?q
  const make = (handler: { GET: (r: Request) => Promise<Response> }) =>
    handler.GET(new Request(`${url.origin}?q=${encodeURIComponent(query)}`));

  const [docsRes, aidRes, blogRes] = await Promise.all([
    make(docsSearch),
    make(aidSearch),
    make(blogSearch),
  ]);

  const [docsJson, aidJson, blogJson]: Array<{ results?: unknown[] }> = await Promise.all([
    docsRes.json(),
    aidRes.json(),
    blogRes.json(),
  ]);

  // Tag results with source for UI clarity
  function withTag(input: { results?: unknown[] } | undefined, tag: string) {
    const results = Array.isArray(input?.results) ? input!.results : [];
    return results.map((r) => ({ ...(r as Record<string, unknown>), _source: tag }));
  }

  const results = [
    ...withTag(docsJson, 'docs'),
    ...withTag(aidJson, 'aid'),
    ...withTag(blogJson, 'blog'),
  ];

  return NextResponse.json({ results });
}
