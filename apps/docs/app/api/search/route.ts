import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const runtime = 'nodejs';

const docsSearch = createFromSource(source, { language: 'english' });

export async function GET(req: Request) {
  return docsSearch.GET(req);
}
