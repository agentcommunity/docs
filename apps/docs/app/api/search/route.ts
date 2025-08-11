import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { source, aidSource } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const docsSearch = createFromSource(source, { language: 'english' });
const aidSearch = createFromSource(aidSource, { language: 'english' });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q') ?? '';

  const make = (handler: { GET: (r: Request) => Promise<Response> }) =>
    handler.GET(new Request(`${url.origin}?q=${encodeURIComponent(query)}`));

  const [docsRes, aidRes] = await Promise.all([make(docsSearch), make(aidSearch)]);

  const [docsJson, aidJson]: Array<{ results?: unknown[] }> = await Promise.all([
    docsRes.json(),
    aidRes.json(),
  ]);

  function withTag(input: { results?: unknown[] } | undefined, tag: string) {
    const results = Array.isArray(input?.results) ? input!.results : [];
    return results.map((r) => ({ ...(r as Record<string, unknown>), _source: tag }));
  }

  const results = [...withTag(docsJson, 'docs'), ...withTag(aidJson, 'aid')];

  return NextResponse.json({ results });
}