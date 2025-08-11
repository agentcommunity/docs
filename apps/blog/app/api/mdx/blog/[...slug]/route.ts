import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/get-llm-text';
import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pageSlug = slug.length === 1 && slug[0] === 'index' ? undefined : slug;
  const page = blogSource.getPage(pageSlug);
  if (!page) notFound();

  return new NextResponse(await getLLMText(page), { headers: { 'Content-Type': 'text/plain' } });
}