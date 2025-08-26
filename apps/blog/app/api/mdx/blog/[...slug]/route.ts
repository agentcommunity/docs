import { type NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getLLMText } from '../../../../../lib/get-llm-text';
import { blogSource } from '../../../../../lib/source';
import { normalizeSlug, notFoundJson, serverErrorJson, methodGuard, buildDisposition } from '../../../../../lib/mdx-export';

export const runtime = 'nodejs';
export const revalidate = false;

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const guard = methodGuard(req as unknown as Request);
  if (guard) return guard as NextResponse;
  try {
    const raw = await params;
    const pageSlug = normalizeSlug(raw);
    const page = blogSource.getPage(pageSlug);
    if (!page) return notFoundJson('blog', pageSlug);

    const text = await getLLMText(page);
    const url = new URL(req.url);
    const fp = JSON.stringify({ id: page.url, updatedAt: page.data.lastModified ?? '' });
    const etag = '"mdx-' + crypto.createHash('sha1').update(fp).digest('base64url') + '"';
    if (req.headers.get('if-none-match') === etag) {
      return new NextResponse(null, { status: 304, headers: { etag } });
    }
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': buildDisposition(pageSlug, url.searchParams),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        etag,
        'x-mdx-section': 'blog',
        'x-mdx-slug': JSON.stringify(pageSlug),
      },
    });
  } catch (error) {
    console.error('mdx/blog error', error);
    return serverErrorJson('export blog failed');
  }
}