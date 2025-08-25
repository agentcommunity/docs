import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/get-llm-text';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const pageSlug = slug.length === 1 && slug[0] === 'index' ? undefined : slug;
    const page = source.getPage(pageSlug);
    if (!page) notFound();

    const text = await getLLMText(page);
    return new NextResponse(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
  } catch (error) {
    console.error('mdx/docs error', error);
    return NextResponse.json({ error: 'failed to generate markdown' }, { status: 500 });
  }
}