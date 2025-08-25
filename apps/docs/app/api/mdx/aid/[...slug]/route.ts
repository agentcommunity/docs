import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/get-llm-text';
import { aidSource } from '@/lib/source';
import { normalizeSlug, notFoundJson, serverErrorJson } from '../_lib';

export const revalidate = false;
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const raw = await params;
    const pageSlug = normalizeSlug(raw);
    const page = aidSource.getPage(pageSlug);
    if (!page) return notFoundJson('aid', pageSlug);

    const text = await getLLMText(page);
    const filename = `${pageSlug.length > 0 ? pageSlug.join('-') : 'index'}.mdx`;
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `inline; filename="${filename}"`,
        'x-mdx-section': 'aid',
        'x-mdx-slug': JSON.stringify(pageSlug),
      },
    });
  } catch (error) {
    console.error('mdx/aid error', error);
    return serverErrorJson('export aid failed');
  }
}