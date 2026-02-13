import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { source, blogSource } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const docsSearch = createFromSource(source, { language: 'english' });
const blogSearch = createFromSource(blogSource, { language: 'english' });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q') ?? '';

  const make = (handler: { GET: (r: Request) => Promise<Response> }) =>
    handler.GET(new Request(`${url.origin}?q=${encodeURIComponent(query)}`));

  const [docsRes, blogRes] = await Promise.all([
    make(docsSearch),
    make(blogSearch),
  ]);

  const [docsJson, blogJson]: Array<{ results?: unknown[] }> = await Promise.all([
    docsRes.json(),
    blogRes.json(),
  ]);

  function withTag(input: { results?: unknown[] } | undefined, tag: string) {
    const results = Array.isArray(input?.results) ? input!.results : [];
    return results.map((r) => ({ ...(r as Record<string, unknown>), _source: tag }));
  }

  const results = [
    ...withTag(docsJson, 'docs'),
    ...withTag(blogJson, 'blog'),
  ];

  return NextResponse.json({ results });
}
